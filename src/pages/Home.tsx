import { Link } from 'react-router-dom';
import { Users, Mic, Brain, TrendingUp, Heart, ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Users,
      title: 'Realistic AI Couples',
      description: 'Practice with AI couples featuring rich psychological profiles, unique attachment styles, and authentic relationship dynamics.',
    },
    {
      icon: Mic,
      title: 'Voice Conversations',
      description: 'Engage naturally using real-time voice recognition. Speak as you would in an actual therapy session.',
    },
    {
      icon: Brain,
      title: 'Session Memory',
      description: 'AI partners remember previous interactions, enabling realistic therapeutic progression across multiple sessions.',
    },
    {
      icon: TrendingUp,
      title: 'Track Your Growth',
      description: 'Monitor your development with detailed analytics, skill assessments, and intervention tracking.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 px-4 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-terracotta-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-sage-100 rounded-full blur-3xl opacity-50" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                          bg-terracotta-50 border border-terracotta-200 mb-6
                          animate-slide-up">
            <Sparkles size={16} className="text-terracotta-500" />
            <span className="text-sm font-medium text-terracotta-700">
              AI-Powered Training
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold
                         text-earth-800 mb-6 animate-slide-up"
              style={{ animationDelay: '0.1s' }}>
            Master Couples Therapy with{' '}
            <span className="text-terracotta-600">Compassionate AI</span>
          </h1>

          <p className="text-lg md:text-xl text-earth-600 mb-10 max-w-2xl mx-auto
                        leading-relaxed animate-slide-up"
             style={{ animationDelay: '0.2s' }}>
            Practice therapeutic techniques with realistic AI-generated partners.
            Build confidence and skills in a safe, judgment-free environment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4
                          animate-slide-up"
               style={{ animationDelay: '0.3s' }}>
            <Link
              to="/couples"
              className="group inline-flex items-center gap-3 px-8 py-4
                         bg-terracotta-500 text-white rounded-2xl font-semibold
                         text-lg shadow-glow-terracotta hover:bg-terracotta-600
                         hover:shadow-xl transition-all duration-300
                         hover:-translate-y-0.5"
            >
              <Heart size={22} />
              Start a Session
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/progress"
              className="inline-flex items-center gap-2 px-6 py-4
                         bg-earth-100 text-earth-700 rounded-2xl font-medium
                         hover:bg-earth-200 transition-all"
            >
              View Progress
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-semibold text-earth-800 mb-3">
              Why Train With Us
            </h2>
            <p className="text-earth-500 max-w-lg mx-auto">
              A comprehensive platform designed for therapist trainees to practice
              and perfect their couples therapy skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, description }, index) => (
              <div
                key={title}
                className="card-warm p-6 animate-slide-up"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-terracotta
                                flex items-center justify-center mb-4 shadow-warm">
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="font-serif text-xl font-semibold text-earth-800 mb-2">
                  {title}
                </h3>
                <p className="text-earth-500 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Difficulty Levels */}
      <section className="py-16 px-4 bg-earth-100/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-semibold text-earth-800 mb-3">
              Progressive Learning Path
            </h2>
            <p className="text-earth-500 max-w-lg mx-auto">
              Start with foundational scenarios and advance to complex therapeutic challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Beginner */}
            <div className="group relative bg-sanctuary-50 rounded-2xl p-6
                            border-2 border-sage-200 hover:border-sage-400
                            transition-all duration-300 hover:-translate-y-1
                            hover:shadow-warm-lg overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-sage-100 rounded-bl-full opacity-50" />
              <div className="relative">
                <span className="inline-block px-3 py-1 text-xs font-semibold
                                 difficulty-beginner rounded-full mb-4">
                  BEGINNER
                </span>
                <h3 className="font-serif text-2xl font-semibold text-earth-800 mb-2">
                  Foundation
                </h3>
                <p className="text-earth-500 mb-4">
                  Low-conflict scenarios focused on building rapport and exploration techniques.
                </p>
                <ul className="space-y-2 text-sm text-earth-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sage-500" />
                    Empty nest transitions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sage-500" />
                    Life stage adjustments
                  </li>
                </ul>
              </div>
            </div>

            {/* Intermediate */}
            <div className="group relative bg-sanctuary-50 rounded-2xl p-6
                            border-2 border-earth-300 hover:border-earth-500
                            transition-all duration-300 hover:-translate-y-1
                            hover:shadow-warm-lg overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-earth-100 rounded-bl-full opacity-50" />
              <div className="relative">
                <span className="inline-block px-3 py-1 text-xs font-semibold
                                 difficulty-intermediate rounded-full mb-4">
                  INTERMEDIATE
                </span>
                <h3 className="font-serif text-2xl font-semibold text-earth-800 mb-2">
                  Development
                </h3>
                <p className="text-earth-500 mb-4">
                  Communication breakdowns and moderate conflict requiring active intervention.
                </p>
                <ul className="space-y-2 text-sm text-earth-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-earth-500" />
                    Four horsemen patterns
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-earth-500" />
                    Parenting conflicts
                  </li>
                </ul>
              </div>
            </div>

            {/* Advanced */}
            <div className="group relative bg-sanctuary-50 rounded-2xl p-6
                            border-2 border-terracotta-200 hover:border-terracotta-400
                            transition-all duration-300 hover:-translate-y-1
                            hover:shadow-warm-lg overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-terracotta-50 rounded-bl-full opacity-50" />
              <div className="relative">
                <span className="inline-block px-3 py-1 text-xs font-semibold
                                 difficulty-advanced rounded-full mb-4">
                  ADVANCED
                </span>
                <h3 className="font-serif text-2xl font-semibold text-earth-800 mb-2">
                  Mastery
                </h3>
                <p className="text-earth-500 mb-4">
                  Crisis scenarios, trauma-informed care, and complex family dynamics.
                </p>
                <ul className="space-y-2 text-sm text-earth-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500" />
                    Trust repair after infidelity
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500" />
                    Blended family challenges
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card-warm p-10 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-terracotta-50/50 to-sage-50/50" />

            <div className="relative">
              <Heart size={40} className="text-terracotta-400 mx-auto mb-4" />
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-earth-800 mb-4">
                Ready to Begin Your Journey?
              </h2>
              <p className="text-earth-500 mb-8 max-w-md mx-auto">
                Choose a couple to work with and start your first practice session today.
              </p>
              <Link
                to="/couples"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Users size={20} />
                Browse Available Couples
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
