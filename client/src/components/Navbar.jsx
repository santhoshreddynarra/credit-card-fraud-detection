import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, LogOut, LayoutDashboard, PlayCircle, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze Transaction', icon: PlayCircle },
    { id: 'history', label: 'Prediction History', icon: History }
  ];

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left Brand & Navigation */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-blue-600/10 border border-blue-500/20 rounded-md text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">
              FraudShield
            </span>
          </Link>

          {/* Navigation Tabs */}
          {activeTab && setActiveTab && (
            <nav className="flex items-center space-x-1 border-l border-gray-800 pl-6">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-gray-800 text-white border border-gray-700'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-950/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right User Profile */}
        <div className="flex items-center space-x-4 text-xs">
          {/* User Profile & Logout */}
          {user && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center font-bold text-blue-400 text-xs">
                  {userInitial}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                  <p className="text-[10px] text-gray-400 leading-tight">{user.email}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-1.5 text-gray-400 hover:text-rose-400 bg-gray-950 hover:bg-gray-800 border border-gray-800 rounded transition-colors"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
