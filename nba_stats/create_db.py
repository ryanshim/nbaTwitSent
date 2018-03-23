# Create a database for team statistics
import sqlite3

conn = sqlite3.connect('../data/data_team.db')
c = conn.cursor()

c.execute('''CREATE TABLE teams 
                (team text, conf text, w real, l real, pct real)''')

c.execute('''CREATE TABLE players
                (team text, num real, name text, pos text, height text, weight real)''')

conn.commit()
conn.close()
