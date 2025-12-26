import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Users, Activity, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/couples', icon: Users, label: 'Couples' },
    { path: '/progress', icon: Activity, label: 'Progress' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-gradient-warm flex">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-sanctuary-50/95 backdrop-blur-sm border-b border-earth-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-terracotta flex items-center justify-center">
              <span className="text-white text-sm font-bold">CT</span>
            </div>
            <span className="font-serif text-lg font-semibold text-earth-800">
              Therapy Sim
            </span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-earth-600 hover:bg-earth-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-earth-800/30 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Panel */}
      <aside
        className={`
          lg:hidden fixed top-0 left-0 h-full w-72 z-50 bg-sanctuary-50 shadow-warm-lg
          transform transition-transform duration-300 ease-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-earth-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-terracotta flex items-center justify-center shadow-warm">
                <span className="text-white text-lg font-bold">CT</span>
              </div>
              <div>
                <h1 className="font-serif text-lg font-semibold text-earth-800">
                  Therapy Simulator
                </h1>
                <p className="text-xs text-earth-500">
                  AI Couples Training
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map(({ path, icon: Icon, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive(path)
                        ? 'bg-terracotta-100 text-terracotta-700 shadow-inner-warm'
                        : 'text-earth-600 hover:bg-earth-100'
                    }`}
                  >
                    <Icon size={20} strokeWidth={isActive(path) ? 2.5 : 2} />
                    <span className="font-medium">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-earth-200">
            {user ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-earth-800 truncate text-sm">
                    {user.email}
                  </p>
                  <p className="text-xs text-earth-500">Trainee</p>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    closeMobileMenu();
                  }}
                  className="p-2 rounded-lg text-earth-400 hover:text-terracotta-600 hover:bg-terracotta-50 transition-colors"
                  title="Sign out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/settings"
                onClick={closeMobileMenu}
                className="btn-primary block w-full text-center"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 xl:w-72 bg-sanctuary-50 border-r border-earth-200 flex-col fixed h-full">
        <div className="p-6 border-b border-earth-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-terracotta flex items-center justify-center shadow-warm">
              <span className="text-white text-lg font-bold">CT</span>
            </div>
            <div>
              <h1 className="font-serif text-lg font-semibold text-earth-800">
                Therapy Simulator
              </h1>
              <p className="text-xs text-earth-500">
                AI Couples Training
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(path)
                      ? 'bg-terracotta-100 text-terracotta-700 shadow-inner-warm'
                      : 'text-earth-600 hover:bg-earth-100'
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive(path) ? 2.5 : 2} />
                  <span className="font-medium">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-earth-200">
          {user ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-full bg-earth-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-earth-600 text-sm font-medium">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-earth-800 truncate text-sm">
                    {user.email}
                  </p>
                  <p className="text-xs text-earth-500">Trainee</p>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="p-2 rounded-lg text-earth-400 hover:text-terracotta-600 hover:bg-terracotta-50 transition-colors"
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/settings"
              className="btn-primary block w-full text-center"
            >
              Sign In
            </Link>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 xl:ml-72 min-h-screen">
        {/* Mobile spacer for fixed header */}
        <div className="h-14 lg:hidden" />
        <div className="page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
