from flask import Flask, render_template, request
import pymongo
from pymongo import MongoClient 
import json
from bson.objectid import ObjectId

app = Flask(__name__)

@app.route("/directions")
def index2():
    return render_template("directions.html")

client = MongoClient()
db = client.potholes
collection = db.potholes

@app.route("/", methods=['Get','POST'])
def index():
    return render_template("index.html")
@app.route("/grab/")
def grab():
    ret = []
    cursor= collection.find()
    print cursor.count()
    for i in range(cursor.count()):
        ret.append(cursor[i])
    for d in ret:
        d['_id'] = str(d['_id'])
    print ret
    return json.dumps(ret)
@app.route('/update', methods=['GET', 'POST'])
def update():
    if request.method == 'GET':
        cursor = collection.find()
        print cursor.count()
        js = [cursor[i] for i in range(cursor.count())]
        for d in js:
            d['_id'] = str(d['_id'])
        print "get"
        print js
        return json.dumps(js)
    elif request.method == 'POST':
        data=json.loads(request.data)
        address=data['address']
        Latitude=data['Latitude']
        Longitude=data['Longitude']
        new_pothole = {
            'address':address,
            'Latitude':Latitude,
            "Longitude":Longitude,
        }
        print "post"
        return json.dumps(str(collection.insert(new_pothole)))
        
@app.route("/delete")
def delete():
    collection.drop()
    return ""




@app.route("/potholes")
def index3():
    return render_template("potholes.html")

if __name__ == "__main__":
   app.run(host="0.0.0.0", port=8000)
   app.debug = True

