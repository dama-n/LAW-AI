import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import {
  Scale,
  FileText,
  Search,
  MessageSquare,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full mb-8">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">India's First AI Legal Copilot</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Legal Intelligence<br />
            <span className="text-blue-600">Powered by AI</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Draft legal documents, analyze contracts, and get instant legal insights - all in one intelligent platform designed for India
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/signup"
              className="group px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition" />
            </Link>
            <Link
              to="/ai-assistant"
              className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-lg hover:border-blue-600 transition font-semibold text-lg"
            >
              Try AI Assistant
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">10,000+</div>
              <div className="text-sm text-gray-600">Documents Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Legal Templates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">98%</div>
              <div className="text-sm text-gray-600">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Legal Work
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive AI-powered tools for modern legal practice
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Legal Assistant</h3>
              <p className="text-gray-600 leading-relaxed">
                Ask legal questions in plain language and get instant, jurisdiction-aware answers powered by advanced AI
              </p>
            </div>

            <div className="p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Document Drafting</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate professional legal documents in minutes using AI-powered templates and smart auto-fill
              </p>
            </div>

            <div className="p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Contract Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload contracts for instant analysis, risk detection, and improvement suggestions
              </p>
            </div>

            <div className="p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Scale className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Legal Research</h3>
              <p className="text-gray-600 leading-relaxed">
                Search case law, statutes, and legal precedents across Indian jurisdiction with AI-powered insights
              </p>
            </div>

            <div className="p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Jurisdiction</h3>
              <p className="text-gray-600 leading-relaxed">
                Get accurate legal guidance across all Indian states and central laws with automatic jurisdiction detection
              </p>
            </div>

            <div className="p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-600 leading-relaxed">
                Bank-grade encryption ensures your legal documents and conversations remain completely confidential
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for India, Powered by AI</h2>
            <p className="text-xl text-blue-100">
              Specifically designed for Indian legal framework
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Indian Laws Database</h3>
                  <p className="text-blue-100">
                    Comprehensive coverage of IPC, CrPC, Constitution, and state-specific laws
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Multilingual Support</h3>
                  <p className="text-blue-100">
                    Work in English or Hindi with seamless translation capabilities
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Local Context</h3>
                  <p className="text-blue-100">
                    AI trained on Indian legal practices, customs, and regional variations
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Real-time Updates</h3>
                  <p className="text-blue-100">
                    Stay current with the latest amendments and legal changes
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Case Law Search</span>
                  <Zap className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Smart Templates</span>
                  <Zap className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Contract Analysis</span>
                  <Zap className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Legal Research</span>
                  <Zap className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/features"
                  className="block text-center py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Explore All Features
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Legal Work?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of lawyers, law firms, and individuals using LAW AI
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg shadow-lg"
          >
            <span>Get Started Free</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Scale className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">LAW AI</span>
            </div>
            <p className="text-sm text-gray-400">
              India's first AI-powered legal assistant for modern legal practice
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Product</h4>
            <div className="space-y-2">
              <Link to="/features" className="block text-sm hover:text-white transition">Features</Link>
              <Link to="/pricing" className="block text-sm hover:text-white transition">Pricing</Link>
              <Link to="/templates" className="block text-sm hover:text-white transition">Templates</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Company</h4>
            <div className="space-y-2">
              <Link to="/about" className="block text-sm hover:text-white transition">About</Link>
              <Link to="/blog" className="block text-sm hover:text-white transition">Blog</Link>
              <Link to="/contact" className="block text-sm hover:text-white transition">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Legal</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm hover:text-white transition">Privacy Policy</a>
              <a href="#" className="block text-sm hover:text-white transition">Terms of Service</a>
              <a href="#" className="block text-sm hover:text-white transition">Cookie Policy</a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; 2024 LAW AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
