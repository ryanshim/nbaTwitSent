# NBA Team Statistics Collector
import requests
import sqlite3
import json
from nba_py import team
from nba_py.constants import TEAMS

season = '2017-18'
team_ids = []

for k,v in TEAMS.items():
    team_ids.append(k)

def populate_teams():
    print('Retrieving team stats')
    conn = sqlite3.connect('../data/data_team.db')
    c = conn.cursor()

    c.execute('DELETE FROM teams') # remove old entries
    conn.commit()

    for team_id in team_ids:
        tid = TEAMS[team_id]['id']
        team_stats = dict(team.TeamSummary(tid, season).json)

        team_name = team_id 
        team_conf = team_stats['resultSets'][0]['rowSet'][0][5]
        team_wins = team_stats['resultSets'][0]['rowSet'][0][8]
        team_loss = team_stats['resultSets'][0]['rowSet'][0][9]
        team_pct = team_stats['resultSets'][0]['rowSet'][0][10]

        row = (team_name, team_conf, team_wins, team_loss, team_pct)
        c.execute('INSERT INTO teams VALUES (?,?,?,?,?)', row)
        conn.commit()

    conn.close()
    print('\tDone')

def populate_players():
    print('Retrieving players stats')
    conn = sqlite3.connect('../data/data_team.db')
    c = conn.cursor()

    c.execute('DELETE FROM players')
    conn.commit()

    for team_id in team_ids:
        tid = TEAMS[team_id]['id']
        player_stats = dict(team.TeamCommonRoster(tid, season).json)

        for player in player_stats['resultSets'][0]['rowSet']:
            num = player[4]
            name = player[3]
            pos = player[5]
            height = player[6]
            weight = player[7]

            row = (team_id, num, name, pos, height, weight)
            c.execute('INSERT INTO players VALUES (?,?,?,?,?,?)', row)
            conn.commit()

    conn.close()
    print('\tDone')

def populate_schedule():
    print('Retrieving nba schedule and scores')
    conn = sqlite3.connect('../data/data_team.db')
    c = conn.cursor()

    c.execute('DELETE FROM teams')
    conn.commit()

    nba_response = requests.get(url='http://data.nba.com/data/10s/v2015/json' + \
            '/mobile_teams/nba/2017/league/00_full_schedule.json').json()

    schedule = nba_response['lscd']
    schedule = schedule[len(schedule)-1]['mscd']['g']   # select most recent month

    for game in schedule:
        game_date = game['gdte']
        game_time = ""
        home_team = game['h']['ta']
        away_team = game['v']['ta']
        home_score = None
        away_score = None 

        # get match results
        if (game['h']['s'] is not "") and (game['v']['s'] is not ""):
            home_score = int(game['h']['s'])
            away_score = int(game['v']['s'])

        # check if game time is set
        if game['etm'][11:]:
            game_time = game['etm'][11:]
        else:
            game_time = 'TBD'

        row = (game_date, game_time, home_team, home_score, away_team, away_score)
        c.execute('INSERT INTO schedule VALUES (?,?,?,?,?,?)', row)
        conn.commit()

    conn.close()
    print('\tDone')

if __name__ == '__main__':
    populate_teams()
    populate_players()
    populate_schedule()
