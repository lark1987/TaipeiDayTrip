from flask import *
import json

from . import db_config
from . import member_token
from . import attraction

api_booking = Blueprint('api_booking', __name__)

# 預定行程
@api_booking.route("/api/booking",methods=["POST"])
def booking_create():
	result, status_code = try_box(try_booking_create)
	return result, status_code

# 取得行程
@api_booking.route("/api/booking",methods=["GET"])
def booking_get():
	result, status_code = try_box(try_booking_get)
	return result, status_code

# 刪除行程
@api_booking.route("/api/booking",methods=["DELETE"])
def booking_delete():
	result, status_code = try_box(try_booking_delete)
	return result, status_code




def try_box(try_content):
	try:
		token_id, token_name, token_email = member_token.token_decode()
		db_connection=db_config.connection_pool.get_connection()
		cursor=db_connection.cursor()
		result = try_content(cursor,db_connection)
		if isinstance(result, tuple):
			data, status_code = result
		else:
			data = result
			status_code = 200
		return data, status_code
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

# try 預定行程
def try_booking_create(cursor,db_connection):
		token_id, token_name, token_email = member_token.token_decode()
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

# try 取得行程
def try_booking_get(cursor,db_connection):
	token_id, token_name, token_email = member_token.token_decode()

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
	
# try 刪除行程
def try_booking_delete(cursor,db_connection):
	token_id, token_name, token_email = member_token.token_decode()
	cursor.execute("SET SQL_SAFE_UPDATES=0;")
	cursor.execute("DELETE FROM bookings WHERE member_id=%s",(token_id,))
	db_connection.commit() 
	response = {"ok": True}
	return jsonify(response)


