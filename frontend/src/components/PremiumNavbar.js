import { Link, useLocation } from 'react-router-dom';
import { Menu, X, DollarSign, IndianRupee } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/hooks/useCurrency';
import { AvocadoLogoMark } from '@/components/AvocadoLogo';
import { motion, useScroll } from 'framer-motion';

export const PremiumNavbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const isActive = (path) => location.pathname === path;

  const toggleCurrency = () => {
    setCurrency(currency === 'USD' ? 'INR' : 'USD');
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-2xl shadow-sm border-b border-gray-200/50'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <AvocadoLogoMark className="w-9 h-9 group-hover:scale-105 transition-transform duration-300" />
            <span className="text-xl font-semibold tracking-tight text-gray-900">Avocado</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`px-4 py-2 text-[15px] font-medium rounded-xl transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              data-testid="nav-home"
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className={`px-4 py-2 text-[15px] font-medium rounded-xl transition-all duration-200 ${
                isActive('/marketplace') 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              data-testid="nav-marketplace"
            >
              Marketplace
            </Link>
            <Link
              to="/sell"
              className={`px-4 py-2 text-[15px] font-medium rounded-xl transition-all duration-200 ${
                isActive('/sell') 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              data-testid="nav-sell"
            >
              Sell
            </Link>

            <div className="w-px h-5 bg-gray-200 mx-3" />

            <button
              onClick={toggleCurrency}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
              data-testid="currency-toggle"
            >
              {currency === 'USD' ? (
                <>
                  <DollarSign className="w-4 h-4 text-gray-700" />
                  <span className="text-[13px] font-medium text-gray-700">USD</span>
                </>
              ) : (
                <>
                  <IndianRupee className="w-4 h-4 text-gray-700" />
                  <span className="text-[13px] font-medium text-gray-700">INR</span>
                </>
              )}
            </button>

            <Link to="/admin" data-testid="nav-admin">
              <Button
                variant="outline"
                size="sm"
                className="ml-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl font-medium"
              >
                Admin
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white/95 backdrop-blur-2xl border-t border-gray-200/50"
          data-testid="mobile-menu"
        >
          <div className="px-6 py-4 space-y-1">
            <Link
              to="/"
              className="block px-4 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className="block px-4 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              to="/sell"
              className="block px-4 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sell
            </Link>
            <button
              onClick={toggleCurrency}
              className="w-full flex items-center justify-between px-4 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <span>Currency</span>
              <span className="text-gray-900">{currency === 'USD' ? '$ USD' : '₹ INR'}</span>
            </button>
            <Link
              to="/admin"
              className="block px-4 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};
