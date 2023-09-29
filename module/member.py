from flask import *
import mysql.connector
from mysql.connector import pooling
import json
import re
import jwt
import datetime
from datetime import datetime, timedelta

from . import member_token

db_config={
    "host":"localhost",
    "user":"root",
    "password":"12345678",
    "database":"Trip",
	"connection_timeout":172800,
}

connection_pool=pooling.MySQLConnectionPool(**db_config)

api_member = Blueprint('api_member', __name__)

# 註冊功能
@api_member.route("/api/user",methods=["POST"])
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
@api_member.route("/api/user/auth",methods=["PUT"])
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
				# expiration_time = datetime.utcnow() + timedelta(days=7)
				# token_data = {
				# 	"id":db_id,
				# 	"name":db_name,
				# 	"email":db_email,
				# 	"exp": expiration_time,
				# }
				# token = jwt.encode(token_data, app.config["SECRET_KEY"], algorithm="HS256")
				token = member_token.token_create(db_id,db_name,db_email)
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
@api_member.route("/api/user/auth")
def signin_data():
	try:
		token_id, token_name, token_email = member_token.token_decode()
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

