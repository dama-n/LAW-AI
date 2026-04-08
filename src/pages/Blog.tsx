import { Navbar } from '../components/Navbar';

export function Blog() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-gray-600">Coming soon - Legal insights and AI technology updates</p>
      </div>
    </div>
  );
}
