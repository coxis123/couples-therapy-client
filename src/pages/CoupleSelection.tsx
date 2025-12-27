import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ChevronRight, Heart, Clock, AlertCircle } from 'lucide-react';

interface CoupleProfile {
  id: string;
  name: string;
  description: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  partner_a: { name: string; age: number };
  partner_b: { name: string; age: number };
  relationship_context: {
    relationshipDurationYears: number;
    presentingIssues: string[];
  };
}

export default function CoupleSelection() {
  const navigate = useNavigate();
  const [couples, setCouples] = useState<CoupleProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCouples();
  }, []);

  const fetchCouples = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/couples/templates`);
      if (response.ok) {
        const data = await response.json();
        // Only show The Chens - the only couple with Convai characters configured
        const availableCouples = data.filter((c: CoupleProfile) =>
          c.name.toLowerCase().includes('chen')
        );
        setCouples(availableCouples);
      }
    } catch (error) {
      console.error('Failed to fetch couples:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only The Chens couple is available (filtered during fetch)

  const startSession = (coupleId: string) => {
    navigate(`/session/${coupleId}`);
  };

  const getDifficultyClass = (level: string) => {
    switch (level) {
      case 'beginner': return 'difficulty-beginner';
      case 'intermediate': return 'difficulty-intermediate';
      case 'advanced': return 'difficulty-advanced';
      default: return 'difficulty-beginner';
    }
  };

  const getDifficultyAccent = (level: string) => {
    switch (level) {
      case 'beginner': return 'border-sage-300 hover:border-sage-400';
      case 'intermediate': return 'border-earth-300 hover:border-earth-400';
      case 'advanced': return 'border-terracotta-300 hover:border-terracotta-400';
      default: return 'border-earth-200';
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-earth-800">
              Choose Your Session
            </h1>
            <p className="text-earth-500 mt-1">
              Select a couple profile to begin practicing therapy techniques
            </p>
          </div>
{/* Create Custom button hidden - only pre-configured Convai couples available */}
        </div>

{/* Filters hidden - only one couple available */}

        {/* Couples Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 rounded-xl bg-earth-100 shimmer mb-4" />
            <div className="h-4 w-32 rounded bg-earth-100 shimmer mb-2" />
            <div className="h-3 w-24 rounded bg-earth-100 shimmer" />
          </div>
        ) : couples.length === 0 ? (
          <div className="text-center py-16 card-warm">
            <div className="w-16 h-16 rounded-2xl bg-earth-100 flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-earth-400" />
            </div>
            <h3 className="font-serif text-xl text-earth-700 mb-2">
              No Couples Found
            </h3>
            <p className="text-earth-500 max-w-sm mx-auto">
              No couples match this difficulty level. Try selecting a different filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {couples.map((couple, index) => (
              <div
                key={couple.id}
                className={`card-warm overflow-hidden cursor-pointer group
                            border-2 ${getDifficultyAccent(couple.difficulty_level)}
                            animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => startSession(couple.id)}
              >
                {/* Couple Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-serif text-xl font-semibold text-earth-800 pr-2">
                      {couple.name}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full
                                      ${getDifficultyClass(couple.difficulty_level)}`}>
                      {couple.difficulty_level.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-earth-500 text-sm line-clamp-2 leading-relaxed">
                    {couple.description}
                  </p>
                </div>

                {/* Partner Profiles */}
                <div className="px-6 pb-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-earth-50/50">
                    <div className="flex-1 text-center">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full
                                      bg-speaker-partnerA-accent/20 border-2 border-speaker-partnerA-accent
                                      flex items-center justify-center">
                        <span className="font-bold text-speaker-partnerA-text">A</span>
                      </div>
                      <p className="font-medium text-earth-800 text-sm">
                        {couple.partner_a?.name}
                      </p>
                      <p className="text-xs text-earth-500">Age {couple.partner_a?.age}</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <Heart size={20} className="text-terracotta-400 mb-1" />
                      <span className="text-xs text-earth-400">
                        {couple.relationship_context?.relationshipDurationYears}y
                      </span>
                    </div>

                    <div className="flex-1 text-center">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full
                                      bg-speaker-partnerB-accent/20 border-2 border-speaker-partnerB-accent
                                      flex items-center justify-center">
                        <span className="font-bold text-speaker-partnerB-text">B</span>
                      </div>
                      <p className="font-medium text-earth-800 text-sm">
                        {couple.partner_b?.name}
                      </p>
                      <p className="text-xs text-earth-500">Age {couple.partner_b?.age}</p>
                    </div>
                  </div>
                </div>

                {/* Presenting Issues */}
                <div className="px-6 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={14} className="text-earth-400" />
                    <span className="text-xs font-medium text-earth-500">
                      Presenting Issues
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {couple.relationship_context?.presentingIssues?.slice(0, 3).map((issue) => (
                      <span
                        key={issue}
                        className="px-2.5 py-1 bg-earth-100 text-earth-600 text-xs
                                   rounded-full border border-earth-200"
                      >
                        {issue}
                      </span>
                    ))}
                    {(couple.relationship_context?.presentingIssues?.length || 0) > 3 && (
                      <span className="px-2.5 py-1 bg-earth-50 text-earth-400 text-xs rounded-full">
                        +{couple.relationship_context.presentingIssues.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Start Button */}
                <div className="px-6 py-4 border-t border-earth-100
                                flex items-center justify-between
                                group-hover:bg-terracotta-50/50 transition-colors">
                  <div className="flex items-center gap-2 text-earth-400">
                    <Clock size={14} />
                    <span className="text-sm">
                      ~30 min session
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5 text-terracotta-600 font-medium text-sm">
                    Begin Session
                    <ChevronRight size={18}
                      className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        {!loading && couples.length > 0 && (
          <div className="mt-12 p-6 card-warm bg-earth-50/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0">
                <Users size={24} className="text-sage-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg font-semibold text-earth-800 mb-1">
                  How Sessions Work
                </h3>
                <p className="text-earth-500 text-sm leading-relaxed">
                  Each session places you in the therapist role with a unique AI couple.
                  Speak naturally or type your interventions. The AI partners will respond
                  with realistic emotional dynamics based on their psychological profiles.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
