import { Navbar } from '../components/Navbar';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  FileText,
  Search,
  Scale,
  Globe,
  Shield,
  Zap,
  Brain,
  ArrowRight
} from 'lucide-react';

export function Features() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Legal Work
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to streamline your legal workflows with AI-powered intelligence
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Legal Assistant</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Get instant answers to complex legal questions. Our AI understands context, remembers
              your conversation history, and provides jurisdiction-specific advice tailored to Indian law.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">✓</span>
                <span className="text-gray-700">Natural language understanding</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">✓</span>
                <span className="text-gray-700">Context-aware responses</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">✓</span>
                <span className="text-gray-700">Conversation history</span>
              </li>
            </ul>
            <Link
              to="/ai-assistant"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <span>Try it now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Document Drafting</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Generate professional legal documents in minutes using our AI-powered templates.
              Perfect for contracts, agreements, notices, and more.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">✓</span>
                <span className="text-gray-700">500+ professional templates</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">✓</span>
                <span className="text-gray-700">Smart auto-fill</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">✓</span>
                <span className="text-gray-700">Export to PDF & Word</span>
              </li>
            </ul>
            <Link
              to="/templates"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <span>Browse templates</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contract Analysis</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Upload any legal document for instant AI-powered analysis. Identify risks,
              extract key clauses, and get actionable recommendations.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">✓</span>
                <span className="text-gray-700">Automatic risk detection</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">✓</span>
                <span className="text-gray-700">Clause extraction</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">✓</span>
                <span className="text-gray-700">Improvement suggestions</span>
              </li>
            </ul>
            <Link
              to="/documents"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <span>Analyze document</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Scale className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Legal Research</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Access comprehensive Indian legal database. Search case laws, statutes,
              amendments, and get AI-powered summaries and citations.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">✓</span>
                <span className="text-gray-700">IPC, CrPC, Constitution</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">✓</span>
                <span className="text-gray-700">Case law database</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">✓</span>
                <span className="text-gray-700">Citation generator</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="text-center">
            <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Multi-Jurisdiction</h3>
            <p className="text-gray-600">
              Support for all Indian states and central laws with automatic jurisdiction detection
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Bank-grade encryption ensures your legal documents remain completely confidential
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Always Learning</h3>
            <p className="text-gray-600">
              Our AI continuously improves with the latest legal updates and user feedback
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of legal professionals using LAW AI to streamline their workflows
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold text-lg"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
