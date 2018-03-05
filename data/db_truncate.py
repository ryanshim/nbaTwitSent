import sqlite3

conn = sqlite3.connect('data.db')
c = conn.cursor()

c.execute('DELETE FROM tweets')

conn.commit()
conn.close()
