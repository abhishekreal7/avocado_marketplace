from fastapi import FastAPI, APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

import logging
from typing import List, Optional
from datetime import datetime, timezone
import uuid

# Import shared database
from database import db, client

# Import models
from backend_models_user import User
from backend_models_order_review import (
    Listing, ListingCreate, ProjectRequest, ProjectRequestCreate, 
    Proposal, ProposalCreate, CategoryEnum, StatusEnum
)

# Import routers
from backend_auth_routes import router as auth_router
from backend_orders_reviews import router as orders_reviews_router
from backend_auth_service import get_current_user
from fastapi import Depends

from fastapi.staticfiles import StaticFiles

# Create uploads directory if not exists
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app = FastAPI()

# Mount static files
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

api_router = APIRouter(prefix="/api")

# CORS Configuration
cors_origins_str = os.environ.get("CORS_ORIGINS", "http://localhost:3000")
origins = [origin.strip() for origin in cors_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

from backend_newsletter import router as newsletter_router
from backend_notifications import router as notifications_router
from backend_analytics import router as analytics_router
from backend_chat import router as chat_router
from backend_admin_analytics import router as admin_analytics_router
from backend_webhooks import router as webhooks_router

# Include Auth and Order/Review routers
api_router.include_router(auth_router)
api_router.include_router(orders_reviews_router)
api_router.include_router(newsletter_router)
api_router.include_router(notifications_router)
api_router.include_router(analytics_router)
api_router.include_router(chat_router)
api_router.include_router(admin_analytics_router)
api_router.include_router(webhooks_router, prefix="/webhooks", tags=["webhooks"])

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# --- Remaining Endpoints (Listings, Projects, Seed) ---

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
    
    listings = await db.listings.find(query, {"_id": 0}).sort([("is_featured", -1), ("created_at", -1)]).to_list(1000)
    
    # Enrich with seller_id
    for listing in listings:
        if isinstance(listing.get('created_at'), str):
            listing['created_at'] = datetime.fromisoformat(listing['created_at'])
        
        # Fetch seller_id if missing
        if not listing.get('seller_id') and listing.get('seller_email'):
            seller = await db.users.find_one({"email": listing['seller_email']}, {"id": 1})
            if seller:
                listing['seller_id'] = seller['id']
    
    return listings

@api_router.get("/seller/listings", response_model=List[Listing])
async def get_seller_listings(current_user: User = Depends(get_current_user)):
    listings = await db.listings.find({"seller_email": current_user.email}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for listing in listings:
        if isinstance(listing.get('created_at'), str):
            listing['created_at'] = datetime.fromisoformat(listing['created_at'])
        listing['seller_id'] = current_user.id
            
    return listings

@api_router.get("/listings/{listing_id}", response_model=Listing)
async def get_listing(listing_id: str):
    listing = await db.listings.find_one({"id": listing_id}, {"_id": 0})
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    if isinstance(listing.get('created_at'), str):
        listing['created_at'] = datetime.fromisoformat(listing['created_at'])
    
    # Fetch seller_id
    if not listing.get('seller_id') and listing.get('seller_email'):
        seller = await db.users.find_one({"email": listing['seller_email']}, {"id": 1})
        if seller:
            listing['seller_id'] = seller['id']
    
    # If it's a bundle, we might want to fetch details of items in it.
    # For now, we trust the frontend to fetch them if needed or we could enrich here.
    # Let's keep it simple for MVP and just return the IDs in 'bundle_items'.
    
    return listing

# Gamification / Rank Logic
def calculate_seller_rank(total_sales: int, avg_rating: float) -> dict:
    # Ranks:
    # 1. Hello World (Start)
    # 2. Junior Dev (1 Sale)
    # 3. Senior Dev (10 Sales, 4.0+ Rating)
    # 4. Tech Lead (50 Sales, 4.5+ Rating)
    # 5. 10x Engineer (100 Sales, 4.8+ Rating)
    
    if total_sales >= 100 and avg_rating >= 4.8:
        return {"rank": "10x Engineer", "badge": "🚀", "next_rank": None, "progress": 100}
    elif total_sales >= 50 and avg_rating >= 4.5:
        return {"rank": "Tech Lead", "badge": "🌐", "next_rank": "10x Engineer", "progress": int((total_sales / 100) * 100)}
    elif total_sales >= 10 and avg_rating >= 4.0:
        return {"rank": "Senior Dev", "badge": "💻", "next_rank": "Tech Lead", "progress": int((total_sales / 50) * 100)}
    elif total_sales >= 1:
        return {"rank": "Junior Dev", "badge": "🐛", "next_rank": "Senior Dev", "progress": int((total_sales / 10) * 100)}
    else:
        return {"rank": "Hello World", "badge": "🖥️", "next_rank": "Junior Dev", "progress": int((total_sales / 1) * 100)} # 0/1

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    headline: Optional[str] = None
    social_links: Optional[dict] = None
    location: Optional[str] = None
    languages: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    country: Optional[str] = None
    pincode: Optional[str] = None

@api_router.get("/users/{user_id}/profile")
async def get_user_profile(user_id: str):
    # 1. Fetch User
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "email": 0, "role": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_internal = await db.users.find_one({"id": user_id})
    user_email = user_internal["email"]

    # 2. Fetch Active Listings
    listings = await db.listings.find(
        {"seller_email": user_email, "status": StatusEnum.ACTIVE}, 
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    # 3. Calculate Stats
    all_seller_listings = await db.listings.find(
        {"seller_email": user_email},
        {"id": 1}
    ).to_list(None)
    all_listing_ids = [l["id"] for l in all_seller_listings]
    
    total_sales = 0
    if all_listing_ids:
        total_sales = await db.purchases.count_documents({"listing_id": {"$in": all_listing_ids}})

    # 4. Fetch Reviews & Rating
    reviews = []
    average_rating = 0.0
    if all_listing_ids:
        raw_reviews = await db.reviews.find(
            {"listing_id": {"$in": all_listing_ids}},
            {"_id": 0}
        ).sort("created_at", -1).to_list(20)
        
        # Enrich reviews with Reviewer and Listing metadata
        for r in raw_reviews:
            reviewer = await db.users.find_one({"id": r["reviewer_id"]}, {"name": 1, "picture": 1, "created_at": 1, "_id": 0})
            listing = await db.listings.find_one({"id": r["listing_id"]}, {"title": 1, "price": 1, "images": 1, "_id": 0})
            
            r["reviewer"] = reviewer
            r["listing"] = listing
            # Mock data for "Duration" or "Country" if not in DB yet
            r["duration"] = "3 days" # Placeholder
            
            if isinstance(r.get('created_at'), str) == False and r.get('created_at'):
                r['created_at'] = r['created_at'].isoformat()
            
        reviews = raw_reviews

        pipeline = [
            {"$match": {"listing_id": {"$in": all_listing_ids}}},
            {"$group": {"_id": None, "avg_rating": {"$avg": "$rating"}}}
        ]
        rating_result = await db.reviews.aggregate(pipeline).to_list(1)
        if rating_result:
            average_rating = round(rating_result[0]["avg_rating"], 1)

    # 5. Calculate Rank
    gamification = calculate_seller_rank(total_sales, average_rating)

    # Format dates and return
    if isinstance(user.get('created_at'), str) == False and user.get('created_at'):
        user['created_at'] = user['created_at'].isoformat()
        
    for l in listings:
        if isinstance(l.get('created_at'), str) == False and l.get('created_at'):
            l['created_at'] = l['created_at'].isoformat()

    return {
        "user": user,
        "listings": listings,
        "stats": {
            "total_sales": total_sales,
            "average_rating": average_rating,
            "total_reviews": len(reviews),
            "member_since": user.get('created_at')
        },
        "gamification": gamification,
        "recent_reviews": reviews
    }

@api_router.put("/users/profile")
async def update_profile(profile_data: ProfileUpdate, current_user: User = Depends(get_current_user)):
    update_data = {}
    if profile_data.name: update_data["name"] = profile_data.name
    if profile_data.bio is not None: update_data["bio"] = profile_data.bio
    if profile_data.headline is not None: update_data["headline"] = profile_data.headline
    if profile_data.social_links is not None: update_data["social_links"] = profile_data.social_links
    if profile_data.location is not None: update_data["location"] = profile_data.location
    if profile_data.languages is not None: update_data["languages"] = profile_data.languages
    if profile_data.skills is not None: update_data["skills"] = profile_data.skills
    if profile_data.country is not None: update_data["country"] = profile_data.country
    if profile_data.pincode is not None: update_data["pincode"] = profile_data.pincode
        
    if not update_data:
        raise HTTPException(status_code=400, detail="No valid fields to update")
        
    await db.users.update_one(
        {"email": current_user.email},
        {"$set": update_data}
    )
    
    updated_user = await db.users.find_one({"email": current_user.email}, {"_id": 0})
    if isinstance(updated_user.get('created_at'), str) == False and updated_user.get('created_at'):
        updated_user['created_at'] = updated_user['created_at'].isoformat()

    return updated_user

@api_router.post("/listings", response_model=Listing)
async def create_listing(listing_data: ListingCreate, current_user: User = Depends(get_current_user)):
    # Logic for Auto-Approval
    initial_status = StatusEnum.PENDING
    
    # 1. Admin always approved
    if current_user.role == "admin":
        initial_status = StatusEnum.ACTIVE
        
    # 2. Trusted Sellers (hardcoded for now)
    trusted_sellers = ["demo@example.com", "abhis@example.com"]
    if current_user.email in trusted_sellers:
        initial_status = StatusEnum.ACTIVE
        
    # 3. Sellers with previous approved listings
    if initial_status == StatusEnum.PENDING:
        existing_approved = await db.listings.count_documents({
            "seller_email": current_user.email,
            "status": StatusEnum.ACTIVE
        })
        if existing_approved > 0:
            initial_status = StatusEnum.ACTIVE

    # Bundle Validation
    if listing_data.is_bundle:
        if not listing_data.bundle_items:
             raise HTTPException(status_code=400, detail="Bundles must contain at least one item.")
        # Verify user owns all items in the bundle
        count = await db.listings.count_documents({
            "id": {"$in": listing_data.bundle_items},
            "seller_email": current_user.email
        })
        if count != len(listing_data.bundle_items):
             raise HTTPException(status_code=400, detail="Invalid bundle items. You must own all items.")

    listing = Listing(
        **listing_data.model_dump(),
        seller_email=current_user.email,
        seller_name=current_user.name,
        status=initial_status
    )
    
    doc = listing.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    if doc.get('featured_until'):
        doc['featured_until'] = doc['featured_until'].isoformat()
    
    await db.listings.insert_one(doc)
    return listing

@api_router.put("/admin/listings/{listing_id}/feature")
async def toggle_featured(listing_id: str):
    listing = await db.listings.find_one({"id": listing_id}, {"_id": 0})
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    new_featured_status = not listing.get('is_featured', False)
    await db.listings.update_one(
        {"id": listing_id},
        {"$set": {"is_featured": new_featured_status}}
    )
    
    return {"message": "Featured status updated", "is_featured": new_featured_status}

@api_router.post("/listings/{listing_id}/promote")
async def promote_listing(listing_id: str):
    listing = await db.listings.find_one({"id": listing_id})
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # In a real app, verify payment here
    featured_until = datetime.now(timezone.utc).isoformat() # Logic to add 7 days would go here
    
    await db.listings.update_one(
        {"id": listing_id},
        {"$set": {"is_featured": True, "featured_until": featured_until}}
    )
    
    return {"message": "Listing promoted successfully", "is_featured": True}

@api_router.post("/listings/{listing_id}/view")
async def increment_listing_view(listing_id: str):
    result = await db.listings.update_one(
        {"id": listing_id},
        {"$inc": {"views": 1}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Listing not found")
    return {"message": "View incremented"}

# --- Projects & Proposals ---

@api_router.post("/projects", response_model=ProjectRequest)
async def create_project_request(project_data: ProjectRequestCreate):
    project = ProjectRequest(**project_data.model_dump())
    doc = project.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.project_requests.insert_one(doc)
    return project

@api_router.get("/projects", response_model=List[ProjectRequest])
async def get_projects(budget: Optional[str] = None, website_type: Optional[str] = None):
    query = {"status": "active"}
    if budget:
        query["budget_range"] = budget
    if website_type:
        query["website_type"] = website_type
    
    projects = await db.project_requests.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for project in projects:
        if isinstance(project.get('created_at'), str):
            project['created_at'] = datetime.fromisoformat(project['created_at'])
    
    return projects

@api_router.get("/projects/{project_id}", response_model=ProjectRequest)
async def get_project(project_id: str):
    project = await db.project_requests.find_one({"id": project_id}, {"_id": 0})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if isinstance(project.get('created_at'), str):
        project['created_at'] = datetime.fromisoformat(project['created_at'])
    
    return project

@api_router.post("/proposals", response_model=Proposal)
async def create_proposal(proposal_data: ProposalCreate):
    proposal = Proposal(**proposal_data.model_dump())
    doc = proposal.model_dump()
    doc['submitted_at'] = doc['submitted_at'].isoformat()
    
    await db.proposals.insert_one(doc)
    return proposal

@api_router.get("/projects/{project_id}/proposals", response_model=List[Proposal])
async def get_project_proposals(project_id: str):
    proposals = await db.proposals.find({"project_id": project_id}, {"_id": 0}).sort("submitted_at", -1).to_list(1000)
    
    for proposal in proposals:
        if isinstance(proposal.get('submitted_at'), str):
            proposal['submitted_at'] = datetime.fromisoformat(proposal['submitted_at'])
    
    return proposals

@api_router.get("/seed")
async def seed_data():
    import json
    import os
    
    # Clear existing data
    await db.listings.delete_many({})
    
    # Load AI tools seed data from JSON file
    seed_file = os.path.join(os.path.dirname(__file__), 'ai_tools_seed.json')
    
    try:
        with open(seed_file, 'r') as f:
            sample_listings = json.load(f)
        
        await db.listings.insert_many(sample_listings)
        return {"message": f"Seeded {len(sample_listings)} AI tools successfully"}
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Seed data file not found. Run generate_ai_tools_seed.py first.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error seeding data: {str(e)}")

app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
