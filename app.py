from flask import Flask, render_template, request
import json

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/getData")
def getData():
    return json.dumps(readMap("static/maps/map3.txt"))
    #  return json.dumps(readMap("static/maps/map1.txt"))

def readMap(filename): 
    data = []
    with open(filename, 'r') as f:
        for row in f:
            if row[0] == "#": 
                continue
            elif "---" in row:
                data.append([])
            else:
                data[-1].append([int(value) for value in list(row.strip())])
    return data


if __name__ == "__main__":	
    app.run(debug=True,host='0.0.0.0')
