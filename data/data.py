import json
import mysql.connector
import re

# 讀取 JSON 資料
with open("taipei-attractions.json","r",encoding="utf-8") as file:
    data=json.load(file)
    data=data["result"]["results"]

# 建立與 MySQL 資料庫的連線 (待改成pool版)
db_connection=mysql.connector.connect(
    host="localhost",
    user="root",
    password="12345678",
    database="Trip"
)

# 建立游標
cursor=db_connection.cursor()

# 建立資料表 attractions
create_table_attractions="""
CREATE TABLE IF NOT EXISTS attractions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    MRT VARCHAR(255),
    category VARCHAR(255),
    file TEXT,
    address VARCHAR(255),
    direction TEXT,
    description TEXT,
    TIME TEXT,
    longitude FLOAT,
    latitude FLOAT
)
"""
cursor.execute(create_table_attractions)

# 將資料插入資料表 attractions
for item in data:
    insert="""
    INSERT INTO attractions (
    name,MRT,category,file,address,direction,
    description,TIME,longitude,latitude)
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """
    values=(
        item["name"],item["MRT"],item["CAT"], item["file"],
        item["address"], item["direction"],item["description"],
        item["MEMO_TIME"],item["longitude"],item["latitude"])
    cursor.execute(insert, values)

# 建立資料表 images
cursor.execute("""
    CREATE TABLE IF NOT EXISTS images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        attractions_id INT,
        link TEXT,
        FOREIGN KEY (attractions_id) REFERENCES attractions(id))
""")

# 將圖片連結存入資料庫
cursor.execute("SELECT id,name,file FROM attractions")
fileData=cursor.fetchall() 

for attractions_id,name,file in fileData:

    image_links=re.findall(r'https:\/\/.*?\.(?:JPG|PNG)',file,re.IGNORECASE)

    for link in image_links:
        cursor.execute("INSERT INTO images (attractions_id,link) VALUES (%s,%s)",
                      (attractions_id,link,))


# 提交變更並關閉連線
db_connection.commit()
cursor.close()
db_connection.close()
