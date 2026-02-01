import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Zap, TrendingUp, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const HomePage = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const userLocale = navigator.language || navigator.userLanguage;
    if (userLocale.toLowerCase().includes('in')) {
      setCurrency('INR');
    }

    const fetchFeaturedListings = async () => {
      try {
        const response = await axios.get(`${API}/listings`);
        setFeaturedListings(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured listings:', error);
      }
    };

    fetchFeaturedListings();
  }, []);

  const formatPrice = (listing) => {
    if (currency === 'INR') {
      return `₹${listing.price_inr.toLocaleString()}`;
    }
    return `$${listing.price_usd}`;
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-avocado-mint via-white to-avocado-mint/30 py-20 md:py-32" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-avocado-dark/10 text-avocado-dark px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Curated AI Website Marketplace
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text mb-6">
              Buy Ready-to-Launch AI Websites
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover complete AI-powered SaaS websites built by creators. Launch your online business in hours, not weeks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/marketplace">
                <Button
                  size="lg"
                  className="bg-avocado-dark hover:bg-avocado-forest text-avocado-light w-full sm:w-auto"
                  data-testid="browse-websites-button"
                >
                  Browse Websites
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/sell">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-avocado-dark text-avocado-dark hover:bg-avocado-mint w-full sm:w-auto"
                  data-testid="sell-website-button"
                >
                  Sell Your Website
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="how-it-works-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center gradient-text mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="hover-lift border-2 border-avocado-mint" data-testid="step-card-1">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-avocado-light text-avocado-dark flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold text-lg mb-2">Browse AI Websites</h3>
                <p className="text-gray-600 text-sm">
                  Explore our curated collection of ready-to-launch AI-powered websites
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-2 border-avocado-mint" data-testid="step-card-2">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-avocado-light text-avocado-dark flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold text-lg mb-2">Purchase Instantly</h3>
                <p className="text-gray-600 text-sm">
                  Secure checkout with instant access to complete source code
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-2 border-avocado-mint" data-testid="step-card-3">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-avocado-light text-avocado-dark flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold text-lg mb-2">Download & Deploy</h3>
                <p className="text-gray-600 text-sm">
                  Get full source code, documentation, and deployment guides
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-2 border-avocado-mint" data-testid="step-card-4">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-avocado-light text-avocado-dark flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-semibold text-lg mb-2">Launch & Grow</h3>
                <p className="text-gray-600 text-sm">
                  Deploy your website and start generating revenue immediately
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-avocado-mint/20" data-testid="trust-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center gradient-text mb-12">
            Why Choose Avocado?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center" data-testid="trust-item-1">
              <div className="w-16 h-16 rounded-full bg-avocado-dark flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-avocado-light" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Curated Quality</h3>
              <p className="text-gray-600 text-sm">
                Every website is manually reviewed before listing
              </p>
            </div>

            <div className="flex flex-col items-center text-center" data-testid="trust-item-2">
              <div className="w-16 h-16 rounded-full bg-avocado-dark flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-avocado-light" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Instant Delivery</h3>
              <p className="text-gray-600 text-sm">
                Get immediate access after purchase
              </p>
            </div>

            <div className="flex flex-col items-center text-center" data-testid="trust-item-3">
              <div className="w-16 h-16 rounded-full bg-avocado-dark flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-avocado-light" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
              <p className="text-gray-600 text-sm">
                Protected transactions with buyer guarantee
              </p>
            </div>

            <div className="flex flex-col items-center text-center" data-testid="trust-item-4">
              <div className="w-16 h-16 rounded-full bg-avocado-dark flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-avocado-light" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Built for Entrepreneurs</h3>
              <p className="text-gray-600 text-sm">
                Complete solutions ready to monetize
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="featured-listings-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-4">
              Featured Listings
            </h2>
            <p className="text-gray-600">Handpicked AI-powered websites ready to launch</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredListings.map((listing) => (
              <Card key={listing.id} className="hover-lift overflow-hidden" data-testid={`featured-listing-${listing.id}`}>
                <div className="h-48 overflow-hidden">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="inline-block bg-avocado-light/30 text-avocado-dark px-3 py-1 rounded-full text-xs font-medium mb-3">
                    {listing.category}
                  </div>
                  <h3 className="font-bold text-xl mb-2">{listing.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {listing.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-avocado-dark">
                      {formatPrice(listing)}
                    </span>
                    <Link to={`/listing/${listing.id}`}>
                      <Button
                        size="sm"
                        className="bg-avocado-dark hover:bg-avocado-forest text-avocado-light"
                        data-testid={`view-details-${listing.id}`}
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/marketplace">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-avocado-dark text-avocado-dark hover:bg-avocado-mint"
                data-testid="view-all-listings"
              >
                View All Listings
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-avocado-dark to-avocado-forest text-white" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Have an AI Website to Sell?
          </h2>
          <p className="text-avocado-light text-lg mb-8">
            Join our marketplace and monetize your AI projects. Reach thousands of potential buyers.
          </p>
          <Link to="/sell">
            <Button
              size="lg"
              className="bg-avocado-light text-avocado-dark hover:bg-avocado-light/90"
              data-testid="submit-website-button"
            >
              Submit Your Website
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
