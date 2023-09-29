from flask import *
import mysql.connector
from mysql.connector import pooling
import json
import re
import jwt
import datetime
from datetime import datetime, timedelta
from . import member_token
from . import attraction

db_config={
    "host":"localhost",
    "user":"root",
    "password":"12345678",
    "database":"Trip",
	"connection_timeout":172800,
}

connection_pool=pooling.MySQLConnectionPool(**db_config)

api_booking = Blueprint('api_booking', __name__)

@api_booking.route("/api/booking",methods=["POST"])
def booking_create():
	try:
		token_id, token_name, token_email = member_token.token_decode()

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
@api_booking.route("/api/booking",methods=["GET"])
def booking_get():
	try:
		token_id, token_name, token_email = member_token.token_decode()

		db_connection=connection_pool.get_connection()
		cursor=db_connection.cursor()
		cursor.execute("SELECT * FROM bookings WHERE member_id=%s",(token_id,))
		bookings_data=cursor.fetchone()

		if bookings_data is not None:
			data_ID,data_memberID,data_attractionID,data_date,data_time,data_price = bookings_data
			cursor.execute("SELECT * FROM attractions WHERE id=%s",(data_attractionID,))
			attractions_data=cursor.fetchall()
			attractions_data_list = attraction.get_attractions_data(attractions_data)
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
@api_booking.route("/api/booking",methods=["DELETE"])
def booking_delete():
	try:
		token_id, token_name, token_email = member_token.token_decode()
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
