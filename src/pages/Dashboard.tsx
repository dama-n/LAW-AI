import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import {
  MessageSquare,
  FileText,
  Search,
  TrendingUp,
  Clock,
  Plus,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Subscription {
  plan: string;
  queries_used: number;
  queries_limit: number;
}

interface Document {
  id: string;
  title: string;
  type: string;
  created_at: string;
  status: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

export function Dashboard() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [recentConversations, setRecentConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    const [subData, docsData, convsData] = await Promise.all([
      supabase
        .from('subscriptions')
        .select('plan, queries_used, queries_limit')
        .eq('user_id', user?.id)
        .maybeSingle(),
      supabase
        .from('documents')
        .select('id, title, type, created_at, status')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('chat_conversations')
        .select('id, title, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    if (subData.data) setSubscription(subData.data);
    if (docsData.data) setRecentDocuments(docsData.data);
    if (convsData.data) setRecentConversations(convsData.data);
    setLoading(false);
  };

  const queriesPercentage = subscription
    ? (subscription.queries_used / subscription.queries_limit) * 100
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back to your legal workspace</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-blue-100 text-sm">Current Plan</p>
                <p className="text-2xl font-bold capitalize">{subscription?.plan || 'Free'}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-200" />
            </div>
            <Link
              to="/pricing"
              className="inline-block px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
            >
              Upgrade Plan
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm">AI Queries</p>
                <p className="text-2xl font-bold text-gray-900">
                  {subscription?.queries_used || 0} / {subscription?.queries_limit || 10}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(queriesPercentage, 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm">Documents</p>
                <p className="text-2xl font-bold text-gray-900">{recentDocuments.length}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Total documents created</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/ai-assistant"
            className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition group"
          >
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">AI Assistant</h3>
            <p className="text-gray-600 text-sm mb-4">Ask legal questions and get instant answers</p>
            <div className="flex items-center text-blue-600 text-sm font-semibold">
              <span>Start Chat</span>
              <Plus className="h-4 w-4 ml-1" />
            </div>
          </Link>

          <Link
            to="/generator"
            className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition group"
          >
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Draft Document</h3>
            <p className="text-gray-600 text-sm mb-4">Generate legal documents from templates</p>
            <div className="flex items-center text-blue-600 text-sm font-semibold">
              <span>Create Now</span>
              <Plus className="h-4 w-4 ml-1" />
            </div>
          </Link>

          <Link
            to="/documents"
            className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition group"
          >
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Analyze Contract</h3>
            <p className="text-gray-600 text-sm mb-4">Upload and analyze legal documents</p>
            <div className="flex items-center text-blue-600 text-sm font-semibold">
              <span>Upload File</span>
              <Plus className="h-4 w-4 ml-1" />
            </div>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Conversations</h2>
              <Link to="/ai-assistant" className="text-sm text-blue-600 hover:text-blue-700">
                View All
              </Link>
            </div>
            {recentConversations.length > 0 ? (
              <div className="space-y-3">
                {recentConversations.map((conv) => (
                  <Link
                    key={conv.id}
                    to={`/ai-assistant?conversation=${conv.id}`}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{conv.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(conv.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Clock className="h-4 w-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No conversations yet</p>
                <Link
                  to="/ai-assistant"
                  className="inline-block mt-3 text-blue-600 hover:text-blue-700 text-sm font-semibold"
                >
                  Start your first chat
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Documents</h2>
              <Link to="/documents" className="text-sm text-blue-600 hover:text-blue-700">
                View All
              </Link>
            </div>
            {recentDocuments.length > 0 ? (
              <div className="space-y-3">
                {recentDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.title}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {doc.type} • {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        doc.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No documents yet</p>
                <Link
                  to="/generator"
                  className="inline-block mt-3 text-blue-600 hover:text-blue-700 text-sm font-semibold"
                >
                  Create your first document
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
