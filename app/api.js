var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

router.get('/', function(req, res) {
    res.append('Content-Type', 'text/plain');

    text = "API List\n\
/api/roster\t\treturns the entire nba roster\n\
/api/record\t\treturns the entire nba win-loss\n\
/api/record/east\treturns the nba eastern conference win-loss\n\
/api/record/west\treturns the nba western conference win-loss\n\
/api/schedule\t\treturns five future games that have not been started\n\
/api/schedule/today\treturns games occurring today in format: date, time, home team, home score, visitor team, and visitor score\n\
/api/tweets\t\treturns 100 most recent tweets with users and timestamp\n\
/api/tweetscore\t\treturns the entire nba average twitter sentiment score by team\n\
/api/tweetscore/day\treturns the entire nba average twitter sentiment score by team and day\n\
/api/tweetscore/hour\treturns the entire nba average twitter sentiment score by team and hour\n\
/api/:team/roster\treturns a team's roster\n\
/api/:team/record\treturns a team's win-loss\n\
/api/:team/tweetscore\treturns a team's average twitter sentiment score\n\
/api/:team/tweetscore/day\treturns a team's average twitter sentiment score by day\n\
/api/:team/tweetscore/hour\treturns a team's average twitter sentiment score by hour\n\n\
replace :team with the 3 letter code\n\
ATL Atlanta Hawks\n\
BKN Brooklyn Nets\n\
BOS Boston Celtics\n\
CHA Chicago Bulls\n\
CLE Cleveland Cavaliers\n\
DAL Dallas Mavericks\n\
DEN Denver Nuggets\n\
DET Detroit Pistons\n\
GSW Golden State Warriors\n\
HOU Houston Rockets\n\
IND Indiana Pacers\n\
LAC Los Angeles Clippers\n\
LAL Los Angeles Lakers\n\
MEM Memphis Grizzlies\n\
MIA Miami Heats\n\
MIL Milwaukee Bucks\n\
MIN Minnesota Timberwolves\n\
NOP New Orleans Pelicans\n\
NYK New York Knicks\n\
OKC Oklahoma City Thunder\n\
ORL Orlando Magic\n\
PHI Philadelphia Sixers\n\
PHX Phoenix Suns\n\
POR Portland Trail Blazers\n\
SAC Sacramento Kings\n\
SAS San Antonio Spurs\n\
TOR Toronto Raptors\n\
UTA Utah Jazz\n\
WAS Washington Wizards\n\
";

    res.send(text);
});

router.get('/roster', function(req, res) {
    var sql = "SELECT * FROM players";
    var params = [];
    stats_query(sql, params, res);
});
router.get('/record/west', function(req, res) {
    var sql = "SELECT * FROM teams WHERE conf = 'West' ORDER BY pct DESC";
    var params = [];
    stats_query(sql, params, res);
});
router.get('/record/east', function(req, res) {
    var sql = "SELECT * FROM teams WHERE conf = 'East' ORDER By pct DESC";
    var params = [];
    stats_query(sql, params, res);
});
router.get('/record', function(req, res) {
    var sql = "SELECT * FROM teams ORDER BY pct DESC";
    var params = [];
    stats_query(sql, params, res);
});
router.get('/schedule', function(req, res) {
    var today = new Date();
    var month = today.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    var date = today.getDate();
    if (date < 10) {
        date = "0" + date;
    }
    var year = today.getFullYear();
    var sql = "SELECT * FROM schedule WHERE h_score is null and date >= '" + year + "-" + month + "-" + date + "' ORDER BY date ASC LIMIT 5";
    var params = [];
    stats_query(sql, params, res)
});

router.get('/schedule/today', function(req, res) {
    var today = new Date();
    var month = today.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    var date = today.getDate();
    if (date < 10) {
        date = "0" + date;
    }
    var year = today.getFullYear();
    var sql = "SELECT * FROM schedule WHERE date == '" + year + "-" + month + "-" + date + "' ORDER BY date ASC LIMIT 5";
    var params = [];
    stats_query(sql, params, res)
});
router.get('/tweets', function(req, res) {
    var sql = "SELECT strftime('%Y-%m-%d %H', date) as date, user, tweet FROM ( SELECT * FROM tweets ORDER BY date DESC LIMIT 100 ) qry ORDER BY date"
    var params = [];
    tweets_query(sql, params, res);
});
router.get('/tweetscore/hour', function(req, res) {
    var sql = "SELECT team, strftime('%Y-%m-%d %H', date) as date, AVG(score) as sentiment, COUNT(score) as count FROM tweets GROUP BY team, strftime('%Y-%m-%d %H', date)";
    var params = [];
    tweets_query(sql, params, res);
});
router.get('/tweetscore/day', function(req, res) {
    var sql = "SELECT team, date(date) as date, AVG(score) as sentiment, COUNT(score) as count FROM tweets GROUP BY team, date(date)";
    var params = [];
    tweets_query(sql, params, res);
});
router.get('/tweetscore', function(req, res) {
    var sql = "SELECT team, AVG(score) as sentiment, COUNT(score) as count FROM tweets GROUP BY team";
    var params = []
    tweets_query(sql, params, res);
});
router.get('/:team/roster', function(req, res) {
    var sql = "SELECT * FROM players WHERE team = ?";
    var params = [req.params.team.toUpperCase()];
    stats_query(sql, params, res);
});
router.get('/:team/record', function(req, res) {
    var sql = "SELECT * FROM teams WHERE team = ?";
    var params = [req.params.team.toUpperCase()];
    stats_query(sql, params, res);
});
router.get('/:team/tweetscore/hour', function(req, res) {
    var sql = "SELECT team, strftime('%Y-%m-%d %H', date) as date, AVG(score) as sentiment, COUNT(score) as count FROM tweets WHERE team = ? GROUP BY strftime('%Y-%m-%d %H', date)";
    var params = [req.params.team.toUpperCase()];
    tweets_query(sql, params, res);
});
router.get('/:team/tweetscore/day', function(req, res) {
    var sql = "SELECT team, date(date) as date, AVG(score) as sentiment, COUNT(score) as count FROM tweets WHERE team = ? GROUP BY date(date)";
    var params = [req.params.team.toUpperCase()];
    tweets_query(sql, params, res);
});
router.get('/:team/tweetscore', function(req, res) {
    var sql = "SELECT team, AVG(score) as sentiment, COUNT(score) as count FROM tweets WHERE team = ?";
    var params = [req.params.team.toUpperCase()];
    tweets_query(sql, params, res);
});


function tweets_query(sql, params, res) {
    var file = '../data/data.db';
    query(file, sql, params, res);
}
function stats_query(sql, params, res) {
    var file = '../data/data_team.db';
    query(file, sql, params, res);
}

function query(file, sql, params, response) {
    var db = new sqlite3.Database(file, sqlite3.OPEN_READONLY,
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
