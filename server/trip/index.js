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
  
  router.put('/', function (req, res, next) {
    var resp = {};
    var msg = req.body;
    var cookies = req.cookies;
    if (!msg || !msg.title || !msg.description || !msg.trip) {
      resp.status = ERROR;
      resp.message = "Missing title or description or trip.";
      return res.status(400).json(resp);
    }
    var event_pk = msg.trip;
    var start_date = msg.start_date;
    var duration_days = msg.duration_days;
    var proposed_start_date = msg.proposed_start_date;
    var proposed_duration_days = msg.proposed_duration_days;
    var title = msg.title;
    var description = msg.description;

    pg.connect(connectionString, function (err, client, done) {
      var query = 'insert into tb_event(         \
                      event,                     \
                      start_date,                \
                      duration_days,             \
                      proposed_start_date,       \
                      proposed_duration_days,    \
                      description,               \
                      title,                     \
                      creator,                   \
                      modifier                   \
                    ) ( select                   \
                      $1, $2, $3, $4,            \
                      $5, $6, $7, $8, $8         \
                      where not exists(                   \
                                        select *          \
                                          from tb_event   \
                                         where event = $1 \
                                      )                   \
                      );';
      client.query(query, [
        event_pk,
        start_date,
        duration_days,
        proposed_start_date,
        proposed_duration_days,
        description,
        title,
        req.entity
      ], function (err, result) {
        done();
        if (result && result.rowCount ) {
          resp.status = OK;
          resp.message = "Trip created.";
          resp.trip = result.rows[0].trip;
          return res.json(resp);
        } else if ( result.rowCount == 0 ){
          next();     
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

  router.put('/', function (req, res, next) {
    var resp = {};
    var msg = req.body;
    var cookies = req.cookies;
    if (!msg || !msg.title || !msg.description || !msg.trip) {
      resp.status = ERROR;
      resp.message = "Missing title or description or trip.";
      return res.status(400).json(resp);
    }
    var event_pk = msg.trip;
    var start_date = msg.start_date;
    var duration_days = msg.duration_days;
    var proposed_start_date = msg.proposed_start_date;
    var proposed_duration_days = msg.proposed_duration_days;
    var title = msg.title;
    var description = msg.description;
    pg.connect(connectionString, function (err, client, done) {
          var query = 'update tb_event                    \
                          set start_date = $1,            \
                              duration_days = $2,         \
                              proposed_start_date = $3    \
                              proposed_duration_days = $4 \
                              description = $5            \
                              title = $6                  \
                              modifier = $7               \
                        where event = $8                  ';
          client.query(query, [
            start_date,
            duration_days,
            proposed_start_date,
            proposed_duration_days,
            description,
            title,
            req.entity,
            event_pk
          ], function (err, result) {
        done();
        if (result && result.rowCount ) {
          resp.status = OK;
          resp.message = "Trip updated.";
          resp.trip = result.rows[0].trip;
          return res.json(resp);
        } else {
          resp.status = ERROR;
          resp.message = "Error when updating trip.";
          if (err) {
            console.log(err);
          }
          return res.status(500).json(resp);
        }
      });
  });

  app.use('/api/trip', router);
};
