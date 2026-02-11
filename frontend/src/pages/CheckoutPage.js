import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Star, ShieldCheck, Lock, Info, Globe, Server, Key, Paperclip, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SellerCard = ({ sellerName }) => (
  <Card className="mb-6 border-avocado-200 bg-avocado-50/30">
    <CardContent className="p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-avocado-100 flex items-center justify-center text-avocado-700 font-bold text-xl border-2 border-white shadow-sm">
        {sellerName?.[0] || 'A'}
      </div>
      <div>
        <h3 className="font-bold text-gray-900">{sellerName || 'Avocado Sellers'}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="flex items-center gap-1 font-medium text-gray-900">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            4.9
          </span>
          <span className="text-gray-400">•</span>
          <span>(Trust Score)</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ProductDetailsModal = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{item.title}</h2>
              <p className="text-gray-500 text-sm mt-1">{item.category} • Sold by {item.seller_name}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Description */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
            </div>

            {/* Inclusions Grid */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">What's Included</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Standard Inclusion */}
                <div className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                  <div className="p-2 bg-green-50 rounded-md text-green-600">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Source Code</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Full access to modify and deploy.</p>
                  </div>
                </div>

                {/* Hosting */}
                {item.includes_hosting && (
                  <div className="flex items-start gap-3 p-3 border border-blue-100 bg-blue-50/30 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-md text-blue-600">
                      <Server className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900 text-sm">Web Hosting</h4>
                      <p className="text-xs text-blue-700 mt-0.5">{item.hosting_details || "Free tier hosting included."}</p>
                    </div>
                  </div>
                )}

                {/* Domain */}
                {item.includes_domain && (
                  <div className="flex items-start gap-3 p-3 border border-purple-100 bg-purple-50/30 rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-md text-purple-600">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-900 text-sm">Custom Domain</h4>
                      <p className="text-xs text-purple-700 mt-0.5">{item.domain_details || "One year free domain registration."}</p>
                    </div>
                  </div>
                )}

                {/* API Access */}
                {item.includes_api_access && (
                  <div className="flex items-start gap-3 p-3 border border-orange-100 bg-orange-50/30 rounded-lg">
                    <div className="p-2 bg-orange-100 rounded-md text-orange-600">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-900 text-sm">API Access</h4>
                      <p className="text-xs text-orange-700 mt-0.5">{item.api_access_details || "API keys included for integration."}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Attachments */}
            {item.attachments && item.attachments.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Paperclip className="w-4 h-4" /> Attachments
                </h3>
                <ul className="space-y-2">
                  {item.attachments.map((att, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-blue-600 hover:underline cursor-pointer">
                      <Paperclip className="w-3 h-3" />
                      {att.split('/').pop() || `Attachment ${idx + 1}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack */}
            {item.tech_stack && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tech_stack.map((tech, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md border border-gray-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          <div className="mt-8 flex justify-end">
            <Button onClick={onClose} variant="outline">Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CheckoutPage = () => {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const params = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null); // For modal

  const isSingleItem = !!params.id;
  const listingId = params.id;

  useEffect(() => {
    const userLocale = navigator.language || navigator.userLanguage;
    if (userLocale && userLocale.toLowerCase().includes('in')) {
      setCurrency('INR');
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        if (isSingleItem) {
          // Single Item Mode
          const response = await axios.get(`${API}/listings/${listingId}`);
          setItems([response.data]);
        } else {
          // Cart Mode
          if (cart.length === 0) {
            navigate('/checkout/cart'); // Redirect if empty
            return;
          }
          setItems(cart);
        }
      } catch (error) {
        console.error('Error fetching checkout data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [listingId, isSingleItem, cart, navigate]);

  const getFormattedPrice = (amount) => {
    if (amount === undefined || amount === null) return '';
    if (currency === 'INR') {
      return `₹${amount.toLocaleString()}`;
    }
    return `$${amount.toFixed(2)}`;
  };

  const calculateSubtotal = () => {
    let subtotal = 0;
    items.forEach(item => {
      subtotal += (currency === 'INR' ? (item.price_inr || item.price_usd * 83) : item.price_usd);
    });
    return subtotal;
  };

  const subtotal = calculateSubtotal();
  const totalAmount = subtotal;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading checkout...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return null; // Handle redirect case
  }

  const handlePayment = async () => {
    if (!user) {
      alert("Please login to continue");
      return;
    }

    setLoading(true);
    try {
      let order;

      if (isSingleItem) {
        const orderUrl = `${API}/create-payment-order`;
        const response = await axios.post(orderUrl, {
          listing_id: items[0].id,
          currency: currency
        });
        order = response.data;
      } else {
        // Cart Checkout Endpoint
        const orderUrl = `${API}/create-cart-payment-order`;
        const response = await axios.post(orderUrl, {
          listing_ids: items.map(i => i.id),
          currency: currency
        });
        order = response.data;
      }

      // Open Dodo Payments
      if (order.checkout_url) {
        window.location.href = order.checkout_url;
      } else {
        throw new Error("No checkout URL received from Dodo Payments");
      }

    } catch (error) {
      console.error("Payment initiation failed", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <Link to={isSingleItem ? `/listing/${items[0]?.id}` : '/checkout/cart'}>
          <Button variant="ghost" className="mb-6" data-testid="back-button">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {isSingleItem ? 'Listing' : 'Cart'}
          </Button>
        </Link>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-500 mt-1">Complete your purchase to get instant access.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content: Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Seller Info */}
            {(() => {
              const uniqueSellers = [...new Set(items.map(i => i.seller_name || 'Avocado Creator'))];
              const displaySellerName = uniqueSellers.length === 1 ? uniqueSellers[0] : "Multiple Sellers";
              return <SellerCard sellerName={displaySellerName} />;
            })()}

            {/* 2. Order Summary */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-4 border-b border-gray-100 last:border-0 pb-4 last:pb-0 items-start">
                      <img
                        src={item.images?.[0] || 'https://via.placeholder.com/80'}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                        <p className="text-gray-500 text-xs">{item.category}</p>
                        <p className="text-xs text-avocado-600 font-medium mt-0.5">Sold by: {item.seller_name || 'Avocado Creator'}</p>

                        {/* View Details Button */}
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-1 flex items-center gap-1 transition-colors"
                        >
                          <Info className="w-3 h-3" /> View Inclusions & Details
                        </button>

                        <p className="text-avocado-dark font-bold text-sm mt-1">
                          {getFormattedPrice(currency === 'INR' ? (item.price_inr || item.price_usd * 83) : item.price_usd)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 mt-6 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({items.length} items)</span>
                    <span className="font-medium text-gray-900">{getFormattedPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="font-medium text-gray-900">{getFormattedPrice(0)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-100 pt-2 mt-2">
                    <span>Total Due</span>
                    <span className="text-avocado-dark">{getFormattedPrice(totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. Payment Section */}
            <Card className="border-avocado-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-50 rounded-lg text-green-600">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
                    <p className="text-xs text-gray-500">Secured by Dodo Payments</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900">Dodo Payments</span>
                    </div>
                    <span className="text-sm text-gray-500">Cards, UPI, Netbanking</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full h-12 text-base bg-avocado-dark hover:bg-avocado-forest text-white shadow-lg shadow-avocado-dark/20 transition-all hover:-translate-y-0.5"
                  onClick={handlePayment}
                  disabled={loading}
                  data-testid="complete-purchase-button"
                >
                  {loading ? 'Processing...' : `Pay ${getFormattedPrice(totalAmount)}`}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                  <ShieldCheck className="w-3 h-3" />
                  <span>256-bit SSL Encrypted Payment</span>
                </div>
              </CardContent>
            </Card>

            {/* 4. Footer Text */}
            <p className="text-xs text-gray-400 text-center">
              By clicking "Complete Purchase", you agree to our <a href="/terms" className="underline hover:text-gray-600" target="_blank">Terms of Service</a>.
            </p>

          </div>

          {/* Sidebar: Right Column */}
          <div className="lg:col-span-1">
            <Card className="sticky top-28 border-none shadow-none bg-transparent">
              <CardContent className="p-0">
                <h3 className="font-bold text-gray-900 mb-4 px-2">What's Included</h3>
                <ul className="space-y-4">
                  {[
                    "Full source code access",
                    "Complete documentation",
                    "Deployment guides",
                    "Lifetime updates",
                    "Commercial license"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <CheckCircle className="w-5 h-5 text-avocado-dark flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* 5. Simple Trust Statement */}
                <div className="mt-8 bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                  <p className="text-sm text-blue-800 leading-relaxed">
                    <strong>Instant Delivery:</strong> You'll receive download access via email immediately after purchase. Need help? You can contact the seller directly from your dashboard.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      <ProductDetailsModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
};
