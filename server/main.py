from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import sqlite3
import time
from dotenv import load_dotenv
import os
load_dotenv()
password = os.getenv("PASSWORD")
app = Flask(__name__)
CORS(app)
def dbinit():
    connection = sqlite3.connect("data.db")
    cursor = connection.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS computers (id INTEGER PRIMARY KEY, uptime INTEGER, load INTEGER, memusage INTEGER, diskusage INTEGER, temp INTEGER, userstring TEXT, lastseen INTEGER DEFAULT 0)")
    connection.commit()
    connection.close()
dbinit()

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/api/uptime", methods=["POST", "GET"])
def uptime():
    if request.method == "POST":
        data = request.json
        if data["password"] != password:
            return "Unauthorized", 401
        if parsedata(data,"uptime"):
            print("Uptime data added")
            return "OK"
        else:
            return "Invalid data", 400
    else:
        return getdata("uptime")
    
@app.route("/api/load", methods=["POST", "GET"])
def load():
    if request.method == "POST":
        data = request.json
        if data["password"] != password:
            return "Unauthorized", 401
        if parsedata(data,"load"):
            return "OK"
        else:
            return "Invalid data", 400
    else:
        return getdata("load")


@app.route("/api/memusage", methods=["POST", "GET"])
def memusage():
    if request.method == "POST":
        data = request.json
        if data["password"] != password:
            return "Unauthorized", 401
        if parsedata(data,"memusage"):
            return "OK"
        else:
            return "Invalid data", 400
    else:
        return getdata("memusage")
    
@app.route("/api/diskusage", methods=["POST", "GET"])
def diskusage():
    if request.method == "POST":
        data = request.json
        if data["password"] != password:
            return "Unauthorized", 401
        if parsedata(data,"diskusage"):
            return "OK"
        else:
            return "Invalid data", 400
    else:
        return getdata("diskusage")
    
@app.route("/api/temp", methods=["POST", "GET"])
def temp():
    if request.method == "POST":
        data = request.json
        if data["password"] != password:
            return "Unauthorized", 401
        if parsedata(data,"temp"):
            return "OK"
        else:
            return "Invalid data", 400
    else:
        return getdata("temp")
    

@app.route("/api/machines", methods=["GET"])
def machines():
    connection = sqlite3.connect("data.db")
    cursor = connection.cursor()
    cursor.execute("SELECT id FROM computers")
    data = cursor.fetchall()
    connection.close()
    data = [item[0] for item in data]
    return jsonify(data)

@app.route("/api/user", methods=["GET", "POST"])
def user():
    if request.method == "POST":
        data = request.json
        if data["password"] != password:
            return "Unauthorized", 401
        if parsedata(data,"userstring"):
            return "OK"
        else:
            return "Invalid data", 400
    return getdata("userstring")

@app.route("/api/lastseen", methods=["GET"])
def lastseen():
    connection = sqlite3.connect("data.db")
    cursor = connection.cursor()
    cursor.execute("SELECT id, lastseen FROM computers")
    data = cursor.fetchall()
    connection.close()
    data = [{"id": item[0], "lastseen": item[1]} for item in data]
    return jsonify(data)


def parsedata(data, key):
    if "id" not in data or key not in data:
        return False
    connection = sqlite3.connect("data.db")
    cursor = connection.cursor()
    # We assume this is handeled already
    cursor.execute("INSERT INTO computers (id, "+key+") VALUES (?, ?)ON CONFLICT(id) DO UPDATE SET "+key+" = excluded."+key,(data["id"], data[key]))    
    connection.commit()
    connection.close()
    updatelastseen(data["id"])
    return True
    
def getdata(key):
    connection = sqlite3.connect("data.db")
    cursor = connection.cursor()
    cursor.execute("SELECT id,"+key+" FROM computers")
    data = cursor.fetchall()
    connection.close()
    data = [{"id": item[0], key: item[1]} for item in data]
    return jsonify(data)

def updatelastseen(id):
    timestamp = int(round(time.time() * 1000))
    connection = sqlite3.connect("data.db")
    cursor = connection.cursor()
    cursor.execute("INSERT INTO computers (id, lastseen) VALUES (?, ?)ON CONFLICT(id) DO UPDATE SET lastseen = excluded.lastseen",(id, timestamp))
    connection.commit()
    connection.close()