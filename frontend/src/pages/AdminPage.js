import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const AdminPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [submissionsRes, purchasesRes] = await Promise.all([
          axios.get(`${API}/admin/submissions`),
          axios.get(`${API}/admin/purchases`)
        ]);
        setSubmissions(submissionsRes.data);
        setPurchases(purchasesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateSubmissionStatus = async (id, status) => {
    try {
      await axios.put(`${API}/admin/submissions/${id}`, { status });
      toast.success(`Submission ${status}!`);
      const response = await axios.get(`${API}/admin/submissions`);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error updating submission:', error);
      toast.error('Failed to update submission');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <Badge className={`${variants[status]} flex items-center gap-1`}>
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredSubmissions = submissions.filter((sub) => {
    if (filter === 'all') return true;
    return sub.status === filter;
  });

  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === 'pending').length,
    approved: submissions.filter((s) => s.status === 'approved').length,
    rejected: submissions.filter((s) => s.status === 'rejected').length,
    purchases: purchases.length,
    revenue: purchases.reduce((sum, p) => sum + p.price_paid, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-avocado-dark to-avocado-forest text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="admin-title">Admin Panel</h1>
          <p className="text-avocado-light">Review and manage website submissions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card data-testid="stat-total">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Submissions</p>
                  <p className="text-3xl font-bold text-avocado-dark">{stats.total}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-pending">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-purchases">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Purchases</p>
                  <p className="text-3xl font-bold text-green-600">{stats.purchases}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-revenue">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-3xl font-bold text-avocado-dark">${stats.revenue.toFixed(0)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-avocado-forest" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Submissions</h2>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40" data-testid="status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading submissions...</p>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-12" data-testid="no-submissions">
                <p className="text-gray-500">No submissions found</p>
              </div>
            ) : (
              <div className="space-y-4" data-testid="submissions-list">
                {filteredSubmissions.map((submission) => (
                  <Card key={submission.id} className="overflow-hidden" data-testid={`submission-${submission.id}`}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-lg" data-testid={`submission-title-${submission.id}`}>
                                {submission.website_title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                by {submission.full_name} ({submission.email})
                              </p>
                            </div>
                            {getStatusBadge(submission.status)}
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline" className="text-xs">
                              {submission.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              ${submission.price}
                            </Badge>
                          </div>
                          <p className="text-gray-700 text-sm mb-3">{submission.description}</p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <a
                              href={submission.demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-avocado-dark hover:underline"
                              data-testid={`demo-link-${submission.id}`}
                            >
                              View Demo →
                            </a>
                            <span className="text-gray-400">|</span>
                            <a
                              href={submission.upload_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-avocado-dark hover:underline"
                              data-testid={`upload-link-${submission.id}`}
                            >
                              View Files →
                            </a>
                          </div>
                        </div>

                        {submission.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => updateSubmissionStatus(submission.id, 'approved')}
                              data-testid={`approve-button-${submission.id}`}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateSubmissionStatus(submission.id, 'rejected')}
                              data-testid={`reject-button-${submission.id}`}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mt-3">
                        Submitted: {new Date(submission.submitted_at).toLocaleString()}
                        {submission.reviewed_at && (
                          <> | Reviewed: {new Date(submission.reviewed_at).toLocaleString()}</>
                        )}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">Review Process</h3>
            <p className="text-sm text-gray-600">
              All listings on Avocado are manually reviewed before appearing on the marketplace. 
              Review submissions within 48 hours to maintain seller trust.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
