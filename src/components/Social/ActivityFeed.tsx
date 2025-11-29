/**
 * ActivityFeed Component - Phase 1 Feature Exposure
 * Shows recent platform activity including achievements, points, and comments
 * Exposes social features and gamification to increase engagement
 * 
 * Optimized for Firebase free tier with limited queries and query-level filtering
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Star, 
  Trophy, 
  Target, 
  Award,
  Clock,
  TrendingUp
} from 'lucide-react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';

interface ActivityItem {
  id: string;
  type: 'follow' | 'like' | 'comment' | 'achievement' | 'badge' | 'project_join' | 'points';
  userId: string;
  userName?: string;
  targetId?: string;
  targetType?: string;
  targetName?: string;
  details?: string;
  points?: number;
  createdAt: any;
}

interface ActivityFeedProps {
  variant?: 'global' | 'personal';
  maxItems?: number;
  showTitle?: boolean;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  variant = 'global', 
  maxItems = 10,
  showTitle = true 
}) => {
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      // Skip loading for personal variant if user is not logged in
      if (variant === 'personal' && !currentUser?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const allActivities: ActivityItem[] = [];
        const queryLimit = variant === 'personal' ? 5 : 8;

        // Load recent points earned (most engaging activity type)
        // Use user-specific query for personal variant to filter at query level
        const pointsQuery = variant === 'personal' && currentUser?.uid
          ? query(
              collection(db, 'user_points'),
              where('userId', '==', currentUser.uid),
              orderBy('createdAt', 'desc'),
              limit(queryLimit)
            )
          : query(
              collection(db, 'user_points'),
              orderBy('createdAt', 'desc'),
              limit(queryLimit)
            );
        
        const pointsSnap = await getDocs(pointsQuery);
        pointsSnap.forEach(doc => {
          const data = doc.data();
          allActivities.push({
            id: `points-${doc.id}`,
            type: 'points',
            userId: data.userId,
            details: data.reason,
            points: data.points,
            createdAt: data.createdAt
          });
        });

        // Load recent achievements
        const achievementsQuery = variant === 'personal' && currentUser?.uid
          ? query(
              collection(db, 'user_achievements'),
              where('userId', '==', currentUser.uid),
              orderBy('earnedAt', 'desc'),
              limit(queryLimit)
            )
          : query(
              collection(db, 'user_achievements'),
              orderBy('earnedAt', 'desc'),
              limit(queryLimit)
            );
        
        const achievementsSnap = await getDocs(achievementsQuery);
        achievementsSnap.forEach(doc => {
          const data = doc.data();
          allActivities.push({
            id: `achievement-${doc.id}`,
            type: 'achievement',
            userId: data.userId,
            targetName: data.name,
            details: data.description,
            createdAt: data.earnedAt
          });
        });

        // Load recent comments (for global feed only to reduce queries)
        if (variant === 'global') {
          const commentsQuery = query(
            collection(db, 'social_comments'),
            orderBy('createdAt', 'desc'),
            limit(5)
          );
          const commentsSnap = await getDocs(commentsQuery);
          commentsSnap.forEach(doc => {
            const data = doc.data();
            allActivities.push({
              id: `comment-${doc.id}`,
              type: 'comment',
              userId: data.userId,
              userName: data.userName,
              targetId: data.targetId,
              targetType: data.targetType,
              details: data.text?.substring(0, 100),
              createdAt: data.createdAt
            });
          });
        }

        // Sort all activities by date
        allActivities.sort((a, b) => {
          const getTime = (ts: any) => {
            if (!ts) return 0;
            if (ts.toDate) return ts.toDate().getTime();
            if (ts.seconds) return ts.seconds * 1000;
            return new Date(ts).getTime();
          };
          return getTime(b.createdAt) - getTime(a.createdAt);
        });

        setActivities(allActivities.slice(0, maxItems));
      } catch (error) {
        console.error('Error loading activity feed:', error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [variant, maxItems, currentUser?.uid]);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'follow': return <UserPlus className="w-4 h-4 text-blue-500" />;
      case 'like': return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment': return <MessageCircle className="w-4 h-4 text-green-500" />;
      case 'achievement': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'badge': return <Award className="w-4 h-4 text-purple-500" />;
      case 'project_join': return <Target className="w-4 h-4 text-teal-500" />;
      case 'points': return <Trophy className="w-4 h-4 text-vibrant-orange" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    const safeDetails = typeof activity.details === 'string' ? activity.details : '';
    const safeName = typeof activity.targetName === 'string' ? activity.targetName : 'an item';
    const safePoints = Number.isFinite(activity.points as number) ? activity.points : 0;
    switch (activity.type) {
      case 'follow':
        return `started following a user`;
      case 'like':
        return `liked a ${activity.targetType || 'post'}`;
      case 'comment': {
        const preview = safeDetails.substring(0, 50);
        const suffix = safeDetails.length > 50 ? '...' : '';
        return `commented: "${preview}${suffix}"`;
      }
      case 'achievement':
        return `unlocked achievement: ${safeName}`;
      case 'badge':
        return `earned badge: ${safeName}`;
      case 'project_join':
        return `joined a project`;
      case 'points':
        return `earned ${safePoints} points${safeDetails ? `: ${safeDetails}` : ''}`;
      default:
        return 'performed an action';
    }
  };

  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Recently';

    let date: Date | null = null;
    try {
      if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
        date = timestamp.toDate();
      } else if (typeof timestamp === 'number') {
        // treat as ms since epoch or seconds if small
        date = new Date(timestamp < 1e12 ? timestamp * 1000 : timestamp);
      } else if (typeof timestamp === 'string') {
        const parsed = new Date(timestamp);
        date = isNaN(parsed.getTime()) ? null : parsed;
      } else if (timestamp instanceof Date) {
        date = isNaN(timestamp.getTime()) ? null : timestamp;
      }
    } catch {
      date = null;
    }

    if (!date) return 'Recently';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (!isFinite(diffMs) || diffMs < 0) return 'Recently';

    const diffInMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        {showTitle && (
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-vibrant-orange" />
            <h3 className="text-lg font-semibold text-logo-navy">Activity Feed</h3>
          </div>
        )}
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibrant-orange" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-vibrant-orange" />
            <h3 className="text-lg font-semibold text-logo-navy">
              {variant === 'personal' ? 'Your Activity' : 'Community Activity'}
            </h3>
          </div>
          <span className="text-xs text-gray-500">
            {activities.length} recent activities
          </span>
        </div>
      )}

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            {variant === 'personal' 
              ? 'No activity yet. Start engaging with the community!'
              : 'No recent community activity.'}
          </p>
          <Link 
            to="/projects" 
            className="inline-flex items-center gap-2 mt-4 text-vibrant-orange text-sm font-medium hover:underline"
          >
            Browse Projects
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-logo-navy">
                  <span className="font-medium">
                    {activity.userName || 'A user'}
                  </span>{' '}
                  {getActivityText(activity)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(activity.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
