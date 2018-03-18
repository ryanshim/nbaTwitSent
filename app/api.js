var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

router.get('/', function(req, res) {
    res.append('Content-Type', 'text/plain');

    text = "API List\n\
replace :team with the 3 letter code\n\
BOS Boston Celtics\n\
CLE Cleveland Cavaliers\n\
GSW Golden State Warriors\n\
HOU Houston Rockets\n\
IND Indiana Pacers\n\
MIN Minnesota Timberwolves\n\
NOP New Orleans Pelicans\n\
TOR Toronto Raptors\n\
WAS Washington Wizards\n\n\
/roster\t\treturns the entire nba roster\n\
/record\t\treturns the entire nba win-loss\n\
/:team/roster\treturns a team's roster\n\
/:team/stats\treturns a team's win-loss\n\
";

    res.send(text);
});

router.get('/tweet', function(req, res) {
    let sql = "SELECT * FROM tweets LIMIT 100";
    var params = [];

    tweets_query(sql, params, res);
});

router.get('/roster', function(req, res) {
    let sql = "SELECT * FROM players";
    var params = [];
    stats_query(sql, params, res);
});
router.get('/stats', function(req, res) {
    let sql = "SELECT * FROM teams";
    var params = [];
    stats_query(sql, params, res);
});
router.get('/:team/roster', function(req, res) {
    // team in 3 letter code, e.g. warriors are GSW
    let sql = "SELECT * FROM players WHERE team = ?";
    var params = [req.params.team.toUpperCase()];
    stats_query(sql, params, res);
});
router.get('/:team/stats', function(req, res) {
    // team in 3 letter code, e.g. warriors are GSW
    let sql = "SELECT * FROM teams WHERE team = ?";
    var params = [req.params.team.toUpperCase()];
    stats_query(sql, params, res);
});


function tweets_query(sql, params, res) {
    let file = '../data/data.db';
    query(file, sql, params, res);
}
function stats_query(sql, params, res) {
    let file = '../data/data_team.db';
    query(file, sql, params, res);
}

function query(file, sql, params, response) {
    let db = new sqlite3.Database(file, sqlite3.OPEN_READONLY,
    (err) => {
        if (err) {
            return console.error(err.message);
        }
    });

    db.serialize(function() {
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error(err.message);
            }
            response.append('Content-Type', 'application/json');
            response.json(rows);
        });
    });
    
    db.close();
}

module.exports = router;
