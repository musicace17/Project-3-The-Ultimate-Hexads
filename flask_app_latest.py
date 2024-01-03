
# Importing the dependepncies.
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify, render_template

# Creating an app, being sure to pass __name__

engine = create_engine("sqlite:///resources/music_database.sqlite")

# Reflecting an existing database into a new model
Base = automap_base()

# Reflecting the tables
Base.prepare(autoload_with=engine)

# Retrieving the table names
table_names = Base.metadata.tables.keys()

print("Table names in the database:")
for table_name in table_names:
    print(table_name)

# Saving references to each table
Spotify_data = Base.classes.spotify_data  # Use the exact case of the table name in your database

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

# #################################################
# # HTML Routes
# #################################################
@app.route("/")
def welcome():
    return render_template("index.html")
    
@app.route("/api/v1.0/spotify_music_data")
def spotify_music_data():
    # Create our session (link) from Python to the DB
    session = Session(engine)
        
    #Query to get a specific columns of interest
    music_data = session.query(Spotify_data.Index, Spotify_data.spotify_id, Spotify_data.name, Spotify_data.artists, Spotify_data.daily_rank, Spotify_data.country, Spotify_data.snapshot_date, Spotify_data.popularity, Spotify_data.duration_ms, Spotify_data.danceability, Spotify_data.energy, Spotify_data.key, Spotify_data.mode, Spotify_data.genre).all()
    print("Country data type", type(music_data))
    
    #Convert the results to a JSON list
    # music_data_list = [{"Index": mdata[0], "Spotify ID": mdata[1], "Name": mdata[2], "Artists": mdata[3], "Daily Rank": mdata[4], "Country": mdata[5], "Snapshot Date": mdata[6], "Popularity": mdata[7], "Duration ms": mdata[8], "Danceability": mdata[9], "Energy": mdata[10], "Key": mdata[11], "Mode": mdata[12], "Genre": mdata[13]} for mdata in music_data]
    music_data_list = [{"index": mdata[0], "spotify_id": mdata[1], "name": mdata[2], "artists": mdata[3], "daily_rank": mdata[4], "country": mdata[5], "snapshot_date": mdata[6], "popularity": mdata[7], "duration_ms": mdata[8], "danceability": mdata[9], "energy": mdata[10], "key": mdata[11], "mode": mdata[12], "genre": mdata[13]} for mdata in music_data]
    #Closing Session
    session.close()

    return jsonify(music_data_list)
    
if __name__ == '__main__':
    app.run(debug=True)









