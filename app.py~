from flask import Flask, render_template, request
import pymongo
from pymongo import MongoClient 
import json

app = Flask(__name__)

client= MongoClient()
db=client['roster']
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/people",methods=['GET','POST','DELETE','PUT'])
@app.route("/people/<id>",methods=['GET','POST','DELETE','PUT'])
def place(id=None):
    method = request.method
    j = request.get_json();
    print method, id, j
    if id ==None:
        id =j['name']
        
    if method == "POST":
        j['_id']=id
        try:
            x = db.roster.update({'_id':id},j,upsert=True)
        except:
            j.pop("_id",None)
            x = db.roster.update({'_id':id},j)
        
    
    return json.dumps({'result':x})


if __name__ == "__main__":
   app.debug = True
   app.run(host="0.0.0.0", port=8000)
