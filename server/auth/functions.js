var pg = require('pg');

var is_session_valid = function(cookies, callback){
    if ( "AuthToken" in cookies ) {
        pg.connect(connectionString, function(err, client, done) {
            client.query('select ( expires < now() ) as expired from tb_session where session_id_hash = $1', [cookies["AuthToken"]], function(err, result) {
                done();
                console.log( result.rows[0]);

                if ( result.rows[0] ){
                    if( result.rows[0].expired ){
                        return callback( false );
                    } else {
                        return callback( true );
                    }
                }
                return callback( false );
            });
        });
    } else {
        return callback( false );
    }
};

/**
*   Checks the authentication of all api calls.
**/
var require_authentication = function(req, res, next){
    var cookies = req.cookies;
    var requesting_url = req.url;
    var resp = {};

    var callback = function ( session_valid ){
        console.log("Session valid: " + session_valid);
        if ( requesting_url != '/api/account' && !session_valid ){
            resp.status = ERROR;
            resp.message = "Authentication required.";
            return res.status(401).json(resp);
        } else {
            return next();
        }
    };

    return is_session_valid( cookies, callback );

};

module.exports.is_session_valid = is_session_valid;
module.exports.require_authentication = require_authentication;
