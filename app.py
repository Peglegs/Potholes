from flask import Flask, render_template, request
import pymongo
from pymongo import MongoClient 
import json
from bson.objectid import ObjectId

app = Flask(__name__)

client = MongoClient()
db = client.potholes
collection = db.potholes

#@app.route("/")
#def index():
   # return render_template("directions.html")


@app.route("/", methods=['Get','POST'])
def index():
    return render_template("index.html")

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
        avenue = data['avenue']
        street = data['street']
        BN = data['BN']
        Latitude=data['Latitude']
        Longitude=data['Longitude']
        new_pothole = {
            'street': street,
            'avenue': avenue,
            'BN': BN,
            'Latitude':Latitude,
            "Longitude":Longitude,
        }
        print "post"
        return json.dumps(str(collection.insert(new_pothole)))
        
@app.route("/delete")
def delete():
    collection.drop()
    return ""




if __name__ == "__main__":
   app.run(host="0.0.0.0", port=8000)
   app.debug = True

