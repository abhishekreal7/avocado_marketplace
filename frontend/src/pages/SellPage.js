import { useState } from 'react';
import { Rocket, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const categories = [
  'Marketing',
  'Real Estate',
  'Student Tools',
  'Business Tools',
  'Productivity',
];

export const SellPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    website_title: '',
    category: '',
    price: '',
    description: '',
    demo_url: '',
    upload_link: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      await axios.post(`${API}/submissions`, submitData);
      setSubmitted(true);
      setFormData({
        full_name: '',
        email: '',
        website_title: '',
        category: '',
        price: '',
        description: '',
        demo_url: '',
        upload_link: '',
      });
    } catch (err) {
      console.error('Error submitting:', err);
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full" data-testid="success-message">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Submission Received!</h2>
            <p className="text-gray-600 mb-6">
              Thanks! Your AI website has been submitted to Avocado. Our team will review it within 48 hours.
            </p>
            <Button
              onClick={() => setSubmitted(false)}
              className="bg-avocado-dark hover:bg-avocado-forest text-avocado-light"
              data-testid="submit-another-button"
            >
              Submit Another Website
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-avocado-dark to-avocado-forest text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Rocket className="w-12 h-12 mx-auto mb-4 text-avocado-light" />
          <h1 className="text-4xl font-bold mb-2" data-testid="sell-page-title">Sell Your AI Website on Avocado</h1>
          <p className="text-avocado-light text-lg">
            Join our marketplace and earn 85% on every sale
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Commission Model</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-avocado-mint/30 rounded-lg p-4">
                <p className="text-3xl font-bold text-avocado-dark">85%</p>
                <p className="text-sm text-gray-600">Seller Keeps</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-3xl font-bold text-gray-700">15%</p>
                <p className="text-sm text-gray-600">Platform Fee</p>
              </div>
              <div className="bg-avocado-light/30 rounded-lg p-4">
                <p className="text-3xl font-bold text-avocado-dark">48hrs</p>
                <p className="text-sm text-gray-600">Review Time</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4 text-center">
              Example: Website sold for $130 → You earn $110.50, Avocado earns $19.50
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} data-testid="submission-form">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    data-testid="full-name-input"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    data-testid="email-input"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="website_title">Website Title *</Label>
                  <Input
                    id="website_title"
                    name="website_title"
                    value={formData.website_title}
                    onChange={handleChange}
                    required
                    data-testid="website-title-input"
                    className="mt-1"
                    placeholder="e.g., AI Resume Builder Pro"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange} required>
                    <SelectTrigger className="mt-1" data-testid="category-select">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category} data-testid={`category-option-${category}`}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    data-testid="price-input"
                    className="mt-1"
                    placeholder="e.g., 129"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Price will be automatically converted to INR for Indian users
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    data-testid="description-input"
                    className="mt-1"
                    rows={4}
                    placeholder="Describe your AI website, its features, and what makes it valuable..."
                  />
                </div>

                <div>
                  <Label htmlFor="demo_url">Demo URL *</Label>
                  <Input
                    id="demo_url"
                    name="demo_url"
                    type="url"
                    value={formData.demo_url}
                    onChange={handleChange}
                    required
                    data-testid="demo-url-input"
                    className="mt-1"
                    placeholder="https://demo.yourwebsite.com"
                  />
                </div>

                <div>
                  <Label htmlFor="upload_link">Upload Link (Google Drive / GitHub) *</Label>
                  <Input
                    id="upload_link"
                    name="upload_link"
                    type="url"
                    value={formData.upload_link}
                    onChange={handleChange}
                    required
                    data-testid="upload-link-input"
                    className="mt-1"
                    placeholder="https://drive.google.com/... or https://github.com/..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Link to source code and documentation
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm" data-testid="error-message">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-avocado-dark hover:bg-avocado-forest text-avocado-light"
                  disabled={loading}
                  data-testid="submit-button"
                >
                  {loading ? 'Submitting...' : 'Submit for Review'}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  All listings on Avocado are manually reviewed before appearing on the marketplace.
                  We'll notify you via email within 48 hours.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
