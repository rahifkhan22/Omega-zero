import firebase_admin
from firebase_admin import credentials, firestore
import os

# Path to your Firebase service account key JSON file
SERVICE_ACCOUNT_PATH = os.getenv(
    "FIREBASE_SERVICE_ACCOUNT", "serviceAccountKey.json"
)

# Initialize Firebase Admin SDK (only once)
if not firebase_admin._apps:
    try:
        cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
        firebase_admin.initialize_app(cred)
        print("✅ Firebase Admin SDK initialized successfully.")
    except Exception as e:
        print(f"⚠️  Firebase Admin SDK initialization failed: {e}")
        print("   Running without Firebase. Using in-memory storage.")

# Firestore client (will be None if Firebase is not initialized)
try:
    db = firestore.client()
except Exception:
    db = None
    print("⚠️  Firestore client not available. Using in-memory storage.")
