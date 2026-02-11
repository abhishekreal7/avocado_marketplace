from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
from enum import Enum
import uuid

class CategoryEnum(str, Enum):
    # Core AI Tools Categories
    DESIGN = "Design"
    CODING = "Coding"
    WEBSITE = "Website"
    CONTENT = "Content"
    MARKETING = "Marketing"
    BUSINESS_TOOLS = "Business Tools"
    PRODUCTIVITY = "Productivity"
    DEV_TOOLS = "DevTools"
    VIDEO_AUDIO = "Video & Audio"
    DATA_ANALYTICS = "Data & Analytics"
    EDUCATION = "Education"
    HEALTH = "Health & Wellness"
    
    # Legacy/Additional Categories
    REAL_ESTATE = "Real Estate"
    STUDENT_TOOLS = "Student Tools"
    WRITING = "Writing"
    FINANCE = "Finance"
    SOCIAL_MEDIA = "Social Media"
    ECOMMERCE = "E-commerce"
    GAME_DEV = "Game Dev"

class StatusEnum(str, Enum):
    ACTIVE = "active"
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class Purchase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    buyer_email: EmailStr
    seller_email: str # Added for tracking sales
    listing_id: str
    listing_title: str
    price_paid: float
    currency: str
    payment_intent_id: Optional[str] = None
    dodo_checkout_id: Optional[str] = None
    platform_fee: float = 0.0 # 15% commission (deducted from seller)
    dodo_fee: float = 0.0 # ~3.5% processing fee (deducted from seller)
    status: str = "completed" # completed, refunded
    purchase_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PurchaseCreate(BaseModel):
    buyer_email: EmailStr
    listing_id: str
    currency: str = "USD"
    payment_intent_id: Optional[str] = None
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    razorpay_signature: Optional[str] = None

class ProjectRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    client_email: EmailStr
    project_title: str
    website_type: str
    budget_range: str
    deadline: str
    description: str
    reference_link: Optional[str] = None
    status: str = "active"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProjectRequestCreate(BaseModel):
    client_name: str
    client_email: EmailStr
    project_title: str
    website_type: str
    budget_range: str
    deadline: str
    description: str
    reference_link: Optional[str] = None

class Proposal(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    provider_name: str
    provider_email: EmailStr
    proposed_price: float
    timeline: str
    message: str
    portfolio_link: Optional[str] = None
    status: str = "pending"
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProposalCreate(BaseModel):
    project_id: str
    provider_name: str
    provider_email: EmailStr
    proposed_price: float
    timeline: str
    message: str
    portfolio_link: Optional[str] = None

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sender_email: str
    receiver_email: str
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_read: bool = False

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
    status: StatusEnum = StatusEnum.PENDING
    seller_email: str
    seller_id: Optional[str] = None # Added for linking to profile
    seller_name: str = "Avocado Creator"
    seller_products: int = 1
    is_featured: bool = False
    featured_until: Optional[datetime] = None
    is_verified: bool = True
    views: int = 0
    clicks: int = 0
    is_bundle: bool = False
    bundle_items: List[str] = []
    
    # AI Tools Tags for Enhanced Filtering
    platform_tags: List[str] = []  # e.g., ["Web", "Mobile", "Desktop", "API"]
    tech_stack_tags: List[str] = []  # e.g., ["React", "Python", "No-Code"]
    use_case_tags: List[str] = []  # e.g., ["Logo Design", "Code Review", "SEO"]
    
    # Auction Fields
    listing_type: str = "fixed" # fixed, auction
    auction_end_time: Optional[datetime] = None
    starting_bid: Optional[float] = None
    current_bid: Optional[float] = None
    bid_count: int = 0
    highest_bidder_email: Optional[str] = None

    # Inclusions
    includes_hosting: bool = False
    hosting_details: Optional[str] = None
    includes_domain: bool = False
    domain_details: Optional[str] = None
    includes_api_access: bool = False
    api_access_details: Optional[str] = None
    includes_pro_email: bool = False
    domain_name: Optional[str] = None
    attachments: List[str] = [] # URLs or filenames
    
    # Trust & Transparency
    license_type: str = "Personal" # Personal, Commercial, Extended
    support_type: str = "Email Support"
    difficulty: str = "Intermediate" # Beginner, Intermediate, Advanced
    ongoing_costs: Optional[str] = None
    update_policy: Optional[str] = None
    faq: List[dict] = [] # List of {question: str, answer: str}
    seller_bio: Optional[str] = None
    
    # Social Proof & Details
    system_requirements: List[str] = []
    version_history: List[dict] = [] # List of {version: str, date: str, notes: str}
    video_demo_url: Optional[str] = None
    sales_count: int = 0
    seller_response_time: str = "Replies within 24hrs"
    rating: float = 5.0
    review_count: int = 0
    views: int = 0
    likes: int = 0
    
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
    seller_name: str = "Avocado Creator"
    seller_products: int = 1
    is_featured: bool = False
    is_verified: bool = True
    is_bundle: bool = False
    bundle_items: List[str] = []
    
    # AI Tools Tags
    platform_tags: List[str] = []
    tech_stack_tags: List[str] = []
    use_case_tags: List[str] = []
    
    # Auction Fields
    listing_type: str = "fixed"
    auction_end_time: Optional[str] = None # ISO format string
    starting_bid: Optional[float] = None

    # Inclusions
    includes_hosting: bool = False
    hosting_details: Optional[str] = None
    includes_domain: bool = False
    domain_details: Optional[str] = None
    includes_api_access: bool = False
    api_access_details: Optional[str] = None
    attachments: List[str] = []
    includes_pro_email: bool = False
    domain_name: Optional[str] = None
    
    # Trust & Transparency
    license_type: str = "Personal"
    support_type: str = "Email Support"
    difficulty: str = "Intermediate"
    ongoing_costs: Optional[str] = None
    update_policy: Optional[str] = None
    faq: List[dict] = []
    seller_bio: Optional[str] = None
    
    # Social Proof & Details
    system_requirements: List[str] = []
    version_history: List[dict] = []
    video_demo_url: Optional[str] = None
    sales_count: int = 0
    seller_response_time: str = "Replies within 24hrs"
    rating: float = 5.0
    review_count: int = 0
    views: int = 0
    likes: int = 0

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    price_usd: Optional[float] = None
    description: Optional[str] = None
    category: Optional[CategoryEnum] = None
    features: Optional[List[str]] = None
    tech_stack: Optional[List[str]] = None
    demo_url: Optional[str] = None
    images: Optional[List[str]] = None
    listing_type: Optional[str] = None
    auction_end_time: Optional[str] = None
    starting_bid: Optional[float] = None
    
    # Inclusions
    includes_hosting: Optional[bool] = None
    hosting_details: Optional[str] = None
    includes_domain: Optional[bool] = None
    domain_details: Optional[str] = None
    includes_api_access: Optional[bool] = None
    api_access_details: Optional[str] = None
    includes_pro_email: Optional[bool] = None
    domain_name: Optional[str] = None
    attachments: Optional[List[str]] = None
    
    # Trust & Transparency
    license_type: Optional[str] = None
    support_type: Optional[str] = None
    difficulty: Optional[str] = None
    ongoing_costs: Optional[str] = None
    update_policy: Optional[str] = None
    faq: Optional[List[dict]] = None
    seller_bio: Optional[str] = None
    
    # Social Proof & Details
    system_requirements: Optional[List[str]] = None
    version_history: Optional[List[dict]] = None
    video_demo_url: Optional[str] = None
    sales_count: Optional[int] = None
    seller_response_time: Optional[str] = None
    rating: Optional[float] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None
    views: Optional[int] = None
    likes: Optional[int] = None

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
    images: List[str] = []
    features: List[str] = []
    tech_stack: List[str] = []
    status: StatusEnum = StatusEnum.PENDING
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    reviewed_at: Optional[datetime] = None
    
    # Auction Fields
    listing_type: str = "fixed"
    auction_end_time: Optional[datetime] = None
    starting_bid: Optional[float] = None

class SubmissionCreate(BaseModel):
    full_name: str
    email: EmailStr
    website_title: str
    category: CategoryEnum
    price: float
    description: str
    demo_url: str
    upload_link: str
    images: List[str] = []
    features: List[str] = []
    tech_stack: List[str] = []
    
    # Auction Fields
    listing_type: str = "fixed"
    auction_end_time: Optional[str] = None
    starting_bid: Optional[float] = None

class SubmissionUpdate(BaseModel):
    status: StatusEnum

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    listing_id: str
    reviewer_email: EmailStr
    reviewer_name: str
    rating: int = Field(..., ge=1, le=5)
    comment: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReviewCreate(BaseModel):
    listing_id: str
    rating: int = Field(..., ge=1, le=5)
    comment: str

class Message(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    proposal_id: str
    sender_email: EmailStr
    sender_name: str
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MessageCreate(BaseModel):
    proposal_id: str
    content: str

class Bid(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    listing_id: str
    bidder_email: EmailStr
    bidder_name: str
    amount: float
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BidCreate(BaseModel):
    listing_id: str
    amount: float
