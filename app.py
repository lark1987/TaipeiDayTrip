from flask import *

from module.attraction import api_attraction_data
from module.member import api_member
from module.booking import api_booking
from module.order import api_order

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



app.run(host="0.0.0.0", port=3001)
