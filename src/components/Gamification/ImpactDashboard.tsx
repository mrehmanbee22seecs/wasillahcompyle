import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeToUserPoints, subscribeToUserStats, PointsEntry, UserPointsStats } from '../../services/gamificationService';
import BadgeSystem from './BadgeSystem';
import Achievements from './Achievements';
import Leaderboard from './Leaderboard';

interface ImpactDashboardProps {
  userId?: string;
  showLeaderboard?: boolean;
}

const ImpactDashboard: React.FC<ImpactDashboardProps> = ({ userId, showLeaderboard = true }) => {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState<PointsEntry[]>([]);
  const [stats, setStats] = useState<UserPointsStats | null>(null);

  // Use provided userId or fall back to current user
  const effectiveUserId = userId || currentUser?.uid;

  useEffect(() => {
    if (!effectiveUserId) {
      setEntries([]);
      setStats(null);
      return;
    }
    const unsubPoints = subscribeToUserPoints(effectiveUserId, setEntries);
    const unsubStats = subscribeToUserStats(effectiveUserId, setStats);
    return () => {
      unsubPoints();
      unsubStats();
    };
  }, [effectiveUserId]);

  if (!effectiveUserId) return null;

  return (
    <div className="space-y-4">
      <section className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-logo-navy">Impact & Points</h3>
            <p className="text-[11px] text-gray-600">
              Track your Wasilah impact, points and milestones.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-vibrant-orange">
              {stats?.totalPoints || 0}
            </div>
            <div className="text-[11px] text-gray-500">Total Points</div>
          </div>
        </div>

        {/* Monthly Points */}
        {stats && stats.monthlyPoints > 0 && (
          <div className="bg-gradient-to-r from-vibrant-orange/10 to-logo-teal/10 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-logo-navy font-medium">This Month</span>
              <span className="text-sm font-bold text-logo-teal">+{stats.monthlyPoints} pts</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <BadgeSystem userId={effectiveUserId} />
          <Achievements userId={effectiveUserId} />
        </div>

        <div className="mt-2">
          <h4 className="text-xs font-semibold text-logo-navy mb-2">Recent point history</h4>
          {entries.length === 0 ? (
            <p className="text-[11px] text-gray-600">No point-earning actions yet.</p>
          ) : (
            <ul className="space-y-1 max-h-40 overflow-y-auto text-[11px] text-gray-700">
              {entries.slice(0, 8).map((e) => {
                const date = e.createdAt?.toDate ? e.createdAt.toDate() : new Date();
                return (
                  <li key={e.id} className="flex items-center justify-between">
                    <span>{e.reason}</span>
                    <span className="text-gray-500">
                      +{e.points} · {date.toLocaleDateString()}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Link to full leaderboard */}
        <Link 
          to="/leaderboard" 
          className="flex items-center justify-center gap-2 w-full py-2 mt-2 text-xs font-semibold text-vibrant-orange hover:bg-vibrant-orange/10 rounded-lg transition-colors border border-vibrant-orange/30"
        >
          <Trophy className="w-3.5 h-3.5" />
          View Full Leaderboard & Rankings
          <ArrowRight className="w-3 h-3" />
        </Link>
      </section>

      {/* Embedded Leaderboard Widget */}
      {showLeaderboard && (
        <Leaderboard />
      )}
    </div>
  );
};

export default ImpactDashboard;


