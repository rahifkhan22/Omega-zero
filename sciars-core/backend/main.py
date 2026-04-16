from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import issues, notifications

app = FastAPI(
    title="SCIARS API",
    description="Smart City Issue and Resolution System - Backend API",
    version="1.0.0",
)

# CORS configuration - allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(issues.router, prefix="/api", tags=["Issues"])
app.include_router(notifications.router, prefix="/api", tags=["Notifications"])


@app.get("/")
async def root():
    return {"message": "SCIARS API is running", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
