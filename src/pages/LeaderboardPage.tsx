/**
 * LeaderboardPage - Phase 1 Feature Exposure
 * A dedicated page to showcase the gamification leaderboard system
 * Exposes the hidden gamification features to improve user engagement
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Medal, Award, Star, TrendingUp, Users, Target, Zap, Crown, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  subscribeToLeaderboard, 
  subscribeToUserStats, 
  UserPointsStats,
  subscribeToBadges,
  subscribeToAchievements,
  Badge,
  Achievement
} from '../services/gamificationService';

type LeaderboardScope = 'global' | 'monthly' | 'role';

const LeaderboardPage: React.FC = () => {
  const { currentUser, userData } = useAuth();
  const [scope, setScope] = useState<LeaderboardScope>('global');
  const [leaderboardData, setLeaderboardData] = useState<UserPointsStats[]>([]);
  const [userStats, setUserStats] = useState<UserPointsStats | null>(null);
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to leaderboard data
  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToLeaderboard(scope, roleFilter, (list) => {
      setLeaderboardData(list.slice(0, 50)); // Show top 50
      setLoading(false);
    });
    return () => unsub();
  }, [scope, roleFilter]);

  // Subscribe to current user's stats
  useEffect(() => {
    if (!currentUser?.uid) {
      setUserStats(null);
      return;
    }
    const unsub = subscribeToUserStats(currentUser.uid, setUserStats);
    return () => unsub();
  }, [currentUser?.uid]);

  // Subscribe to current user's badges
  useEffect(() => {
    if (!currentUser?.uid) {
      setUserBadges([]);
      return;
    }
    const unsub = subscribeToBadges(currentUser.uid, setUserBadges);
    return () => unsub();
  }, [currentUser?.uid]);

  // Subscribe to current user's achievements
  useEffect(() => {
    if (!currentUser?.uid) {
      setUserAchievements([]);
      return;
    }
    const unsub = subscribeToAchievements(currentUser.uid, setUserAchievements);
    return () => unsub();
  }, [currentUser?.uid]);

  const getUserRank = () => {
    if (!currentUser?.uid) return null;
    const index = leaderboardData.findIndex(u => u.userId === currentUser.uid);
    return index >= 0 ? index + 1 : null;
  };

  const userRank = getUserRank();

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>;
  };

  const getRankBgColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300';
    if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300';
    if (rank === 3) return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-300';
    return 'bg-white border-gray-200';
  };

  return (
    <div className="min-h-screen bg-cream-white pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-vibrant-orange/10 px-6 py-2 rounded-full mb-4">
            <Trophy className="w-6 h-6 text-vibrant-orange" />
            <span className="text-vibrant-orange font-semibold">Gamification Center</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-modern-display font-bold text-logo-navy mb-4">
            Community Leaderboard
          </h1>
          <p className="text-lg text-logo-navy-light max-w-2xl mx-auto">
            Celebrate our top contributors! Earn points by volunteering, completing projects, 
            and engaging with the Wasilah community.
          </p>
        </div>

        {/* User Stats Card (if logged in) */}
        {currentUser && userStats && (
          <div className="mb-8 bg-gradient-to-r from-logo-navy to-logo-navy-light rounded-2xl shadow-xl p-6 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-vibrant-orange rounded-full flex items-center justify-center">
                  {userData?.photoURL ? (
                    <img 
                      src={userData.photoURL} 
                      alt={`Profile picture of ${userData?.displayName || 'user'}`} 
                      className="w-full h-full rounded-full object-cover" 
                    />
                  ) : (
                    <span className="text-2xl font-bold">{(userData?.displayName || 'U').charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{userData?.displayName || 'Your Stats'}</h2>
                  <p className="text-white/70 text-sm">
                    {userRank ? `Rank #${userRank} on the leaderboard` : 'Start earning points to appear on the leaderboard!'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-vibrant-orange">{userStats.totalPoints}</div>
                  <div className="text-xs text-white/70">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-logo-teal">{userStats.monthlyPoints}</div>
                  <div className="text-xs text-white/70">This Month</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">{userBadges.length}</div>
                  <div className="text-xs text-white/70">Badges</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{userAchievements.length}</div>
                  <div className="text-xs text-white/70">Achievements</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scope Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => { setScope('global'); setRoleFilter(null); }}
            className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
              scope === 'global' 
                ? 'bg-vibrant-orange text-white shadow-lg' 
                : 'bg-white text-logo-navy border border-gray-200 hover:border-vibrant-orange'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            All Time
          </button>
          <button
            onClick={() => { setScope('monthly'); setRoleFilter(null); }}
            className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
              scope === 'monthly' 
                ? 'bg-vibrant-orange text-white shadow-lg' 
                : 'bg-white text-logo-navy border border-gray-200 hover:border-vibrant-orange'
            }`}
          >
            <Star className="w-4 h-4 inline mr-2" />
            This Month
          </button>
          <button
            onClick={() => { setScope('role'); setRoleFilter('volunteer'); }}
            className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
              scope === 'role' && roleFilter === 'volunteer'
                ? 'bg-vibrant-orange text-white shadow-lg' 
                : 'bg-white text-logo-navy border border-gray-200 hover:border-vibrant-orange'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Volunteers
          </button>
          <button
            onClick={() => { setScope('role'); setRoleFilter('ngo'); }}
            className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
              scope === 'role' && roleFilter === 'ngo'
                ? 'bg-vibrant-orange text-white shadow-lg' 
                : 'bg-white text-logo-navy border border-gray-200 hover:border-vibrant-orange'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            NGOs
          </button>
          <button
            onClick={() => { setScope('role'); setRoleFilter('student'); }}
            className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
              scope === 'role' && roleFilter === 'student'
                ? 'bg-vibrant-orange text-white shadow-lg' 
                : 'bg-white text-logo-navy border border-gray-200 hover:border-vibrant-orange'
            }`}
          >
            <Zap className="w-4 h-4 inline mr-2" />
            Students
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-logo-navy to-logo-navy-light p-6">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">
                    {scope === 'global' && 'All-Time Champions'}
                    {scope === 'monthly' && 'Monthly Stars'}
                    {scope === 'role' && roleFilter && `Top ${roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}s`}
                  </h2>
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibrant-orange mx-auto mb-4" />
                  <p className="text-gray-500">Loading leaderboard...</p>
                </div>
              ) : leaderboardData.length === 0 ? (
                <div className="p-12 text-center">
                  <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Rankings Yet</h3>
                  <p className="text-gray-500 mb-4">Be the first to earn points and appear on the leaderboard!</p>
                  <Link to="/projects" className="inline-flex items-center gap-2 bg-vibrant-orange text-white px-6 py-3 rounded-full font-semibold hover:bg-vibrant-orange-light transition-colors">
                    Browse Projects <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {leaderboardData.map((user, index) => {
                    const rank = index + 1;
                    const isCurrentUser = currentUser?.uid === user.userId;
                    return (
                      <div
                        key={user.userId}
                        className={`flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors ${
                          isCurrentUser ? 'bg-vibrant-orange/5 border-l-4 border-vibrant-orange' : ''
                        } ${getRankBgColor(rank)}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">{getRankIcon(rank)}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Link 
                                to={`/u/${user.userId}`}
                                className="font-semibold text-logo-navy hover:text-vibrant-orange transition-colors"
                              >
                                {user.displayName || 'Anonymous User'}
                              </Link>
                              {isCurrentUser && (
                                <span className="px-2 py-0.5 bg-vibrant-orange text-white text-xs rounded-full">You</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">{user.role || 'Volunteer'}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-logo-navy">
                            {scope === 'monthly' ? user.monthlyPoints : user.totalPoints}
                          </div>
                          <div className="text-xs text-gray-500">points</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* How to Earn Points */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-logo-navy mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-vibrant-orange" />
                How to Earn Points
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-green-800">Complete a project</span>
                  <span className="font-bold text-green-600">+30 pts</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-800">Organize an event</span>
                  <span className="font-bold text-blue-600">+50 pts</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm text-purple-800">Complete your profile</span>
                  <span className="font-bold text-purple-600">+15 pts</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm text-orange-800">Join a project</span>
                  <span className="font-bold text-orange-600">+10 pts</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                  <span className="text-sm text-teal-800">Attend an event</span>
                  <span className="font-bold text-teal-600">+5 pts</span>
                </div>
              </div>
            </div>

            {/* Your Badges */}
            {currentUser && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-logo-navy mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-vibrant-orange" />
                  Your Badges
                </h3>
                {userBadges.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Complete projects and engage with the community to unlock badges!
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {userBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="px-4 py-2 bg-gradient-to-r from-vibrant-orange/10 to-vibrant-orange/20 rounded-full text-sm font-semibold text-vibrant-orange-dark"
                        title={badge.description}
                      >
                        {badge.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Your Achievements */}
            {currentUser && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-logo-navy mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Your Achievements
                </h3>
                {userAchievements.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Unlock achievements by reaching milestones in your volunteer journey!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {userAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                      >
                        <div className="font-semibold text-yellow-800 text-sm">{achievement.name}</div>
                        <div className="text-xs text-yellow-600">{achievement.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CTA for non-logged in users */}
            {!currentUser && (
              <div className="bg-gradient-to-r from-vibrant-orange to-vibrant-orange-light rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Join the Competition!</h3>
                <p className="text-sm text-white/90 mb-4">
                  Sign up to track your progress, earn badges, and compete on the leaderboard.
                </p>
                <Link
                  to="/volunteer"
                  className="inline-flex items-center gap-2 bg-white text-vibrant-orange px-6 py-3 rounded-full font-semibold hover:bg-cream-white transition-colors"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
