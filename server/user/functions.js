var pg = require('pg');
var constants = require('./constants');

var if_entity_exists = function (entity, callback) {

    var query = 'select entity from tb_entity where entity = $1';
    pg.connect(connectionString, function (err, client, done) {
        client.query(query, [entity], function (err, result) {
            done();
            if (result && result.rows[0]) {
                return callback(true);
            } else {
                return callback(false);
            }
        });
    });

};

//Check if two entites are friends
var if_entity_friend = function (entity, entity2, callback) {
    var query = 'select *  \
                   from tb_entity_friend ef \
                  where (                   \
                            entity = $1     \
                        and friend = $2     \
                        )                   \
                     or (                   \
                            friend = $1     \
                        and entity = $2     \
                    )';
    pg.connect(connectionString, function (err, client, done) {
        client.query(query, [entity, entity2], function (err, result) {
            done();
            if(err){
                console.log(err);
            }
            if (result && result.rows[0]) {
                return callback(true);
            } else {
                return callback(false);
            }
        });
    });
};

var get_friend_requests = function(entity, callback){
    var query = "select *, 'requester' as direction \
                   from tb_friend_request           \
                  where requester = $1              \
                   union                            \
                  select *, 'receiver' as direction \
                    from tb_friend_request          \
                   where requestee = $1             \
                   ";
    pg.connect(connectionString, function (err, client, done) {
        client.query(query, [entity], function (err, result) {
            done();
            if (err){
                console.log(err);
            }
            if (result && result.rows[0]) {
                return callback(result.rows);
            } else {
                return callback(null);
            }
        });
    });
};

var if_friend_request_exists = function( requester, requestee, callback ){
    var query = "select *                           \
                   from tb_friend_request           \
                  where requester = $1              \
                    and requestee = $2              \
                    and friend_request_type in ( $3, $4 ) \
                   ";
    pg.connect(connectionString, function (err, client, done) {
        client.query(query, [
                                requester,
                                requestee,
                                constants.FRIEND_REQUEST_SEEN,
                                constants.FRIEND_REQUEST_SENT
                            ], function (err, result) {
            done();
            
            if(err){
                console.log(err);
            }

            if (result && result.rows[0]) {
                return callback(true);
            } else {
                return callback(false);
            }
        });
    });
};

var update_friend_request_type = function( friend_request, type ){
    var query = 'update tb_friend_request \
                    set friend_request_type = $1 \
                  where friend_request = $2';
    pg.connect(connectionString, function (err, client, done) {
        client.query(query, [FRIEND_REQUEST_SENT, friend_request], function (err, result) {
            done();
            if(err){
                console.log(err);
            }
            if(result && result.rowCount){
                return callback(true);
            } else {
                return callback(false);
            }
        });
    });
};

module.exports = {
    if_entity_exists: if_entity_exists,
    if_entity_friend: if_entity_friend,
    get_friend_requests: get_friend_requests,
    if_friend_request_exists: if_friend_request_exists,
    update_friend_request_type: update_friend_request_type
};
