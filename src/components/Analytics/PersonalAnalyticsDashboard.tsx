/**
 * Personal Analytics Dashboard - Phase 2 Feature
 * Shows personal impact metrics, skill development, and growth trends
 * Available to all users (not just admins)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Award, 
  Clock, 
  Users,
  Star,
  ArrowUp,
  ArrowDown,
  Trophy,
  Heart,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { subscribeToUserStats, subscribeToAchievements, UserPointsStats, Achievement } from '../../services/gamificationService';

interface PersonalStats {
  projectsJoined: number;
  projectsCompleted: number;
  eventsAttended: number;
  hoursVolunteered: number;
  peopleImpacted: number;
  skillsLearned: string[];
  monthlyActivity: { month: string; hours: number; projects: number }[];
}

interface SkillProgress {
  skill: string;
  level: number;
  projectsUsed: number;
  lastUsed?: Date;
}

const PersonalAnalyticsDashboard: React.FC = () => {
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PersonalStats | null>(null);
  const [pointsStats, setPointsStats] = useState<UserPointsStats | null>(null);
  const [skillProgress, setSkillProgress] = useState<SkillProgress[]>([]);
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const getDateRange = (
    range: 'month' | 'quarter' | 'year'
  ): { start: Date; end: Date; monthLabels: string[] } => {
    const end = new Date();
    const start = new Date(end); // clone to keep day alignment
    let monthLabels: string[] = [];

    switch (range) {
      case 'month': {
        start.setMonth(start.getMonth() - 1);
        monthLabels = getMonthLabels(1);
        break;
      }
      case 'quarter': {
        start.setMonth(start.getMonth() - 3);
        monthLabels = getMonthLabels(3);
        break;
      }
      case 'year': {
        start.setFullYear(start.getFullYear() - 1);
        monthLabels = getMonthLabels(12);
        break;
      }
    }

    // normalize to avoid TZ boundary issues
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return { start, end, monthLabels };
  };
  
  // Get month labels for the selected range
  const getMonthLabels = (months: number): string[] => {
    const labels: string[] = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(now.getMonth() - i);
      labels.push(monthNames[date.getMonth()]);
    }
    
    return labels;
  };

  useEffect(() => {
    if (!currentUser?.uid) return;
    
    const loadPersonalStats = async () => {
      try {
        setLoading(true);
        
        // Get date range based on selected time range
        const { start: startDate, monthLabels } = getDateRange(timeRange);
        const startTimestamp = startDate.getTime();
        
        // Fetch projects where user is participant
        const projectsQuery = query(
          collection(db, 'project_submissions'),
          where('participantIds', 'array-contains', currentUser.uid)
        );
        const projectsSnap = await getDocs(projectsQuery);
        
        let totalProjects = 0;
        let completedProjects = 0;
        let totalHours = 0;
        let totalImpacted = 0;
        const skillsUsed = new Map<string, number>();
        const monthlyData = new Map<string, { hours: number; projects: number }>();
        
        // Initialize monthly data
        monthLabels.forEach(month => {
          monthlyData.set(month, { hours: 0, projects: 0 });
        });
        
        projectsSnap.forEach(doc => {
          const project = doc.data();
          
          // Filter by time range if project has a date
          const projectDate = project.createdAt?.toDate?.() || project.startDate?.toDate?.() || new Date();
          const projectTimestamp = projectDate.getTime();
          
          // Skip projects outside the selected time range
          if (projectTimestamp < startTimestamp) {
            return;
          }
          
          totalProjects++;
          
          if (project.status === 'completed') {
            completedProjects++;
          }
          
          // Track skills used
          if (Array.isArray(project.requiredSkills)) {
            project.requiredSkills.forEach((skill: string) => {
              skillsUsed.set(skill, (skillsUsed.get(skill) || 0) + 1);
            });
          }
          
          const rawHours = project.hoursVolunteered ?? project.estimatedHours ?? 0;
          const hours = Number.isFinite(Number(rawHours)) ? Math.max(0, Number(rawHours)) : 0;
          totalHours += hours;

          const rawImpact = project.impactCount ?? project.participantIds?.length ?? 0;
          const impact = Number.isFinite(Number(rawImpact)) ? Math.max(0, Number(rawImpact)) : 0;
          totalImpacted += impact;
          
          // Track monthly activity
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const projectMonth = monthNames[projectDate.getMonth()];
          if (monthlyData.has(projectMonth)) {
            const existing = monthlyData.get(projectMonth)!;
            monthlyData.set(projectMonth, {
              hours: existing.hours + hours,
              projects: existing.projects + 1
            });
          }
        });
        
        // Fetch events attended
        let eventsAttended = 0;
        try {
          const eventsQuery = query(
            collection(db, 'event_registrations'),
            where('userId', '==', currentUser.uid)
          );
          const eventsSnap = await getDocs(eventsQuery);
          eventsSnap.forEach(doc => {
            const event = doc.data();
            const eventDate = event.registeredAt?.toDate?.() || new Date();
            if (eventDate.getTime() >= startTimestamp) {
              eventsAttended++;
            }
          });
        } catch {
          // Events collection may not exist
        }
        
        // Build skill progress data
        const skillProgressData: SkillProgress[] = [];
        skillsUsed.forEach((count, skill) => {
          skillProgressData.push({
            skill,
            level: Math.min(100, count * 20), // 20% per project up to 100%
            projectsUsed: count
          });
        });
        skillProgressData.sort((a, b) => b.projectsUsed - a.projectsUsed);
        
        // Convert monthly data to array
        const monthlyActivity = monthLabels.map(month => ({
          month,
          hours: monthlyData.get(month)?.hours || 0,
          projects: monthlyData.get(month)?.projects || 0
        }));
        
        setStats({
          projectsJoined: totalProjects,
          projectsCompleted: completedProjects,
          eventsAttended,
          hoursVolunteered: totalHours,
          peopleImpacted: totalImpacted,
          skillsLearned: Array.from(skillsUsed.keys()),
          monthlyActivity
        });
        
        setSkillProgress(skillProgressData.slice(0, 8)); // Top 8 skills
        
      } catch (error) {
        console.error('Error loading personal stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPersonalStats();
    
    // Subscribe to points stats
    const unsubPoints = subscribeToUserStats(currentUser.uid, setPointsStats);
    
    // Subscribe to backend achievements
    const unsubAchievements = subscribeToAchievements(currentUser.uid, setAchievements);
    
    return () => {
      unsubPoints();
      unsubAchievements();
    };
  }, [currentUser?.uid, timeRange]);



  const impactLevel = useMemo(() => {
    if (!stats) return { level: 'Newcomer', color: 'text-gray-500', next: 10 };
    const total = stats.projectsCompleted;
    if (total >= 50) return { level: 'Champion', color: 'text-purple-600', next: null };
    if (total >= 25) return { level: 'Leader', color: 'text-blue-600', next: 50 };
    if (total >= 10) return { level: 'Contributor', color: 'text-green-600', next: 25 };
    if (total >= 5) return { level: 'Active', color: 'text-yellow-600', next: 10 };
    return { level: 'Newcomer', color: 'text-gray-600', next: 5 };
  }, [stats]);

  // Check currentUser first - unauthenticated users should see sign-in message
  // This must come before loading check since loading only becomes false inside loadPersonalStats
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-cream-white pt-28 pb-12 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-logo-navy mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to view your personal analytics.</p>
          <Link to="/volunteer" className="text-vibrant-orange hover:underline">
            Join Wasilah →
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-white pt-28 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibrant-orange mx-auto mb-4" />
          <p className="text-logo-navy">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-white pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-modern-display font-bold text-logo-navy">
                Your Impact Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Track your volunteer journey and see your impact grow
              </p>
            </div>
            <div className="flex items-center gap-2">
              {['month', 'quarter', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-vibrant-orange text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Impact Level Banner */}
        <div className="bg-gradient-to-r from-logo-navy to-logo-navy-light rounded-2xl shadow-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-vibrant-orange rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Your Impact Level</p>
                <h2 className="text-2xl font-bold text-white">
                  {impactLevel.level}
                </h2>
                {impactLevel.next && (
                  <p className="text-white/60 text-xs mt-1">
                    {impactLevel.next - (stats?.projectsCompleted || 0)} more projects to next level
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-vibrant-orange">
                {pointsStats?.totalPoints || 0}
              </div>
              <p className="text-white/70 text-sm">Total Points</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            icon={Target}
            label="Projects Joined"
            value={stats?.projectsJoined || 0}
            color="bg-blue-50 text-blue-600"
          />
          <MetricCard
            icon={Award}
            label="Completed"
            value={stats?.projectsCompleted || 0}
            color="bg-green-50 text-green-600"
          />
          <MetricCard
            icon={Clock}
            label="Hours Volunteered"
            value={stats?.hoursVolunteered || 0}
            suffix="hrs"
            color="bg-purple-50 text-purple-600"
          />
          <MetricCard
            icon={Heart}
            label="People Impacted"
            value={stats?.peopleImpacted || 0}
            color="bg-red-50 text-red-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-logo-navy mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-vibrant-orange" />
              Activity Over Time
            </h3>
            <div className="space-y-4">
              {stats?.monthlyActivity.map((month, idx) => (
                <div key={month.month} className="flex items-center gap-4">
                  <span className="w-12 text-sm text-gray-600">{month.month}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-vibrant-orange to-vibrant-orange-light rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (month.hours / 50) * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-logo-navy w-16">
                        {month.hours} hrs
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Progress */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-logo-navy mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-vibrant-orange" />
              Skill Development
            </h3>
            {skillProgress.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Join projects to develop and track your skills!
              </p>
            ) : (
              <div className="space-y-4">
                {skillProgress.map((skill) => (
                  <div key={skill.skill}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-logo-navy">{skill.skill}</span>
                      <span className="text-xs text-gray-500">{skill.projectsUsed} projects</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-logo-teal transition-all duration-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <Link
              to="/projects"
              className="mt-4 flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-vibrant-orange hover:bg-vibrant-orange/10 rounded-lg transition-colors"
            >
              Find Projects to Grow Skills
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-logo-navy mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Recent Achievements
          </h3>
          {achievements.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🏆</div>
              <p className="text-gray-500 text-sm">
                Complete projects and participate in events to earn achievements!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.slice(0, 8).map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 rounded-xl text-center bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200"
                >
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="text-sm font-medium text-logo-navy">
                    {achievement.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {achievement.description}
                  </div>
                  <div className="text-xs text-green-600 mt-1">✓ Earned</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/leaderboard"
            className="bg-gradient-to-r from-vibrant-orange to-vibrant-orange-light text-white rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <Trophy className="w-8 h-8 mb-3" />
            <h4 className="font-semibold text-lg">View Leaderboard</h4>
            <p className="text-white/80 text-sm mt-1">See how you rank among other volunteers</p>
          </Link>
          <Link
            to="/projects"
            className="bg-gradient-to-r from-logo-teal to-logo-teal-light text-white rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <Target className="w-8 h-8 mb-3" />
            <h4 className="font-semibold text-lg">Find Projects</h4>
            <p className="text-white/80 text-sm mt-1">Discover opportunities that match your skills</p>
          </Link>
          <Link
            to="/u/me"
            className="bg-gradient-to-r from-logo-navy to-logo-navy-light text-white rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <Users className="w-8 h-8 mb-3" />
            <h4 className="font-semibold text-lg">Your Profile</h4>
            <p className="text-white/80 text-sm mt-1">View and share your public impact profile</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix?: string;
  trend?: number;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon: Icon, label, value, suffix, trend, color }) => (
  <div className="bg-white rounded-xl shadow-lg p-5">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      {trend !== undefined && (
        <div className={`flex items-center text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="text-2xl font-bold text-logo-navy">
      {value.toLocaleString()}{suffix && <span className="text-base font-normal text-gray-500 ml-1">{suffix}</span>}
    </div>
    <p className="text-sm text-gray-500 mt-1">{label}</p>
  </div>
);

export default PersonalAnalyticsDashboard;
