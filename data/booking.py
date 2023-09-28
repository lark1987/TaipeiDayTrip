import mysql.connector

db_connection=mysql.connector.connect(
    host="localhost",
    user="root",
    password="12345678",
    database="Trip"
)

cursor=db_connection.cursor()

create_table_members="""
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT UNIQUE,
    attractionID INT,
    date VARCHAR(255),
    time VARCHAR(255),
    price INT,
    FOREIGN KEY (member_id) REFERENCES members(id)
);
"""
cursor.execute(create_table_members)
db_connection.commit()
cursor.close()
db_connection.close()