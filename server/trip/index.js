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

  router.get('/mytrips', function (req, res, next) {
    var resp = {};
    var cookies = req.cookies;
    pg.connect(connectionString, function (err, client, done) {
      var query = "select *             \
                     from tb_event,     \
                          tb_session s  \
                    where event = any( fn_get_entity_related_event(s.entity) ) \
                      and s.session_id_hash = $1";
      client.query(query, [cookies['AuthToken']], function (err, result) {
        done();
        if (result) {
          if (result.rows[0]) {
            resp.status = OK;
            resp.trips = result.rows;
            return res.json(resp);
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
                   where session_id_hash = $8';
      client.query(query, [
        start_date,
        duration_days,
        proposed_start_date,
        proposed_duration_days,
        description,
        title,
        event_pk,
        cookies['AuthToken']
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

  app.use('/api/trip', router);
};
