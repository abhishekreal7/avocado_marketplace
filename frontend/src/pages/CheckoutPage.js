import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const CheckoutPage = () => {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);
  
  const listingId = params.id;

  useEffect(() => {
    const userLocale = navigator.language || navigator.userLanguage;
    if (userLocale && userLocale.toLowerCase().includes('in')) {
      setCurrency('INR');
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}/listings/${listingId}`);
        setListing(response.data);
      } catch (error) {
        console.error('Error fetching listing:', error);
      } finally {
        setLoading(false);
      }
    };

    if (listingId) {
      fetchData();
    }
  }, [listingId]);

  const getFormattedPrice = () => {
    if (!listing) return '';
    if (currency === 'INR') {
      return `₹${listing.price_inr.toLocaleString()}`;
    }
    return `$${listing.price_usd}`;
  };

  const calculateCommission = () => {
    if (!listing) return { seller: 0, platform: 0 };
    const price = currency === 'INR' ? listing.price_inr : listing.price_usd;
    return {
      seller: (price * 0.85).toFixed(2),
      platform: (price * 0.15).toFixed(2),
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Listing not found</p>
          <Link to="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  const commission = calculateCommission();
  const imageList = listing.images || [];
  const firstImage = imageList.length > 0 ? imageList[0] : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to={`/listing/${listingId}`}>
          <Button variant="ghost" className="mb-6" data-testid="back-to-listing">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Listing
          </Button>
        </Link>

        <h1 className="text-3xl font-bold gradient-text mb-8" data-testid="checkout-title">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="flex gap-4">
                  {firstImage && (
                    <img
                      src={firstImage}
                      alt={listing.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg" data-testid="checkout-listing-title">{listing.title}</h3>
                    <p className="text-gray-600 text-sm">{listing.category}</p>
                    <p className="text-avocado-dark font-bold text-xl mt-2" data-testid="checkout-price">
                      {getFormattedPrice()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Payment Information</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Secure Payment Processing</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Payments are processed securely. After purchase, you receive download access via email.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 text-center" data-testid="payment-placeholder">
                  <p className="text-gray-600 mb-4">
                    Payment integration will be available soon.
                  </p>
                  <p className="text-sm text-gray-500">
                    Stripe/Razorpay payment gateway integration placeholder
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4">What You'll Get</h2>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Full source code access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Complete documentation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Deployment guides</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Lifetime updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Commercial license</span>
                  </li>
                </ul>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{getFormattedPrice()}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600 text-sm">Seller receives</span>
                    <span className="text-sm text-green-600">
                      {currency === 'INR' ? '₹' : '$'}{commission.seller}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-4">
                    <span>Total</span>
                    <span className="text-avocado-dark">{getFormattedPrice()}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full mt-6 bg-avocado-dark hover:bg-avocado-forest text-avocado-light"
                  disabled
                  data-testid="complete-purchase-button"
                >
                  Complete Purchase (Coming Soon)
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By purchasing, you agree to our terms of service
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
