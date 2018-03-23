import os
import sqlite3
import json
import multiprocessing
import time
from datetime import datetime
from textblob import TextBlob
from tweepy import Stream
from tweepy import OAuthHandler
from tweepy import StreamListener
from credentials import *
from logger import *

db_path = '/data/data.db'
tracking = {
    # Western Conference
    "@houstonrockets": "HOU", "#rockets": "HOU",
    "@warriors": "GSW", "#dubnation": "GSW",
    "@trailblazers": "POR", "#ripcity": "POR",
    "@pelicansnba": "NOP", "#doitbig": "NOP",
    "@timberwolves": "MIN", "#alleyesnorth": "MIN",
    "@nuggest": "DEN", "#milehighbasketball": "DEN",
    "@okcthunder": "OKC", "#thunderup": "OKC",
    "@dallasmavs": "DAL", "#mffl": "DAL",
    "@lakers": "LAL", "#lakeshow": "LAL",
    "@laclippers": "LAC", "#ittakeseverything": "LAC",
    "@suns": "PHX", "#sunsat50": "PHX",
    "@spurs": "SAS", "#gospursgo": "SAS",
    "@utahjazz": "UTA", "#takenote": "UTA",
    "@memgrizz": "MEM", "#grindcity": "MEM",
    "@sacramentokings": "SAC", "#sacramentoproud": "SAC",

    # Eastern Conference
    "@raptors": "TOR", "#wethenorth": "TOR",
    "@celtics": "BOS", "#celtics": "BOS",
    "@cavs": "CLE", "#allforone": "CLE",
    "@pacers": "IND", "#pacers": "IND",
    "@washwizards": "WAS", "#dcfamily": "WAS",
    "@atlhawks": "ATL", "#truetoatlanta": "ATL",
    "@brooklynets": "BKN", "#wegohard": "BKN",
    "@hornets": "CHA", "#buzzcity": "CHA",
    "@chicagobulls": "CHI", "#bullsnation": "CHI",
    "@nyknicks": "NYK", "#newyorkforever": "NYK",
    "@orlandomagic": "ORL", "#puremagic": "ORL",
    "@detroitpistons": "DET", "#detroitbasketall": "DET",
    "@sixers": "PHI", "#heretheycome": "PHI",
    "@bucks": "MIL", "#fearthedeer": "MIL",
    "@miamiheat": "MIA", "#heatculture": "MIA"
}
east = ["TOR", "BOS", "CLE", "IND", "WAS", "ATL", "BKN", "CHA",\
        "CHI", "NYK", "ORL", "DET", "PHI", "MIL", "MIA"]

class Listener(StreamListener):
    def __init__(self, db):
        super().__init__(self)
        self.db = db

    def on_data(self, data):
        all_data = json.loads(data)

        if "retweeted_status" not in all_data \
        and "RT @" not in all_data["text"] \
        and "rt @" not in all_data["text"]:
            created = all_data["created_at"] # UTC string
            date = datetime.strptime(created, "%a %b %d %H:%M:%S %z %Y").isoformat()
            user = all_data["user"]["screen_name"]
            tweet = all_data["text"]
            if all_data["truncated"]:
                tweet = all_data["extended_tweet"]["full_text"]

            score = 0
            blob = TextBlob(tweet)
            for sentence in blob.sentences:
                score += sentence.sentiment.polarity

            t = (date, "", "", user, tweet, score, -1)
            for k, v in tracking.items():
                if k in tweet.lower():
                    if v in east:
                        t = (date, v, k, user, tweet, score, 1)
                    else:
                        t = (date, v, k, user, tweet, score, 0)

            self.db.insert("INSERT INTO tweets VALUES (?,?,?,?,?,?,?)", t)
            #logger.info("Stored tweet")
        #logger.debug(all_data)

    def on_error(self, status_code):
        # TODO: change credentials or restart process in an hour
        logger.info("Error {0}".format(status_code))
        if status_code == 420: # hit the Twitter rate limit
            return False

class DBManager(object):
    def __init__(self, path, uri=True):
        self.conn = sqlite3.connect(path, uri=uri)
        self.cur = self.conn.cursor()
        logger.info("Database connection opened")

    def query(self, query):
        self.cur.execute(arg)
        self.conn.commit()
        return self.cur
    
    def insert(self, query, values):
        self.cur.execute(query, values)
        self.conn.commit()
        return self.cur

    def __del__(self):
        self.conn.close()
        logger.info("Database connection closed")


def twitter_stream(database):

    # connect to twitter
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)

    # start tracking tweets
    twitterStream = Stream(auth, Listener(database))
    twitterStream.filter(languages=["en"], track=tracking.keys())

if __name__ == '__main__':
    logger.info("Begin collecting tweets")
    os.chdir('..')

    # connect to database
    db = DBManager(os.getcwd() + db_path)

    p = multiprocessing.Process(target=twitter_stream, name="TwitterStream", args=(db,))
    p.start()
    p.join(14400) # run for 4 hours
    p.terminate()

    del db
    logger.info("Stop collecting tweets")

