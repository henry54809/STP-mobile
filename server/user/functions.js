var pg = require('pg');

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
    var query = 'select ft.label as friend_type  \
                   from tb_entity_friend ef \
                   join tb_friend_type ft   \
                     on ef.friend_type = ft.friend_type \
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
            if (result && result.rows[0]) {
                return callback(result.rows[0].friend_type);
            } else {
                return callback(null);
            }
        });
    });
};

var get_my_entity = function ( cookies, callback ){
    var query = 'select entity  \
                   from tb_session \
                  where session_id_hash = $1';
    pg.connect(connectionString, function (err, client, done) {
        client.query(query, [cookies["AuthToken"]], function (err, result) {
            done();
            if (result && result.rows[0]) {
                return callback(result.rows[0].entity);
            } else {
                return callback(null);
            }
        });
    });
};

module.exports.if_entity_exists = if_entity_exists;
module.exports.if_entity_friend = if_entity_friend;
module.exports.get_my_entity = get_my_entity;