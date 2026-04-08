import { Navbar } from '../components/Navbar';
import { Link } from 'react-router-dom';
import { Check, Zap, Crown, Users } from 'lucide-react';

export function Pricing() {
  const plans = [
    {
      name: 'Free',
      icon: Zap,
      price: '₹0',
      period: '/month',
      description: 'Perfect for trying out Vaakil AI',
      features: [
        '10 AI queries per month',
        'Access to 100+ templates',
        'Basic document analysis',
        'Community support',
        'Indian jurisdiction coverage',
      ],
      cta: 'Get Started',
      link: '/signup',
      highlighted: false,
    },
    {
      name: 'Pro',
      icon: Crown,
      price: '₹999',
      period: '/month',
      description: 'For individual lawyers and professionals',
      features: [
        'Unlimited AI queries',
        'Access to 500+ premium templates',
        'Advanced contract analysis',
        'Priority support',
        'Multi-jurisdiction coverage',
        'Document export (PDF, Word)',
        'Legal research database',
        'Citation generator',
      ],
      cta: 'Start Free Trial',
      link: '/signup',
      highlighted: true,
    },
    {
      name: 'Team',
      icon: Users,
      price: '₹4,999',
      period: '/month',
      description: 'For law firms and organizations',
      features: [
        'Everything in Pro',
        'Up to 10 team members',
        'Team collaboration tools',
        'Custom templates',
        'API access',
        'Dedicated account manager',
        'Advanced analytics',
        'White-label option',
        'Custom integrations',
      ],
      cta: 'Contact Sales',
      link: '/contact',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl shadow-lg p-8 ${
                  plan.highlighted
                    ? 'ring-4 ring-blue-600 scale-105 relative'
                    : 'border border-gray-200'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-100 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to={plan.link}
                  className={`block w-full py-3 text-center rounded-lg font-semibold transition ${
                    plan.highlighted
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I change plans later?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">
                Yes, all paid plans come with a 14-day free trial. No credit card required.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, debit cards, UPI, and net banking.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. No questions asked.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Need a custom solution?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            We offer custom enterprise plans with dedicated support, custom integrations, and more.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold text-lg"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </div>
  );
}
