/**
 * NotificationSettings Component - Phase 3 Feature
 * Manage push notification preferences
 * Uses browser Notification API and Firebase Cloud Messaging (free tier)
 */

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellOff, 
  Smartphone, 
  Mail, 
  MessageSquare,
  Calendar,
  Award,
  Users,
  Target,
  Check,
  AlertCircle,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePWA } from '../../hooks/usePWA';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  category: 'activity' | 'social' | 'events' | 'achievements';
}

const defaultPreferences: Omit<NotificationPreference, 'enabled'>[] = [
  {
    id: 'new_projects',
    label: 'New Projects',
    description: 'Get notified when new projects match your interests',
    icon: Target,
    category: 'activity'
  },
  {
    id: 'event_reminders',
    label: 'Event Reminders',
    description: 'Receive reminders before events you registered for',
    icon: Calendar,
    category: 'events'
  },
  {
    id: 'achievements',
    label: 'Achievements & Badges',
    description: 'Celebrate when you earn new badges or achievements',
    icon: Award,
    category: 'achievements'
  },
  {
    id: 'followers',
    label: 'New Followers',
    description: 'Know when someone follows your profile',
    icon: Users,
    category: 'social'
  },
  {
    id: 'comments',
    label: 'Comments & Replies',
    description: 'Get notified of new comments on your content',
    icon: MessageSquare,
    category: 'social'
  },
  {
    id: 'weekly_digest',
    label: 'Weekly Digest',
    description: 'Summary of your impact and upcoming opportunities',
    icon: Mail,
    category: 'activity'
  }
];

const NotificationSettings: React.FC = () => {
  const { currentUser } = useAuth();
  const { requestNotificationPermission, showNotification } = usePWA();
  
  const [pushEnabled, setPushEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testSent, setTestSent] = useState(false);

  // Load notification permission status
  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
      setPushEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Load user preferences from Firestore
  useEffect(() => {
    const loadPreferences = async () => {
      if (!currentUser?.uid) {
        setPreferences(defaultPreferences.map(p => ({ ...p, enabled: true })));
        setLoading(false);
        return;
      }

      try {
        const prefDoc = await getDoc(doc(db, 'notification_preferences', currentUser.uid));
        
        if (prefDoc.exists()) {
          const savedPrefs = prefDoc.data().preferences as Record<string, boolean>;
          setPreferences(defaultPreferences.map(p => ({
            ...p,
            enabled: savedPrefs[p.id] ?? true
          })));
        } else {
          setPreferences(defaultPreferences.map(p => ({ ...p, enabled: true })));
        }
      } catch (error) {
        console.error('Error loading notification preferences:', error);
        setPreferences(defaultPreferences.map(p => ({ ...p, enabled: true })));
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [currentUser?.uid]);

  const handleEnablePush = async () => {
    const permission = await requestNotificationPermission();
    setPermissionStatus(permission);
    setPushEnabled(permission === 'granted');
    
    if (permission === 'granted') {
      // Show test notification
      await showNotification('Notifications Enabled! 🎉', {
        body: 'You will now receive updates about projects, events, and achievements.',
        icon: '/logo.jpeg',
        badge: '/logo.jpeg'
      });
    }
  };

  const handleTogglePreference = async (prefId: string) => {
    const updated = preferences.map(p =>
      p.id === prefId ? { ...p, enabled: !p.enabled } : p
    );
    setPreferences(updated);

    // Save to Firestore
    if (currentUser?.uid) {
      setSaving(true);
      try {
        const prefMap: Record<string, boolean> = {};
        updated.forEach(p => { prefMap[p.id] = p.enabled; });
        
        await setDoc(doc(db, 'notification_preferences', currentUser.uid), {
          preferences: prefMap,
          updatedAt: new Date()
        });
      } catch (error) {
        console.error('Error saving preferences:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleTestNotification = async () => {
    if (permissionStatus === 'granted') {
      await showNotification('Test Notification 🔔', {
        body: 'This is how your notifications will look!',
        icon: '/logo.jpeg',
        badge: '/logo.jpeg'
      });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    }
  };

  const categoryColors: Record<string, string> = {
    activity: 'border-blue-200 bg-blue-50',
    social: 'border-purple-200 bg-purple-50',
    events: 'border-green-200 bg-green-50',
    achievements: 'border-yellow-200 bg-yellow-50'
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibrant-orange mx-auto mb-4" />
        <p className="text-gray-500">Loading notification settings...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-logo-navy to-logo-navy-light p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Notification Settings</h2>
            <p className="text-white/70 text-sm">Manage how you receive updates</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Push Notification Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              pushEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
            }`}>
              {pushEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-medium text-logo-navy">Push Notifications</h3>
              <p className="text-sm text-gray-500">
                {permissionStatus === 'granted' 
                  ? 'Enabled - You will receive push notifications'
                  : permissionStatus === 'denied'
                  ? 'Blocked - Enable in browser settings'
                  : 'Click to enable push notifications'}
              </p>
            </div>
          </div>
          
          {permissionStatus !== 'denied' && (
            <button
              onClick={handleEnablePush}
              disabled={pushEnabled}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                pushEnabled
                  ? 'bg-green-100 text-green-700 cursor-default'
                  : 'bg-vibrant-orange text-white hover:bg-vibrant-orange-light'
              }`}
            >
              {pushEnabled ? (
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4" /> Enabled
                </span>
              ) : 'Enable'}
            </button>
          )}
          
          {permissionStatus === 'denied' && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              Blocked
            </div>
          )}
        </div>

        {/* Test Notification */}
        {pushEnabled && (
          <button
            onClick={handleTestNotification}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed transition-colors ${
              testSent 
                ? 'border-green-300 bg-green-50 text-green-700'
                : 'border-gray-300 hover:border-vibrant-orange hover:bg-vibrant-orange/5 text-gray-600 hover:text-vibrant-orange'
            }`}
          >
            <Smartphone className="w-5 h-5" />
            {testSent ? 'Test notification sent!' : 'Send Test Notification'}
          </button>
        )}

        {/* Preference Categories */}
        <div className="space-y-4">
          <h3 className="font-medium text-logo-navy flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Notification Preferences
          </h3>
          
          {preferences.map((pref) => (
            <div
              key={pref.id}
              className={`flex items-center justify-between p-4 rounded-xl border ${categoryColors[pref.category]}`}
            >
              <div className="flex items-center gap-3">
                <pref.icon className="w-5 h-5 text-gray-600" />
                <div>
                  <h4 className="font-medium text-logo-navy">{pref.label}</h4>
                  <p className="text-sm text-gray-500">{pref.description}</p>
                </div>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pref.enabled}
                  onChange={() => handleTogglePreference(pref.id)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-vibrant-orange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vibrant-orange"></div>
              </label>
            </div>
          ))}
        </div>

        {/* Save Status */}
        {saving && (
          <div className="text-center text-sm text-gray-500">
            Saving preferences...
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSettings;
