from dodopayments import DodoPayments
import os
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# Initialize Dodo Payments Client
DODO_API_KEY = os.environ.get("DODO_PAYMENTS_API_KEY", "YOUR_DODO_API_KEY")

client = DodoPayments(api_key=DODO_API_KEY) if DODO_API_KEY else None

def create_dodo_checkout_session(amount: int, currency: str, customer: dict, product_name: str, listing_ids: list) -> dict:
    """
    Create a Dodo Payments Checkout Session.
    Amount should be in the smallest currency unit (e.g., cents for USD, paise for INR).
    """
    if not client:
        logger.error("Dodo Payments client not initialized.")
        return None

    try:
        # Constructing the payment data
        # Note: Dodo Payments SDK might have specific requirements for currency/amount formatting
        # Based on typical SDK patterns:
        checkout_session = client.checkouts.create(
            amount=amount,
            currency=currency,
            customer=customer,
            product_name=product_name,
            metadata={
                "listing_ids": ",".join(listing_ids)
            },
            # Redirect URLs (should be configurable)
            success_url=os.environ.get("FRONTEND_URL", "http://localhost:3000") + "/purchases",
            cancel_url=os.environ.get("FRONTEND_URL", "http://localhost:3000") + "/checkout"
        )
        return {
            "checkout_url": checkout_session.checkout_url,
            "id": checkout_session.id
        }
    except Exception as e:
        logger.error(f"Error creating Dodo Payments checkout session: {e}")
        return None

def verify_dodo_payment(checkout_id: str) -> bool:
    """
    Verify a Dodo payment by retrieving the checkout session status.
    """
    if not client:
        return False
        
    try:
        checkout = client.checkouts.retrieve(checkout_id)
        if checkout.status == "succeeded":
            return True
        return False
    except Exception as e:
        logger.error(f"Error verifying Dodo payment: {e}")
        return False
