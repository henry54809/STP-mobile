var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }
exec("git status | head -n 1", puts);


var app = express();
var knex = require('knex')({
     client: 'pg',
     connection: {
         host: 'athena.internal',
         user: 'postgres',
         password: 'blueshoes',
         database: 'ises',
         charset: 'utf8'
     }
});

var bookshelf = require('bookshelf')(knex);

