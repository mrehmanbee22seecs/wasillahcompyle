import React, { useEffect, useState } from 'react';
import { Trophy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeToLeaderboard, UserPointsStats } from '../../services/gamificationService';

type Scope = 'global' | 'monthly' | 'role';

const Leaderboard: React.FC = () => {
  const { userData, currentUser } = useAuth();
  const [scope, setScope] = useState<Scope>('global');
  const [rows, setRows] = useState<UserPointsStats[]>([]);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToLeaderboard(scope, roleFilter, (list) => {
      setRows(list.slice(0, 10));
    });
    return () => unsub();
  }, [scope, roleFilter]);

  return (
    <section className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <h3 className="text-sm font-semibold text-logo-navy">Leaderboard</h3>
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <button
            className={`px-2 py-1 rounded ${
              scope === 'global' ? 'bg-logo-teal text-white' : 'text-gray-600'
            }`}
            onClick={() => setScope('global')}
          >
            Global
          </button>
          <button
            className={`px-2 py-1 rounded ${
              scope === 'monthly' ? 'bg-logo-teal text-white' : 'text-gray-600'
            }`}
            onClick={() => setScope('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-2 py-1 rounded ${
              scope === 'role' ? 'bg-logo-teal text-white' : 'text-gray-600'
            }`}
            onClick={() => {
              setScope('role');
              setRoleFilter(userData?.role || 'volunteer');
            }}
          >
            My role
          </button>
        </div>
      </div>
      {rows.length === 0 ? (
        <p className="text-xs text-gray-600">No leaderboard data yet.</p>
      ) : (
        <div className="space-y-1 text-[11px]">
          {rows.map((row, idx) => {
            const isCurrentUser = currentUser?.uid === row.userId;
            return (
              <div
                key={row.userId}
                className={`flex items-center justify-between py-1.5 px-2 rounded ${
                  isCurrentUser ? 'bg-vibrant-orange/10 border border-vibrant-orange/30' : 'border-b border-gray-50 last:border-b-0'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-5 text-center font-semibold ${isCurrentUser ? 'text-vibrant-orange' : ''}`}>
                    {idx + 1}
                  </span>
                  <span className={`font-medium ${isCurrentUser ? 'text-vibrant-orange' : 'text-logo-navy'}`}>
                    {row.displayName || 'User'}
                    {isCurrentUser && <span className="ml-1 text-[9px] bg-vibrant-orange text-white px-1 rounded">You</span>}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase">
                    {row.role}
                  </span>
                </div>
                <div className={`text-[11px] font-semibold ${isCurrentUser ? 'text-vibrant-orange' : 'text-logo-navy'}`}>
                  {scope === 'monthly' ? row.monthlyPoints : row.totalPoints} pts
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* View Full Leaderboard Link */}
      <Link 
        to="/leaderboard" 
        className="mt-4 flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold text-vibrant-orange hover:bg-vibrant-orange/10 rounded-lg transition-colors"
      >
        View Full Leaderboard
        <ArrowRight className="w-3 h-3" />
      </Link>
    </section>
  );
};

export default Leaderboard;


