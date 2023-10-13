import mysql.connector
import time
import threading

from . import db_config


# 創建線程、定時連線資料庫
def check_database_connection(interval=14400):
    timer = threading.Timer(interval, check_database_connection, args=(interval,))
    timer.daemon = True  
    timer.start()
    try:
        db_connection=db_config.connection_pool.get_connection()
        cursor=db_connection.cursor()
        cursor.execute("SELECT 1")
        result=cursor.fetchone()
        cursor.close()
        db_connection.close()
    except mysql.connector.Error as error:
        print(error)
