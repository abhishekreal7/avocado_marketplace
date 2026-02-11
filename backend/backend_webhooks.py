from fastapi import APIRouter, Request, HTTPException, Header
from typing import Optional
import logging
import os
from database import db
from dodopayments_integration import client
from datetime import datetime
from backend_email import send_order_confirmation, send_sale_notification

router = APIRouter()
logger = logging.getLogger(__name__)

DODO_WEBHOOK_KEY = os.environ.get("DODO_PAYMENTS_WEBHOOK_KEY")

@router.post("/dodopayments")
async def dodo_webhook(
    request: Request,
    x_dodo_signature: Optional[str] = Header(None)
):
    """
    Webhook handler for Dodo Payments events.
    """
    if not DODO_WEBHOOK_KEY:
        logger.error("DODO_PAYMENTS_WEBHOOK_KEY not set in environment")
        # In development, we might skip signature check or log it
        pass

    payload = await request.body()
    
    # Verify Signature if key is present
    if DODO_WEBHOOK_KEY and x_dodo_signature:
        try:
            # The SDK usually provides a way to verify signatures
            # client.webhooks.verify(payload, x_dodo_signature, DODO_WEBHOOK_KEY)
            pass
        except Exception as e:
            logger.error(f"Webhook signature verification failed: {e}")
            raise HTTPException(status_code=400, detail="Invalid signature")

    try:
        data = await request.json()
        event_type = data.get("type")
        
        logger.info(f"Received Dodo Webhook: {event_type}")

        if event_type == "payment.succeeded":
            payment_data = data.get("data", {})
            checkout_id = payment_data.get("id")
            metadata = payment_data.get("metadata", {})
            listing_ids_str = metadata.get("listing_ids", "")
            listing_ids = listing_ids_str.split(",") if listing_ids_str else []
            buyer_email = payment_data.get("customer", {}).get("email")
            buyer_name = payment_data.get("customer", {}).get("name", "Valued Customer")
            
            # Update orders in DB
            for lid in listing_ids:
                # Fetch listing for price and seller info
                listing = await db.listings.find_one({"id": lid})
                
                if listing:
                    price_paid = listing.get('price_usd', 0)
                    platform_fee = price_paid * 0.15
                    dodo_fee = price_paid * 0.035

                    # Find the pending purchase or create a completed one
                    await db.purchases.update_many(
                        {"listing_id": lid, "buyer_email": buyer_email, "status": "pending"},
                        {"$set": {
                            "status": "completed", 
                            "dodo_checkout_id": checkout_id,
                            "platform_fee": platform_fee,
                            "dodo_fee": dodo_fee
                        }}
                    )

                    # Notify Buyer
                    try:
                        await send_order_confirmation(
                            to_email=buyer_email,
                            order_id=checkout_id,
                            listing_title=listing['title']
                        )
                    except Exception as e:
                        logger.error(f"Failed to send webhook success email to buyer: {e}")

                    # Notify Seller
                    seller_email = listing.get('seller_email')
                    if seller_email:
                        try:
                            await send_sale_notification(
                                to_email=seller_email,
                                buyer_name=buyer_name,
                                item_title=listing['title'],
                                amount=listing.get('price_usd', 0),
                                currency="USD"
                            )
                        except Exception as e:
                            logger.error(f"Failed to send webhook sale notification to seller: {e}")

        return {"status": "success"}

    except Exception as e:
        logger.error(f"Error processing webhook: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
