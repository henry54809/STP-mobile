var pg = require('pg');

module.exports = function (app) {
  var express = require('express');
  var router = express.Router();

  router.get('/', function (req, res) {
    var resp = {};
    pg.connect(connectionString, function (err, client, done) {
      var query = "select nextval('sq_pk_event') as trip";

      client.query(query, function (err, result) {
        done();
        if (result && result.rows[0]) {
          resp.status = OK;
          resp.trip = result.rows[0].trip;
          return res.json(resp);
        } else {
          resp.status = ERROR;
          resp.message = "Error when getting new trip id.";
          if (err) {
            console.log(err);
          }
          return res.status(500).json(resp);
        }
      });
    });
  });

  router.post('/', function (req, res, next) {
    var resp = {};
    var msg = req.body;
    var cookies = req.cookies;
    if (!msg || !msg.title || !msg.description || !msg.trip) {
      resp.status = ERROR;
      resp.message = "Missing title or description or trip.";
      return res.json(resp);
    }
    var event_pk = msg.trip;
    var start_date = msg.start_date;
    var duration_days = msg.duration_days;
    var proposed_start_date = msg.proposed_start_date;
    var proposed_duration_days = msg.proposed_duration_days;
    var title = msg.title;
    var description = msg.description;

    pg.connect(connectionString, function (err, client, done) {
      var query = 'select fn_new_event(            \
                                          $1,      \
                                          $2,      \
                                          $3,      \
                                          $4,      \
                                          entity,  \
                                          $5,      \
                                          $6,      \
                                          $7       \
                                       ) as trip   \
                    from tb_session                \
                   where session_id_hash = $7';
      client.query(query, [
        start_date,
        duration_days,
        proposed_start_date,
        proposed_duration_days,
        description,
        title,
        cookies['AuthToken'],
        event_pk
      ], function (err, result) {
        done();
        if (result && result.rows[0]) {
          resp.status = OK;
          resp.message = "Trip created.";
          resp.trip = result.rows[0].trip;
          return res.json(resp);
        } else {
          resp.status = ERROR;
          resp.message = "Error when creating trip.";
          if (err) {
            console.log(err);
          }
          return res.status(500).json(resp);
        }
      });
    });
  });

  //checking event id validity 
  //and check if entity is associated with this event
  router.all('/:trip_id', function (req, res, next) {
    var resp = {};
    var trip_id = req.trip_id;
    var cookies = req.cookes;
    if (isNaN(trip_id)) {
      return next();
    }
    pg.connect(connectionString, function (err, client, done) {
      var query = "select e.*             \
                     from tb_event e,     \
                          tb_session s    \
                    where event = $1      \
                      and s.session_id_hash = $2  \
                      and s.entity = any( fn_get_event_related_entity($1) )";

      client.query(query, [trip_id, cookies['AuthToken']], function (err, result) {
        done();
        if (result) {
          if (result.rows[0]) {
            req.event = result.rows[0];
            return next();
          } else {
            resp.status = ERROR;
            resp.message = "Could not find trip.";
            if (err) {
              console.log(err);
            }
            return res.status(400).json(resp);
          }
        } else {
          resp.status = ERROR;
          resp.message = "Error when finding trip.";
          if (err) {
            console.log(err);
          }
          return res.status(500).json(resp);
        }
      });
    });
  });

  router.post('/:trip_id/itinerary', function (req, res, next) {
    var trip_id = req.trip_id;
    var cookies = req.cookies;
    var resp = {};
    if (isNaN(trip_id)) {
      return next();
    }
    var create_new_itinerary = function () {
      pg.connect(connectionString, function (err, client, done) {
        var query = "insert into tb_itinerary(            \
                                              event,      \
                                              creator,    \
                                              modifier    \
                                              )           \
                                              (           \
                                                select event,         \
                                                       s.entity,      \
                                                       s.entity       \
                                                  from tb_event e,   \
                                                       tb_session s,  \
                                                 where e.event = $1, \
                                                   and s.session_id_hash = $2 \
                                              ) returning itinerary";

        client.query(query, [trip_id, cookies['AuthToken']], function (err, result) {
          done();
          if (result && result.rows[0]) {
            resp.status = OK;
            resp.message = "New itinerary.";
            resp.itinerary = result.rows[0].itinerary;
            return res.json(resp);
          } else {
            resp.status = ERROR;
            resp.message = "Error when creating itinerary.";
            if (err) {
              console.log(err);
            }
            return res.status(500).json(resp);
          }
        });
      });
    };

    pg.connect(connectionString, function (err, client, done) {
      var query = "select itinerary \
                     from tb_itinerary  \
                    where event = $1";

      client.query(query, [trip_id], function (err, result) {
        done();
        if (result) {
          if (result.rows[0]) {
            resp.status = OK;
            resp.message = "Existing itinerary.";
            resp.itinerary = result.rows[0].itinerary;
            return res.json(resp);
          } else {
            return create_new_itinerary();
          }
        } else {
          resp.status = ERROR;
          resp.message = "Error when creating itinerary.";
          if (err) {
            console.log(err);
          }
          return res.status(500).json(resp);
        }
      });
    });
  });

  app.use('/api/trip', router);
};