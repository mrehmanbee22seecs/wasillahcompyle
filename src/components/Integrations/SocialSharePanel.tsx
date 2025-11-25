/**
 * SocialSharePanel Component - Phase 3 Feature
 * Enhanced social sharing with multiple platforms and copy link
 * Zero cost - uses client-side share URLs and Web Share API
 */

import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail,
  MessageCircle,
  X
} from 'lucide-react';
import { shareUrls, shareNative, copyToClipboard, trackShare } from '../../utils/shareUtils';

interface SocialSharePanelProps {
  url: string;
  title: string;
  description?: string;
  contentType: 'project' | 'event' | 'profile' | 'page';
  contentId?: string;
  variant?: 'inline' | 'modal' | 'floating';
  onClose?: () => void;
}

const socialPlatforms = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageCircle,
    color: 'bg-[#25D366] hover:bg-[#20BD5A]',
    textColor: 'text-white'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-[#1877F2] hover:bg-[#166FE5]',
    textColor: 'text-white'
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: Twitter,
    color: 'bg-black hover:bg-gray-800',
    textColor: 'text-white'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'bg-[#0A66C2] hover:bg-[#095BB5]',
    textColor: 'text-white'
  },
  {
    id: 'email',
    name: 'Email',
    icon: Mail,
    color: 'bg-gray-600 hover:bg-gray-700',
    textColor: 'text-white'
  }
];

const SocialSharePanel: React.FC<SocialSharePanelProps> = ({
  url,
  title,
  description = '',
  contentType,
  contentId = '',
  variant = 'inline',
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [shareCount, setShareCount] = useState<Record<string, boolean>>({});

  const handleShare = async (platformId: string) => {
    let shareUrl = '';
    
    switch (platformId) {
      case 'whatsapp':
        shareUrl = shareUrls.whatsapp(url, title);
        break;
      case 'facebook':
        shareUrl = shareUrls.facebook(url);
        break;
      case 'twitter':
        shareUrl = shareUrls.twitter(url, title);
        break;
      case 'linkedin':
        shareUrl = shareUrls.linkedin(url);
        break;
      case 'email':
        shareUrl = shareUrls.email(title, description, url);
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
    
    // Track share
    trackShare(platformId, contentType, contentId);
    
    // Show confirmation
    setShareCount(prev => ({ ...prev, [platformId]: true }));
    setTimeout(() => {
      setShareCount(prev => ({ ...prev, [platformId]: false }));
    }, 2000);
  };

  const handleNativeShare = async () => {
    const success = await shareNative({ title, text: description, url });
    if (success) {
      trackShare('native', contentType, contentId);
    }
    return success;
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      trackShare('copy_link', contentType, contentId);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-logo-navy">Share this {contentType}</h3>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close share panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Native Share Button (for mobile) */}
          {'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 bg-vibrant-orange text-white rounded-xl font-medium hover:bg-vibrant-orange-light transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share via...</span>
            </button>
          )}
          
          {/* Social Platforms Grid */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {socialPlatforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleShare(platform.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl ${platform.color} ${platform.textColor} transition-all hover:scale-105`}
                title={`Share on ${platform.name}`}
              >
                {shareCount[platform.id] ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <platform.icon className="w-5 h-5" />
                )}
                <span className="text-xs">{platform.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
          
          {/* Copy Link Section */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-500 mb-2">Or copy link</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 truncate"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'floating') {
    return (
      <div className="fixed bottom-20 right-4 z-40 bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 animate-slide-up">
        <p className="text-sm font-medium text-gray-700 mb-3">Share this {contentType}</p>
        <div className="flex gap-2">
          {socialPlatforms.slice(0, 4).map((platform) => (
            <button
              key={platform.id}
              onClick={() => handleShare(platform.id)}
              className={`p-2.5 rounded-full ${platform.color} ${platform.textColor} transition-all hover:scale-110`}
              title={`Share on ${platform.name}`}
            >
              <platform.icon className="w-4 h-4" />
            </button>
          ))}
          <button
            onClick={handleCopyLink}
            className={`p-2.5 rounded-full transition-all hover:scale-110 ${
              copied ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Copy link"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    );
  }

  // Inline variant (default)
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-500 mr-1">Share:</span>
      {socialPlatforms.map((platform) => (
        <button
          key={platform.id}
          onClick={() => handleShare(platform.id)}
          className={`p-2 rounded-lg ${platform.color} ${platform.textColor} transition-all hover:scale-105`}
          title={`Share on ${platform.name}`}
        >
          {shareCount[platform.id] ? (
            <Check className="w-4 h-4" />
          ) : (
            <platform.icon className="w-4 h-4" />
          )}
        </button>
      ))}
      <button
        onClick={handleCopyLink}
        className={`p-2 rounded-lg transition-all hover:scale-105 ${
          copied ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        title="Copy link"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default SocialSharePanel;
