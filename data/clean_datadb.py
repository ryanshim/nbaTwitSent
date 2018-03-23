import sqlite3

conn = sqlite3.connect('data.db')
c = conn.cursor()

c.execute("UPDATE tweets SET team = 'HOU' WHERE team = 'rockets'")
c.execute("UPDATE tweets SET team = 'GSW' WHERE team = 'warriors'")
c.execute("UPDATE tweets SET team = 'POR' WHERE team = 'blazers'")
c.execute("UPDATE tweets SET team = 'NOP' WHERE team = 'pelicans'")
c.execute("UPDATE tweets SET team = 'MIN' WHERE team = 'timberwolves'")
c.execute("UPDATE tweets SET team = 'TOR' WHERE team = 'raptors'")
c.execute("UPDATE tweets SET team = 'BOS' WHERE team = 'celtics'")
c.execute("UPDATE tweets SET team = 'CLE' WHERE team = 'cavaliers'")
c.execute("UPDATE tweets SET team = 'IND' WHERE team = 'pacers'")
c.execute("UPDATE tweets SET team = 'WAS' WHERE team = 'wizards'")
c.execute("DELETE FROM tweets WHERE team = ''")

c.execute("UPDATE tweets SET date = replace(date, 'Mar', '03') WHERE date LIKE '%Mar%'")
c.execute("UPDATE tweets SET date = substr(date,26,4)||'-'||substr(date,5,2)||'-'||substr(date,8,2)||'T'||substr(date,11,8)")

c.execute("ALTER TABLE tweets ADD COLUMN east INTEGER DEFAULT 0")
c.execute("UPDATE tweets SET east = 1 WHERE team = 'TOR'")
c.execute("UPDATE tweets SET east = 1 WHERE team = 'BOS'")
c.execute("UPDATE tweets SET east = 1 WHERE team = 'CLE'")
c.execute("UPDATE tweets SET east = 1 WHERE team = 'IND'")
c.execute("UPDATE tweets SET east = 1 WHERE team = 'WAS'")


conn.commit()
conn.close()
