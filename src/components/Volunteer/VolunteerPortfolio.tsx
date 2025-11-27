/**
 * VolunteerPortfolio Component - Phase 2 Enhanced Volunteer Management
 * Showcases volunteer achievements, skills, and impact in a shareable format
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Star, 
  Trophy, 
  Target, 
  Clock, 
  Heart,
  Share2,
  ExternalLink,
  CheckCircle,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { 
  subscribeToUserStats, 
  subscribeToBadges, 
  subscribeToAchievements,
  UserPointsStats,
  Badge,
  Achievement 
} from '../../services/gamificationService';

interface VolunteerProject {
  id: string;
  title: string;
  category: string;
  completedAt?: Date;
  hoursContributed: number;
  impact?: string;
  skills: string[];
}

interface PortfolioProps {
  userId?: string;
  variant?: 'full' | 'compact';
  showShareButton?: boolean;
}

const VolunteerPortfolio: React.FC<PortfolioProps> = ({ 
  userId, 
  variant = 'full',
  showShareButton = true 
}) => {
  const { currentUser, userData } = useAuth();
  const effectiveUserId = userId || currentUser?.uid;
  
  const [loading, setLoading] = useState(true);
  const [pointsStats, setPointsStats] = useState<UserPointsStats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [completedProjects, setCompletedProjects] = useState<VolunteerProject[]>([]);
  const [topSkills, setTopSkills] = useState<{skill: string; count: number}[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [totalImpact, setTotalImpact] = useState(0);

  useEffect(() => {
    if (!effectiveUserId) return;

    const loadPortfolioData = async () => {
      try {
        setLoading(true);
        
        // Fetch completed projects
        const projectsQuery = query(
          collection(db, 'project_submissions'),
          where('participantIds', 'array-contains', effectiveUserId),
          where('status', '==', 'completed')
        );
        const projectsSnap = await getDocs(projectsQuery);
        
        const projects: VolunteerProject[] = [];
        const skillsMap = new Map<string, number>();
        let hours = 0;
        let impact = 0;
        
        projectsSnap.forEach(doc => {
          const data = doc.data();
          projects.push({
            id: doc.id,
            title: data.title,
            category: data.category,
            completedAt: data.completedAt?.toDate?.(),
            hoursContributed: data.durationEstimate || 8,
            impact: data.impactDescription,
            skills: data.requiredSkills || []
          });
          
          // Track skills
          (data.requiredSkills || []).forEach((skill: string) => {
            skillsMap.set(skill, (skillsMap.get(skill) || 0) + 1);
          });
          
          hours += data.durationEstimate || 8;
          impact += data.peopleImpacted || 0;
        });
        
        setCompletedProjects(projects);
        setTotalHours(hours);
        setTotalImpact(impact);
        
        // Sort and set top skills
        const sortedSkills = Array.from(skillsMap.entries())
          .map(([skill, count]) => ({ skill, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6);
        setTopSkills(sortedSkills);
        
      } catch (error) {
        console.error('Error loading portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolioData();
    
    // Subscribe to gamification data
    const unsubStats = subscribeToUserStats(effectiveUserId, setPointsStats);
    const unsubBadges = subscribeToBadges(effectiveUserId, setBadges);
    const unsubAchievements = subscribeToAchievements(effectiveUserId, setAchievements);
    
    return () => {
      unsubStats();
      unsubBadges();
      unsubAchievements();
    };
  }, [effectiveUserId]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/u/${effectiveUserId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Wasilah Volunteer Portfolio',
          text: 'Check out my volunteer impact at Wasilah!',
          url: shareUrl
        });
      } catch {
        // user cancelled or share failed; silently ignore
      }
      return;
    }

    // Fallback copy logic with robust error handling
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = shareUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      // TODO: replace with toast/snackbar state
      console.info('Portfolio link copied to clipboard');
    } catch (e) {
      console.error('Failed to copy share link', e);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-vibrant-orange mx-auto mb-4" />
        <p className="text-gray-500">Loading portfolio...</p>
      </div>
    );
  }

  if (!effectiveUserId) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Sign in to view your volunteer portfolio</p>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-logo-navy flex items-center gap-2">
            <Award className="w-5 h-5 text-vibrant-orange" />
            Volunteer Portfolio
          </h3>
          {showShareButton && (
            <button
              onClick={handleShare}
              className="p-2 text-gray-500 hover:text-vibrant-orange hover:bg-vibrant-orange/10 rounded-lg transition-colors"
              title="Share Portfolio"
              aria-label="Share portfolio"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* Compact Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">{completedProjects.length}</div>
            <div className="text-xs text-gray-600">Projects</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xl font-bold text-green-600">{totalHours}</div>
            <div className="text-xs text-gray-600">Hours</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-xl font-bold text-purple-600">{badges.length}</div>
            <div className="text-xs text-gray-600">Badges</div>
          </div>
        </div>
        
        {/* Top Skills */}
        {topSkills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {topSkills.slice(0, 4).map((s) => (
              <span key={s.skill} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                {s.skill}
              </span>
            ))}
            {topSkills.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                +{topSkills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-logo-navy to-logo-navy-light rounded-2xl shadow-xl p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Award className="w-8 h-8 text-vibrant-orange" />
            Volunteer Portfolio
          </h2>
          {showShareButton && (
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              aria-label="Share portfolio"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm">Share</span>
            </button>
          )}
        </div>
        
        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-3xl font-bold">{pointsStats?.totalPoints || 0}</div>
            <div className="text-sm text-white/70">Total Points</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-3xl font-bold">{completedProjects.length}</div>
            <div className="text-sm text-white/70">Projects Completed</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-3xl font-bold">{totalHours}</div>
            <div className="text-sm text-white/70">Hours Volunteered</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-3xl font-bold">{totalImpact}</div>
            <div className="text-sm text-white/70">People Impacted</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skills & Expertise */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-logo-navy mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-vibrant-orange" />
            Skills & Expertise
          </h3>
          {topSkills.length === 0 ? (
            <p className="text-gray-500 text-sm">Complete projects to build your skill profile!</p>
          ) : (
            <div className="space-y-3">
              {topSkills.map((s) => (
                <div key={s.skill}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-logo-navy">{s.skill}</span>
                    <span className="text-xs text-gray-500">{s.count} projects</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-vibrant-orange to-vibrant-orange-light"
                      style={{ width: `${Math.min(100, s.count * 20)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Badges & Achievements */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-logo-navy mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Badges Earned
          </h3>
          {badges.length === 0 ? (
            <p className="text-gray-500 text-sm">Earn badges by completing activities!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="px-3 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg text-sm font-medium text-yellow-800"
                  title={badge.description}
                >
                  {badge.name}
                </div>
              ))}
            </div>
          )}
          
          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-logo-navy mb-2">Achievements</h4>
              <div className="space-y-2">
                {achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{achievement.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-logo-navy mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Recent Projects
          </h3>
          {completedProjects.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm mb-3">No completed projects yet</p>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-vibrant-orange text-sm font-medium hover:underline"
              >
                Browse Projects <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {completedProjects.slice(0, 4).map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="font-medium text-logo-navy text-sm truncate">
                    {project.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{project.category}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{project.hoursContributed} hrs</span>
                  </div>
                </Link>
              ))}
              {completedProjects.length > 4 && (
                <p className="text-center text-sm text-gray-500">
                  +{completedProjects.length - 4} more projects
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerPortfolio;
