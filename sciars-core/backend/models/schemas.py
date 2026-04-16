from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class IssueStatus(str, Enum):
    """Allowed status values for an issue."""
    reported = "reported"
    in_progress = "in-progress"
    resolved = "resolved"


class IssueCreate(BaseModel):
    """Schema for creating a new issue."""
    title: str = Field(..., min_length=3, max_length=200, description="Title of the issue")
    description: str = Field(..., min_length=10, max_length=2000, description="Detailed description")
    category: str = Field(default="other", description="Issue category (road, water, electricity, etc.)")
    lat: float = Field(..., ge=-90, le=90, description="Latitude coordinate")
    lng: float = Field(..., ge=-180, le=180, description="Longitude coordinate")


class IssueStatusUpdate(BaseModel):
    """Schema for updating an issue's status."""
    status: IssueStatus = Field(..., description="New status for the issue")


class IssueResponse(BaseModel):
    """Schema for the issue response object."""
    id: str
    title: str
    description: str
    category: str
    lat: float
    lng: float
    imageUrl: Optional[str] = None
    status: str
    createdAt: str


class NotificationResponse(BaseModel):
    """Schema for a notification object."""
    id: str
    title: str
    message: str
    userId: Optional[str] = None
    read: bool = False
    createdAt: str
