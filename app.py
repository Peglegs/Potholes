from flask import Flask, render_template, request
app = Flask(__name__)

@app.route("/")
@app.route("/directions")
def index():
    return render_template("directions.html")

@app.route("/potholes")
def index2():
    return render_template("potholes.html")

if __name__ == "__main__":
    app.debug = True
    app.run(host="0.0.0.0", port=5000)
