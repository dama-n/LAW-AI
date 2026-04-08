import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { FileText, Search, Filter, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  jurisdiction: string;
  usage_count: number;
}

export function Templates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'contract', name: 'Contracts' },
    { id: 'agreement', name: 'Agreements' },
    { id: 'notice', name: 'Notices' },
    { id: 'petition', name: 'Petitions' },
    { id: 'deed', name: 'Deeds' },
    { id: 'affidavit', name: 'Affidavits' },
    { id: 'power_of_attorney', name: 'Power of Attorney' },
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [searchQuery, selectedCategory, templates]);

  const loadTemplates = async () => {
    const { data } = await supabase
      .from('legal_templates')
      .select('*')
      .eq('is_public', true)
      .order('usage_count', { ascending: false });

    if (data) {
      setTemplates(data);
      setFilteredTemplates(data);
    }
    setLoading(false);
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }

    setFilteredTemplates(filtered);
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      contract: '📄',
      agreement: '🤝',
      notice: '📢',
      petition: '⚖️',
      deed: '📜',
      affidavit: '✍️',
      power_of_attorney: '🔐',
      other: '📋',
    };
    return icons[category] || '📄';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal Templates</h1>
          <p className="text-gray-600">
            Browse our collection of professional legal document templates for India
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none bg-white min-w-[200px]"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredTemplates.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-600 transition group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{getCategoryIcon(template.category)}</div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <TrendingUp className="h-3 w-3" />
                    <span>{template.usage_count} uses</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                  {template.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full capitalize">
                      {template.category}
                    </span>
                    <span className="text-xs text-gray-500">{template.jurisdiction}</span>
                  </div>
                </div>

                <Link
                  to={`/generator?template=${template.id}`}
                  className="mt-4 block w-full py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Use Template
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
