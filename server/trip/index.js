var pg = require('pg');

module.exports = function (app) {
  var express = require('express');
  var router = express.Router();

  router.post('/', function (req, res, next) {
    var resp = {};
    var msg = req.body;
    var cookies = req.cookies;

    if (!msg || !msg.title || !msg.description) {
      resp.status = ERROR;
      resp.message = "Missing title or description.";
      return res.json(resp);
    }

    var start_date = msg.start_date;
    var duration_days = msg.duration_days;
    var proposed_start_date = msg.proposed_start_date;
    var title = msg.title;
    var description = msg.description;

    pg.connect(connectionString, function (err, client, done) {
      var query = 'select  fn_new_event(                              \
                                          start_date,                 \
                                          duration_days,              \
                                          proposed_start_date,        \
                                          propsed_duration_days,      \
                                          select entity               \
                                            from tb_session s         \
                                           where session_id_hash = $1,\
                                          description,                \
                                          title                       \
                                       ) as trip';
      client.query(query, [cookes['AuthToken']], function (err, result) {
        done();
        if (result && result.rows[0]) {
          resp.status = OK;
          resp.message = "Event created.";
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

    app.use('/api/trip', router);
  });
};