var pg = require('pg');

module.exports = function (app) {
    var express = require('express');
    var router = express.Router();

    router.get('/friends', function (req, res, next) {
        var resp = {};
        var cookies = req.cookies;
        pg.connect(connectionString, function (err, client, done) {
            var query = 'select count(e.username),       \
                                e.username,     \
                                ee.description, \
                                ee.city,        \
                                avatar_url,     \
                                ft.label as friend_status   \
                           from tb_session as s             \
                           join tb_entity e                 \
                             on e.entity = s.entity         \
                      left join tb_entity_extra_info ee     \
                             on e.entity_extra_info = ee.entity_extra_info     \
                      left join tb_entity_friend ef                            \
                             on (                                              \
                                    e.entity = ef.entity                       \
                                 or e.entity = ef.friend                       \
                                )                                              \
                      left join tb_friend_type as ft                           \
                             on ft.friend_type = ef.friend_type                \
                          where s.session_id_hash = $1                         \
                            and ef.friend_type in ( 1, 3, 4 ),                 \
                       group by e.entity,                                      \
                                ee.entity_extra_info,                          \
                                ft.friend_type   ';
            client.query(query, [cookies['AuthToken']], function (err, result) {
                done();
                if (result) {
                    if (result.rows[0]) {
                        return res.json(result.rows[0]);
                    }
                } else {
                    resp.status = ERROR;
                    resp.message = "Friend not found.";
                    return res.status(400).json(resp);
                }
            });
        });
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
            req.entity = entity;
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
            var query = 'select e.username,     \
                                     ee.description, \
                                     ee.city,        \
                                     avatar_url      \
                                from tb_entity e                                    \
                           left join tb_entity_extra_info ee                        \
                                  on e.entity_extra_info = ee.entity_extra_info     \
                               where e.entity = $1';
            client.query(query, [entity], function (err, result) {
                done();
                if (result.rows[0]) {
                    return res.json(result.rows[0]);
                } else {
                    resp.status = ERROR;
                    resp.message = "User not found.";
                    return res.status(400).json(resp);
                }
            });
        });
    });

    router.post('/:entity', function (req, res, next) {
        var resp = {};
        var req_query = req.query;
        var cookies = req.cookies;
        var user_functions = require('./functions');

        var my_entity_callback = function(my_entity) {
            req.my_entity = my_entity;
            next();
        };

        var callback = function (exists) {
            if (exists){
            if (!req_query.action) {
                resp.status = ERROR;
                resp.message = "User action not found.";
                res.status(400).json(resp);
            } else {
                user_functions.get_my_entity(cookies, my_entity_callback);
            }
            } else {
                             resp.status = ERROR;
                resp.message = "User not found.";
                res.status(400).json(resp);   
            }
        };

        user_functions.if_entity_exists(req.entity, callback);
    });

    app.use('/api/user', router);
};