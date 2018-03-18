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

conn.commit()
conn.close()
