import sqlite3

conn = sqlite3.connect('data.db')
c = conn.cursor()

count = 0

for row in c.execute('SELECT * FROM tweets'):
    print(row)
    count += 1

print(count)
