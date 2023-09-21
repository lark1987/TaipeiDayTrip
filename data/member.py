import mysql.connector

db_connection=mysql.connector.connect(
    host="localhost",
    user="root",
    password="12345678",
    database="Trip"
)

cursor=db_connection.cursor()

create_table_members="""
CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255)
)
"""
cursor.execute(create_table_members)

db_connection.commit()
cursor.close()
db_connection.close()