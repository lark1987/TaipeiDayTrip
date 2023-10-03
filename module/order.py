from flask import *
import json
from datetime import datetime
import requests

from . import db_config
from . import member_token

api_order = Blueprint('api_order', __name__)

@api_order.route("/api/orders",methods=["POST"])
def booking_create():

    data = request.json
    orderID = insertSQL(data)
    orderStaus,orderMessage = sendTapPay(data,orderID)

    if (orderID is not None):
        response = {
        "data": {
            "number": orderID,
            "payment": {
                "status": orderStaus,
                "message": orderMessage,
            }
        }}
        return jsonify(response)
    else:
        response = {
        "error": True,
        "message": "訂單建立失敗，輸入不正確或其他原因"
        }
        return jsonify(response)

# 訂購資訊存入 MySQL
def insertSQL(data):

    # 會員編號
    token_id, token_name, token_email = member_token.token_decode()

    # 訂單編號
    currentTime = datetime.now()
    orderID = currentTime.strftime("ORD%Y%m%d%H%M%S")

    db_connection=db_config.connection_pool.get_connection()
    cursor=db_connection.cursor()
    cursor.execute('''
    INSERT INTO orders (
    member_id,orderID,status,price,date,time,
    contactName,contactMail,contactPhone,
    attractionID,attractionName,attractionAddress,attractionImage)
    VALUES (%s, %s, %s, %s, %s,%s, %s, %s, %s, %s, %s, %s, %s)
    ''', (token_id, orderID, "未付款", data["order"]["price"],  data["order"]["trip"]["date"], data["order"]["trip"]["time"],
          data["order"]["contact"]["name"],data["order"]["contact"]["email"],data["order"]["contact"]["phone"],
          data["order"]["trip"]["attraction"]["id"],data["order"]["trip"]["attraction"]["name"],
          data["order"]["trip"]["attraction"]["address"],data["order"]["trip"]["attraction"]["image"]
           ))
    db_connection.commit()
    cursor.close()
    db_connection.close()

    return orderID

# 發送付款資料給 TapPay
def sendTapPay(data,orderID):

    prime = data["prime"]
    partnerKey = "partner_mexRYSQz71J1kGgbh5aJzIFfthnFjjXYeei5923mBaA6Atz4VdCWdoMh"
    merchant_id = "Lark1987_ESUN"

    url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': partnerKey,
    }
    data = {
        "prime": prime,
        "partner_key": partnerKey,
        "merchant_id": merchant_id,
        "details":"TapPay Test",
        "amount": data["order"]["price"],
        "cardholder": {
            "phone_number":data["order"]["contact"]["phone"],
            "name": data["order"]["contact"]["name"],
            "email": data["order"]["contact"]["email"],
        },
        "remember": True
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))
    result = response.json()

    if response.status_code == 200:
        orderSuccess(orderID)
        orderMessage = "付款成功"    
        print('交易成功')
    else:
        orderMessage = "付款失敗" 
        print('交易失敗', response.status_code , response.text)

    return result["status"],orderMessage

# 付款成功，更改訂單狀態
def orderSuccess(orderID):
    db_connection=db_config.connection_pool.get_connection()
    cursor=db_connection.cursor()
    cursor.execute("UPDATE orders SET status='已付款' WHERE orderID=%s",(orderID,))
    db_connection.commit()
    cursor.close()
    db_connection.close()
