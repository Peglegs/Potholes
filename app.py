from flask import Flask, render_template, request
import pymongo
from pymongo import MongoClient 
import json
from bson.objectid import ObjectId

app = Flask(__name__)

client = MongoClient()
db = client.potholes
collection = db.potholes


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
        new_pothole = {
            'street': street,
            'avenue': avenue,
            'BN': BN

        }
        print "post"
        return json.dumps(str(collection.insert(new_pothole)))
        

@app.route('/update/<id>', methods=['PUT'])
def updateWithID(id=None):
    if request.method == 'PUT':
        data = json.loads(request.data)
        street = data['street']
        avenue = data['avenue']
        building = data['building']
        update(street,avenue,building)
        return ""

@app.route('/<id>', methods = ['GET', 'POST'])
def showPothole(id):
    pothole = collection.find({'id': id})
    for i in pothole:
        print i
        avenue = i['avenue']
        street = i['street']
        BN = i['BN']
    return render_template("showPothole.html", avenue=avenue, street=street, BN=BN)
    




######################## JSON CODE ####################################


if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0', port=8000)