var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

router.get('/', function(req, res) {
    res.append('Content-Type', 'text/plain');

    text = "API List\n\
/api/roster\t\treturns the entire nba roster\n\
/api/record\t\treturns the entire nba win-loss\n\
/api/tweetscore\t\treturns the entire nba average twitter sentiment score by team\n\
/api/tweetscore/day\treturns the entire nba average twitter sentiment score by team and day\n\
/api/tweetscore/hour\treturns the entire nba average twitter sentiment score by team and hour\n\
/api/:team/roster\treturns a team's roster\n\
/api/:team/record\treturns a team's win-loss\n\
/api/:team/tweetscore\treturns a team's average twitter sentiment score\n\
/api/:team/tweetscore/day\treturns a team's average twitter sentiment score by day\n\
/api/:team/tweetscore/hour\treturns a team's average twitter sentiment score by hour\n\n\
replace :team with the 3 letter code\n\
BOS Boston Celtics\n\
CLE Cleveland Cavaliers\n\
GSW Golden State Warriors\n\
HOU Houston Rockets\n\
IND Indiana Pacers\n\
MIN Minnesota Timberwolves\n\
NOP New Orleans Pelicans\n\
TOR Toronto Raptors\n\
WAS Washington Wizards\n\
";

    res.send(text);
});

router.get('/roster', function(req, res) {
    let sql = "SELECT * FROM players";
    var params = [];
    stats_query(sql, params, res);
});
router.get('/record', function(req, res) {
    let sql = "SELECT * FROM teams";
    var params = [];
    stats_query(sql, params, res);
});
router.get('/tweetscore/hour', function(req, res) {
    let sql = "SELECT team, datetime(date) as date, AVG(score) as sentiment, COUNT(score) as count FROM tweets GROUP BY team, datetime(date)";
    var params = [];
    tweets_query(sql, params, res);
});
router.get('/tweetscore/day', function(req, res) {
    let sql = "SELECT team, date(date) as date, AVG(score) as sentiment, COUNT(score) as count FROM tweets GROUP BY team, date(date)";
    var params = [];
    tweets_query(sql, params, res);
});
router.get('/tweetscore', function(req, res) {
    let sql = "SELECT team, AVG(score) as sentiment, COUNT(score) as count FROM tweets GROUP BY team";
    var params = []
    tweets_query(sql, params, res);
});
router.get('/:team/roster', function(req, res) {
    let sql = "SELECT * FROM players WHERE team = ?";
    var params = [req.params.team.toUpperCase()];
    stats_query(sql, params, res);
});
router.get('/:team/record', function(req, res) {
    let sql = "SELECT * FROM teams WHERE team = ?";
    var params = [req.params.team.toUpperCase()];
    stats_query(sql, params, res);
});
router.get('/:team/tweetscore/hour', function(req, res) {
    let sql = "SELECT team, datetime(date) as date, AVG(score) as sentiment, COUNT(score) as count FROM tweets WHERE team = ? GROUP BY datetime(date)";
    var params = [req.params.team.toUpperCase()];
    tweets_query(sql, params, res);
});
router.get('/:team/tweetscore/day', function(req, res) {
    let sql = "SELECT team, date(date) as date, AVG(score) as sentiment, COUNT(score) as count FROM tweets WHERE team = ? GROUP BY date(date)";
    var params = [req.params.team.toUpperCase()];
    tweets_query(sql, params, res);
});
router.get('/:team/tweetscore', function(req, res) {
    let sql = "SELECT team, AVG(score) as sentiment, COUNT(score) as count FROM tweets WHERE team = ?";
    var params = [req.params.team.toUpperCase()];
    tweets_query(sql, params, res);
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
