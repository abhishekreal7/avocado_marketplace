import { Link, useLocation } from 'react-router-dom';
import { Menu, X, DollarSign, IndianRupee } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/hooks/useCurrency';
import { AvocadoLogoMark } from '@/components/AvocadoLogo';

export const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();

  const isActive = (path) => location.pathname === path;

  const toggleCurrency = () => {
    setCurrency(currency === 'USD' ? 'INR' : 'USD');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <AvocadoLogoMark className="w-10 h-10 group-hover:scale-105 transition-transform duration-300" />
            <span className="text-2xl font-semibold tracking-tight text-avocado-dark">Avocado</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 text-[15px] font-medium rounded-lg transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-avocado-mint/50 text-avocado-dark' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              data-testid="nav-home"
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className={`px-4 py-2 text-[15px] font-medium rounded-lg transition-all duration-200 ${
                isActive('/marketplace') 
                  ? 'bg-avocado-mint/50 text-avocado-dark' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              data-testid="nav-marketplace"
            >
              Marketplace
            </Link>
            <Link
              to="/sell"
              className={`px-4 py-2 text-[15px] font-medium rounded-lg transition-all duration-200 ${
                isActive('/sell') 
                  ? 'bg-avocado-mint/50 text-avocado-dark' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              data-testid="nav-sell"
            >
              Sell
            </Link>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* iOS-style Currency Toggle */}
            <button
              onClick={toggleCurrency}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-avocado-dark/30 hover:bg-gray-50 transition-all duration-200"
              data-testid="currency-toggle"
            >
              {currency === 'USD' ? (
                <>
                  <DollarSign className="w-4 h-4 text-avocado-dark" />
                  <span className="text-[13px] font-medium text-gray-700">USD</span>
                </>
              ) : (
                <>
                  <IndianRupee className="w-4 h-4 text-avocado-dark" />
                  <span className="text-[13px] font-medium text-gray-700">INR</span>
                </>
              )}
            </button>

            <Link to="/admin" data-testid="nav-admin">
              <Button
                variant="outline"
                size="sm"
                className="ml-2 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 rounded-lg font-medium"
              >
                Admin
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/50" data-testid="mobile-menu">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/"
              className="block px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className="block px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              to="/sell"
              className="block px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sell
            </Link>
            <button
              onClick={toggleCurrency}
              className="w-full flex items-center justify-between px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span>Currency</span>
              <span className="text-avocado-dark">{currency === 'USD' ? '$ USD' : '₹ INR'}</span>
            </button>
            <Link
              to="/admin"
              className="block px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
