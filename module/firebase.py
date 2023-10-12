import firebase_admin
from firebase_admin import credentials
import os
from dotenv import load_dotenv
load_dotenv()

FIREBASE_PROJECT_ID =  os.getenv("FIREBASE_PROJECT_ID")
FIREBASE_PRIVATE_KEY_ID = os.getenv("FIREBASE_PRIVATE_KEY_ID")
FIREBASE_PRIVATE_KEY = os.getenv("FIREBASE_PRIVATE_KEY")
FIREBASE_CLIENT_EMAIL = os.getenv("FIREBASE_CLIENT_EMAIL")
FIREBASE_CLIENT_ID = os.getenv("FIREBASE_CLIENT_ID")
FIREBASE_STORAGE_BUCKET = os.getenv("FIREBASE_STORAGE_BUCKET")
FIREBASE_CLIENT_x509_cert_url=os.getenv("FIREBASE_CLIENT_x509_cert_url")

cred = credentials.Certificate({
    "type": "service_account",
    "project_id": FIREBASE_PROJECT_ID,
    "private_key_id": FIREBASE_PRIVATE_KEY_ID,
    "private_key": FIREBASE_PRIVATE_KEY,
    "client_email": FIREBASE_CLIENT_EMAIL,
    "client_id": FIREBASE_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": FIREBASE_CLIENT_x509_cert_url,
    "universe_domain": "googleapis.com"
})


