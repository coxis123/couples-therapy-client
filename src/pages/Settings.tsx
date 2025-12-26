import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mic, Volume2, Shield, LogIn, LogOut, Mail, Lock, UserCircle } from 'lucide-react';

export default function Settings() {
  const { user, signIn, signUp, signOut, loading, error } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, fullName);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      // Error handled by context
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-12 h-12 rounded-xl bg-earth-100 shimmer mb-4" />
        <div className="h-4 w-32 rounded bg-earth-100 shimmer mb-2" />
        <div className="h-3 w-24 rounded bg-earth-100 shimmer" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold text-earth-800 mb-2">
            Settings
          </h1>
          <p className="text-earth-500">
            Manage your account and preferences
          </p>
        </div>

        {/* Auth Section */}
        <section className="card-warm p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-terracotta-100
                            flex items-center justify-center">
              <User className="text-terracotta-600" size={20} />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-earth-800">Account</h2>
              <p className="text-sm text-earth-500">Sign in to save your progress</p>
            </div>
          </div>

          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-earth-50/50 border border-earth-200">
                <div className="w-12 h-12 rounded-full bg-terracotta-100 flex items-center justify-center">
                  <span className="text-terracotta-600 text-lg font-semibold">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-earth-800 truncate">{user.email}</p>
                  <p className="text-sm text-earth-500">Therapist Trainee</p>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-5 py-2.5 bg-earth-100 text-earth-700
                           rounded-xl font-medium hover:bg-earth-200 transition-colors"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-earth-700 mb-2">
                    <UserCircle size={16} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input-warm"
                    placeholder="Your full name"
                    required={isSignUp}
                  />
                </div>
              )}

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-earth-700 mb-2">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-warm"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-earth-700 mb-2">
                  <Lock size={16} />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-warm"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-terracotta-50 border border-terracotta-200">
                  <p className="text-terracotta-700 text-sm">{error}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  <LogIn size={18} />
                  {authLoading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-terracotta-600 hover:text-terracotta-700 font-medium
                             hover:underline underline-offset-2 transition-colors"
                >
                  {isSignUp ? 'Already have an account?' : 'Need an account?'}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Audio Settings */}
        <section className="card-warm p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-sage-100
                            flex items-center justify-center">
              <Mic className="text-sage-600" size={20} />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-earth-800">Audio</h2>
              <p className="text-sm text-earth-500">Configure voice settings</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-medium text-earth-800">Microphone</p>
                <p className="text-sm text-earth-500">Select your input device</p>
              </div>
              <select className="select-warm">
                <option>Default Microphone</option>
              </select>
            </div>

            <div className="h-px bg-earth-200" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-medium text-earth-800">Speaker</p>
                <p className="text-sm text-earth-500">Select your output device</p>
              </div>
              <select className="select-warm">
                <option>Default Speaker</option>
              </select>
            </div>

            <div className="h-px bg-earth-200" />

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-earth-800">Voice Activity Detection</p>
                <p className="text-sm text-earth-500">Automatically detect when you're speaking</p>
              </div>
              <label className="toggle-warm">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="toggle-track peer-checked:bg-terracotta-500">
                  <div className="toggle-thumb peer-checked:translate-x-5" />
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* Playback Settings */}
        <section className="card-warm p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-earth-100
                            flex items-center justify-center">
              <Volume2 className="text-earth-600" size={20} />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-earth-800">Playback</h2>
              <p className="text-sm text-earth-500">Control audio output</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-medium text-earth-800">AI Voice Volume</p>
                <p className="text-sm text-earth-500">Adjust character voice volume</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="80"
                  className="range-warm w-32"
                />
                <span className="text-sm font-medium text-earth-600 w-10">80%</span>
              </div>
            </div>

            <div className="h-px bg-earth-200" />

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-earth-800">Show Transcripts</p>
                <p className="text-sm text-earth-500">Display text alongside audio</p>
              </div>
              <label className="toggle-warm">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="toggle-track peer-checked:bg-terracotta-500">
                  <div className="toggle-thumb peer-checked:translate-x-5" />
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section className="card-warm p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.25s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-sage-100
                            flex items-center justify-center">
              <Shield className="text-sage-600" size={20} />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-earth-800">Privacy</h2>
              <p className="text-sm text-earth-500">Manage data preferences</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-earth-800">Save Session Recordings</p>
                <p className="text-sm text-earth-500">Store audio for review (uses more storage)</p>
              </div>
              <label className="toggle-warm">
                <input type="checkbox" className="sr-only peer" />
                <div className="toggle-track peer-checked:bg-terracotta-500">
                  <div className="toggle-thumb peer-checked:translate-x-5" />
                </div>
              </label>
            </div>

            <div className="h-px bg-earth-200" />

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-earth-800">Analytics</p>
                <p className="text-sm text-earth-500">Help improve the simulator with anonymous data</p>
              </div>
              <label className="toggle-warm">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="toggle-track peer-checked:bg-terracotta-500">
                  <div className="toggle-thumb peer-checked:translate-x-5" />
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* App Info */}
        <div className="text-center text-sm text-earth-400 mt-8 mb-4">
          <p>Couples Therapy Training Simulator</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
