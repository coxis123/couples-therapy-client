import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Calendar, ArrowRight, Heart, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProgressData {
  id: string;
  couple_id: string;
  total_sessions: number;
  total_duration_seconds: number;
  last_session_at: string;
  couple: {
    name: string;
    difficulty_level: string;
  };
  skill_assessments: {
    empathy: number | null;
    activeListening: number | null;
    interventionTiming: number | null;
    conflictDeescalation: number | null;
  };
}

export default function Progress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, [user]);

  const fetchProgress = async () => {
    try {
      const userId = user?.id || 'demo-user';
      const response = await fetch(`/api/trainees/${userId}/progress`);
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const totalSessions = progress.reduce((sum, p) => sum + p.total_sessions, 0);
  const totalTime = progress.reduce((sum, p) => sum + p.total_duration_seconds, 0);

  const getSkillLevel = () => {
    if (totalSessions === 0) return 'Beginner';
    if (totalSessions < 5) return 'Developing';
    if (totalSessions < 15) return 'Intermediate';
    if (totalSessions < 30) return 'Advanced';
    return 'Expert';
  };

  const getDifficultyClass = (level: string) => {
    switch (level) {
      case 'beginner': return 'difficulty-beginner';
      case 'intermediate': return 'difficulty-intermediate';
      case 'advanced': return 'difficulty-advanced';
      default: return 'difficulty-beginner';
    }
  };

  const getSkillColor = (value: number | null) => {
    if (!value) return 'bg-earth-200';
    if (value <= 3) return 'bg-gradient-to-r from-terracotta-300 to-terracotta-400';
    if (value <= 6) return 'bg-gradient-to-r from-earth-400 to-earth-500';
    return 'bg-gradient-to-r from-sage-400 to-sage-500';
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold text-earth-800 mb-2">
            Your Progress
          </h1>
          <p className="text-earth-500">
            Track your development and growth as a couples therapist
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="card-warm p-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-terracotta-100
                              flex items-center justify-center">
                <Users className="text-terracotta-600" size={20} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-earth-800 mb-1">
              {progress.length}
            </p>
            <p className="text-sm text-earth-500">Couples Practiced</p>
          </div>

          <div className="card-warm p-5 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-sage-100
                              flex items-center justify-center">
                <Calendar className="text-sage-600" size={20} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-earth-800 mb-1">
              {totalSessions}
            </p>
            <p className="text-sm text-earth-500">Total Sessions</p>
          </div>

          <div className="card-warm p-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-earth-100
                              flex items-center justify-center">
                <Clock className="text-earth-600" size={20} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-earth-800 mb-1">
              {formatDuration(totalTime)}
            </p>
            <p className="text-sm text-earth-500">Practice Time</p>
          </div>

          <div className="card-warm p-5 animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-terracotta
                              flex items-center justify-center">
                <Award className="text-white" size={20} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-earth-800 mb-1">
              {getSkillLevel()}
            </p>
            <p className="text-sm text-earth-500">Current Level</p>
          </div>
        </div>

        {/* Progress by Couple */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl font-semibold text-earth-800">
            Progress by Couple
          </h2>
          {progress.length > 0 && (
            <Link
              to="/couples"
              className="text-sm text-terracotta-600 hover:text-terracotta-700 font-medium
                         flex items-center gap-1"
            >
              Practice More
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 rounded-xl bg-earth-100 shimmer mb-4" />
            <div className="h-4 w-32 rounded bg-earth-100 shimmer mb-2" />
            <div className="h-3 w-24 rounded bg-earth-100 shimmer" />
          </div>
        ) : progress.length === 0 ? (
          <div className="card-warm p-12 text-center animate-slide-up">
            <div className="w-16 h-16 rounded-2xl bg-earth-100
                            flex items-center justify-center mx-auto mb-4">
              <Heart size={32} className="text-earth-400" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-earth-800 mb-2">
              Begin Your Journey
            </h3>
            <p className="text-earth-500 mb-6 max-w-sm mx-auto">
              You haven't completed any therapy sessions yet. Start practicing
              to track your development.
            </p>
            <Link
              to="/couples"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Users size={20} />
              Start Your First Session
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {progress.map((item, index) => (
              <div
                key={item.id}
                className="card-warm p-6 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-earth-100
                                    flex items-center justify-center flex-shrink-0">
                      <Users size={24} className="text-earth-500" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-earth-800 mb-1">
                        {item.couple?.name || 'Unknown Couple'}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full
                                          ${getDifficultyClass(item.couple?.difficulty_level)}`}>
                          {item.couple?.difficulty_level}
                        </span>
                        <span className="text-sm text-earth-500">
                          {item.total_sessions} sessions
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-earth-500 sm:text-right">
                    <p className="flex items-center gap-2 sm:justify-end mb-1">
                      <Clock size={14} />
                      {formatDuration(item.total_duration_seconds)} total
                    </p>
                    <p>
                      Last: {new Date(item.last_session_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Skill Assessment Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { key: 'empathy', label: 'Empathy', icon: '💜' },
                    { key: 'activeListening', label: 'Active Listening', icon: '👂' },
                    { key: 'interventionTiming', label: 'Timing', icon: '⏱️' },
                    { key: 'conflictDeescalation', label: 'De-escalation', icon: '🕊️' },
                  ].map(({ key, label, icon }) => {
                    const value = item.skill_assessments?.[key as keyof typeof item.skill_assessments] || 0;
                    return (
                      <div key={key} className="p-3 bg-earth-50/50 rounded-xl">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="flex items-center gap-1.5 text-earth-600 font-medium">
                            <span className="text-xs">{icon}</span>
                            {label}
                          </span>
                          <span className="text-earth-500 font-semibold">
                            {value || '-'}<span className="text-earth-400 font-normal">/10</span>
                          </span>
                        </div>
                        <div className="h-2 bg-earth-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${getSkillColor(value)}`}
                            style={{ width: `${(value || 0) * 10}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skill Legend */}
        {progress.length > 0 && (
          <div className="mt-8 p-5 card-warm bg-earth-50/50">
            <h3 className="font-medium text-earth-700 mb-3">Skill Rating Guide</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-terracotta-300 to-terracotta-400" />
                <span className="text-earth-600">1-3: Developing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-earth-400 to-earth-500" />
                <span className="text-earth-600">4-6: Competent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-sage-400 to-sage-500" />
                <span className="text-earth-600">7-10: Proficient</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
