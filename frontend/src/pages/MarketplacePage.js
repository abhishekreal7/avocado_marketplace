import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axios from 'axios';
import { useCurrency } from '@/hooks/useCurrency';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const categories = [
  'All',
  'Marketing',
  'Real Estate',
  'Student Tools',
  'Business Tools',
  'Productivity',
];

export const MarketplacePage = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get(`${API}/listings`);
        setListings(response.data);
        setFilteredListings(response.data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  useEffect(() => {
    const filterListings = () => {
      let filtered = listings;

      if (selectedCategory !== 'All') {
        filtered = filtered.filter((listing) => listing.category === selectedCategory);
      }

      if (searchQuery) {
        filtered = filtered.filter(
          (listing) =>
            listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredListings(filtered);
    };

    filterListings();
  }, [listings, selectedCategory, searchQuery]);

 

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-avocado-dark to-avocado-forest text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="marketplace-title">Marketplace</h1>
          <p className="text-avocado-light">Browse {listings.length} AI-powered websites ready to launch</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search websites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="search-input"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-64" data-testid="category-filter">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} data-testid={`category-${category}`}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading listings...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12" data-testid="no-results">
            <p className="text-gray-500 text-lg">No listings found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="listings-grid">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="hover-lift overflow-hidden" data-testid={`listing-card-${listing.id}`}>
                <div className="h-48 overflow-hidden">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-avocado-light/30 text-avocado-dark px-3 py-1 rounded-full text-xs font-medium">
                      {listing.category}
                    </span>
                    <a
                      href={listing.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-avocado-dark hover:text-avocado-forest"
                      data-testid={`demo-link-${listing.id}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <h3 className="font-bold text-xl mb-2">{listing.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold text-avocado-dark">{formatPrice(listing.price_usd)}</span>
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
        )}
      </div>
    </div>
  );
};
