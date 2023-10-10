from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# 設定上傳目錄
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': '未選擇檔案'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'message': '未選擇檔案'}), 400

    if file:
        # 將檔案儲存到指定目錄
        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)
        return jsonify({'message': '檔案上傳成功'}), 200

if __name__ == '__main__':
    app.run(debug=True)
