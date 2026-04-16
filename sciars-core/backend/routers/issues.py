from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
from models.schemas import IssueCreate, IssueStatusUpdate, IssueResponse
from services.duplicate_check import is_duplicate
from services.firebase_admin import db
import uuid
from datetime import datetime

router = APIRouter()

# In-memory store (replace with Firebase Firestore in production)
issues_store = []


@router.post("/issues", response_model=IssueResponse)
async def create_issue(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form("other"),
    lat: float = Form(...),
    lng: float = Form(...),
    image: Optional[UploadFile] = File(None),
):
    """
    POST /api/issues - Create a new issue report.
    Checks for duplicate issues nearby using the Haversine formula.
    """
    # Check for duplicate issues within 100m radius
    for existing in issues_store:
        if is_duplicate(lat, lng, existing["lat"], existing["lng"], threshold_km=0.1):
            if existing["category"] == category:
                raise HTTPException(
                    status_code=409,
                    detail=f"A similar '{category}' issue already exists nearby (ID: {existing['id']}).",
                )

    image_url = None
    if image:
        # TODO: Upload to Firebase Storage and get the URL
        image_url = f"/uploads/{image.filename}"

    new_issue = {
        "id": str(uuid.uuid4()),
        "title": title,
        "description": description,
        "category": category,
        "lat": lat,
        "lng": lng,
        "imageUrl": image_url,
        "status": "reported",
        "createdAt": datetime.utcnow().isoformat(),
    }

    issues_store.append(new_issue)
    return new_issue


@router.get("/issues")
async def get_issues():
    """
    GET /api/issues - Retrieve all reported issues.
    """
    return issues_store


@router.put("/issues/{issue_id}/status")
async def update_issue_status(issue_id: str, payload: IssueStatusUpdate):
    """
    PUT /api/issues/{issue_id}/status - Update the status of an issue.
    """
    for issue in issues_store:
        if issue["id"] == issue_id:
            issue["status"] = payload.status
            return {"message": "Status updated", "issue": issue}

    raise HTTPException(status_code=404, detail="Issue not found.")
