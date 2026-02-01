import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Zap, TrendingUp, ArrowRight, Code2, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useCurrency } from '@/hooks/useCurrency';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export const PremiumHomePage = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const { formatPrice } = useCurrency();

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
      {/* Hero Section - Apple/Stripe Inspired */}
      <section className="relative pt-20 pb-32 overflow-hidden" data-testid="hero-section">
        {/* Subtle gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-avocado-light/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-avocado-forest/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            {/* Badge */}
            <motion.div variants={fadeIn} className="mb-8">
              <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Curated AI Website Marketplace
              </div>
            </motion.div>

            {/* Main Heading - Linear/Stripe Style */}
            <motion.h1
              variants={fadeIn}
              className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600"
            >
              Launch in hours,
              <br />
              not weeks
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-normal"
            >
              Buy ready-to-launch AI websites from top creators. Complete source code, documentation, and deployment guides included.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/marketplace">
                <Button
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-base rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                  data-testid="browse-websites-button"
                >
                  <span className="relative z-10 flex items-center">
                    Browse Websites
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-avocado-dark to-avocado-forest opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
              <Link to="/sell">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-900 hover:bg-gray-50 px-8 py-6 text-base rounded-full transition-all duration-300"
                  data-testid="sell-website-button"
                >
                  Become a Seller
                </Button>
              </Link>
            </motion.div>

            {/* Trust Stats */}
            <motion.div
              variants={fadeIn}
              className="mt-20 flex items-center justify-center gap-12 text-sm text-gray-600"
            >
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-avocado-forest" />
                <span>100% Curated</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-avocado-forest" />
                <span>Instant Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-avocado-forest" />
                <span>Secure Payments</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Listings - Stripe-style Cards */}
      <section className="py-24 bg-white" data-testid="featured-listings-section">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Featured AI Websites
            </h2>
            <p className="text-xl text-gray-600">Handpicked by our team</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {featuredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                variants={fadeIn}
                data-testid={`featured-listing-${listing.id}`}
              >
                <Link to={`/listing/${listing.id}`}>
                  <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white rounded-3xl">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden bg-gray-100">
                      <motion.img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-block bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-xs font-semibold">
                          {listing.category}
                        </span>
                      </div>

                      {/* Verified Badge */}
                      {listing.is_verified && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-avocado-forest text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Verified
                          </div>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <h3 className="font-semibold text-xl mb-2 text-gray-900 group-hover:text-avocado-forest transition-colors line-clamp-1">
                        {listing.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {listing.description}
                      </p>

                      {/* Seller Info */}
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-avocado-dark to-avocado-forest flex items-center justify-center text-white text-xs font-semibold">
                          {listing.seller_name?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{listing.seller_name}</div>
                          <div className="text-xs text-gray-500">{listing.seller_products} products</div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Starting at</div>
                          <div className="text-2xl font-bold text-gray-900">
                            {formatPrice(listing.price_usd)}
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-avocado-forest group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/marketplace">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 text-gray-900 hover:bg-gray-50 rounded-full px-8 py-6 group"
                data-testid="view-all-listings"
              >
                View All Listings
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works - Minimal & Clean */}
      <section className="py-24 bg-gray-50" data-testid="how-it-works-section">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Simple & Fast
            </h2>
            <p className="text-xl text-gray-600">Get started in minutes</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              { number: '01', title: 'Browse', desc: 'Explore curated AI websites', icon: Code2 },
              { number: '02', title: 'Purchase', desc: 'Secure instant checkout', icon: Zap },
              { number: '03', title: 'Download', desc: 'Get complete source code', icon: ShieldCheck },
              { number: '04', title: 'Launch', desc: 'Deploy and start earning', icon: TrendingUp }
            ].map((step) => (
              <motion.div
                key={step.number}
                variants={fadeIn}
                className="text-center"
                data-testid={`step-card-${step.number}`}
              >
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gray-900 text-white flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <div className="text-sm font-mono text-gray-400">{step.number}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Section - Webflow Style */}
      <section className="py-24 bg-white" data-testid="trust-section">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Built for Trust
            </h2>
            <p className="text-xl text-gray-600">Every detail matters</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              {
                icon: ShieldCheck,
                title: 'Curated Quality',
                desc: 'Every website manually reviewed by our team'
              },
              {
                icon: Zap,
                title: 'Instant Access',
                desc: 'Download immediately after purchase'
              },
              {
                icon: Star,
                title: 'Verified Sellers',
                desc: 'Work with trusted creators only'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="text-center"
                data-testid={`trust-item-${index + 1}`}
              >
                <div className="w-16 h-16 rounded-2xl bg-avocado-mint flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-avocado-forest" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Notion Style */}
      <section className="py-32 bg-gray-900 text-white" data-testid="cta-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Ready to sell your AI website?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join hundreds of creators monetizing their projects on Avocado
          </p>
          <Link to="/sell">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 px-10 py-7 text-lg rounded-full shadow-2xl hover:shadow-white/20 transition-all duration-300 group"
              data-testid="submit-website-button"
            >
              Start Selling
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};
