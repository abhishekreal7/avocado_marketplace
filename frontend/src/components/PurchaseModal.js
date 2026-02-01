import { useState } from 'react';
import { X, Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { useCurrency } from '@/hooks/useCurrency';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const PurchaseModal = ({ listing, isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { currency, formatPrice } = useCurrency();

  const handlePurchase = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/purchases`, {
        buyer_email: email,
        listing_id: listing.id,
        currency: currency
      });

      setSuccess(true);
      toast.success('Purchase confirmed!');
      
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setEmail('');
      }, 3000);
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 z-10"
          data-testid="purchase-modal"
        >
          {!success ? (
            <>
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                data-testid="close-modal"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <div className="w-12 h-12 rounded-full bg-avocado-mint flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-avocado-forest" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Purchase</h2>
                <p className="text-gray-600">Enter your email to receive download access</p>
              </div>

              {/* Listing Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <img
                    src={listing.images?.[0]}
                    alt={listing.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{listing.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{listing.category}</p>
                    <p className="text-lg font-bold text-avocado-forest mt-2">
                      {formatPrice(listing.price_usd)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handlePurchase}>
                <div className="mb-6">
                  <Label htmlFor="buyer-email" className="text-sm font-medium text-gray-900 mb-2 block">
                    Email Address
                  </Label>
                  <Input
                    id="buyer-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="h-12"
                    data-testid="buyer-email-input"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Download link and setup instructions will be sent to this email
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl"
                  disabled={loading}
                  data-testid="confirm-purchase-button"
                >
                  {loading ? 'Processing...' : 'Confirm Purchase'}
                </Button>
              </form>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Instant delivery</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Secure payment</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Purchase Confirmed!</h3>
              <p className="text-gray-600 mb-4">
                Download link has been sent to:
              </p>
              <p className="text-lg font-semibold text-avocado-forest mb-6">{email}</p>
              <p className="text-sm text-gray-500">
                Check your inbox for complete source code, documentation, and setup instructions.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
