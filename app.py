from flask import *
import mysql.connector
from mysql.connector import pooling
import json
import re
import jwt
import datetime
from datetime import datetime, timedelta


app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config["SECRET_KEY"] = "12345678"

# MySQL資料庫連線
db_config={
    "host":"localhost",
    "user":"root",
    "password":"12345678",
    "database":"Trip",
	"connection_timeout":172800,
}

connection_pool=pooling.MySQLConnectionPool(**db_config)


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




# api

# 取得景點資料列表
@app.route("/api/attractions")
def api_attractions():
	try:
		db_connection=connection_pool.get_connection()
		cursor=db_connection.cursor()

		keyword=request.args.get("keyword")
		page=int(request.args.get("page"))
		page_start=page*12

		if keyword is not None:
			cursor.execute("SELECT * FROM attractions WHERE MRT=%s or name LIKE %s LIMIT %s,12",
						(keyword,"%"+keyword+"%",page_start))
		else:			
			cursor.execute("SELECT * FROM attractions LIMIT %s,12",(page_start,))

		SQLdata=cursor.fetchall()

		if cursor.rowcount == 0:
			next_page=None
		else:
			next_page=page+1


		response_data=get_attractions_data(SQLdata)
		response={
			"nextPage":next_page,
  			"data":response_data,
		}

		cursor.close()
		db_connection.close()
		return jsonify(response)
	
	except Exception as e :  
		error_message=str(e)
		response={
			"error":True,
			"message": error_message
			}
		return jsonify(response),500

# 根據景點編號取得景點資料
@app.route("/api/attractions/<int:attractionId>")
def api_attractions_id(attractionId):
	try:
		db_connection=connection_pool.get_connection()
		cursor=db_connection.cursor()

		cursor.execute("SELECT * FROM attractions WHERE id=%s",(attractionId,))
		SQLdata=cursor.fetchall()
		response_data=get_attractions_data(SQLdata)
		response={
  			"data": response_data[0]
		}

		cursor.close()
		db_connection.close()
		return jsonify(response)
	except IndexError as e :  
		error_message=str(e)
		response={
			"error":True,
			"message": error_message
			}
		return jsonify(response),400	
	except Exception as e :  
		error_message=str(e)
		response={
			"error":True,
			"message": error_message
			}
		return jsonify(response),500

# 取得捷運站名稱列表
@app.route("/api/mrts")
def api_mrts():
	try:
		db_connection=connection_pool.get_connection()
		cursor=db_connection.cursor()

		query='''
		SELECT MRT, COUNT(name) as attraction_Number 
		FROM attractions GROUP BY MRT ORDER BY attraction_Number DESC
		'''
		cursor.execute(query)
		mrt_info=cursor.fetchall()
		mrt_list=[]
		for mrt, count in mrt_info:
			mrt_list.append(mrt)
		response={
				"data": mrt_list
		}

		cursor.close()
		db_connection.close()
		return jsonify(response)

	except Exception as e :  
		error_message=str(e)
		response={
			"error":True,
			"message": error_message
			}
		return jsonify(response),500

# 註冊功能
@app.route("/api/user",methods=["POST"])
def signup():
	try:
		data = request.json
		name=data["name"] 
		email=data["email"] 
		password=data["password"]

		db_connection=connection_pool.get_connection()
		cursor=db_connection.cursor()
		cursor.execute("SELECT email FROM members;")
		email_list = [email[0] for email in cursor.fetchall()]
		if email in email_list:
			response={
				"error": True,
				"message":"註冊失敗，Email已被註冊！"
				}
			return jsonify(response),400
		
		cursor.execute("INSERT INTO members (name, email, password) VALUES (%s, %s, %s)",
					(name, email, password))
		db_connection.commit() 
		response = {"ok": True}
		return jsonify(response)

	except Exception as e :  
		error_message=str(e)
		response={
			"error":True,
			"message": error_message
			}
		return jsonify(response),500
	finally:
		cursor.close()
		db_connection.close()

# 登入功能
@app.route("/api/user/auth",methods=["PUT"])
def signin():
	try:
		data = request.json
		email=data["email"] 
		password=data["password"]

		db_connection=connection_pool.get_connection()
		cursor=db_connection.cursor()
		cursor.execute("SELECT * FROM members WHERE email = %s", (email,))
		result=cursor.fetchone()
		if result is not None:
			db_id,db_name,db_email,db_password = result
			if email == db_email and password == db_password:
				expiration_time = datetime.utcnow() + timedelta(days=7)
				token_data = {
					"id":db_id,
					"name":db_name,
					"email":db_email,
					"exp": expiration_time,
				}
				token = jwt.encode(token_data, app.config["SECRET_KEY"], algorithm="HS256")
				response = {
					"token": token
				}
				return jsonify(response)
			else:
				response = {
					"error": True,
					"message": "登入失敗，帳號或密碼輸入錯誤！"
					}
				return jsonify(response),400
	except Exception as e :  
		error_message=str(e)
		response={
			"error":True,
			"message": error_message
			}
		return jsonify(response),500
	finally:
		cursor.close()
		db_connection.close()

# 會員身份
@app.route("/api/user/auth")
def signin_data():
	try:
		token_id, token_name, token_email = token_decode()
		response = {"data":{
			"id":token_id,
			"name":token_name,
			"email":token_email
			}
		}
		return jsonify(response)
	except Exception as e :  
		error_message=str(e)
		response={
			"error":True,
			"message": error_message
			}
		return jsonify(response),500

# 建立行程
@app.route("/api/booking",methods=["POST"])
def booking_create():
	try:
		token_id, token_name, token_email = token_decode()

		db_connection = connection_pool.get_connection()
		cursor = db_connection.cursor()
		data = request.json
		attractionId=data["attractionId"] 
		date=data["date"]
		time=data["time"]
		price=data["price"]
		if date == "" or time == "" or price == "":
			response = {
			"error": True,
			"message": "建立失敗，輸入不正確或其他原因",
			}
			return jsonify(response), 400
		else:
			cursor.execute('''
			INSERT INTO bookings (member_id, attractionID, date, time, price) 
			VALUES (%s, %s, %s, %s, %s)
			ON DUPLICATE KEY UPDATE
			attractionID = VALUES(attractionID),
			date = VALUES(date),
			time = VALUES(time),
			price = VALUES(price);
			''', (token_id, attractionId, date, time, price, ))
			db_connection.commit()
			response = {"ok": True}
			return jsonify(response)
	except Exception as e :  
		error_message=str(e)
		response={
			"error":True,
			"message": error_message
			}
		return jsonify(response),500
	finally:
		cursor.close()
		db_connection.close()

# 取得行程
@app.route("/api/booking",methods=["GET"])
def booking_get():
	try:
		token_id, token_name, token_email = token_decode()

		db_connection=connection_pool.get_connection()
		cursor=db_connection.cursor()
		cursor.execute("SELECT * FROM bookings WHERE member_id=%s",(token_id,))
		bookings_data=cursor.fetchone()

		if bookings_data is not None:
			data_ID,data_memberID,data_attractionID,data_date,data_time,data_price = bookings_data
			cursor.execute("SELECT * FROM attractions WHERE id=%s",(data_attractionID,))
			attractions_data=cursor.fetchall()
			attractions_data_list = get_attractions_data(attractions_data)
			response = {"data": {
				"attraction": {
					"id": attractions_data_list[0]["id"],
					"name": attractions_data_list[0]["name"],
					"address": attractions_data_list[0]["address"],
					"image": attractions_data_list[0]["images"][0],
				},
				"date": data_date,
				"time": data_time,
				"price": data_price
			}}
			return jsonify(response)
		else:
			response = {"data":None}
			return jsonify(response)
	except Exception as e :  
		error_message=str(e)
		response={
			"error":True,
			"message": error_message
			}
		return jsonify(response),500
	finally:
		cursor.close()
		db_connection.close()

# 刪除行程
@app.route("/api/booking",methods=["DELETE"])
def booking_delete():
	try:
		token_id, token_name, token_email = token_decode()
		db_connection=connection_pool.get_connection()
		cursor=db_connection.cursor()
		cursor.execute("SET SQL_SAFE_UPDATES=0;")
		cursor.execute("DELETE FROM bookings WHERE member_id=%s",(token_id,))
		db_connection.commit() 
		response = {"ok": True}
		return jsonify(response)
	except Exception as e :  
		error_message=str(e)
		response={
			"error":True,
			"message": error_message
			}
		return jsonify(response),500
	finally:
		cursor.close()
		db_connection.close()
	



# function

# 景點資料輸出 (SELECT * FROM attractions)
def get_attractions_data(SQLdata):
	attractions_data_list=[]
	for id,name,MRT,category,file,address,direction,description,TIME,longitude,latitude in SQLdata:
		image_list=[]
		image_links=re.findall(r'https:\/\/.*?\.(?:JPG|PNG)',file,re.IGNORECASE)
		for link in image_links:
			image_list.append(link)
		attractions_data={
			"id":id ,
			"name":name,
			"category":category,
			"description":description,
			"address": address,
			"transport": direction,
			"mrt": MRT,
			"lat":latitude,
			"lng":longitude,
			"images": image_list
			}
		attractions_data_list.append(attractions_data)
	return attractions_data_list

# token確認及解碼
def token_decode():
	token = request.headers.get("Authorization")
	if token is not None:
		decoded_token = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
		token_id = decoded_token.get("id") 
		token_name = decoded_token.get("name") 
		token_email = decoded_token.get("email") 
		return token_id, token_name, token_email
	else:
		response = {
		"error": True,
		"message": "未登入系統，拒絕存取",
		}
		return jsonify(response), 403


app.run(host="0.0.0.0", port=3000)
