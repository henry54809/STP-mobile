var pg = require('pg');

module.exports = function (app) {
  var express = require('express');
  var router = express.Router();

  //Search among all entities.
  router.get('/', function (req, res, next) {
    var resp = {};
    var url_query = req.query;
    if (!url_query.search) {
      return next();
    }
    pg.connect(connectionString, function (err, client, done) {
      var wildcard_search = '%' + url_query.search + '%';
      var query = "select      e.entity as id, \
                                     ee.first_name,  \
                                     ee.last_name,   \
                                     e.username,     \
                                     ee.description, \
                                     ee.city,        \
                                     ee.avatar_url,       \
                                     ci.label as city,    \
                                     r.label as region,   \
                                     c.label as country   \
                           from tb_entity e                                 \
                      left join tb_entity_extra_info ee                     \
                             on e.entity_extra_info = ee.entity_extra_info  \
                      left join tb_city ci                                  \
                             on ci.city = ee.city                           \
                      left join tb_region r                                 \
                             on r.region = ci.region                        \
                      left join tb_country c                                \
                             on c.country = r.country                       \
                          where ee.first_name like $1                       \
                             or soundex($2) = soundex(ee.first_name)        \
                             or ee.last_name like  $1                       \
                             or soundex($2) = soundex(ee.last_name)         \
                             or e.username like $1                          \
                             or soundex($2) = soundex(e.username)           \
                             ";
      client.query(query, [wildcard_search, url_query.search], function (err, result) {
        done();
        if (result && result.rows[0]) {
          return res.json(result.rows);
        } else {
          if (err) {
            console.log(err);
          }
          resp.status = ERROR;
          resp.message = "User not found.";
          return res.json(resp);
        }
      });
    });
  });

  router.get('/friends', function (req, res, next) {
    var resp = {};
    var cookies = req.cookies;
    pg.connect(connectionString, function (err, client, done) {
      var query = 'select e.entity as id,                                  \
                                e.username,                                      \
                                ee.description,                                  \
                                ee.first_name,                                   \
                                ee.last_name,                                    \
                                ee.city,                                         \
                                avatar_url,                                      \
                                ft.label as friend_status                        \
                          from tb_entity_friend ef                               \
                             on (                                                \
                                    $1 = ef.entity                               \
                                 or $1 = ef.friend                               \
                                )                                                \
                      left join tb_entity e                                      \
                             on (                                                \
                                  e.entity = ef.entity                           \
                              or  e.entity = ef.friend                           \
                                )                                                \
                      left join tb_entity_extra_info ee                          \
                             on e.entity_extra_info = ee.entity_extra_info       \
                      left join tb_friend_type as ft                             \
                             on ft.friend_type = ef.friend_type                  \
                          where e.entity != $1';
      client.query(query, [req.entity], function (err, result) {
        done();
        if (result) {
          if (result.rows) {
            return res.json(result.rows);
          }
        } else {
          resp.status = ERROR;
          resp.message = "Friend not found.";
          return res.json(resp);
        }
      });
    });
  });

  router.get('/friendRequests', function (req, res, next) {
    var resp = {};
    var user_functions = require('./functions');
    var callback = function(data){
      if( !data ){
        resp.status = ERROR;
        resp.message = 'Friend requests not found.';
        return res.json(resp);
      }
      resp.status = OK;
      resp.friend_requests = data;
      return res.json(resp);
    }
    user_functions.get_friend_requests(req.entity);
  });

  //Check if entity is a number
  router.all('/:entity', function (req, res, next) {
    var resp = {};
    if (!req.params.entity) {
      resp.status = ERROR;
      resp.message = "User id required.";
      return res.status(400).json(resp);
    }
    var entity = req.params.entity;

    //Try to match it with some other route.
    if (!isNaN(entity)) {
      next();
    } else {
      resp.status = ERROR;
      resp.message = "User id is not a number.";
      return res.status(400).json(resp);
    }
  });

  router.get('/:entity', function (req, res, next) {
    var resp = {};

    pg.connect(connectionString, function (err, client, done) {
      var query = 'select            ee.first_name,  \
                                     ee.last_name,   \
                                     e.username,     \
                                     ee.description, \
                                     ee.avatar_url,     \
                                     ci.label as city,    \
                                     r.label as region,   \
                                     c.label as country   \
                                from tb_entity e                                 \
                           left join tb_entity_extra_info ee                     \
                                  on e.entity_extra_info = ee.entity_extra_info  \
                           left join tb_city ci                                  \
                                  on ci.city = ee.city                           \
                           left join tb_region r                                 \
                                  on r.region = ci.region                         \
                           left join tb_country c                                \
                                  on c.country = r.country                       \
                               where e.entity = $1';
      client.query(query, [req.params.entity], function (err, result) {
        done();
        if (result && result.rows[0]) {
          return res.json(result.rows[0]);
        } else {
          resp.status = ERROR;
          resp.message = "User not found.";
          if (err) {
            console.log(err);
          }
          return res.status(400).json(resp);
        }
      });
    });
  });

  app.use('/api/user', router);
};