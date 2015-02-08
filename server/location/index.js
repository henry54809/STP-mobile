var pg = require('pg');

module.exports = function (app) {
  var express = require('express');
  var router = express.Router();

  router.get('/countries', function (req, res) {
    var resp = {};
    var cookies = req.cookies;
    var query = 'select country, \
                        label   \
                   from tb_country';
    pg.connect(connectionString, function (err, client, done) {
      client.query(query, function (err, result) {
        done();
        if (result && result.rows) {
          resp.status = OK;
          resp.countries = result.rows;
          return res.json(resp);
        } else {
          if (err) {
            resp.status = ERROR;
            resp.message = "Could not get countries list.";
            res.status(500).json(resp);
          }
        }
      });
    });
  });

  router.get('/:country/regions', function (req, res) {
    var resp = {};
    if (!req.params.country) {
      resp.status = ERROR;
      resp.message = "Country id required.";
      return res.status(400).json(resp);
    }
    var country = req.params.country;

    if (isNaN(country)) {
      return next();
    }

    var query = "select region,      \
                        label        \
                   from tb_region    \
                  where country = $1";

    pg.connect(connectionString, function (err, client, done) {
      client.query(query, [country], function (err, result) {
        done();
        if (result && result.rows) {
          resp.status = OK;
          resp.countries = result.rows;
          return res.json(resp);
        } else {
          if (err) {
            resp.status = ERROR;
            resp.message = "Could not get regions list.";
            res.status(500).json(resp);
          }
        }
      });
    });

  });

  router.get('/:region/cities', function (req, res) {
    var resp = {};
    if (!req.params.region) {
      resp.status = ERROR;
      resp.message = "Region id required.";
      return res.status(400).json(resp);
    }
    var region = req.params.region;

    if (isNaN(region)) {
      return next();
    }
    var query = "select city,      \
                        label      \
                   from tb_city    \
                  where region = $1";

    pg.connect(connectionString, function (err, client, done) {
      client.query(query, [region], function (err, result) {
        done();
        if (result && result.rows) {
          resp.status = OK;
          resp.cities = result.rows;
          return res.json(resp);
        } else {
          if (err) {
            resp.status = ERROR;
            resp.message = "Could not get cities list.";
            res.status(500).json(resp);
          }
        }
      });
});
  });
  app.use('/api/location', router);
};