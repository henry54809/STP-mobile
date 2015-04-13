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
    var query = "select friend_request,             \
                        requester,                  \
                        requestee,                  \
                        frt.label as status,        \
                        message,                    \
                        created,                    \
                        case when requester = $1    \
                        then 'requester'            \
                        else 'receiver'             \
                        end as direction            \
                   from tb_friend_request fr        \
                   join tb_friend_request_type frt  \
                     on frt.friend_request_type = fr.friend_request_type \
                  where requester = $1              \
                     or requestee = $1";
    pg.connect(connectionString, function (err, client, done) {
        client.query(query, [entity], function (err, result) {
            done();
            if (err){
                console.log(err);
            }
            if (result && result.rows[0]) {
                var friend_requests = {};
                var requested = [];
                var received = [];
                for( var i=0; i< result.rows; i++){
                    if( result.rows[i].direction === 'requester' ){
                        friend_requests.requested.push(result.rows[i]) ;
                    } else {
                        friend_requests.received.push(result.rows[i]) ;
                    }
                }
                friend_requests.requested = requested;
                friend_requests.requested = received;
                return callback(result.rows);
            } else {
                return callback(null);
            }
        });
    });
};

//This should only produce 1 row.
var if_friend_request_exists = function( requester, requestee, callback ){
    var query = "select *,                          \
                        case when requester = $1    \
                        then 'requester'            \
                        else 'receiver'             \
                        end as direction            \
                   from tb_friend_request           \
                  where ((requester = $1            \
                    and requestee = $2 )            \
                     or ( requester = $2            \
                    and requestee = $1 ))           \
                    and friend_request_type in ( $3, $4 ) \
               order by created                           \
                  limit 1 ";
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
                return callback(result.rows[0]);
            } else {
                return callback(false);
            }
        });
    });
};

var update_friend_request_type = function( friend_request, type, callback ){
    var query = 'update tb_friend_request \
                    set friend_request_type = $1 \
                  where friend_request = $2';
    pg.connect(connectionString, function (err, client, done) {
        client.query(query, [type, friend_request], function (err, result) {
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
