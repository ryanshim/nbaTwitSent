import sqlite3
import json
import time
from tweepy import Stream
from tweepy import OAuthHandler
from tweepy import StreamListener
from credentials import *

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

        date = all_data["created_at"] # maybe use timestamp_ms
        user = all_data["user"]["screen_name"]
        tweet = all_data["text"]

        # TODO: figure out how to extract the search tag and get the team
        t = (date, "team", "tag", user, tweet, None)

        c.execute("INSERT INTO tweets VALUES (?,?,?,?,?,?)", t)
        print(data)

        conn.commit()
        return True

# start tracking tweets
twitterStream = Stream(auth, listener())
twitterStream.filter(track=[
    # Western
    "@houstonrockets", "#rockets",
    "@warriors", "#dubnation",
    "@trailblazers", "#ripcity",
    "@pelicansnba", "#doitbig",
    "@timberwolves", "#alleyesnorth",

    # Eastern
    "@raptors", "#wethenorth",
    "@celtics", "#celtics",
    "@cavs", "#allforone",
    "@pacers", "#gopacers",
    "@washwizards", "dcfamily"
])
