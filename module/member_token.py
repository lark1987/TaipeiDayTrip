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

# token製造
def token_create(db_id,db_name,db_email):
	expiration_time = datetime.utcnow() + timedelta(days=7)
	token_data = {
		"id":db_id,
		"name":db_name,
		"email":db_email,
		"exp": expiration_time,
	}
	token = jwt.encode(token_data, app.config["SECRET_KEY"], algorithm="HS256")
	return token

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
