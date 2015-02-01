var pg = require('pg');

module.exports = function (app) {
  var express = require('express');
  var router = express.Router();

  router.get('/', function (req, res) {
    var resp = {};
    var cookies = req.cookies;
    var query = 'select e.username, \
                            e.email_address,\
                            ee.address_line_one,\
                            ee.address_line_two,\
                            ee.profession, \
                            ee.age, \
                            ee.description, \
                            ee.first_name, \
                            ee.last_name, \
                            ee.city, \
                            avatar_url \
                       from tb_entity e \
                       join tb_session s \
                         on s.entity = e.entity \
                  left join tb_entity_extra_info ee \
                         on ee.entity_extra_info = e.entity_extra_info \
                      where s.session_id_hash = $1 \
                        and s.expires > now()';
    pg.connect(connectionString, function (err, client, done) {
      client.query(query, [cookies["AuthToken"]], function (err, result) {
        done();
        if (result.rows[0]) {
          return res.json(result.rows[0]);
        } else {
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
                                            null,                           \
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
        if (result.rows[0]) {
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

  app.use('/api/account', router);
};