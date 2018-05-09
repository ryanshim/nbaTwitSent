// Miscellaneous functions for the main page
var teams = [];
$(document).ready(function (){
    getTopLogos();

    getSchedule("#inner-sched");
    //getTweets("#inner-tweet");
    getChart();

});

function getTopLogos() {
    var i;
    for (i = 1; i < 5; i++) {
        getLogo("west", i, "#inner-west"+i);
        getLogo("east", i, "#inner-east"+i);
    }
}

function getLogo(conference, rank, id) {
    $.getJSON('api/record/'+conference, function(data) {
        var team = data[rank-1].team;
        teams.push(team);
        $(id).append("<button style='background: url(images/teamLogos/"+team+"_logo.svg)' class='teamLogo' data-toggle='modal' data-target='#teamDialogBox'></button>")
        $(id).append("<p>Wins: " + data[rank-1].w + "</p>");
        $(id).append("<p>Losses: " + data[rank-1].l + "</p>");
        $(id).append("<p>Percent: " + Number.parseFloat(data[rank-1].pct*100 + "%" + "</p>").toFixed(1));

        $(id).on("click", function() {
            $('#modal-teamLogo').empty();
            $('#modal-teamLogo').append('<img src="images/teamLogos/'+team+'_logo.svg" />')
            $.getJSON('api/'+team+'/roster', function(data) {
                $('#teamInfo').find('tbody').empty();
                $.each(data, function(key, value) {

                    $('#teamInfo').find('tbody').append('<tr class="playerRow">' +
                    '<td>' + value.num + '</td>' +
                    '<td>' + value.name + '</td>' +
                    '<td>' + value.pos +'</td>' +
                    '<td>' + value.height +'</td>' +
                    '<td>' + value.weight +'</td>' +
                    '</tr>');
                });
            });
        });
    });
}

// Calls the api to retreive tweet time, user, text, and score
function getTweets(id) {
    $.getJSON('api/tweets', function(data) {
        $.each(data, function(key, value) {
            var embed = "";
            embed += value.date.slice(0, -2) + " " + value.user + "</br>";
            embed += value.tweet;
            $(id).append("<p class='div-tweet'>" + embed + "</p>");
        });
    });
}

// Calls the api to retrieve upcoming games
function getSchedule(id) {
    $.getJSON('api/schedule', function(data) {
        $.each(data, function(key, value) {
            var embed;
            embed += "<td>" + value.date + "</td>";
            embed += "<td>" + value.time + "</td>";
            embed += "<td>" + value.h_team + "</td>" ;
            embed += "<td>" + value.v_team + "</td>";
            $(id).append("<tr>" + embed + "</tr>");
        });
    });
}

// Add sentiment chart
function getChart() {
    $.getJSON('api/tweetscore', function(data) {
        var scores = [];
        $.each(data, function(key, value) {
            if (teams.includes(value.team)) {
                scores.push({"team": value.team, "senti": value.sentiment*100});
            }
        });

        var chart = AmCharts.makeChart( "chart-div", {
            "type": "serial",
            "theme": "light",
            "color": "#FFFFFF",
            "creditsPosition": "top-right",
            "fontFamily": "Questrial",
            "dataProvider": scores,
            "valueAxes": [ {
                "gridColor": "#FFFFFF",
                "gridAlpha": 0.2,
                "dashLength": 0
            } ],
            "gridAboveGraphs": true,
            "startDuration": 1,
            "graphs": [ {
                "balloonText": "[[category]]: <b>[[value]]</b>",
                "fillAlphas": 0.8,
                "lineAlpha": 0.2,
                "type": "column",
                "valueField": "senti"
            } ],
            "chartCursor": {
                "categoryBalloonEnabled": false,
                "cursorAlpha": 0,
                "zoomable": false
            },
            "categoryField": "team",
            "categoryAxis": {
                "gridPosition": "start",
                "gridAlpha": 0,
                "tickPosition": "start",
                "tickLength": 20
            },
            "export": {
                "enabled": true
            }
        });
    });
}

