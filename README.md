# nbaTwitSent

### Objective
This project performs sentiment analysis on the NBA derived from Twitter data.

* /app - webapp files
* /data - database related files
* /twitter - twitter data collection files
* /nba_stats - nba statistics collection files

### Getting started
##### Collecting tweets
1. Install python3
2. Install tweepy
 * 'pip install tweepy'
3. Install textblob
 * 'pip install textblob'
 * 'python -m textblob.download_corpora'
4. Change directory to the data folder
5. Run db_prep.py
6. Change directory to the twitter folder
7. Add twitter credentials to credentials.py
8. Run twitter.py

##### Collecting nba stats
1. Install python3
2. Install nba_py
 * 'pip install nba_py'
3. Change directory to nba_stats
4. Run create_db.py
5. Run nba_stats.py

##### Running webapp
1. Install nodejs
2. Change directory to app
3. Install required node modules
  * 'npm install'
4. Run server
  * 'node server.js'

### TODO:
##### Frontend:
* Make use of API

##### Backend:
* Add more API calls, fix hourly (currently doing by second)
* nba_stats needs to run daily
* Code cleanup
 * combine db_prep and create_db
