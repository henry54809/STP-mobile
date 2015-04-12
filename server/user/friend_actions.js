var pg = require('pg');
var constants = require('./constants');
var user_functions = require('./functions');

module.exports = function (app) {
    var express = require('express');
    var router = express.Router();

    var FRIEND = 'Friend';
    var STARRED = 'Starred';

    //Check if they are friend.
    router.put('/:entity', function (req, res, next) {
        var action = req.query.action;
        if (action !== 'add') {
            next();
        }

        var resp = {};
        var recipient = req.params.entity;
        var callback = function (are_friends) {
            if (are_friends) {
                resp.status = ERROR;
                resp.message = "Already friends.";
                return res.json(resp);
            }
            return next();
        };
        return user_functions.if_entity_friend(entity, recipient, callback);
    });

    //Check if friend request exists.
    router.all('/:entity', function (req, res, next) {
        var action = req.query.action;
        if (action !== 'add') {
            next();
        }
        var recipient = req.params.entity;
        var callback = function (friend_request) {
            req.friend_request = friend_request;
            return next();
        };
        return user_functions.if_friend_request_exists(req.entity, recipient, callback);
    });

    //Add friend request
    router.put('/:entity', function( req, res, next){
        var resp = {};
        var action = req.query.action;
        var msg = req.body;
        var message = msg.message;
        if (action !== 'add') {
            return next();
        }
        if(req.friend_request){
            resp.status = ERROR;
            resp.message = 'Friend resquest exists.';
            return res.json(resp);
        }
        //Add friend
        var query = 'insert into tb_friend_request (                            \
                                                        requester,              \
                                                        requestee,              \
                                                        message                 \
                                                  ) values( $1, $2, $3 )        \
                  returning friend_request';
        pg.connect(connectionString, function (err, client, done) {
            client.query(query, [
                                    req.entity,
                                    req.params.entity,
                                    message
                                ], function (err, result) {
                done();
                if (result && result.rows[0]) {
                    resp.status = OK;
                    resp.message = "Friend request sent.";
                    resp.friend_request = result.rows[0].friend_request;
                    return res.json(resp);
                } else {
                    if(err){
                        console.log(err);
                    }
                    resp.status = ERROR;
                    resp.message = "Error when sending friend request.";
                    return res.json(resp);
                }
            });
        });
    });

    //Decline friend request.
    router.put('/:entity', function (req, res, next) {
        var action = req.query.action;
        if (action !== 'reject') {
            return next();
        }
        var resp = {};
        var friend_request = req.friend_request;
        var callback = function(modified){
            if( modified ){
                resp.status = OK;
                resp.message = 'Friend request rejected.';
            } else {
                resp.status = ERROR;
                resp.message = 'Friend request not found.';
            }
            return res.json(resp);
        };

        user_functions.update_friend_request_type(
            friend_request.friend_request,
            constants.FRIEND_REQUEST_REJECTED,
            callback
        );
    });

    router.put('/:entity', function (req, res, next) {
        var action = req.query.action;
        if (action !== 'accept') {
            return next();
        }
        var friend_request = req.friend_request;
        var callback = function(modified){
            if( modified ){
                resp.status = OK;
                resp.message = 'Friend request accepted.';
                var query = 'insert into tb_entity_friend (                            \
                                                        entity,              \
                                                        friend              \
                                                  ) values( $1, $2 )        \
                  returning entity_friend';
                pg.connect(connectionString, function (err, client, done) {
                    client.query(query, [
                                            req.entity,
                                            req.params.entity,
                                        ], function (err, result) {
                        done();
                        if(result && result.rows[0]){
                            resp.entity_friend = result.rows[0].entity_friend;
                        } else {
                            resp.status = ERROR;
                            resp.message = 'Could not add friend.';
                            if(err){
                                console.log(err);
                            }
                            return res.status(500).json(resp);
                        }
                    });
                });
            } else {
                resp.status = ERROR;
                resp.message = 'Friend request not found.';
            }
            return res.json(resp);
        };

        user_functions.update_friend_request_type(
            friend_request.friend_request,
            constants.FRIEND_REQUEST_ACCEPTED,
            callback
        );
    });

    router.put('/:entity', function (req, res, next) {
        var action = req.query.action;
        var resp = {};
        if (action !== 'delete') {
            return next();
        }
        var friend_request = req.friend_request;
        var query = 'delete from tb_friend_request \
                      where friend_request = $1';
        pg.connect(connectionString, function (err, client, done) {
            client.query(query, [ friend_request.friend_request ], function (err, result) {
                done();
                if(result && result.rowCount){
                    resp.status = OK;
                    resp.message = 'Friend request deleted.';
                    return res.json(resp);
                } else {
                    resp.status = ERROR;
                    resp.message = 'Could not find friend request.';
                    if(err){
                        console.log(err);
                    }
                    return res.status(500).json(resp);
                }
            });
        });
    });

    //fall through
    router.put('/:entity', function (req, res, next) {
        var resp = {};
        resp.status = ERROR;
        resp.message = "User action does not exist.";
        return res.json(resp);
    });

    app.use('/api/user', router);
};