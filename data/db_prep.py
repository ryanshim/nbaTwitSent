import sqlite3

# TODO: force data.db to be created in same folder as this file
conn = sqlite3.connect('data.db')
c = conn.cursor()

c.execute('''CREATE TABLE tweets
            (date text not null,
            team text not null,
            tag text not null,
            user text not null,
            tweet text not null,
            score real,
            east integer)''')

conn.commit()
conn.close()
