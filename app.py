from flask import *

from module.attraction import api_attraction_data
from module.member import api_member
from module.booking import api_booking
from module.order import api_order

from module.db_check import check_database_connection
check_database_connection()

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

app.register_blueprint(api_attraction_data)
app.register_blueprint(api_member)
app.register_blueprint(api_booking)
app.register_blueprint(api_order)

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")
@app.route("/member")
def member():
	return render_template("member.html")




import os
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



app.run(host="0.0.0.0", port=3000)

