import { Link, useLocation } from 'react-router-dom';
import { Rocket, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-avocado-dark to-avocado-forest flex items-center justify-center group-hover:scale-110 transition-transform">
              <Rocket className="w-5 h-5 text-avocado-light" />
            </div>
            <span className="text-2xl font-bold gradient-text">Avocado</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium hover:text-avocado-forest transition-colors ${
                isActive('/') ? 'text-avocado-dark' : 'text-gray-600'
              }`}
              data-testid="nav-home"
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className={`text-sm font-medium hover:text-avocado-forest transition-colors ${
                isActive('/marketplace') ? 'text-avocado-dark' : 'text-gray-600'
              }`}
              data-testid="nav-marketplace"
            >
              Marketplace
            </Link>
            <Link
              to="/sell"
              className={`text-sm font-medium hover:text-avocado-forest transition-colors ${
                isActive('/sell') ? 'text-avocado-dark' : 'text-gray-600'
              }`}
              data-testid="nav-sell"
            >
              Sell Your Website
            </Link>
            <Link to="/admin" data-testid="nav-admin">
              <Button
                variant="outline"
                size="sm"
                className="border-avocado-dark text-avocado-dark hover:bg-avocado-mint"
              >
                Admin
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200" data-testid="mobile-menu">
          <div className="px-4 py-3 space-y-3">
            <Link
              to="/"
              className="block text-sm font-medium text-gray-600 hover:text-avocado-forest"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className="block text-sm font-medium text-gray-600 hover:text-avocado-forest"
              onClick={() => setMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              to="/sell"
              className="block text-sm font-medium text-gray-600 hover:text-avocado-forest"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sell Your Website
            </Link>
            <Link
              to="/admin"
              className="block text-sm font-medium text-gray-600 hover:text-avocado-forest"
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
