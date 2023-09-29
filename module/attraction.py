from flask import *
import json
import re

from . import db_config

api_attraction_data = Blueprint('api_attraction_data', __name__)

### route

# 取得捷運站名稱列表
@api_attraction_data.route("/api/mrts")
def api_mrts():
	result, status_code = try_dbconnect(try_content_mrtList)
	return result, status_code

# 取得景點資料列表
@api_attraction_data.route("/api/attractions")
def api_attractions():
	result, status_code = try_dbconnect(try_content_attractionList)
	return result, status_code

# 根據景點編號取得景點資料
@api_attraction_data.route("/api/attractions/<int:attractionId>")
def api_attractions_id(attractionId):
	global g_attractionId
	g_attractionId = attractionId
	result, status_code = try_dbconnect(try_content_attractionIDdata)
	return result, status_code


### route function

# try 包裝
def try_dbconnect(try_content):
	try:
		db_connection=db_config.connection_pool.get_connection()
		cursor=db_connection.cursor()
		result = try_content(cursor)
		return result,200
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

# try 取得捷運站名稱列表
def try_content_mrtList(cursor):
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

# try 取得景點資料列表
def try_content_attractionList(cursor):
		keyword=request.args.get("keyword")
		page=int(request.args.get("page"))
		page_start=page*12
		if keyword is not None:
			cursor.execute("SELECT * FROM attractions WHERE MRT=%s or name LIKE %s LIMIT %s,12",
						(keyword,"%"+keyword+"%",page_start))
		else:			
			cursor.execute("SELECT * FROM attractions LIMIT %s,12",(page_start,))
		SQLdata=cursor.fetchall()
		# 判斷最後一頁
		if cursor.rowcount == 0:
			next_page=None
		else:
			next_page=page+1
		response_data=get_attractions_data(SQLdata)
		response={
			"nextPage":next_page,
  			"data":response_data,
		}
		return jsonify(response)

# try 根據景點編號取得景點資料
def try_content_attractionIDdata(cursor):
	cursor.execute("SELECT * FROM attractions WHERE id=%s",(g_attractionId,))
	SQLdata=cursor.fetchall()
	response_data=get_attractions_data(SQLdata)
	response={
	"data": response_data[0]
	}
	return jsonify(response)



### function

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
