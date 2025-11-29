/**
 * ChatQuickActions Component - Phase 2 Chat Enhancement
 * Provides contextual quick actions and suggestions based on user context
 * Improves existing chat functionality without creating a new chatbot
 */

import React, { useMemo } from 'react';
import { 
  Target, 
  Calendar, 
  HelpCircle, 
  MapPin, 
  Award, 
  Users, 
  Briefcase,
  TrendingUp,
  FileText,
  Phone
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface QuickAction {
  id: string;
  icon: React.ElementType;
  label: string;
  question: string;
  category: 'projects' | 'events' | 'volunteer' | 'contact' | 'general';
}

interface ChatQuickActionsProps {
  onSelectQuestion: (question: string) => void;
  recentTopics?: string[];
}

const ChatQuickActions: React.FC<ChatQuickActionsProps> = ({ 
  onSelectQuestion,
  recentTopics = []
}) => {
  const { currentUser, userData } = useAuth();

  // Generate contextual quick actions based on user state
  const quickActions = useMemo((): QuickAction[] => {
    const baseActions: QuickAction[] = [
      {
        id: 'what-is-wasilah',
        icon: HelpCircle,
        label: 'About Wasilah',
        question: 'What is Wasilah and what do you do?',
        category: 'general'
      },
      {
        id: 'how-to-volunteer',
        icon: Users,
        label: 'How to Volunteer',
        question: 'How can I become a volunteer at Wasilah?',
        category: 'volunteer'
      },
      {
        id: 'current-projects',
        icon: Target,
        label: 'Current Projects',
        question: 'What projects are currently running?',
        category: 'projects'
      },
      {
        id: 'upcoming-events',
        icon: Calendar,
        label: 'Upcoming Events',
        question: 'What events are coming up?',
        category: 'events'
      },
      {
        id: 'locations',
        icon: MapPin,
        label: 'Office Locations',
        question: 'Where are your offices located?',
        category: 'contact'
      },
      {
        id: 'contact-info',
        icon: Phone,
        label: 'Contact Us',
        question: 'How can I contact Wasilah?',
        category: 'contact'
      }
    ];

    // Add personalized actions for logged-in users
    if (currentUser && userData) {
      const personalizedActions: QuickAction[] = [
        {
          id: 'my-progress',
          icon: TrendingUp,
          label: 'My Progress',
          question: 'How can I track my volunteer progress and achievements?',
          category: 'volunteer'
        },
        {
          id: 'matching-projects',
          icon: Briefcase,
          label: 'Projects for Me',
          question: 'What projects match my skills and interests?',
          category: 'projects'
        },
        {
          id: 'earn-points',
          icon: Award,
          label: 'Earn Points',
          question: 'How can I earn more points and badges?',
          category: 'volunteer'
        }
      ];
      
      // Prioritize personalized actions for logged-in users
      return [...personalizedActions.slice(0, 2), ...baseActions.slice(0, 4)];
    }

    return baseActions.slice(0, 6);
  }, [currentUser, userData]);

  // Generate follow-up suggestions based on recent topics
  const followUpSuggestions = useMemo((): string[] => {
    if (recentTopics.length === 0) return [];

    const suggestions: string[] = [];
    
    // Map topics to relevant follow-up questions
    const topicMap: Record<string, string[]> = {
      volunteer: [
        'What skills are needed for volunteering?',
        'How much time commitment is required?',
        'Can students volunteer?'
      ],
      project: [
        'How long do projects usually last?',
        'Can I suggest a new project?',
        'How are volunteers matched to projects?'
      ],
      event: [
        'Are events free to attend?',
        'Can I bring friends to events?',
        'How do I register for an event?'
      ],
      donation: [
        'How are donations used?',
        'Is my donation tax-deductible?',
        'Can I donate items instead of money?'
      ],
      contact: [
        'What are your working hours?',
        'Can I schedule a visit?',
        'Do you have a WhatsApp number?'
      ]
    };

    // Find relevant follow-ups based on recent topics
    for (const topic of recentTopics.slice(0, 2)) {
      const topicLower = topic.toLowerCase();
      for (const [key, questions] of Object.entries(topicMap)) {
        if (topicLower.includes(key)) {
          suggestions.push(...questions.slice(0, 2));
          break;
        }
      }
    }

    return [...new Set(suggestions)].slice(0, 3);
  }, [recentTopics]);

  const getCategoryColor = (category: QuickAction['category']) => {
    switch (category) {
      case 'projects': return 'bg-blue-50 text-blue-600 hover:bg-blue-100';
      case 'events': return 'bg-purple-50 text-purple-600 hover:bg-purple-100';
      case 'volunteer': return 'bg-green-50 text-green-600 hover:bg-green-100';
      case 'contact': return 'bg-orange-50 text-orange-600 hover:bg-orange-100';
      default: return 'bg-gray-50 text-gray-600 hover:bg-gray-100';
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Actions Grid */}
      <div>
        <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
          ⚡ Quick Questions
        </p>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onSelectQuestion(action.question)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-xs font-medium transition-colors ${getCategoryColor(action.category)}`}
            >
              <action.icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Follow-up Suggestions */}
      {followUpSuggestions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
            💡 You might also want to know
          </p>
          <div className="space-y-1">
            {followUpSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onSelectQuestion(suggestion)}
                className="w-full text-left px-3 py-2 text-xs bg-white hover:bg-blue-50 rounded-lg border border-gray-200 transition-colors text-gray-700 hover:text-blue-700"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <p className="text-[10px] text-gray-500 text-center">
        Or type your own question below
      </p>
    </div>
  );
};

export default ChatQuickActions;
