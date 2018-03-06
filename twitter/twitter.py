import sqlite3
import json
from tweepy import Stream
from tweepy import OAuthHandler
from tweepy import StreamListener
from credentials import *
from logger import *

tracking = {
    # Western
    "@houstonrockets": "rockets", "#rockets": "rockets",
    "@warriors": "warriors", "#dubnation": "warriors",
    "@trailblazers": "blazers", "#ripcity": "blazers",
    "@pelicansnba": "pelicans", "#doitbig": "pelicans",
    "@timberwolves": "timberwolves", "#alleyesnorth": "timberwolves",

    # Eastern
    "@raptors": "raptors", "#wethenorth": "raptors",
    "@celtics": "celtics", "#celtics": "celtics",
    "@cavs": "cavaliers", "#allforone": "cavaliers",
    "@pacers": "pacers", "#gopacers": "pacers",
    "@washwizards": "wizards", "dcfamily": "wizards"
}

# connect to the database
conn = sqlite3.connect("../data/data.db", uri=True)
c = conn.cursor()

# connect to twitter
auth = OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

# create a stream listener
class listener(StreamListener):
    def on_data(self, data):
        all_data = json.loads(data)

        if "retweeted_status" not in all_data \
        and "RT @" not in all_data["text"] \
        and "rt @" not in all_data["text"]:
            date = all_data["created_at"] # maybe use timestamp_ms
            user = all_data["user"]["screen_name"]
            tweet = all_data["text"]
            if all_data["truncated"]:
                tweet = all_data["extended_tweet"]["full_text"]

            t = (date, "", "", user, tweet, None)
            for k, v in tracking.items():
                if k in tweet:
                    t = (date, v, k, user, tweet, None)

            c.execute("INSERT INTO tweets VALUES (?,?,?,?,?,?)", t)
            conn.commit()
            logger.info("Stored tweet")
        logger.debug(all_data)

    def on_error(self, status_code):
        # TODO: change credentials or restart process in an hour
        logger.info("Error {0}".format(status_code))
        if status_code == 420: # hit the Twitter rate limit
            return False

# start tracking tweets
twitterStream = Stream(auth, listener())
twitterStream.filter(languages=["en"], track=tracking.keys())
