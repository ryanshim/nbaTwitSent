# Create a database for team statistics
import sqlite3

conn = sqlite3.connect('data_team.db')

c = conn.cursor()

# Create teams table
c.execute('''CREATE TABLE teams 
                (team text, w real, l real, pct real)''')

conn.commit()   # save changes

conn.close()
