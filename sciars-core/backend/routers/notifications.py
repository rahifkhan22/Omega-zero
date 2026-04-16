from fastapi import APIRouter

router = APIRouter()

# In-memory notifications store (replace with Firebase Firestore in production)
notifications_store = []


@router.get("/notifications")
async def get_notifications():
    """
    GET /api/notifications - Retrieve all notifications for the current user.
    Returns a list of notification objects.
    """
    return notifications_store


@router.post("/notifications")
async def create_notification(title: str, message: str, user_id: str = None):
    """
    POST /api/notifications - Create a new notification.
    Typically triggered internally when an issue status changes.
    """
    import uuid
    from datetime import datetime

    notification = {
        "id": str(uuid.uuid4()),
        "title": title,
        "message": message,
        "userId": user_id,
        "read": False,
        "createdAt": datetime.utcnow().isoformat(),
    }

    notifications_store.append(notification)
    return notification
