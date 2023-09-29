# import mysql.connector
from mysql.connector import pooling

db_config={
    "host":"localhost",
    "user":"root",
    "password":"12345678",
    "database":"Trip",
	"connection_timeout":172800,
}

connection_pool=pooling.MySQLConnectionPool(**db_config)