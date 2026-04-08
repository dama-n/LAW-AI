import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { FileText, Download, Copy, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Template {
  id: string;
  title: string;
  category?: string | null;
  content: string;
  variables: string[];
}

export function Generator() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const templateId = searchParams.get('template');

  const [template, setTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedDocument, setGeneratedDocument] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (templateId) {
      loadTemplate(templateId);
    }
  }, [templateId]);

  const loadTemplate = async (id: string) => {
    const { data } = await supabase
      .from('legal_templates')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (data) {
      setTemplate(data);
      setDocumentTitle(data.title);
      const initialData: Record<string, string> = {};
      data.variables.forEach((variable: string) => {
        initialData[variable] = '';
      });
      setFormData(initialData);
    }
  };

  const handleGenerate = () => {
    if (!template) return;

    let content = template.content;
    Object.entries(formData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, value || `[${key}]`);
    });

    setGeneratedDocument(content);
  };

  const handleSave = async () => {
    if (!user || !generatedDocument) return;

    setSaving(true);
    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        title: documentTitle,
        type: template?.category || 'custom',
        content: generatedDocument,
        status: 'completed',
      })
      .select()
      .single();

    if (!error && data) {
      await supabase.from('document_generations').insert({
        user_id: user.id,
        template_id: templateId,
        document_id: data.id,
        input_data: formData,
      });

      // Best-effort increment of usage_count; should not break saving flow.
      try {
        if (templateId) {
          const { data: tpl } = await supabase
            .from('legal_templates')
            .select('usage_count')
            .eq('id', templateId)
            .single();

          if (tpl) {
            await supabase
              .from('legal_templates')
              .update({ usage_count: (tpl.usage_count ?? 0) + 1 })
              .eq('id', templateId);
          }
        }
      } catch (usageError) {
        console.warn('Failed to update template usage_count', usageError);
      }

      alert('Document saved successfully!');
      navigate('/documents');
    }

    setSaving(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDocument);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatVariableName = (variable: string) => {
    return variable
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No template selected</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Generator</h1>
          <p className="text-gray-600">Fill in the details to generate your legal document</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{template.title}</h2>

            <div className="space-y-4">
              {template.variables.map((variable) => (
                <div key={variable}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formatVariableName(variable)}
                  </label>
                  <input
                    type="text"
                    value={formData[variable] || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, [variable]: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder={`Enter ${formatVariableName(variable).toLowerCase()}`}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Generate Document
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Preview</h2>
              {generatedDocument && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    <Download className="h-4 w-4" />
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                  </button>
                </div>
              )}
            </div>

            {generatedDocument ? (
              <div className="bg-gray-50 rounded-lg p-6 max-h-[600px] overflow-y-auto">
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900 leading-relaxed">
                  {generatedDocument}
                </pre>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-12 text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  Fill in the form and click "Generate Document" to see the preview
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
