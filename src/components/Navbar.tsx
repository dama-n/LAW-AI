import { Link, useNavigate } from 'react-router-dom';
import { Scale, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">LAW AI</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/features" className="text-gray-700 hover:text-blue-600 transition">
              Features
            </Link>
            <Link to="/templates" className="text-gray-700 hover:text-blue-600 transition">
              Templates
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-blue-600 transition">
              Pricing
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-blue-600 transition">
              Blog
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/features"
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/templates"
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Templates
            </Link>
            <Link
              to="/pricing"
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-700 hover:text-blue-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block py-2 text-blue-600 font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
