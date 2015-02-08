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