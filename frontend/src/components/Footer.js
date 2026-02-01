import { Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-avocado-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-avocado-light flex items-center justify-center">
                <Rocket className="w-5 h-5 text-avocado-dark" />
              </div>
              <span className="text-2xl font-bold text-avocado-light">Avocado</span>
            </div>
            <p className="text-gray-300 text-sm max-w-md">
              The curated marketplace for ready-to-launch AI-powered websites. Launch your online business in hours, not weeks.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-avocado-light">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/marketplace" className="text-gray-300 hover:text-avocado-light transition-colors">
                  Browse Websites
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-gray-300 hover:text-avocado-light transition-colors">
                  Sell Your Website
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-300 hover:text-avocado-light transition-colors">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-avocado-light">About</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300">Curated quality</li>
              <li className="text-gray-300">Instant delivery</li>
              <li className="text-gray-300">Secure payments</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-avocado-forest mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2025 Avocado Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
