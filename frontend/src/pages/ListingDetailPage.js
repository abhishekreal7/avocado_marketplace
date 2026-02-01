import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, CheckCircle, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PurchaseModal } from '@/components/PurchaseModal';
import axios from 'axios';
import { useCurrency } from '@/hooks/useCurrency';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ListingDetailPage = () => {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const { formatPrice } = useCurrency();
  
  const listingId = params.id;

  useEffect(() => {
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

  const imageList = listing.images || [];
  const featureList = listing.features || [];
  const techList = listing.tech_stack || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/marketplace">
          <Button variant="ghost" className="mb-6" data-testid="back-button">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden mb-6">
              <div className="relative h-96 bg-gray-200">
                {imageList.length > 0 && (
                  <img
                    src={imageList[currentImageIndex]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    data-testid="listing-image"
                  />
                )}
              </div>
              {imageList.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {imageList.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-avocado-dark' : 'border-gray-200'
                      }`}
                      data-testid={`thumbnail-${index}`}
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed" data-testid="listing-description">{listing.description}</p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {featureList.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2" data-testid={`feature-${index}`}>
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {techList.map((tech, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-avocado-light/30 text-avocado-dark px-3 py-1"
                      data-testid={`tech-${index}`}
                    >
                      <Code className="w-3 h-3 mr-1" />
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <div className="mb-4">
                  <Badge className="bg-avocado-light/30 text-avocado-dark" data-testid="listing-category">
                    {listing.category}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold mb-4" data-testid="listing-title">{listing.title}</h1>
                <div className="text-4xl font-bold text-avocado-dark mb-6" data-testid="listing-price">
                  {getFormattedPrice()}
                </div>

                <div className="space-y-3 mb-6">
                  <Button
                    size="lg"
                    className="w-full bg-avocado-dark hover:bg-avocado-forest text-avocado-light"
                    onClick={() => navigate(`/checkout/${listing.id}`)}
                    data-testid="buy-now-button"
                  >
                    Buy Now
                  </Button>
                  <a
                    href={listing.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-2 border-avocado-dark text-avocado-dark hover:bg-avocado-mint"
                      data-testid="live-demo-button"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </Button>
                  </a>
                </div>

                <div className="bg-avocado-mint/30 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 text-avocado-dark">What You'll Receive:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Full source code</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Setup documentation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Deployment instructions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Lifetime access to updates</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
