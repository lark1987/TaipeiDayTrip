from flask import *
import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage
from datetime import datetime, timedelta

from . import firebase

app=Flask(__name__)
api_upload = Blueprint("api_upload", __name__)

firebase_admin.initialize_app(firebase.cred, options={
    "storageBucket": "lark1987-wehelptwo-2023.appspot.com"
})


# 將檔案儲存到 Firebase，並生成 url 供前端使用 
@api_upload.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"message": "未選擇檔案"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"message": "未選擇檔案"}), 400

    if file:

        storage = firebase_admin.storage.bucket()
        blob = storage.blob("uploads/" + file.filename)
        blob.upload_from_string(file.read(), content_type=file.content_type)

        expiration_time = datetime.now() + timedelta(hours=1)
        image_url = blob.generate_signed_url(expiration=expiration_time, method='GET')

        print(image_url)

        response = {
            "message": "檔案上傳成功",
            "image_url":image_url

            }
        return jsonify(response),200




