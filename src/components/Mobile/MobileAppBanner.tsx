/**
 * MobileAppBanner Component - Phase 3 Feature
 * Promotes PWA installation on mobile devices
 * Zero cost - uses native browser PWA capabilities
 */

import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  X, 
  Download, 
  Check, 
  Bell,
  Wifi,
  Zap,
  Star
} from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

interface MobileAppBannerProps {
  variant?: 'banner' | 'card' | 'fullscreen';
  showOnDesktop?: boolean;
}

const MobileAppBanner: React.FC<MobileAppBannerProps> = ({ 
  variant = 'banner',
  showOnDesktop = false
}) => {
  const { isInstallable, isInstalled, installPWA } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on a mobile device (guard for SSR)
    const checkMobile = () => {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
      const isNarrow = window.innerWidth < 768;
      const isUA = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent || '');
      setIsMobile(isNarrow || isUA);
    };
  
    checkMobile();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
    return;
  }, []);

  // Check if already dismissed in this session
  useEffect(() => {
    const dismissedAt = sessionStorage.getItem('pwa_banner_dismissed');
    if (dismissedAt) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('pwa_banner_dismissed', Date.now().toString());
  };

  const handleInstall = async () => {
    setInstalling(true);
    const success = await installPWA();
    setInstalling(false);
    if (success) {
      setInstalled(true);
      setTimeout(() => setDismissed(true), 3000);
    }
  };

  // Don't show if already installed, dismissed, or on desktop (unless showOnDesktop)
  if (isInstalled || dismissed || (!showOnDesktop && !isMobile && !isInstallable)) {
    return null;
  }

  // Don't show if not installable and no way to prompt
  if (!isInstallable && variant !== 'card') {
    return null;
  }

  const features = [
    { icon: Bell, label: 'Push notifications' },
    { icon: Wifi, label: 'Works offline' },
    { icon: Zap, label: 'Faster experience' },
    { icon: Star, label: 'Home screen access' }
  ];

  if (variant === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-logo-navy to-logo-navy-light flex items-center justify-center p-6">
        <div className="text-center text-white max-w-md">
          <button
            onClick={handleDismiss}
            className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-20 h-20 bg-white rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
            <img src="/logo.jpeg" alt="Wasilah" className="w-16 h-16 rounded-2xl" />
          </div>

          <h2 className="text-3xl font-bold mb-4">Get the Wasilah App</h2>
          <p className="text-white/70 mb-8">
            Install our app for the best experience. It's free and works offline!
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {features.map((feature) => (
              <div key={feature.label} className="flex items-center gap-2 text-left bg-white/10 rounded-xl p-3">
                <feature.icon className="w-5 h-5 text-vibrant-orange" />
                <span className="text-sm">{feature.label}</span>
              </div>
            ))}
          </div>

          {isInstallable ? (
            <button
              onClick={handleInstall}
              disabled={installing || installed}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                installed
                  ? 'bg-green-500 text-white'
                  : installing
                  ? 'bg-gray-400 text-white'
                  : 'bg-vibrant-orange hover:bg-vibrant-orange-light text-white'
              }`}
            >
              {installed ? (
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-6 h-6" /> Installed!
                </span>
              ) : installing ? (
                'Installing...'
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Download className="w-6 h-6" /> Install App
                </span>
              )}
            </button>
          ) : (
            <div className="bg-white/10 rounded-xl p-4 text-sm text-white/70">
              <p className="font-medium text-white mb-2">How to install:</p>
              <ol className="list-decimal list-inside space-y-1 text-left">
                <li>Tap the share button in your browser</li>
                <li>Select "Add to Home Screen"</li>
                <li>Tap "Add" to confirm</li>
              </ol>
            </div>
          )}

          <button
            onClick={handleDismiss}
            className="mt-4 text-white/50 hover:text-white text-sm transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="bg-gradient-to-r from-logo-navy to-logo-navy-light rounded-2xl p-6 text-white relative overflow-hidden">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1 text-white/50 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
            <Smartphone className="w-7 h-7 text-logo-navy" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Get the App Experience</h3>
            <p className="text-white/70 text-sm mb-4">
              Install Wasilah for push notifications, offline access, and faster loading.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {features.slice(0, 2).map((feature) => (
                <span key={feature.label} className="inline-flex items-center gap-1 text-xs bg-white/10 rounded-full px-3 py-1">
                  <feature.icon className="w-3 h-3" />
                  {feature.label}
                </span>
              ))}
            </div>

            {isInstallable ? (
              <button
                onClick={handleInstall}
                disabled={installing || installed}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                  installed
                    ? 'bg-green-500 text-white'
                    : installing
                    ? 'bg-gray-400 text-white'
                    : 'bg-vibrant-orange hover:bg-vibrant-orange-light text-white'
                }`}
              >
                {installed ? (
                  <>
                    <Check className="w-5 h-5" /> Installed
                  </>
                ) : installing ? (
                  'Installing...'
                ) : (
                  <>
                    <Download className="w-5 h-5" /> Install
                  </>
                )}
              </button>
            ) : (
              <p className="text-xs text-white/50">
                Use your browser's menu to add to home screen
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default banner variant
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-logo-navy text-white px-4 py-3 shadow-2xl safe-area-bottom">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-5 h-5 text-logo-navy" />
          </div>
          <div>
            <p className="font-medium text-sm">Install Wasilah App</p>
            <p className="text-xs text-white/70 hidden sm:block">Get notifications & offline access</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isInstallable ? (
            <button
              onClick={handleInstall}
              disabled={installing || installed}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                installed
                  ? 'bg-green-500 text-white'
                  : installing
                  ? 'bg-gray-400 text-white'
                  : 'bg-vibrant-orange hover:bg-vibrant-orange-light text-white'
              }`}
            >
              {installed ? (
                <Check className="w-5 h-5" />
              ) : installing ? (
                '...'
              ) : (
                'Install'
              )}
            </button>
          ) : (
            <span className="text-xs text-white/50 hidden sm:inline">
              Add to home screen via browser menu
            </span>
          )}
          <button
            onClick={handleDismiss}
            className="p-2 text-white/50 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileAppBanner;
