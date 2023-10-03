from flask import *
import json
from datetime import datetime

from . import db_config
from . import member_token

api_order = Blueprint('api_order', __name__)

@api_order.route("/api/orders",methods=["POST"])
def booking_create():

    data = request.json
    insertSQL(data)

    response = {"ok": True}
    return jsonify(response)


def insertSQL(data):

    # 會員編號
    token_id, token_name, token_email = member_token.token_decode()

    # 訂單編號
    currentTime = datetime.now()
    orderID = currentTime.strftime("ORD%Y%m%d%H%M%S")
    print(orderID)

    print(data["prime"])
    print(data["order"]["price"])
    print(data["order"]["contact"]["name"])




    db_connection=db_config.connection_pool.get_connection()
    cursor=db_connection.cursor()

    cursor.execute('''
    INSERT INTO orders (
    member_id,orderID,status,price,date,time,
    contactName,contactMail,contactPhone,
    attractionID,attractionName,attractionAddress,attractionImage)
    VALUES (%s, %s, %s, %s, %s,%s, %s, %s, %s, %s, %s, %s, %s)
    ''', (token_id, attractionId, date, time, price, ))
    db_connection.commit()



    cursor.close()
    db_connection.close()

