import mysql.connector
import json
import re

from flask import *
app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

# 建立與 MySQL 資料庫的連線
db_connection=mysql.connector.connect(
    host="localhost",
    user="root",
    password="12345678",
    database="Trip")
cursor=db_connection.cursor()

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
		keyword=request.args.get("keyword")
		page=int(request.args.get("page"))
		page_start=page*12

		if keyword is not None:
			cursor.execute("SELECT * FROM attractions WHERE MRT=%s or name LIKE %s LIMIT %s,12",
						(keyword,"%"+keyword+"%",page_start))
		else:			
			cursor.execute("SELECT * FROM attractions LIMIT %s,12",(page_start,))

		SQLdata=cursor.fetchall()
		response_data=get_attractions_data(SQLdata)
		response={
			"nextPage":page+1,
  			"data":response_data
		}
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
		cursor.execute("SELECT * FROM attractions WHERE id=%s",(attractionId,))
		SQLdata=cursor.fetchall()
		response_data=get_attractions_data(SQLdata)
		response={
  			"data": response_data[0]
		}
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
		return jsonify(response)

	except Exception as e :  
		error_message=str(e)
		response={
			"error":True,
			"message": error_message
			}
		return jsonify(response),500



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


app.run(host="0.0.0.0", port=3000)

cursor.close()
db_connection.close()