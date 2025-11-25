/**
 * FollowerStats Component - Phase 1 Feature Exposure
 * Shows follower and following counts for a user profile
 * Exposes social network features for better engagement
 */

import React, { useEffect, useState } from 'react';
import { Users, UserPlus } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface FollowerStatsProps {
  userId: string;
  variant?: 'compact' | 'detailed';
}

interface Stats {
  followers: number;
  following: number;
}

const FollowerStats: React.FC<FollowerStatsProps> = ({ userId, variant = 'compact' }) => {
  const [stats, setStats] = useState<Stats>({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Get followers count (people following this user)
        const followersQuery = query(
          collection(db, 'user_follows'),
          where('followedId', '==', userId)
        );
        const followersSnap = await getDocs(followersQuery);

        // Get following count (people this user follows)
        const followingQuery = query(
          collection(db, 'user_follows'),
          where('followerId', '==', userId)
        );
        const followingSnap = await getDocs(followingQuery);

        setStats({
          followers: followersSnap.size,
          following: followingSnap.size
        });
      } catch (error) {
        console.error('Error loading follower stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center gap-4 animate-pulse">
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <Users className="w-5 h-5 text-blue-500" />
          <div>
            <div className="text-xl font-bold text-logo-navy">{stats.followers}</div>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
          <UserPlus className="w-5 h-5 text-green-500" />
          <div>
            <div className="text-xl font-bold text-logo-navy">{stats.following}</div>
            <div className="text-xs text-gray-500">Following</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="text-logo-navy">
        <span className="font-bold">{stats.followers}</span>{' '}
        <span className="text-gray-500">followers</span>
      </span>
      <span className="text-logo-navy">
        <span className="font-bold">{stats.following}</span>{' '}
        <span className="text-gray-500">following</span>
      </span>
    </div>
  );
};

export default FollowerStats;
