import sqlite3

conn = sqlite3.connect('data.db')
c = conn.cursor()

tweets = [('18-01-01', 'warriors', '#warriors', 'mark', 'asdf', 10.00),
          ('18-01-01', 'warriors', '#warriors', 'mark', 'asdf', 1.00),
          ('18-01-01', 'spurs', '#warriors', 'mark', 'asdf', 5.00),
          ('18-01-01', 'spurs', '#warriors', 'mark', 'asdf', 4.00),
          ('18-01-01', 'rockets', '#warriors', 'mark', 'asdf', 3.00),
          ('18-01-01', 'rockets', '#warriors', 'mark', 'asdf', 1.20),
          ('18-01-01', 'rockets', '#warriors', 'mark', 'asdf', None)
         ]
c.executemany('INSERT INTO tweets VALUES (?,?,?,?,?,?)', tweets)

conn.commit()
conn.close()
