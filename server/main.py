from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import sqlite3


app = Flask(__name__)
CORS(app)
def dbinit():
    connection = sqlite3.connect("data.db")
    cursor = connection.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS computers (id INTEGER PRIMARY KEY, uptime INTEGER, load INTEGER, memusage INTEGER, diskusage INTEGER)")
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
        if parsedata(data,"diskusage"):
            return "OK"
        else:
            return "Invalid data", 400
    else:
        return getdata("diskusage")

def parsedata(data, key):
    if "id" not in data or key not in data:
        return False
    connection = sqlite3.connect("data.db")
    cursor = connection.cursor()
    # We assume this is handeled already
    #cursor.execute("CREATE TABLE IF NOT EXISTS computers (id INTEGER PRIMARY KEY, uptime INTEGER)")
    cursor.execute("INSERT INTO computers (id, "+key+") VALUES (?, ?)ON CONFLICT(id) DO UPDATE SET "+key+" = excluded."+key,(data["id"], data[key]))    
    connection.commit()
    connection.close()
    return True
    
def getdata(key):
    connection = sqlite3.connect("data.db")
    cursor = connection.cursor()
    cursor.execute("SELECT id,"+key+" FROM computers")
    data = cursor.fetchall()
    connection.close()
    data = [{"id": item[0], key: item[1]} for item in data]
    return jsonify(data)