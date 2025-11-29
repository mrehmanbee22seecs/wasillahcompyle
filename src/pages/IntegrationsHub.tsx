/**
 * Integrations Hub Page - Phase 3 Feature
 * Central hub for all integrations: Calendar sync, Social sharing, Notifications, Automations
 * Zero to minimal cost - uses client-side integrations and Firebase free tier
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plug,
  Calendar,
  Share2,
  Bell,
  Zap,
  Mail,
  Smartphone,
  Globe,
  ExternalLink,
  ChevronRight,
  Check,
  Settings,
  ArrowLeft,
  LogIn,
  Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePWA } from '../hooks/usePWA';
import NotificationSettings from '../components/Integrations/NotificationSettings';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: 'active' | 'available' | 'coming_soon';
  category: 'calendar' | 'social' | 'notifications' | 'automation';
  color: string;
  action?: () => void;
  href?: string;
}

const integrations: Integration[] = [
  // Calendar Integrations
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    description: 'Add events directly to Google Calendar',
    icon: Calendar,
    status: 'active',
    category: 'calendar',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'outlook_calendar',
    name: 'Outlook Calendar',
    description: 'Sync events with Microsoft Outlook',
    icon: Calendar,
    status: 'active',
    category: 'calendar',
    color: 'bg-sky-100 text-sky-600'
  },
  {
    id: 'ical',
    name: 'Apple Calendar / iCal',
    description: 'Download .ics files for any calendar app',
    icon: Calendar,
    status: 'active',
    category: 'calendar',
    color: 'bg-gray-100 text-gray-600'
  },
  // Social Integrations
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Share opportunities with your contacts',
    icon: Share2,
    status: 'active',
    category: 'social',
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Share projects and events on Facebook',
    icon: Share2,
    status: 'active',
    category: 'social',
    color: 'bg-blue-100 text-blue-700'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Share your volunteer achievements',
    icon: Share2,
    status: 'active',
    category: 'social',
    color: 'bg-sky-100 text-sky-700'
  },
  // Notification Integrations
  {
    id: 'push_notifications',
    name: 'Push Notifications',
    description: 'Real-time alerts on your device',
    icon: Bell,
    status: 'active',
    category: 'notifications',
    color: 'bg-yellow-100 text-yellow-700'
  },
  {
    id: 'email_notifications',
    name: 'Email Notifications',
    description: 'Get updates in your inbox',
    icon: Mail,
    status: 'active',
    category: 'notifications',
    color: 'bg-red-100 text-red-600'
  },
  // Future Automations
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect to 5000+ apps',
    icon: Zap,
    status: 'coming_soon',
    category: 'automation',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    id: 'webhook',
    name: 'Webhooks',
    description: 'Custom integrations via webhooks',
    icon: Globe,
    status: 'coming_soon',
    category: 'automation',
    color: 'bg-purple-100 text-purple-600'
  }
];

const categoryInfo = {
  calendar: {
    title: 'Calendar Sync',
    description: 'Never miss an event - sync directly to your calendar',
    icon: Calendar
  },
  social: {
    title: 'Social Sharing',
    description: 'Share opportunities with your network',
    icon: Share2
  },
  notifications: {
    title: 'Notifications',
    description: 'Stay updated with real-time alerts',
    icon: Bell
  },
  automation: {
    title: 'Automations',
    description: 'Connect Wasilah to your other tools',
    icon: Zap
  }
};

const IntegrationsHub: React.FC = () => {
  const { currentUser } = useAuth();
  const { isInstallable, isInstalled, installPWA } = usePWA();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [installing, setInstalling] = useState(false);

  const handleInstallPWA = async () => {
    setInstalling(true);
    await installPWA();
    setInstalling(false);
  };

  const categories = Object.keys(categoryInfo) as Array<keyof typeof categoryInfo>;

  // Authentication guard - unauthenticated users should see sign-in message
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-cream-white pt-28 pb-12 flex items-center justify-center">
        <div className="text-center">
          <Plug className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-logo-navy mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to access your integration settings.</p>
          <Link to="/volunteer" className="text-vibrant-orange hover:underline flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" />
            Join Wasilah →
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: Integration['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <Check className="w-3 h-3" /> Active
          </span>
        );
      case 'available':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            Available
          </span>
        );
      case 'coming_soon':
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
            Coming Soon
          </span>
        );
    }
  };

  // Show notification settings panel
  if (activeSection === 'notifications') {
    return (
      <div className="min-h-screen bg-cream-white pt-28 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setActiveSection(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-vibrant-orange mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Integrations
          </button>
          <NotificationSettings />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-white pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-vibrant-orange rounded-xl flex items-center justify-center">
              <Plug className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-modern-display font-bold text-logo-navy">
                Integrations Hub
              </h1>
              <p className="text-gray-600">
                Connect Wasilah with your favorite tools
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map((cat) => {
            const info = categoryInfo[cat];
            const count = integrations.filter(i => i.category === cat && i.status === 'active').length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedCategory === cat
                    ? 'border-vibrant-orange bg-vibrant-orange/5'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <info.icon className={`w-6 h-6 mb-2 ${selectedCategory === cat ? 'text-vibrant-orange' : 'text-gray-400'}`} />
                <h3 className="font-medium text-logo-navy text-sm">{info.title}</h3>
                <p className="text-xs text-gray-500">{count} active</p>
              </button>
            );
          })}
        </div>

        {/* Integration Categories */}
        <div className="space-y-8">
          {categories
            .filter(cat => !selectedCategory || selectedCategory === cat)
            .map((category) => {
              const info = categoryInfo[category];
              const categoryIntegrations = integrations.filter(i => i.category === category);
              
              return (
                <div key={category} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <info.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-logo-navy">{info.title}</h2>
                        <p className="text-sm text-gray-500">{info.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-50">
                    {categoryIntegrations.map((integration) => (
                      <div
                        key={integration.id}
                        className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${integration.color}`}>
                            <integration.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-medium text-logo-navy">{integration.name}</h3>
                            <p className="text-sm text-gray-500">{integration.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {getStatusBadge(integration.status)}
                          
                          {integration.status === 'active' && integration.id === 'push_notifications' && (
                            <button
                              onClick={() => setActiveSection('notifications')}
                              className="p-2 text-gray-400 hover:text-vibrant-orange hover:bg-vibrant-orange/10 rounded-lg transition-colors"
                              title="Configure"
                            >
                              <Settings className="w-5 h-5" />
                            </button>
                          )}
                          
                          {integration.status !== 'coming_soon' && (
                            <ChevronRight className="w-5 h-5 text-gray-300" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>

        {/* PWA Install Banner */}
        <div className="mt-8 bg-gradient-to-r from-logo-navy to-logo-navy-light rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Smartphone className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Install Wasilah App</h3>
                <p className="text-white/70 text-sm">
                  Get the best experience with push notifications, offline access, and quick launch
                </p>
              </div>
            </div>
            {isInstalled ? (
              <span className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium flex items-center gap-2">
                <Check className="w-5 h-5" />
                Installed
              </span>
            ) : isInstallable ? (
              <button
                onClick={handleInstallPWA}
                disabled={installing}
                className="px-6 py-3 bg-white text-logo-navy rounded-xl font-medium hover:bg-gray-100 transition-colors flex items-center gap-2 disabled:opacity-50"
                aria-label="Install Wasilah App"
              >
                {installing ? (
                  'Installing...'
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Install App
                  </>
                )}
              </button>
            ) : (
              <div className="text-sm text-white/70 max-w-xs">
                <p className="font-medium text-white mb-1">Manual Installation:</p>
                <p>Use your browser's menu → "Add to Home Screen" or "Install App"</p>
              </div>
            )}
          </div>
        </div>

        {/* Developer API Coming Soon */}
        <div className="mt-8 bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-200">
          <div className="text-center">
            <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-logo-navy mb-2">Developer API</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-4">
              Build custom integrations with Wasilah. Our public API is coming soon with webhooks,
              OAuth support, and comprehensive documentation.
            </p>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm">
              <Zap className="w-4 h-4" />
              Coming Q2 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsHub;
