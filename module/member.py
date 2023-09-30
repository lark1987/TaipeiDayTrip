from flask import *
import json

from . import db_config
from . import member_token

api_member = Blueprint('api_member', __name__)

# 註冊功能
@api_member.route("/api/user",methods=["POST"])
def signup():
	result, status_code = try_box(try_signUp)
	return result, status_code

# 登入功能
@api_member.route("/api/user/auth",methods=["PUT"])
def signin():
	result, status_code = try_box(try_signIn)
	return result, status_code

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




# try 包裝
def try_box(try_content):
	try:
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

# try 註冊功能
def try_signUp(cursor,db_connection):
	data = request.json
	name=data["name"] 
	email=data["email"] 
	password=data["password"]

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

# try 登入功能
def try_signIn(cursor,db_connection):
	data = request.json
	email=data["email"] 
	password=data["password"]

	cursor.execute("SELECT * FROM members WHERE email = %s", (email,))
	result=cursor.fetchone()
	if result is not None:
		db_id,db_name,db_email,db_password = result
		if email == db_email and password == db_password:
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