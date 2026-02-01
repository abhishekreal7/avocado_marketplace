from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

class CategoryEnum(str, Enum):
    MARKETING = "Marketing"
    REAL_ESTATE = "Real Estate"
    STUDENT_TOOLS = "Student Tools"
    BUSINESS_TOOLS = "Business Tools"
    PRODUCTIVITY = "Productivity"

class StatusEnum(str, Enum):
    ACTIVE = "active"
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class Listing(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    price_usd: float
    price_inr: float
    description: str
    category: CategoryEnum
    features: List[str]
    tech_stack: List[str]
    demo_url: str
    images: List[str]
    status: StatusEnum = StatusEnum.ACTIVE
    seller_email: str
    seller_name: str = "Avocado Creator"
    seller_products: int = 1
    is_featured: bool = False
    is_verified: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ListingCreate(BaseModel):
    title: str
    price_usd: float
    price_inr: float
    description: str
    category: CategoryEnum
    features: List[str]
    tech_stack: List[str]
    demo_url: str
    images: List[str]
    seller_email: str

class Submission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    email: EmailStr
    website_title: str
    category: CategoryEnum
    price: float
    description: str
    demo_url: str
    upload_link: str
    status: StatusEnum = StatusEnum.PENDING
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    reviewed_at: Optional[datetime] = None

class SubmissionCreate(BaseModel):
    full_name: str
    email: EmailStr
    website_title: str
    category: CategoryEnum
    price: float
    description: str
    demo_url: str
    upload_link: str

class SubmissionUpdate(BaseModel):
    status: StatusEnum

@api_router.get("/")
async def root():
    return {"message": "Avocado Marketplace API"}

@api_router.get("/listings", response_model=List[Listing])
async def get_listings(category: Optional[str] = None, search: Optional[str] = None):
    query = {"status": StatusEnum.ACTIVE}
    if category:
        query["category"] = category
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    listings = await db.listings.find(query, {"_id": 0}).to_list(1000)
    
    for listing in listings:
        if isinstance(listing.get('created_at'), str):
            listing['created_at'] = datetime.fromisoformat(listing['created_at'])
    
    return listings

@api_router.get("/listings/{listing_id}", response_model=Listing)
async def get_listing(listing_id: str):
    listing = await db.listings.find_one({"id": listing_id}, {"_id": 0})
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    if isinstance(listing.get('created_at'), str):
        listing['created_at'] = datetime.fromisoformat(listing['created_at'])
    
    return listing

@api_router.post("/submissions", response_model=Submission)
async def create_submission(submission_data: SubmissionCreate):
    submission = Submission(**submission_data.model_dump())
    doc = submission.model_dump()
    doc['submitted_at'] = doc['submitted_at'].isoformat()
    doc['reviewed_at'] = None
    
    await db.submissions.insert_one(doc)
    return submission

@api_router.get("/admin/submissions", response_model=List[Submission])
async def get_submissions(status: Optional[str] = None):
    query = {}
    if status:
        query["status"] = status
    
    submissions = await db.submissions.find(query, {"_id": 0}).sort("submitted_at", -1).to_list(1000)
    
    for submission in submissions:
        if isinstance(submission.get('submitted_at'), str):
            submission['submitted_at'] = datetime.fromisoformat(submission['submitted_at'])
        if submission.get('reviewed_at') and isinstance(submission['reviewed_at'], str):
            submission['reviewed_at'] = datetime.fromisoformat(submission['reviewed_at'])
    
    return submissions

@api_router.put("/admin/submissions/{submission_id}", response_model=Submission)
async def update_submission(submission_id: str, update_data: SubmissionUpdate):
    submission = await db.submissions.find_one({"id": submission_id}, {"_id": 0})
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    update_dict = {
        "status": update_data.status,
        "reviewed_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.submissions.update_one(
        {"id": submission_id},
        {"$set": update_dict}
    )
    
    updated_submission = await db.submissions.find_one({"id": submission_id}, {"_id": 0})
    
    if isinstance(updated_submission.get('submitted_at'), str):
        updated_submission['submitted_at'] = datetime.fromisoformat(updated_submission['submitted_at'])
    if updated_submission.get('reviewed_at') and isinstance(updated_submission['reviewed_at'], str):
        updated_submission['reviewed_at'] = datetime.fromisoformat(updated_submission['reviewed_at'])
    
    return updated_submission

@api_router.post("/admin/listings", response_model=Listing)
async def create_listing(listing_data: ListingCreate):
    listing = Listing(**listing_data.model_dump())
    doc = listing.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.listings.insert_one(doc)
    return listing

@api_router.get("/seed")
async def seed_data():
    existing_count = await db.listings.count_documents({})
    if existing_count > 0:
        return {"message": "Database already seeded"}
    
    sample_listings = [
        {
            "id": str(uuid.uuid4()),
            "title": "AI Resume Builder Pro",
            "price_usd": 129,
            "price_inr": 9999,
            "description": "Complete AI-powered resume builder with professional templates, AI content generation, and PDF export. Includes landing page, authentication, and payment integration.",
            "category": "Productivity",
            "features": [
                "AI-powered content suggestions",
                "15+ professional templates",
                "PDF export functionality",
                "User authentication & profiles",
                "Payment integration ready",
                "Mobile responsive design"
            ],
            "tech_stack": ["React", "FastAPI", "MongoDB", "OpenAI GPT-4", "Tailwind CSS"],
            "demo_url": "https://demo.resumebuilder.ai",
            "images": [
                "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800",
                "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800"
            ],
            "status": "active",
            "seller_email": "builder@example.com",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "AI Real Estate Description Generator",
            "price_usd": 99,
            "price_inr": 7499,
            "description": "AI-powered tool that generates compelling property descriptions for real estate listings. Perfect for realtors and property managers.",
            "category": "Real Estate",
            "features": [
                "AI-generated property descriptions",
                "Multiple style options (luxury, family, modern)",
                "Bulk description generation",
                "Export to multiple formats",
                "SEO-optimized content",
                "User dashboard with history"
            ],
            "tech_stack": ["Next.js", "Python", "PostgreSQL", "Claude AI", "Stripe"],
            "demo_url": "https://demo.realestate-ai.com",
            "images": [
                "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
                "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800"
            ],
            "status": "active",
            "seller_email": "realtor@example.com",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "AI Instagram Caption Generator SaaS",
            "price_usd": 79,
            "price_inr": 5999,
            "description": "Generate engaging Instagram captions with AI. Includes hashtag suggestions, emoji integration, and multiple tone options.",
            "category": "Marketing",
            "features": [
                "AI caption generation",
                "Smart hashtag suggestions",
                "Multiple tone options",
                "Save favorite captions",
                "Subscription billing",
                "Social media scheduler integration"
            ],
            "tech_stack": ["React", "Node.js", "MongoDB", "GPT-4", "Tailwind CSS"],
            "demo_url": "https://demo.captiongenie.ai",
            "images": [
                "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
                "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800"
            ],
            "status": "active",
            "seller_email": "marketer@example.com",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "AI Study Notes Summarizer",
            "price_usd": 89,
            "price_inr": 6999,
            "description": "AI-powered study assistant that converts long documents and lectures into concise, organized study notes. Perfect for students.",
            "category": "Student Tools",
            "features": [
                "Document to notes conversion",
                "YouTube lecture summarization",
                "Flashcard generation",
                "Quiz creation from notes",
                "Organize by subject/course",
                "Export to PDF/Markdown"
            ],
            "tech_stack": ["Vue.js", "FastAPI", "PostgreSQL", "OpenAI", "Bootstrap"],
            "demo_url": "https://demo.studyai.app",
            "images": [
                "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",
                "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800"
            ],
            "status": "active",
            "seller_email": "student@example.com",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "AI Customer Support Chatbot Platform",
            "price_usd": 169,
            "price_inr": 12999,
            "description": "Complete white-label AI chatbot platform for customer support. Train on your data, embed on any website, track conversations.",
            "category": "Business Tools",
            "features": [
                "Custom AI training on your data",
                "Widget embed code",
                "Conversation analytics",
                "Multi-language support",
                "White-label branding",
                "API access",
                "Lead capture forms"
            ],
            "tech_stack": ["React", "Python", "MongoDB", "LangChain", "OpenAI", "WebSocket"],
            "demo_url": "https://demo.supportbot.ai",
            "images": [
                "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
                "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800"
            ],
            "status": "active",
            "seller_email": "business@example.com",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.listings.insert_many(sample_listings)
    return {"message": f"Seeded {len(sample_listings)} sample listings"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
