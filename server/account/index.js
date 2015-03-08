var pg = require('pg');

module.exports = function (app) {
  var express = require('express');
  var router = express.Router();

  router.get('/', function (req, res, next) {
    var resp = {};

    //next if url param contains keys.
    if (Object.getOwnPropertyNames(req.query).length > 0) {
      return next();
    }
    var cookies = req.cookies;
    var query = 'select     e.username,         \
                            e.email_address,    \
                            ee.address_line_one,\
                            ee.address_line_two,\
                            ee.profession,      \
                            ee.age,             \
                            ee.description,     \
                            ee.first_name,      \
                            ee.last_name,       \
                            ci.label as city,   \
                            ee.avatar_url,      \
                            r.label as region,  \
                            c.label as country  \
                       from tb_entity e                                 \
                       join tb_session s                                \
                         on s.entity = e.entity                         \
                  left join tb_entity_extra_info ee                     \
                         on ee.entity_extra_info = e.entity_extra_info  \
                  left join tb_city ci                                  \
                         on ee.city = ci.city                           \
                  left join tb_region r                                 \
                         on ci.region = r.region                        \
                  left join tb_country c                                \
                         on r.country = c.country                       \
                      where s.session_id_hash = $1                      \
                        and s.expires > now()';
    pg.connect(connectionString, function (err, client, done) {
      client.query(query, [cookies["AuthToken"]], function (err, result) {
        done();
        if (result && result.rows[0]) {
          return res.json(result.rows[0]);
        } else {
          if (err) {
            console.log(err);
          }
          resp.status = ERROR;
          resp.message = "Authentication required";
          return res.status(401).json(resp);
        }
      });
    });
  });

  router.post('/', function (req, res, next) {
    var resp = {};
    var msg = req.body;

    if (!msg || !msg.username || !msg.password || !msg.email_address) {
      resp.status = ERROR;
      resp.message = "Missing username or password or email address.";
      return res.json(resp);
    }
    var username = msg.username;
    var password = msg.password;
    var email_address = msg.email_address;
    var entity_type = msg.entity_type;
    var address_line_one = msg.address_line_one;
    var address_line_two = msg.address_line_two;
    var profession = msg.profession;
    var age = msg.age;
    var description = msg.description;
    var first_name = msg.first_name;
    var last_name = msg.last_name;
    var city = msg.city;
    var region = msg.region;
    var avatar_url = msg.avatar_url;

    var query = 'select fn_new_entity(                                  \
                                            $1,                             \
                                            $2,                             \
                                            crypt( $3, gen_salt(\'bf\') ),  \
                                            $4,                             \
                                            $5,                             \
                                            fn_new_entity_extra_info(       \
                                                                        $6, \
                                                                        $7, \
                                                                        $8, \
                                                                        $9, \
                                                                        $10,\
                                                                        $11,\
                                                                        $12,\
                                                                        $13,\
                                                                        $14,\
                                                                        $15 \
                                                                    )       \
                                          ) as entity';
    pg.connect(connectionString, function (err, client, done) {
      client.query(query, [
        0,
        username,
        password,
        email_address,
        1,
        address_line_one,
        address_line_two,
        profession,
        age,
        description,
        first_name,
        last_name,
        city,
        region,
        avatar_url
      ], function (err, result) {
        done();
        if (result && result.rows[0]) {
          resp.status = OK;
          resp.message = "Account created.";
          return res.json(resp);
        } else {
          resp.status = ERROR;
          resp.message = "Error when creating entity.";
          if (err) {
            console.log(err);
          }

          return res.status(500).json(resp);
        }
      });
    });
  });

  //Update entity information
  router.put('/', function (req, res, next) {
    var resp = {};

    //next if url param contains keys.
    if (req.query && req.query.reset_password) {
      return next();
    }

    var callback = function (session_valid) {
      if (!session_valid) {
        resp.status = ERROR;
        resp.message = "Authentication required.";
        return res.status(401).json(resp);
      }
      var query = 'update tb_entity_extra_info ee\
                        set';
      req.db_query = query;
      req.values = [];
      return next();
    };

    var auth_functions = require('../auth/functions');
    auth_functions.is_session_valid(req.cookies, callback);
  });

  router.put('/', function (req, res, next) {
    var resp = {};
    var url_query = req.query;

    if (!url_query.address_line_one) {
      return next();
    }
    req.db_query = req.db_query + ' address_line_one = $, ';
    req.values.push(url_query.address_line_one);
    next();
  });

  router.put('/', function (req, res, next) {
    var resp = {};
    var url_query = req.query;

    if (!url_query.address_line_two) {
      return next();
    }
    req.db_query = req.db_query + ' address_line_two = $, ';
    req.values.push(url_query.address_line_two);
    next();
  });

  router.put('/', function (req, res, next) {
    var resp = {};
    var url_query = req.query;

    if (!url_query.profession) {
      return next();
    }
    req.db_query = req.db_query + ' profession = $, ';
    req.values.push(url_query.profession);
    next();
  });

  router.put('/', function (req, res, next) {
    var resp = {};
    var url_query = req.query;

    if (!url_query.age) {
      return next();
    }
    req.db_query = req.db_query + ' age = $, ';
    req.values.push(url_query.age);
    next();
  });

  router.put('/', function (req, res, next) {
    var resp = {};
    var url_query = req.query;

    if (!url_query.description) {
      return next();
    }
    req.db_query = req.db_query + ' description = $, ';
    req.values.push(url_query.description);
    next();
  });

  router.put('/', function (req, res, next) {
    var resp = {};
    var url_query = req.query;

    if (!url_query.first_name) {
      return next();
    }
    req.db_query = req.db_query + ' first_name = $, ';
    req.values.push(url_query.first_name);
    next();
  });

  router.put('/', function (req, res, next) {
    var resp = {};
    var url_query = req.query;

    if (!url_query.last_name) {
      return next();
    }
    req.db_query = req.db_query + ' last_name = $, ';
    req.values.push(url_query.last_name);
    next();
  });

  router.put('/', function (req, res, next) {
    var resp = {};
    var url_query = req.query;

    if (!url_query.city) {
      return next();
    }
    req.db_query = req.db_query + ' city = $, ';
    req.values.push(url_query.city);
    next();
  });

  router.put('/', function (req, res, next) {
    var query = req.query;
    if (req.body && (!req.values || req.values.length === 0)) {
      return next();
    }
    var resp = {};
    var values = req.values;
    if (values.length === 0) {
      resp.status = ERROR;
      resp.message = "No field to update.";
      return res.json(resp);
    }

    req.db_query = req.db_query.substring(0, req.db_query.length - 2);

    var cookies = req.cookies;
    values.push(cookies["AuthToken"]);
    req.db_query = req.db_query +
      " from tb_session s, \
                            tb_entity e  \
                      where s.entity = e.entity \
                        and ee.entity_extra_info = e.entity_extra_info \
                   ";

    req.db_query = req.db_query + ' and s.session_id_hash = $ \
                                and s.expires > now()';
    //Find where the $ are
    var indices = [];
    for (var i = 0; i < req.db_query.length; i++) {
      if (req.db_query[i] === "$") {
        indices.push(i + 1);
      }
    }

    for (var i = 0; i < indices.length; i++) {
      req.db_query = req.db_query.splice(indices[i] + i, 0, i + 1);
    }
    pg.connect(connectionString, function (err, client, done) {
      client.query(req.db_query, values, function (err, result) {
        done();
        if (result) {
          resp.status = OK;
          resp.message = "User information updated.";
          return res.json(resp);
        } else {
          if (err) {
            console.log(err);
          }
          resp.status = ERROR;
          resp.message = "Could not update user.";
          return res.status(500).json(resp);
        }

      });
    });
  });

  app.use('/api/account', router);
};