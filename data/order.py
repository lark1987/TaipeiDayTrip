import mysql.connector

db_connection=mysql.connector.connect(
    host="localhost",
    user="root",
    password="12345678",
    database="Trip"
)

cursor=db_connection.cursor()

create_table_members="""
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT,
    orderID VARCHAR(255),
    status VARCHAR(255),
    price INT,
    date VARCHAR(255),
    time VARCHAR(255),
    contactName VARCHAR(255),
    contactMail VARCHAR(255),
    contactPhone VARCHAR(255),
    attractionID INT,	
    attractionName VARCHAR(255),
    attractionAddress VARCHAR(255),
    attractionImage TEXT )
"""
cursor.execute(create_table_members)

db_connection.commit()
cursor.close()
db_connection.close()