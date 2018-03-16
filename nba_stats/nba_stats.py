# NBA Team Statistics Collector
import sqlite3
import json
from nba_py import team
from nba_py.constants import TEAMS

season = '2017-18'
team_ids = ['TOR', 'BOS', 'CLE', 'IND', 'WAS',
        'HOU', 'GSW', 'NOP', 'POR', 'MIN']

def populate_teams():
    conn = sqlite3.connect('data_team.db')
    c = conn.cursor()

    for team_id in team_ids:
        tid = TEAMS[team_id]['id']
        team_stats = dict(team.TeamSummary(tid, season).json)

        team_name = team_stats['resultSets'][0]['rowSet'][0][3]
        team_wins = team_stats['resultSets'][0]['rowSet'][0][8]
        team_loss = team_stats['resultSets'][0]['rowSet'][0][9]
        team_pct = team_stats['resultSets'][0]['rowSet'][0][10]

        row = (team_name, team_wins, team_loss, team_pct)
        c.execute('INSERT INTO teams VALUES (?,?,?,?)', row)
        conn.commit()

    conn.close()


def main():
    populate_teams()

if __name__ == '__main__':
    main()
