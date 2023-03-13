import os
from flask import Flask, request, redirect, url_for, send_file
from flask_cors import CORS, cross_origin
from pathlib import Path

from train_model import train_faces

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

# Route to get images
@app.route("/<file_name>")
def getFile(file_name):
    print(file_name)
    return send_file(
        file_name,
        mimetype=None,
        as_attachment=False,
        download_name=None,
        conditional=True,
        etag=True,
        last_modified=None,
        max_age=None,
    )

# Route to save images and train data
@app.route("/upload", methods=["POST"])
@cross_origin()
def upload():

    user_id = request.form.get("user_id")
    print(user_id)
    Path("static/TrainingData/{}".format(user_id)).mkdir(parents=True, exist_ok=True)
    if request.files:
        for file in request.files:
            filename = user_id + "_" + file + ".jpg"
            request.files[file].save(
                os.path.join("static", "TrainingData", user_id, filename)
            )

        train_faces()
        return {"success": True}

    return {"success": False}


if __name__ == "__main__":
    app.run(debug=True)
