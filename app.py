from flask import Flask, render_template, request
import json

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/getData")
def getData():
    return json.dumps(readMap("static/maps/map.txt"))

@app.route("/getItemData")
def getItemData():
    return json.dumps(readItemMap("static/itemMap.json"))

def readMap(filename): 
    data = []
    with open(filename, "r") as f:
        for row in f:
            if row[0] == "#": 
                continue
            elif "---" in row:
                data.append([])
            else:
                data[-1].append([int(value) for value in list(row.strip())])
    return data

def readItemMap(filename):
    with open(filename, "r") as f:
        return json.load(f)
    
@app.route("/scores")
def scores():
    return render_template("scores.html")

@app.route("/leaderboard", methods=("POST", "GET"))
def leaderboard():
    scores = []
    if request.method == "POST":
        with open("leaderboard.json", "r") as f:
            scores = json.load(f)
        scores.append(request.json)
        scores.sort(key=lambda x: -x[1])
        with open("leaderboard.json", "w") as f:
            json.dump(scores, f)
    elif request.method == "GET":
        with open("leaderboard.json", "r") as f:
            scores = json.load(f)

    return json.dumps(scores)




if __name__ == "__main__":	
    app.run(debug=True,host='0.0.0.0')
