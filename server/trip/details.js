var pg = require('pg');

module.exports = function (app) {
  var express = require('express');
  var router = express.Router();
  //checking event id validity 
  //and check if entity is associated with this event
  router.all('/:trip_id/*', function (req, res, next) {
    var resp = {};
    var trip_id = req.params.trip_id;
    var cookies = req.cookies;
    if (isNaN(trip_id)) {
      resp.status = ERROR;
      resp.message = "Trip id is not a number.";
      return res.status(400).json(resp);
    }
    pg.connect(connectionString, function (err, client, done) {
      var query = "select e.*            \
                     from tb_event e     \
                    where event = $1     \
                      and $2 = any( fn_get_event_related_entity($1) )";

      client.query(query, [trip_id, req.entity], function (err, result) {
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
  
  router.get('/:trip_id', function (req, res, next) {
    var resp = {};
    var trip_id = req.params.trip_id;
    var cookies = req.cookies;
    pg.connect(connectionString, function (err, client, done) {
      var query = "select start_date,             \
                          event as trip_id,       \
                          duration_days,          \
                          proposed_start_date,    \
                          proposed_duration_days, \
                          creator,                \
                          modifier,               \
                          description,            \
                          title                   \
                     from tb_event                \
                    where event = $1";

      client.query(query, [trip_id], function (err, result) {
        done();
        if (result && result.rows[0]) {
          resp.status = OK;
          resp.trip = result.rows[0];
          return res.json(resp);
        } else {
          resp.status = ERROR;
          resp.message = "Error when getting trip info.";
          if (err) {
            console.log(err);
          }
          return res.status(500).json(resp);
        }
      });
    });
  });

  router.get('/:trip_id/photos', function (req, res, next) {
    var aws = require('../util/aws');
    var resp = {};
    var trip_id = req.params.trip_id;
    var cookies = req.cookies;
    pg.connect(connectionString, function (err, client, done) {
      var query = "select distinct                                    \
                          case when cached_file_link_expires > now()  \
                                and cached_file_link is not null      \
                               then cached_file_link                  \
                               else null                              \
                          end as cached_file_link,                    \
                          path                                        \
                     from tb_file f                                   \
                     join tb_album_file af                            \
                       on af.file = f.file                            \
                    where a.event = $1";

      client.query(query, [trip_id], function (err, result) {
        done();
        if (result) {
          if (result.rowCount > 0) {
            //TODO
          } else {
            resp.status = ERROR;
            resp.message = "Could not find trip photos.";
            return res.status(404).json(resp);
          }
        } else {
          resp.status = ERROR;
          resp.message = "Error when finding trip photos.";
          if (err) {
            console.log(err);
          }
          return res.status(500).json(resp);
        }
      });
    });
  });

  router.post('/:trip_id/itinerary', function (req, res, next) {
    var trip_id = req.params.trip_id;
    var cookies = req.cookies;
    var resp = {};
    if (!req.event) {
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
                                                       tb_session s  \
                                                 where e.event = $1 \
                                                   and s.session_id_hash = $2 \
                                              ) returning itinerary";

        client.query(query, [trip_id, cookies['AuthToken']], function (err, result) {
          done();
          if (result && result.rows[0]) {
            resp.status = OK;
            resp.existing = false;
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
      var query = "select itinerary     \
                     from tb_itinerary  \
                    where event = $1";

      client.query(query, [trip_id], function (err, result) {
        done();
        if (result) {
          if (result.rows[0]) {
            resp.status = OK;
            resp.existing = true;
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