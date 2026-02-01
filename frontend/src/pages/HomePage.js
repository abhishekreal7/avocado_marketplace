import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Zap, TrendingUp, ExternalLink, ArrowRight, Rocket, Code2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const HomePage = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [currency, setCurrency] = useState('USD');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const userLocale = navigator.language || navigator.userLanguage;
    if (userLocale && userLocale.toLowerCase().includes('in')) {
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

    // Scroll animation handler
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatPrice = (listing) => {
    if (currency === 'INR') {
      return `₹${listing.price_inr.toLocaleString()}`;
    }
    return `$${listing.price_usd}`;
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with Parallax Effect */}
      <section 
        className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-avocado-mint via-white to-avocado-mint/30" 
        data-testid="hero-section"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute -top-40 -right-40 w-96 h-96 bg-avocado-light/20 rounded-full blur-3xl animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />
          <div 
            className="absolute top-1/3 -left-32 w-80 h-80 bg-avocado-forest/10 rounded-full blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.2}px)` }}
          />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-avocado-light/10 rounded-full blur-2xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge with Animation */}
            <div 
              className="inline-flex items-center gap-2 bg-white shadow-lg shadow-avocado-dark/10 text-avocado-dark px-5 py-2.5 rounded-full text-sm font-medium mb-8 animate-fade-in-down border border-avocado-light/30 hover:scale-105 transition-transform duration-300"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              Curated AI Website Marketplace
            </div>

            {/* Main Heading with Stagger Animation */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold gradient-text mb-6 animate-fade-in leading-tight">
              Buy Ready-to-Launch AI Websites
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
              Discover complete AI-powered SaaS websites built by creators. Launch your online business in 
              <span className="text-avocado-dark font-semibold"> hours, not weeks</span>.
            </p>

            {/* CTA Buttons with Enhanced Hover */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/marketplace">
                <Button
                  size="lg"
                  className="bg-avocado-dark hover:bg-avocado-forest text-avocado-light w-full sm:w-auto text-lg px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                  data-testid="browse-websites-button"
                >
                  Browse Websites
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/sell">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-avocado-dark text-avocado-dark hover:bg-avocado-mint w-full sm:w-auto text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  data-testid="sell-website-button"
                >
                  Sell Your Website
                </Button>
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-center">
                <div className="text-3xl font-bold text-avocado-dark mb-1">5+</div>
                <div className="text-sm text-gray-600">AI Websites</div>
              </div>
              <div className="text-center border-x border-gray-200">
                <div className="text-3xl font-bold text-avocado-dark mb-1">100%</div>
                <div className="text-sm text-gray-600">Curated Quality</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-avocado-dark mb-1">48h</div>
                <div className="text-sm text-gray-600">Review Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-avocado-dark rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-avocado-dark rounded-full" />
          </div>
        </div>
      </section>

      {/* How It Works Section with Cards Animation */}
      <section className="py-24 bg-white relative" data-testid="how-it-works-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg">Get started in four simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-avocado-light via-avocado-dark to-avocado-light opacity-20" />
            
            {[
              {
                number: 1,
                title: 'Browse AI Websites',
                description: 'Explore our curated collection of ready-to-launch AI-powered websites',
                icon: Code2,
                delay: '0s'
              },
              {
                number: 2,
                title: 'Purchase Instantly',
                description: 'Secure checkout with instant access to complete source code',
                icon: Zap,
                delay: '0.1s'
              },
              {
                number: 3,
                title: 'Download & Deploy',
                description: 'Get full source code, documentation, and deployment guides',
                icon: Rocket,
                delay: '0.2s'
              },
              {
                number: 4,
                title: 'Launch & Grow',
                description: 'Deploy your website and start generating revenue immediately',
                icon: TrendingUp,
                delay: '0.3s'
              }
            ].map((step) => (
              <Card 
                key={step.number}
                className="relative group hover-lift border-2 border-avocado-mint hover:border-avocado-dark bg-white hover:bg-gradient-to-br hover:from-white hover:to-avocado-mint/10 transition-all duration-500 animate-fade-in-up" 
                style={{ animationDelay: step.delay }}
                data-testid={`step-card-${step.number}`}
              >
                <CardContent className="p-8 text-center relative">
                  {/* Floating Number Badge */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-avocado-light to-avocado-dark flex items-center justify-center text-avocado-dark text-2xl font-bold shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 z-10">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-avocado-mint/30 flex items-center justify-center mx-auto mb-6 mt-6 group-hover:bg-avocado-light/40 transition-colors duration-300">
                    <step.icon className="w-8 h-8 text-avocado-dark" />
                  </div>
                  
                  <h3 className="font-bold text-xl mb-3 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section with Enhanced Cards */}
      <section className="py-24 bg-gradient-to-b from-white to-avocado-mint/10 relative overflow-hidden" data-testid="trust-section">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-avocado-light/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-avocado-forest/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
              Why Choose Avocado?
            </h2>
            <p className="text-gray-600 text-lg">Built with trust and quality in mind</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: 'Curated Quality',
                description: 'Every website is manually reviewed before listing',
                color: 'from-emerald-500 to-emerald-600'
              },
              {
                icon: Zap,
                title: 'Instant Delivery',
                description: 'Get immediate access after purchase',
                color: 'from-amber-500 to-amber-600'
              },
              {
                icon: ShieldCheck,
                title: 'Secure Payments',
                description: 'Protected transactions with buyer guarantee',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: TrendingUp,
                title: 'Built for Entrepreneurs',
                description: 'Complete solutions ready to monetize',
                color: 'from-purple-500 to-purple-600'
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="group text-center animate-fade-in-up hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`trust-item-${index + 1}`}
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 mx-auto shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 relative`}>
                  <item.icon className="w-10 h-10 text-white" />
                  <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings Section with Enhanced Cards */}
      <section className="py-24 bg-white relative" data-testid="featured-listings-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-avocado-light/20 text-avocado-dark px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4 fill-current" />
              Featured Listings
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
              Handpicked for You
            </h2>
            <p className="text-gray-600 text-lg">AI-powered websites ready to launch today</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredListings.map((listing, index) => (
              <Card 
                key={listing.id} 
                className="group overflow-hidden border-2 border-gray-100 hover:border-avocado-dark hover:shadow-2xl transition-all duration-500 bg-white animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`featured-listing-${listing.id}`}
              >
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Floating Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-white/95 backdrop-blur-sm text-avocado-dark px-4 py-2 rounded-full text-xs font-semibold shadow-lg">
                      {listing.category}
                    </span>
                  </div>

                  {/* Demo Link Button */}
                  <a
                    href={listing.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-avocado-light shadow-lg"
                  >
                    <ExternalLink className="w-5 h-5 text-avocado-dark" />
                  </a>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-avocado-dark transition-colors line-clamp-1">
                    {listing.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
                    {listing.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Starting at</div>
                      <span className="text-2xl font-bold text-avocado-dark">
                        {formatPrice(listing)}
                      </span>
                    </div>
                    <Link to={`/listing/${listing.id}`}>
                      <Button
                        size="sm"
                        className="bg-avocado-dark hover:bg-avocado-forest text-avocado-light rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                        data-testid={`view-details-${listing.id}`}
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
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
                className="border-2 border-avocado-dark text-avocado-dark hover:bg-avocado-mint rounded-xl px-8 py-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                data-testid="view-all-listings"
              >
                View All Listings
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section with Enhanced Design */}
      <section className="py-24 bg-gradient-to-br from-avocado-dark via-avocado-forest to-avocado-dark text-white relative overflow-hidden" data-testid="cta-section">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-avocado-light/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-avocado-light/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-avocado-light/20 backdrop-blur-sm mb-8 animate-bounce">
            <Rocket className="w-10 h-10 text-avocado-light" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Have an AI Website to Sell?
          </h2>
          <p className="text-avocado-light text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Join our marketplace and monetize your AI projects. Reach thousands of potential buyers.
          </p>
          
          <Link to="/sell">
            <Button
              size="lg"
              className="bg-avocado-light text-avocado-dark hover:bg-white text-lg px-10 py-7 rounded-xl shadow-2xl hover:shadow-avocado-light/50 hover:scale-105 transition-all duration-300 group font-semibold"
              data-testid="submit-website-button"
            >
              Submit Your Website
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <p className="text-avocado-light/80 text-sm mt-8">
            Join 100+ creators already selling on Avocado
          </p>
        </div>
      </section>
    </div>
  );
};
