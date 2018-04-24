import sqlite3

conn = sqlite3.connect('data_team.db')
c = conn.cursor()
for row in c.execute('SELECT * FROM schedule'):
    print(row)
conn.close()
