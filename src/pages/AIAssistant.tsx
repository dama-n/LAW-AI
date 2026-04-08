import { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Send, Sparkles, Scale, Loader2, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface Conversation {
  id: string;
  title: string;
}

export function AIAssistant() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId);
    }
  }, [currentConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    const { data } = await supabase
      .from('chat_conversations')
      .select('id, title')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (data) {
      setConversations(data);
      if (data.length > 0 && !currentConversationId) {
        setCurrentConversationId(data[0].id);
      }
    }
  };

  const loadMessages = async (conversationId: string) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data);
    }
  };

  const createNewConversation = async () => {
    const { data } = await supabase
      .from('chat_conversations')
      .insert({
        user_id: user?.id,
        title: 'New Conversation',
      })
      .select()
      .single();

    if (data) {
      setConversations([data, ...conversations]);
      setCurrentConversationId(data.id);
      setMessages([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentConversationId || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    const tempUserMessage: Message = {
      id: 'temp-user',
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    };

    setMessages([...messages, tempUserMessage]);

    const { data: savedUserMessage } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: currentConversationId,
        role: 'user',
        content: userMessage,
      })
      .select()
      .single();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/legal-ai`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            message: userMessage,
            conversation_id: currentConversationId,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`legal-ai failed (${response.status}): ${errorText}`);
      }

      const data = await response.json();

      const { data: assistantMessage } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: currentConversationId,
          role: 'assistant',
          content: data.response,
        })
        .select()
        .single();

      if (savedUserMessage && assistantMessage) {
        setMessages([...messages, savedUserMessage, assistantMessage]);
      }

      // Best-effort usage tracking; should never break chat UX.
      try {
        if (user?.id) {
          const { data: sub } = await supabase
            .from('subscriptions')
            .select('queries_used')
            .eq('user_id', user.id)
            .single();

          if (sub) {
            await supabase
              .from('subscriptions')
              .update({ queries_used: (sub.queries_used ?? 0) + 1 })
              .eq('user_id', user.id);
          }
        }
      } catch (usageError) {
        console.warn('Failed to update queries_used', usageError);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: 'error',
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        created_at: new Date().toISOString(),
      };
      setMessages([...messages, savedUserMessage!, errorMessage]);
    }

    setLoading(false);
  };

  const suggestedQueries = [
    'What is the process to file a consumer complaint in India?',
    'Explain the difference between IPC and CrPC',
    'What are the requirements for a valid contract?',
    'How do I register a trademark in India?',
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {sidebarOpen && (
          <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={createNewConversation}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                <Plus className="h-5 w-5" />
                <span>New Chat</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setCurrentConversationId(conv.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      currentConversationId === conv.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <p className="truncate text-sm">{conv.title}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center h-20 w-20 bg-blue-100 rounded-full mb-6">
                    <Scale className="h-10 w-10 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Welcome to LAW AI Assistant
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Ask me anything about Indian law, legal procedures, or document drafting
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {suggestedQueries.map((query, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInput(query)}
                        className="p-4 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-md transition"
                      >
                        <Sparkles className="h-5 w-5 text-blue-600 mb-2" />
                        <p className="text-sm text-gray-700">{query}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((message, idx) => (
                    <div
                      key={message.id || idx}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-2xl px-6 py-4 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {message.role === 'assistant' && (
                            <Scale className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                          )}
                          <div className="flex-1">
                            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="max-w-2xl px-6 py-4 rounded-2xl bg-white border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                          <p className="text-gray-600">Thinking...</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 bg-white p-4">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="flex space-x-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a legal question..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  disabled={loading || !currentConversationId}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim() || !currentConversationId}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Send</span>
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-2 text-center">
                LAW AI provides general legal information. For specific legal advice, consult a licensed attorney.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
