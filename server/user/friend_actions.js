var pg = require('pg');

module.exports = function (app) {
    var express = require('express');
    var router = express.Router();
    var FRIEND_REQUEST_SENT = 'Friend request sent';
    var FRIEND = 'Friend';
    var STARRED = 'Starred';
    var UNFRIENDED = 'Unfriended';

    //Send friend request.
    router.post('/:entity', function (req, res, next) {
        var action = req.query.action;
        if (action !== 'add') {
            next();
        }

        var resp = {};
        var entity = req.entity;
        var my_entity = req.my_entity;
        var callback = function (friend_type) {
            if (friend_type) {
                switch (friend_type) {
                case FRIEND_REQUEST_SENT:
                    resp.status = ERROR;
                    resp.message = "Friend request exists.";
                    return res.json(resp);
                    break;
                case FRIEND, STARRED:
                    resp.status = ERROR;
                    resp.message = "Already friend.";
                    return res.json(resp);
                    break;
                }
            }

            //Add friend
            var query = 'select fn_new_entity_friend (                          \
                                                        $1,                     \
                                                        $2,                     \
                                                        (                           \
                                                            select friend_type      \
                                                              from tb_friend_type   \
                                                             where label = $3       \
                                                        )                           \
                                                      )';
            pg.connect(connectionString, function (err, client, done) {
                client.query(query, [my_entity, entity, FRIEND_REQUEST_SENT], function (err, result) {
                    done();
                    if (result && result.rows[0]) {
                        resp.status = OK;
                        resp.message = "Friend request sent.";
                        return res.json(resp);
                    } else {
                        console.log(err);
                        resp.status = ERROR;
                        resp.message = "Error when sending friend request.";
                        return res.json(resp);
                    }
                });
            });
        };
        var user_functions = require('./functions');
        return user_functions.if_entity_friend(my_entity, entity, callback);
    });

    //Decline friend request.
    router.post('/:entity', function (req, res, next) {
        var action = req.query.action;
        if (action !== 'decline') {
            next();
        }
        var resp = {};
        var entity = req.entity;
        var my_entity = req.my_entity;

        var query = '';
        pg.connect(connectionString, function (err, client, done) {
            client.query(query, [my_entity, entity, FRIEND_REQUEST_SENT], function (err, result) {});
        });

        return res.end();
    });

    router.post('/:entity', function (req, res, next) {
        var action = req.query.action;
        if (action !== 'accept') {
            next();
        }
        var resp = {};

        return res.end();
    });

    router.post('/:entity', function (req, res, next) {
        var action = req.query.action;
        var resp = {};
        if (action !== 'delete') {
            next();
        }

        return res.end();
    });

    //fall through
    router.post('/:entity', function (req, res, next) {
        var resp = {};
        resp.status = ERROR;
        resp.message = "User action does not exist.";
        res.json(resp);
    });

    app.use('/api/user', router);
};