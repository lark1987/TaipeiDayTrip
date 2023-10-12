from flask import *
import os

UPLOAD_FOLDER = 'uploads'
app=Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

api_upload = Blueprint('api_upload', __name__)

# 圖檔接收儲存
@api_upload.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': '未選擇檔案'}), 400

    file = request.files['file']
    print(request.files)

    if file.filename == '':
        return jsonify({'message': '未選擇檔案'}), 400

    if file:
        # 將檔案儲存到指定目錄
        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)
        return jsonify({'message': '檔案上傳成功'}), 200
