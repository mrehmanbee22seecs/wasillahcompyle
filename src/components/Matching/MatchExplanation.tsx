/**
 * MatchExplanation Component - Phase 1 Feature Exposure
 * Shows detailed explanation of why a project matches a user's profile
 * Exposes the hidden matching algorithm insights to improve transparency
 */

import React from 'react';
import { CheckCircle, AlertCircle, TrendingUp, MapPin, Briefcase, Heart, Clock, Star, X } from 'lucide-react';
import { MatchingFactors } from '../../utils/matchingAlgorithm';

interface MatchExplanationProps {
  factors: MatchingFactors;
  isOpen: boolean;
  onClose: () => void;
  projectTitle?: string;
}

const MatchExplanation: React.FC<MatchExplanationProps> = ({ 
  factors, 
  isOpen, 
  onClose,
  projectTitle 
}) => {
  if (!isOpen) return null;

  const {
    totalScore,
    skillsScore,
    interestsScore,
    locationScore,
    availabilityScore,
    experienceScore,
    reasons,
    improvementSuggestions
  } = factors;

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-400';
  };

  const getScoreTextColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 70) return 'text-green-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-500';
  };

  const scoreCategories = [
    { 
      label: 'Skills Match', 
      score: skillsScore, 
      max: 35, 
      icon: Briefcase,
      description: 'How well your skills align with project requirements'
    },
    { 
      label: 'Interest Alignment', 
      score: interestsScore, 
      max: 20, 
      icon: Heart,
      description: 'Match between your interests and project category'
    },
    { 
      label: 'Location Proximity', 
      score: locationScore, 
      max: 25, 
      icon: MapPin,
      description: 'Geographic proximity to the project'
    },
    { 
      label: 'Availability', 
      score: availabilityScore, 
      max: 10, 
      icon: Clock,
      description: 'Timeline compatibility with your schedule'
    },
    { 
      label: 'Experience Level', 
      score: experienceScore, 
      max: 10, 
      icon: TrendingUp,
      description: 'Your volunteering experience level'
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-vibrant-orange to-vibrant-orange-light p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-white" />
              <div>
                <h2 className="text-xl font-bold text-white">Match Analysis</h2>
                {projectTitle && (
                  <p className="text-white/80 text-sm truncate max-w-[250px]">{projectTitle}</p>
                )}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close match explanation"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          
          {/* Overall Score */}
          <div className="mt-4 bg-white/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Overall Match Score</span>
              <span className="text-3xl font-bold text-white">{totalScore}%</span>
            </div>
            <div className="mt-2 w-full bg-white/30 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-white transition-all duration-500"
                style={{ width: `${totalScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Score Breakdown */}
          <div>
            <h3 className="text-lg font-semibold text-logo-navy mb-4">Score Breakdown</h3>
            <div className="space-y-4">
              {scoreCategories.map((category) => (
                <div key={category.label} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <category.icon className={`w-5 h-5 ${getScoreTextColor(category.score, category.max)}`} />
                      <span className="font-medium text-logo-navy">{category.label}</span>
                    </div>
                    <span className={`font-bold ${getScoreTextColor(category.score, category.max)}`}>
                      {category.score}/{category.max}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${getScoreColor(category.score, category.max)} transition-all duration-500`}
                      style={{ width: `${(category.score / category.max) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{category.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why This Match */}
          {reasons.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-logo-navy mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Why This Match
              </h3>
              <ul className="space-y-2">
                {reasons.map((reason, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-700 bg-green-50 p-3 rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvement Suggestions */}
          {improvementSuggestions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-logo-navy mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-vibrant-orange" />
                Improve Your Match
              </h3>
              <ul className="space-y-2">
                {improvementSuggestions.map((suggestion, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-700 bg-orange-50 p-3 rounded-lg"
                  >
                    <AlertCircle className="w-4 h-4 text-vibrant-orange flex-shrink-0 mt-0.5" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full bg-vibrant-orange text-white py-3 rounded-lg font-semibold hover:bg-vibrant-orange-light transition-colors"
            >
              Got It!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchExplanation;
