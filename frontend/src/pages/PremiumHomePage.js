import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Zap, TrendingUp, ArrowRight, Code2, Star, Check, Users, Award, Clock, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FloatingAvocadoOrb } from '@/components/FloatingAvocadoOrb';
import axios from 'axios';
import { useCurrency } from '@/hooks/useCurrency';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.15 } },
  viewport: { once: true }
};

export const PremiumHomePage = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const { formatPrice } = useCurrency();
  const { scrollY, scrollYProgress } = useScroll();
  
  // Parallax effects with smooth spring physics
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const heroY = useSpring(useTransform(scrollY, [0, 500], [0, 150]), { stiffness: 100, damping: 30 });
  
  // Background gradient transitions
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Floating Brand Orb - Signature Element */}
      <FloatingAvocadoOrb />

      {/* Ambient gradient overlay that shifts with scroll */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: backgroundOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-avocado-mint/5 via-transparent to-avocado-forest/5" />
      </motion.div>

      {/* Hero Section with Enhanced Parallax */}
      <motion.section 
        className="relative pt-32 pb-40 overflow-hidden" 
        style={{ 
          opacity: heroOpacity, 
          scale: heroScale,
          y: heroY
        }}
        data-testid="hero-section"
      >
        {/* Animated background orbs */}
        <motion.div 
          className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-avocado-light/10 to-avocado-forest/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-avocado-forest/10 to-avocado-light/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Animated Badge */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                Curated AI Website Marketplace
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Launch in hours,
              <br />
              not weeks
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-normal"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Buy ready-to-launch AI websites from top creators. Complete source code, documentation, and deployment guides included.
            </motion.p>

            {/* CTA Buttons with Hover Effects */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Link to="/marketplace">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-base rounded-full shadow-2xl relative overflow-hidden group"
                    data-testid="browse-websites-button"
                  >
                    <span className="relative z-10 flex items-center">
                      Browse Websites
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </motion.div>
                    </span>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-avocado-dark to-avocado-forest"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/sell">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-gray-300 text-gray-900 hover:bg-gray-50 px-8 py-6 text-base rounded-full shadow-lg"
                    data-testid="sell-website-button"
                  >
                    Become a Seller
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Trust Stats */}
            <motion.div
              className="mt-20 flex items-center justify-center gap-12 text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {[
                { icon: Check, text: "100% Curated" },
                { icon: Check, text: "Instant Delivery" },
                { icon: Check, text: "Secure Payments" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + (i * 0.1), duration: 0.5 }}
                >
                  <item.icon className="w-5 h-5 text-avocado-forest" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2">
            <motion.div 
              className="w-1.5 h-3 bg-gray-600 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Social Proof Stats Section */}
      <motion.section 
        className="py-20 bg-gray-50 border-y border-gray-200 relative"
        {...fadeInUp}
      >
        {/* Gradient divider */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-avocado-forest/30 to-transparent" />
        
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
          >
            {[
              { number: "50+", label: "AI Websites", icon: Code2 },
              { number: "1000+", label: "Happy Buyers", icon: Users },
              { number: "4.9/5", label: "Avg Rating", icon: Star },
              { number: "24h", label: "Support", icon: Clock }
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center"
                variants={fadeInUp}
                whileHover={{ 
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mx-auto mb-4 shadow-sm relative overflow-hidden group"
                  whileHover={{ 
                    scale: 1.15, 
                    rotate: [0, -5, 5, 0],
                    boxShadow: "0 10px 30px rgba(15, 57, 43, 0.15)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Animated background on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-avocado-light/20 to-avocado-forest/20"
                    initial={{ opacity: 0, scale: 0 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <stat.icon className="w-8 h-8 text-avocado-forest relative z-10" />
                </motion.div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Listings with Advanced Animations */}
      <motion.section 
        className="py-32 bg-white relative overflow-hidden" 
        data-testid="featured-listings-section"
      >
        {/* Decorative gradient divider with glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-avocado-forest/30 to-transparent blur-sm" />
        </div>
        
        {/* Ambient light effect */}
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-avocado-light/5 to-transparent rounded-full blur-3xl pointer-events-none"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            {...fadeInUp}
          >
            <motion.div
              className="inline-block mb-4"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-avocado-mint px-4 py-2 rounded-full text-sm font-semibold text-avocado-dark">
                <Star className="w-4 h-4 fill-current" />
                Featured Collection
              </div>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-4">
              Premium AI Websites
            </h2>
            <p className="text-xl text-gray-600">Handpicked by our expert team</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
          >
            {featuredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                variants={fadeInUp}
                whileHover={{ 
                  y: -12,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                data-testid={`featured-listing-${listing.id}`}
              >
                <Link to={`/listing/${listing.id}`}>
                  <motion.div
                    whileHover={{
                      boxShadow: "0 25px 50px -12px rgba(15, 57, 43, 0.25)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white rounded-3xl relative">
                      {/* Hover glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-avocado-light/10 to-avocado-forest/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1 }}
                      />
                    {/* Image with Zoom Effect */}
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                      <motion.img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      {/* Floating Badges */}
                      <motion.div 
                        className="absolute top-4 left-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="inline-block bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                          {listing.category}
                        </span>
                      </motion.div>

                      {listing.is_verified && (
                        <motion.div 
                          className="absolute top-4 right-4"
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                        >
                          <div className="bg-avocado-forest text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                            <Check className="w-3 h-3" />
                            Verified
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <motion.h3 
                        className="font-semibold text-xl mb-2 text-gray-900 group-hover:text-avocado-forest transition-colors line-clamp-1"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        {listing.title}
                      </motion.h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {listing.description}
                      </p>

                      {/* Seller with Animation */}
                      <motion.div 
                        className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                      >
                        <motion.div 
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-avocado-dark to-avocado-forest flex items-center justify-center text-white text-xs font-semibold"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                        >
                          {listing.seller_name?.charAt(0) || 'A'}
                        </motion.div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{listing.seller_name}</div>
                          <div className="text-xs text-gray-500">{listing.seller_products} products</div>
                        </div>
                      </motion.div>

                      {/* Price with Hover Effect */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Starting at</div>
                          <motion.div 
                            className="text-2xl font-bold text-gray-900"
                            whileHover={{ scale: 1.05 }}
                          >
                            {formatPrice(listing.price_usd)}
                          </motion.div>
                        </div>
                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-avocado-forest transition-colors" />
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-16"
            {...fadeInUp}
          >
            <Link to="/marketplace">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-900 hover:bg-gray-50 rounded-full px-10 py-6 group shadow-lg"
                  data-testid="view-all-listings"
                >
                  View All Listings
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works - Enhanced */}
      <motion.section 
        className="py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden" 
        data-testid="how-it-works-section"
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-avocado-light/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-20"
            {...fadeInUp}
          >
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-4">
              Simple & Fast
            </h2>
            <p className="text-xl text-gray-600">Get started in minutes, not days</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8 relative"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
          >
            {/* Connection line */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-avocado-light via-avocado-forest to-avocado-light opacity-20" />

            {[
              { number: '01', title: 'Browse', desc: 'Explore curated AI websites', icon: Code2 },
              { number: '02', title: 'Purchase', desc: 'Secure instant checkout', icon: Zap },
              { number: '03', title: 'Download', desc: 'Get complete source code', icon: ShieldCheck },
              { number: '04', title: 'Launch', desc: 'Deploy and start earning', icon: TrendingUp }
            ].map((step, i) => (
              <motion.div
                key={step.number}
                className="text-center relative"
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                data-testid={`step-card-${step.number}`}
              >
                <motion.div 
                  className="mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white flex items-center justify-center mx-auto mb-4 shadow-xl relative overflow-hidden group">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-avocado-dark to-avocado-forest opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                    />
                    <step.icon className="w-9 h-9 relative z-10" />
                  </div>
                  <div className="text-sm font-mono text-gray-400">{step.number}</div>
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Trust Section with Depth */}
      <motion.section 
        className="py-32 bg-white relative" 
        data-testid="trust-section"
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            {...fadeInUp}
          >
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-4">
              Built for Trust
            </h2>
            <p className="text-xl text-gray-600">Every detail matters</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
          >
            {[
              {
                icon: ShieldCheck,
                title: 'Curated Quality',
                desc: 'Every website manually reviewed by our team',
                color: 'from-emerald-500 to-emerald-600'
              },
              {
                icon: Zap,
                title: 'Instant Access',
                desc: 'Download immediately after purchase',
                color: 'from-amber-500 to-amber-600'
              },
              {
                icon: Star,
                title: 'Verified Sellers',
                desc: 'Work with trusted creators only',
                color: 'from-purple-500 to-purple-600'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="text-center group"
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                data-testid={`trust-item-${i + 1}`}
              >
                <motion.div 
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-shadow`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <item.icon className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Project Marketplace Teaser */}
      <motion.section
        className="py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
        {...fadeInUp}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Briefcase className="w-4 h-4" />
              New: Custom Projects
            </div>
          </motion.div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Need a Custom Website?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Post your project requirements and get proposals from verified developers
          </p>
          <Link to="/post-project">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-7 rounded-full text-lg shadow-2xl">
                Post a Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </Link>
        </div>
      </motion.section>

      {/* CTA Section with Premium Animation */}
      <motion.section 
        className="py-40 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden" 
        data-testid="cta-section"
      >
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating shapes */}
        <motion.div 
          className="absolute top-20 left-20 w-32 h-32 bg-avocado-light/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-40 h-40 bg-avocado-forest/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
        />

        <motion.div
          className="max-w-4xl mx-auto px-6 text-center relative z-10"
          {...fadeInUp}
        >
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-avocado-light/20 backdrop-blur-sm mb-8"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Award className="w-12 h-12 text-avocado-light" />
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Ready to sell your AI website?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join hundreds of creators monetizing their projects on Avocado
          </p>
          <Link to="/sell">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-8 text-lg rounded-full shadow-2xl hover:shadow-white/20 transition-all group"
                data-testid="submit-website-button"
              >
                Start Selling Today
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
};
