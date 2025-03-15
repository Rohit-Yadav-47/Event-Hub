import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Calendar,
  Search,
  MessageSquare,
  Menu,
  X,
  User,
  Bell,
  Sun,
  Moon,
  Settings,
  LogOut,
  ChevronDown,
  Activity
} from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navigationLinks = [
    { name: 'Home', to: '/', icon: <Calendar className="w-5 h-5 mr-2" /> },
    { name: 'Events', to: '/events', icon: <Calendar className="w-5 h-5 mr-2" /> },
    { name: 'Community', to: '/community', icon: <Activity className="w-5 h-5 mr-2" /> },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle search with keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Toggle Dark Mode and persist preference
  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Initialize Dark Mode based on user's preference or system settings
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      // If no preference, use system setting
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        notificationsDropdownRef.current &&
        !notificationsDropdownRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
    setSearchQuery('');
  };

  // Example user data (replace with actual user data)
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://via.placeholder.com/150',
    role: 'Premium Member'
  };

  // Example notifications (replace with actual notifications)
  const notifications = [
    { id: 1, message: 'New event: Tech Meetup', time: '2 hours ago', read: false },
    { id: 2, message: 'You have a new friend request', time: '1 day ago', read: true },
    { id: 3, message: 'Event reminder: Health Workshop tomorrow', time: '3 days ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
        : 'bg-white dark:bg-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section with animation */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group transition-transform duration-300 transform hover:scale-105"
          >
            <div className="relative">
              <Calendar className="w-7 h-7 text-blue-600 dark:text-blue-400 transition-all duration-300" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            </div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              EventHub
            </span>
          </Link>

          {/* Desktop Navigation with hover effects */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                end
                className={({ isActive }) =>
                  `relative group flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 ${
                    isActive ? 'text-blue-600 dark:text-blue-400 font-medium' : ''
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    <span
                      className={`absolute left-0 -bottom-1 w-full h-0.5 bg-blue-600 dark:bg-blue-400 transform transition-transform duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    ></span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>


          {/* Action Icons and Profile */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button - Added visible button */}
            <button
              onClick={handleDarkModeToggle}
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 relative focus:outline-none p-1 rounded-full hover:bg-gray-100"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 relative focus:outline-none p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-haspopup="true"
                aria-expanded={isNotificationsOpen}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {/* Notification Badge */}
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full z-10 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown with animations */}
              {isNotificationsOpen && (
                <div
                  ref={notificationsDropdownRef}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 z-50 border border-gray-200 dark:border-gray-700 animate-fadeIn"
                >
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Notifications</h4>
                    <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <Link
                          key={notification.id}
                          to="#"
                          className={`block px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => setIsNotificationsOpen(false)}
                        >
                          <div className="flex justify-between">
                            <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                              {notification.message}
                            </p>
                            {!notification.read && (
                              <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                        </Link>
                      ))
                    ) : (
                      <p className="px-4 py-6 text-sm text-center text-gray-500 dark:text-gray-400">No new notifications.</p>
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      to="/notifications"
                      className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={() => setIsNotificationsOpen(false)}
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

           

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 focus:outline-none group"
                aria-haspopup="true"
                aria-expanded={isProfileDropdownOpen}
                aria-label="User Menu"
              >
                <img
                  src={user.avatar || 'https://via.placeholder.com/150'}
                  alt={`${user.name}'s avatar`}
                  className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-transparent group-hover:ring-blue-500 dark:group-hover:ring-blue-400 transition-all duration-300"
                  />
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
  
                {/* Profile Dropdown with animations */}
                {isProfileDropdownOpen && (
                  <div
                    ref={profileDropdownRef}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 z-50 border border-gray-200 dark:border-gray-700 animate-fadeIn"
                  >
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center">
                        <img
                          src={user.avatar || 'https://via.placeholder.com/150'}
                          alt={`${user.name}'s avatar`}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-xs">
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Your Profile
                    </Link>
                    
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    
                    <Link
                      to="/logout"
                      className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Link>
                  </div>
                )}
              </div>
  
              {/* Mobile Menu Button with animation */}
              <button
                className="md:hidden p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 animate-fadeIn" />
                ) : (
                  <Menu className="w-6 h-6 animate-fadeIn" />
                )}
              </button>
            </div>
          </div>
        </div>
  
        {/* Mobile Navigation Menu with animations */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 shadow-md animate-slideDown">
            
            <nav className="px-2 pt-2 pb-4 space-y-1">
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.to}
                  end
                  className={({ isActive }) =>
                    isActive
                      ? 'flex items-center px-3 py-2 rounded-lg text-base font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150'
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.icon}
                  {link.name}
                </NavLink>
              ))}
              
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                Quick Links
              </div>
              
              <NavLink
                to="/events/create"
                className="flex items-center px-3 py-2 rounded-lg text-base text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Create Event
              </NavLink>
              
              <NavLink
                to="/notifications"
                className="flex items-center px-3 py-2 rounded-lg text-base text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Bell className="w-5 h-5 mr-2" />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
              
              <NavLink
                to="/assistant"
                className="flex items-center px-3 py-2 rounded-lg text-base text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Assistant
              </NavLink>

              <NavLink
                to="#"
                className="flex items-center px-3 py-2 rounded-lg text-base text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-150"
                onClick={(e) => {
                  e.preventDefault();
                  handleDarkModeToggle();
                  setIsMobileMenuOpen(false);
                }}
              >
                {isDarkMode ? (
                  <><Sun className="w-5 h-5 mr-2" />Light Mode</>
                ) : (
                  <><Moon className="w-5 h-5 mr-2" />Dark Mode</>
                )}
              </NavLink>
            </nav>
          </div>
        )}
        
        {/* CSS animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideDown {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-in-out;
          }
          
          .animate-slideDown {
            animation: slideDown 0.3s ease-in-out;
          }
          
          .animate-ping {
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          
          @keyframes ping {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
        `}</style>
      </header>
    );
  }