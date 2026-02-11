from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime, timezone
import shutil
import os

from database import db
from backend_models_user import User
from backend_auth_service import get_current_user, get_current_admin
from backend_models_order_review import Purchase, PurchaseCreate, Listing, Submission, SubmissionCreate, SubmissionUpdate, StatusEnum, Review, ReviewCreate
from backend_models_notification import Notification

router = APIRouter()

# --- Purchases ---

from stripe_integration import verify_payment, refund_payment
from backend_email import send_order_confirmation, send_refund_notification, send_sale_notification
import logging

from dodopayments_integration import create_dodo_checkout_session, verify_dodo_payment

logger = logging.getLogger(__name__)

class PaymentOrderRequest(BaseModel):
    listing_id: str
    currency: str = "INR"

class CartPaymentOrderRequest(BaseModel):
    listing_ids: List[str]
    currency: str = "INR"

@router.post("/create-payment-order")
async def create_payment_order(request: PaymentOrderRequest, current_user: User = Depends(get_current_user)):
    # 1. Fetch Listing
    listing = await db.listings.find_one({"id": request.listing_id})
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # 2. Determine Amount (Subtotal)
    if request.currency == "INR":
        subtotal_inr = listing.get("price_inr") or (listing["price_usd"] * 83)
    else:
        subtotal_usd = listing["price_usd"]
        subtotal_inr = subtotal_usd * 83 # Fallback conversion if needed
        
    # 3. Apply 15% Platform Fee (Temporarily Waived)
    if request.currency == "INR":
        total_amount_inr = subtotal_inr
        total_amount_paise = int(total_amount_inr * 100)
    else:
        total_amount_usd = listing["price_usd"]
        total_amount_paise = int(total_amount_usd * 100) # Smallest unit for Dodo
        
    # 4. Create Dodo Checkout Session
    customer = {
        "email": current_user.email,
        "name": current_user.name
    }
    product_name = f"Purchase {listing['title']}"
    
    checkout_session = create_dodo_checkout_session(
        amount=total_amount_paise, 
        currency=request.currency, 
        customer=customer,
        product_name=product_name,
        listing_ids=[request.listing_id]
    )
    
    if not checkout_session:
        raise HTTPException(status_code=500, detail="Failed to create Dodo Payments checkout session")
        
    return checkout_session

@router.post("/create-cart-payment-order")
async def create_cart_payment_order(request: CartPaymentOrderRequest, current_user: User = Depends(get_current_user)):
    # 1. Fetch Listings
    listings = await db.listings.find({"id": {"$in": request.listing_ids}}).to_list(100)
    if not listings:
        raise HTTPException(status_code=404, detail="No listings found")
    
    # 2. Calculate Total with Fee
    total_subtotal = 0
    if request.currency == "INR":
        for listing in listings:
            total_subtotal += listing.get("price_inr") or (listing["price_usd"] * 83)
    else:
        for listing in listings:
            total_subtotal += listing["price_usd"]
            
    total_with_fee = total_subtotal # Fee Waived
    total_amount_paise = int(total_with_fee * 100)
        
    # 3. Create Dodo Checkout Session
    customer = {
        "email": current_user.email,
        "name": current_user.name
    }
    product_name = f"Cart Purchase ({len(listings)} items)"
    
    checkout_session = create_dodo_checkout_session(
        amount=total_amount_paise, 
        currency=request.currency, 
        customer=customer,
        product_name=product_name,
        listing_ids=request.listing_ids
    )
    
    if not checkout_session:
        raise HTTPException(status_code=500, detail="Failed to create Dodo Payments checkout session")
        
    return checkout_session

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    UPLOAD_DIR = "uploads"
    # Create valid filename
    filename = f"{datetime.now().timestamp()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Return URL (assuming localhost for now, or relative path)
    # In production, this would be a full URL
    return {"url": f"http://localhost:8000/uploads/{filename}"}

class CartPurchaseCreate(BaseModel):
    buyer_email: EmailStr
    listing_ids: List[str]
    currency: str = "USD"
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    razorpay_signature: Optional[str] = None

@router.post("/cart-purchases", response_model=List[Purchase])
async def create_cart_purchases(purchase_data: CartPurchaseCreate):
    # 1. Verify Payment (Once for the whole batch)
    is_verified = False
    if purchase_data.dodo_checkout_id:
        is_verified = verify_dodo_payment(purchase_data.dodo_checkout_id)
        if not is_verified:
             raise HTTPException(status_code=400, detail="Payment verification failed")
    
    # 2. Process each listing
    purchases = []
    listings = await db.listings.find({"id": {"$in": purchase_data.listing_ids}}).to_list(100)
    
    for listing in listings:
        price_paid = listing['price_usd'] if purchase_data.currency == 'USD' else listing['price_inr']
        
        # Email Logic (simplified for batch)
        # In a real app, you might aggregate emails or send individual ones
        
        # Calculate Fees (Seller-side deductions)
        platform_fee = price_paid * 0.15
        dodo_fee = price_paid * 0.035
        
        purchase = Purchase(
            buyer_email=purchase_data.buyer_email,
            seller_email=listing.get('seller_email', 'unknown@avocado.com'),
            listing_id=listing['id'],
            listing_title=listing['title'],
            price_paid=price_paid,
            currency=purchase_data.currency,
            dodo_checkout_id=purchase_data.dodo_checkout_id,
            platform_fee=platform_fee,
            dodo_fee=dodo_fee,
            status="completed"
        )
        
        doc = purchase.model_dump()
        doc['purchase_date'] = doc['purchase_date'].isoformat()
        await db.purchases.insert_one(doc)
        purchases.append(purchase)
        
        # Send notifications (Seller)
        try:
             # Notify Seller
            seller_user = await db.users.find_one({"email": listing.get('seller_email')})
            if seller_user:
                notif = Notification(
                    user_id=seller_user['id'],
                    type="sale",
                    title="New Sale!",
                    message=f"You sold '{listing['title']}' for {purchase_data.currency} {price_paid}.",
                    link="/dashboard"
                )
                await db.notifications.insert_one(notif.model_dump())
        except Exception as e:
            logger.error(f"Failed to notify seller for {listing['title']}: {e}")

    # Send ONE confirmation email to buyer (Simplified)
    # await send_cart_order_confirmation(...) 
    
    return purchases

@router.post("/purchases", response_model=Purchase)
async def create_purchase(purchase_data: PurchaseCreate):
    # Get listing details
    listing = await db.listings.find_one({"id": purchase_data.listing_id}, {"_id": 0})
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Determine price based on currency
    price_paid = listing['price_usd'] if purchase_data.currency == 'USD' else listing['price_inr']
    
    # 1. VERIFY PAYMENT
    is_verified = False
    
    # Check for Dodo Payments
    if purchase_data.dodo_checkout_id:
        is_verified = verify_dodo_payment(
            purchase_data.dodo_checkout_id
        )
        payment_id = purchase_data.dodo_checkout_id
        
        if not is_verified:
            logger.error(f"Dodo Payments verification failed for {payment_id}")
    else:
        # Fallback to Stripe Mock
        payment_id = purchase_data.payment_intent_id or f"mock_pid_{datetime.now().timestamp()}"
        is_verified = verify_payment(payment_id)
    
    # 2. SIMULATE DELIVERY
    # Try to "deliver" -> For now, we assume it works unless listing title contains "Buggy"
    delivery_success = True
    if "Buggy" in listing['title']:
        delivery_success = False
        logger.error(f"Delivery failed for {listing['title']}")

    status = "completed"
    
    if not is_verified or not delivery_success:
        # TRIGGER AUTO-REFUND
        logger.warning(f"Order verification/delivery failed. Initiating refund for {payment_id}")
        refund_payment(payment_id, reason="Verification or Delivery Failed")
        
        # EMAIL CUSTOMER
        await send_refund_notification(
            to_email=purchase_data.buyer_email,
            order_id=payment_id,
            listing_title=listing['title'],
            reason="System Verification / Delivery Failed"
        )
        
        status = "refunded"
    else:
        # SUCCESS
        # Email Buyer
        await send_order_confirmation(
            to_email=purchase_data.buyer_email,
            order_id=payment_id,
            listing_title=listing['title']
        )
        
        # Email Seller
        buyer_user = await db.users.find_one({"email": purchase_data.buyer_email})
        buyer_name = buyer_user['name'] if buyer_user else "A Buyer"
        
        # Safe access for seller_email (handle legacy data)
        seller_email = listing.get('seller_email')
        
        if seller_email:
            try:
                await send_sale_notification(
                    to_email=seller_email,
                    buyer_name=buyer_name,
                    item_title=listing['title'],
                    amount=price_paid,
                    currency=purchase_data.currency
                )
            except Exception as e:
                logger.error(f"Failed to send sale notification: {e}")

            # Notify Seller
            seller_user = await db.users.find_one({"email": seller_email})
            if seller_user:
                notif = Notification(
                    user_id=seller_user['id'],
                    type="sale",
                    title="New Sale!",
                    message=f"You sold '{listing['title']}' for {purchase_data.currency} {price_paid}.",
                    link="/dashboard"
                )
                await db.notifications.insert_one(notif.model_dump())

    # Calculate Fees
    platform_fee = price_paid * 0.15
    dodo_fee = price_paid * 0.035

    purchase = Purchase(
        buyer_email=purchase_data.buyer_email,
        seller_email=listing.get('seller_email', 'unknown@avocado.com'),
        listing_id=purchase_data.listing_id,
        listing_title=listing['title'],
        price_paid=price_paid,
        currency=purchase_data.currency,
        payment_intent_id=payment_id,
        dodo_checkout_id=purchase_data.dodo_checkout_id,
        platform_fee=platform_fee,
        dodo_fee=dodo_fee,
        status=status
    )
    
    doc = purchase.model_dump()
    doc['purchase_date'] = doc['purchase_date'].isoformat()
    
    await db.purchases.insert_one(doc)
    
    return purchase

@router.get("/buyer/purchases", response_model=List[Purchase])
async def get_buyer_purchases(current_user: User = Depends(get_current_user)):
    purchases = await db.purchases.find({"buyer_email": current_user.email}, {"_id": 0}).sort("purchase_date", -1).to_list(1000)
    
    for purchase in purchases:
        if isinstance(purchase.get('purchase_date'), str):
            purchase['purchase_date'] = datetime.fromisoformat(purchase['purchase_date'])
            
    return purchases

@router.get("/seller/sales", response_model=List[Purchase])
async def get_seller_sales(current_user: User = Depends(get_current_user)):
    # Find purchases where seller_email matches
    purchases = await db.purchases.find({"seller_email": current_user.email}, {"_id": 0}).sort("purchase_date", -1).to_list(1000)
    
    for purchase in purchases:
        if isinstance(purchase.get('purchase_date'), str):
            purchase['purchase_date'] = datetime.fromisoformat(purchase['purchase_date'])
            
    return purchases

@router.get("/admin/purchases", response_model=List[Purchase])
async def get_purchases(current_user: User = Depends(get_current_admin)):
    purchases = await db.purchases.find({}, {"_id": 0}).sort("purchase_date", -1).to_list(1000)
    
    for purchase in purchases:
        if isinstance(purchase.get('purchase_date'), str):
            purchase['purchase_date'] = datetime.fromisoformat(purchase['purchase_date'])
    
    return purchases

# --- Submissions (Reviews/Seller content) ---

from backend_email import send_submission_confirmation, send_submission_status_update
from backend_models_notification import Notification

@router.post("/submissions", response_model=Submission)
async def create_submission(submission_data: SubmissionCreate):
    submission = Submission(**submission_data.model_dump())
    doc = submission.model_dump()
    doc['submitted_at'] = doc['submitted_at'].isoformat()
    doc['reviewed_at'] = None
    
    await db.submissions.insert_one(doc)
    
    # 1. Send Email
    try:
        await send_submission_confirmation(
            to_email=submission.email, 
            name=submission.full_name, 
            title=submission.website_title
        )
    except Exception as e:
        logger.error(f"Failed to send submission email: {e}")

    # 2. Create In-App Notification
    # Find user by email to get ID
    user = await db.users.find_one({"email": submission.email})
    if user:
        notification = Notification(
            user_id=user['id'],
            type="system",
            title="Submission Received",
            message=f"We received your submission for '{submission.website_title}'.",
            link="/dashboard"
        )
        await db.notifications.insert_one(notification.model_dump())

    return submission

@router.get("/seller/submissions", response_model=List[Submission])
async def get_seller_submissions(current_user: User = Depends(get_current_user)):
    submissions = await db.submissions.find({"email": current_user.email}, {"_id": 0}).sort("submitted_at", -1).to_list(1000)
    
    for submission in submissions:
        if isinstance(submission.get('submitted_at'), str):
            submission['submitted_at'] = datetime.fromisoformat(submission['submitted_at'])
        if submission.get('reviewed_at') and isinstance(submission['reviewed_at'], str):
            submission['reviewed_at'] = datetime.fromisoformat(submission['reviewed_at'])
            
    return submissions

@router.get("/admin/submissions", response_model=List[Submission])
async def get_submissions(status: Optional[str] = None, current_user: User = Depends(get_current_admin)):
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

@router.put("/admin/submissions/{submission_id}", response_model=Submission)
async def update_submission(submission_id: str, update_data: SubmissionUpdate, current_user: User = Depends(get_current_admin)):
    submission = await db.submissions.find_one({"id": submission_id}, {"_id": 0})
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # Check if status is actually changing
    status_changed = submission.get('status') != update_data.status
    
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
        
    # Send Notifications if status changed
    if status_changed:
        # 1. Email
        try:
            await send_submission_status_update(
                to_email=updated_submission['email'],
                name=updated_submission['full_name'],
                title=updated_submission['website_title'],
                status=update_data.status
            )
        except Exception as e:
            logger.error(f"Failed to send status update email: {e}")
            
        # 2. In-App Notification
        user = await db.users.find_one({"email": updated_submission['email']})
        if user:
            notif_title = "Submission Approved!" if update_data.status == "approved" else "Submission Update"
            notif_msg = f"Your submission '{updated_submission['website_title']}' has been {update_data.status}."
            
            notification = Notification(
                user_id=user['id'],
                type="system",
                title=notif_title,
                message=notif_msg,
                link="/dashboard"
            )
            await db.notifications.insert_one(notification.model_dump())

        # 3. Create Listing if Approved
        if update_data.status == StatusEnum.APPROVED:
            # Check if already exists to avoid duplicates
            existing_listing = await db.listings.find_one({
                "seller_email": updated_submission['email'],
                "title": updated_submission['website_title']
            })
            
            if not existing_listing:
                # Create new listing from submission data
                new_listing = Listing(
                    title=updated_submission['website_title'],
                    price_usd=updated_submission['price'],
                    price_inr=updated_submission['price'] * 83, # Approximate conversion
                    description=updated_submission['description'],
                    category=updated_submission['category'],
                    features=updated_submission.get('features', []),
                    tech_stack=updated_submission.get('tech_stack', []),
                    demo_url=updated_submission['demo_url'],
                    images=updated_submission.get('images') if updated_submission.get('images') else ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60"], # Default placeholder
                    status=StatusEnum.ACTIVE,
                    seller_email=updated_submission['email'],
                    seller_name=updated_submission['full_name'],
                    is_verified=True,
                    
                    # Copy Auction Fields
                    listing_type=updated_submission.get('listing_type', 'fixed'),
                    auction_end_time=updated_submission.get('auction_end_time'),
                    starting_bid=updated_submission.get('starting_bid'),
                    current_bid=updated_submission.get('starting_bid') if updated_submission.get('listing_type') == 'auction' else None
                )
                
                doc = new_listing.model_dump()
                doc['created_at'] = doc['created_at'].isoformat()
                if doc.get('auction_end_time'):
                     # Ensure it's stored as ISO string if it's a datetime
                     if isinstance(doc['auction_end_time'], datetime):
                        doc['auction_end_time'] = doc['auction_end_time'].isoformat()

                await db.listings.insert_one(doc)
                logger.info(f"Auto-created listing for approved submission: {updated_submission['id']}")

    return updated_submission

# --- Reviews ---

@router.post("/reviews", response_model=Review)
async def create_review(review_data: ReviewCreate, current_user: User = Depends(get_current_user)):
    # Verify listing exists
    listing = await db.listings.find_one({"id": review_data.listing_id})
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
        
    # Check if user has already reviewed this listing
    existing_review = await db.reviews.find_one({
        "listing_id": review_data.listing_id,
        "reviewer_email": current_user.email
    })
    
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already reviewed this listing")
    
    review = Review(
        listing_id=review_data.listing_id,
        reviewer_email=current_user.email,
        reviewer_name=current_user.name,
        rating=review_data.rating,
        comment=review_data.comment
    )
    
    doc = review.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.reviews.insert_one(doc)
    return review

@router.get("/listings/{listing_id}/reviews", response_model=List[Review])
async def get_listing_reviews(listing_id: str):
    reviews = await db.reviews.find({"listing_id": listing_id}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for review in reviews:
        if isinstance(review.get('created_at'), str):
            review['created_at'] = datetime.fromisoformat(review['created_at'])
            
    return reviews

# --- Proposal Actions (Acceptance & Messaging) ---

@router.post("/proposals/{proposal_id}/accept")
async def accept_proposal(proposal_id: str, current_user: User = Depends(get_current_user)):
    # 1. Verify Proposal exists
    proposal = await db.proposals.find_one({"id": proposal_id})
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
        
    # 2. Verify User owns the project
    project = await db.project_requests.find_one({"id": proposal['project_id']})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    if project['client_email'] != current_user.email:
        raise HTTPException(status_code=403, detail="Not authorized to accept this proposal")
        
    # 3. Update Statuses
    # - Proposal -> accepted
    await db.proposals.update_one(
        {"id": proposal_id},
        {"$set": {"status": "accepted"}}
    )
    
    # - Project -> assigned
    await db.project_requests.update_one(
        {"id": project['id']},
        {"$set": {"status": "assigned"}}
    )
    
    # - Other proposals for this project -> rejected (Optional, for now just leave pending or mark rejected)
    await db.proposals.update_many(
        {"project_id": project['id'], "id": {"$ne": proposal_id}},
        {"$set": {"status": "rejected"}}
    )
    
    return {"message": "Proposal accepted successfully"}

from backend_models_order_review import Message, MessageCreate

@router.get("/proposals/{proposal_id}/messages", response_model=List[Message])
async def get_messages(proposal_id: str, current_user: User = Depends(get_current_user)):
    # Verify access (must be client or provider)
    proposal = await db.proposals.find_one({"id": proposal_id})
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
        
    project = await db.project_requests.find_one({"id": proposal['project_id']})
    
    if current_user.email not in [proposal['provider_email'], project['client_email']]:
        raise HTTPException(status_code=403, detail="Not authorized to view messages")
        
    messages = await db.messages.find({"proposal_id": proposal_id}, {"_id": 0}).sort("created_at", 1).to_list(1000)
    
    for msg in messages:
         if isinstance(msg.get('created_at'), str):
            msg['created_at'] = datetime.fromisoformat(msg['created_at'])
            
    return messages

@router.post("/messages", response_model=Message)
async def send_message(message_data: MessageCreate, current_user: User = Depends(get_current_user)):
    # Verify access
    proposal = await db.proposals.find_one({"id": message_data.proposal_id})
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
        
    project = await db.project_requests.find_one({"id": proposal['project_id']})
    
    if current_user.email not in [proposal['provider_email'], project['client_email']]:
        raise HTTPException(status_code=403, detail="Not authorized to send messages")

    message = Message(
        proposal_id=message_data.proposal_id,
        sender_email=current_user.email,
        sender_name=current_user.name,
        content=message_data.content
    )
    
    doc = message.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.messages.insert_one(doc)
    return message

# --- Auction Bidding ---

from backend_models_order_review import Bid, BidCreate

@router.post("/listings/{listing_id}/bid", response_model=Bid)
async def place_bid(bid_data: BidCreate, current_user: User = Depends(get_current_user)):
    # 1. Verify Listing
    listing = await db.listings.find_one({"id": bid_data.listing_id})
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
        
    if listing.get('listing_type') != 'auction':
        raise HTTPException(status_code=400, detail="This listing is not an auction")
        
    # 2. Verify Time
    if listing.get('auction_end_time'):
        end_time = listing['auction_end_time'].replace(tzinfo=timezone.utc)
        if datetime.now(timezone.utc) > end_time:
            raise HTTPException(status_code=400, detail="Auction has ended")
            
    # 3. Verify Bid Amount
    current_highest = listing.get('current_bid') or listing.get('starting_bid') or 0
    if bid_data.amount <= current_highest:
        raise HTTPException(status_code=400, detail=f"Bid must be higher than ${current_highest}")
        
    # 4. Record Bid
    bid = Bid(
        listing_id=bid_data.listing_id,
        bidder_email=current_user.email,
        bidder_name=current_user.name,
        amount=bid_data.amount
    )
    
    doc = bid.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.bids.insert_one(doc)
    
    # 5. Update Listing
    await db.listings.update_one(
        {"id": bid_data.listing_id},
        {"$set": {
            "current_bid": bid_data.amount,
            "highest_bidder_email": current_user.email,
            "bid_count": (listing.get('bid_count') or 0) + 1
        }}
    )
    
    
    return bid

from backend_models_order_review import ListingUpdate

@router.put("/listings/{listing_id}", response_model=Listing)
async def update_listing(listing_id: str, update_data: ListingUpdate, current_user: User = Depends(get_current_user)):
    # 1. Verify Listing exists
    listing = await db.listings.find_one({"id": listing_id}, {"_id": 0})
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
        
    # 2. Verify Ownership
    if listing['seller_email'] != current_user.email:
         raise HTTPException(status_code=403, detail="Not authorized to edit this listing")

    # 3. Prepare Update Dict
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    if not update_dict:
        return listing

    # Handle special fields
    if 'price_usd' in update_dict:
        update_dict['price_inr'] = update_dict['price_usd'] * 83
        
    if 'auction_end_time' in update_dict and update_dict['auction_end_time']:
         # Ensure it's stored as ISO string if needed, currently incoming is str
         pass

    # 4. Update Database
    await db.listings.update_one(
        {"id": listing_id},
        {"$set": update_dict}
    )
    
    updated_listing = await db.listings.find_one({"id": listing_id}, {"_id": 0})
    
    # Fix dates for response model
    if isinstance(updated_listing.get('created_at'), str):
        updated_listing['created_at'] = datetime.fromisoformat(updated_listing['created_at'])
    if updated_listing.get('auction_end_time') and isinstance(updated_listing['auction_end_time'], str):
        updated_listing['auction_end_time'] = datetime.fromisoformat(updated_listing['auction_end_time'])
        
    return updated_listing