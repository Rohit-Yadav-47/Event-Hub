import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUserPlus, FaUserMinus, FaUser, FaCalendarAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { AiOutlinePlus, AiOutlineSearch, AiOutlineHeart } from "react-icons/ai";
import { motion } from "framer-motion";

// Define TypeScript interfaces (Optional but recommended)
interface User {
  id: number;
  username: string;
  email: string;
  interests: string[];
  avatar?: string; // Optional, since we'll use random images
  about?: string;
}

interface Event {
  id: number;
  name: string;
  location: string;
  type: string;
  date: string;
  day: string;
  time: string;
  description?: string;
  image_url?: string;
}

export default function UserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const numericUserId = userId ? parseInt(userId, 10) : 1; // Default to user 1 if no ID

  useEffect(() => {
    if (!userId) {
      // Redirect to default user profile if no ID provided
      navigate('/profile/1');
    }
  }, [userId, navigate]);

  // State variables
  const [user, setUser] = useState<User | null>(null); // User details
  const [loadingUser, setLoadingUser] = useState(false); // Loading state for user details
  const [errorUser, setErrorUser] = useState<string | null>(null); // Error state for user details

  const [activeTab, setActiveTab] = useState<string>('Profile'); // Active tab: 'Profile', 'Find Friends', 'Suggested Events'

  const [relatedUsers, setRelatedUsers] = useState<User[]>([]); // Related users based on interests or search
  const [loadingMatch, setLoadingMatch] = useState(false); // Loading state for related users
  const [errorMatch, setErrorMatch] = useState<string | null>(null); // Error state for related users

  const [searchQuery, setSearchQuery] = useState<string>(''); // Search input for related users

  const [friends, setFriends] = useState<User[]>([]); // List of friends added by the user

  // Suggested Events State Variables
  const [suggestedEvents, setSuggestedEvents] = useState<Event[]>([]); // Suggested events based on interests
  const [loadingEvents, setLoadingEvents] = useState(false); // Loading state for suggested events
  const [errorEvents, setErrorEvents] = useState<string | null>(null); // Error state for suggested events

  // Add More Interests State Variables
  const [newInterest, setNewInterest] = useState<string>(''); // Input for new interest
  const [updatingInterests, setUpdatingInterests] = useState(false); // Loading state for updating interests
  const [errorInterests, setErrorInterests] = useState<string | null>(null); // Error state for updating interests
  const [successInterests, setSuccessInterests] = useState<string | null>(null); // Success message for updating interests

  const API_BASE_URL = 'http://127.0.0.1:8000'; // Replace with your FastAPI backend URL

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      try {
        const response = await fetch(`${API_BASE_URL}/users/${numericUserId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data: User = await response.json();
        setUser(data);
      } catch (err: any) {
        console.error("Error fetching user details:", err);
        setErrorUser(err.message || 'An unexpected error occurred.');
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [numericUserId, API_BASE_URL]);

  // Fetch related users based on search query or user interests with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const fetchRelatedUsers = async () => {
        if (!user) {
          setRelatedUsers([]);
          return;
        }

        setLoadingMatch(true);
        setErrorMatch(null);

        try {
          // Prepare the query
          const query =
            searchQuery.trim() !== ''
              ? searchQuery
                  .split(',')
                  .map((interest: string) => interest.trim())
                  .filter((interest: string) => interest !== '')
                  .join(', ')
              : user.interests.join(', ');

          const payload = {
            query,
          };

          const response = await fetch(`${API_BASE_URL}/match/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.detail || 'Failed to fetch related users');
          }

          // Handle the API response
          if (data.users && Array.isArray(data.users)) {
            setRelatedUsers(data.users);
          } else {
            setRelatedUsers([]);
          }
        } catch (err: any) {
          console.error("Error fetching related users:", err);
          setErrorMatch(err.message || 'An unexpected error occurred.');
        } finally {
          setLoadingMatch(false);
        }
      };

      fetchRelatedUsers();
    }, 500); // 500ms debounce delay

    // Cleanup function to cancel the timeout if searchQuery changes before 500ms
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, user, API_BASE_URL]);

  // Fetch suggested events based on user interests when "Suggested Events" tab is active
  useEffect(() => {
    if (activeTab !== 'Suggested Events' || !user) {
      return;
    }

    const fetchSuggestedEvents = async () => {
      setLoadingEvents(true);
      setErrorEvents(null);

      try {
        // Prepare the query based on user's interests
        const query = user.interests.join(', ');

        const payload = {
          query,
        };

        const response = await fetch(`${API_BASE_URL}/chatbot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Failed to fetch suggested events');
        }

        // Handle the API response
        if (data.events && Array.isArray(data.events)) {
          setSuggestedEvents(data.events);
        } else {
          setSuggestedEvents([]);
        }
      } catch (err: any) {
        console.error("Error fetching suggested events:", err);
        setErrorEvents(err.message || 'An unexpected error occurred.');
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchSuggestedEvents();
  }, [activeTab, user, API_BASE_URL]);

  // Handle tab switching
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery('');
    // Reset states related to the previous tab if necessary
    if (tab !== 'Find Friends') {
      setRelatedUsers([]);
      setErrorMatch(null);
      setLoadingMatch(false);
    }
    if (tab !== 'Suggested Events') {
      setSuggestedEvents([]);
      setErrorEvents(null);
      setLoadingEvents(false);
    }
  };

  // Handle search input for related users
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle adding a friend
  const handleAddFriend = async (friend: User) => {
    if (friends.find((f) => f.id === friend.id)) {
      return;
    }

    try {
      const payload = {
        user_id: numericUserId,
        friend_id: friend.id,
      };

      const response = await fetch(`${API_BASE_URL}/add-friend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to add friend');
      }

      // Update local state
      setFriends([...friends, friend]);
    } catch (err: any) {
      console.error("Error adding friend:", err);
      // Optionally, set an error state to display to the user
      alert(err.message || 'Failed to add friend.');
    }
  };

  // Handle adding an event to favorites (Optional Feature)
  const handleAddFavoriteEvent = (event: Event) => {
    // Implement this function based on your requirements
    // For example, add the event to a favorites list or send a request to the backend
    console.log(`Added event to favorites: ${event.name}`);
    alert(`Added "${event.name}" to favorites.`);
  };

  // Handle adding a new interest
  const handleAddInterest = async () => {
    if (newInterest.trim() === '') {
      setErrorInterests('Interest cannot be empty.');
      return;
    }

    setUpdatingInterests(true);
    setErrorInterests(null);
    setSuccessInterests(null);

    try {
      const payload = {
        user_id: numericUserId,
        new_interest: newInterest.trim(),
      };

      const response = await fetch(`${API_BASE_URL}/users/${numericUserId}/interests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to add new interest');
      }

      // Update user interests in state
      setUser((prevUser) => ({
        ...prevUser,
        interests: [...prevUser!.interests, newInterest.trim()],
      }));

      setSuccessInterests('Interest added successfully!');
      setNewInterest('');
    } catch (err: any) {
      console.error("Error adding new interest:", err);
      setErrorInterests(err.message || 'An unexpected error occurred.');
    } finally {
      setUpdatingInterests(false);
    }
  };

  // Render loading state with animation - improved with a nicer spinner
  if (loadingUser) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mb-4"
        />
        <p className="text-blue-800 text-lg font-medium">Loading your profile...</p>
      </div>
    );
  }

  // Render error state
  if (errorUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{errorUser}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If user data is not yet fetched
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 z- to-purple-50">
      {/* Hero Banner - More vibrant with subtle pattern */}
      <div className="relative bg-gradient-to-r  from-indigo-600 to-purple-600 h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end">
          <div className="pb-6 md:pb-8 relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Welcome back, {user.username}!
            </h1>
            <p className="text-blue-100 mt-2">Discover new events and connect with friends</p>
          </div>
        </div>
      </div>

      {/* Profile Content - Better spacing and shadows */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 -mt-12 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-8">
            {/* Profile Card - Enhanced with better visual hierarchy */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden"
            >
              <div className="bg-blue-600 h-24"></div>
              <div className="px-6 pb-6">
                <div className="flex flex-col items-center">
                  <div className="relative -mt-12">
                    <img
                      src={`https://picsum.photos/seed/${user.id}/200/200`}
                      alt={user.username}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute bottom-0 right-0 bg-green-500 h-5 w-5 rounded-full border-2 border-white"></div>
                  </div>
                  <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.username}</h2>
                  <p className="text-gray-500">{user.email}</p>
                  <p className="mt-4 text-center text-gray-600 italic">
                    "{user.about || "No bio yet. Add something about yourself!"}"
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-100 px-6 py-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  My Interests
                </h3>
                {user.interests && user.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full text-sm font-medium shadow-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No interests added yet.</p>
                )}
              </div>
            </motion.div>

            {/* Add Interests Card - Improved visual style */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden"
            >
              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <AiOutlinePlus className="mr-2 text-purple-600" />
                  Add More Interests
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add a new interest..."
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
                  />
                  <button
                    onClick={handleAddInterest}
                    disabled={updatingInterests}
                    className={`px-4 py-2 rounded-lg text-white transition-all duration-200 flex items-center ${
                      updatingInterests 
                        ? "bg-gray-400" 
                        : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    }`}
                  >
                    <AiOutlinePlus className="mr-1" size={16} />
                    Add
                  </button>
                </div>
                
                {/* Success and Error Messages */}
                {successInterests && (
                  <p className="flex items-center text-green-600 mt-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {successInterests}
                  </p>
                )}
                {errorInterests && (
                  <p className="flex items-center text-red-600 mt-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {errorInterests}
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Tabs with better tab styling */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs Navigation - Enhanced with better visual cues */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="sm:hidden">
                <select
                  id="tabs"
                  name="tabs"
                  className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  defaultValue={activeTab}
                  onChange={(e) => handleTabClick(e.target.value)}
                >
                  {['Profile', 'Find Friends', 'Suggested Events'].map((tab) => (
                    <option key={tab}>{tab}</option>
                  ))}
                </select>
              </div>
              <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px justify-around" aria-label="Tabs">
                    {['Profile', 'Find Friends', 'Suggested Events'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={`${
                          activeTab === tab
                            ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        } whitespace-nowrap py-4 px-8 border-b-2 font-medium text-sm transition-all duration-200`}
                        aria-current={activeTab === tab ? 'page' : undefined}
                      >
                        {tab === 'Profile' && <FaUser className="inline mr-2" />}
                        {tab === 'Find Friends' && <FaUserPlus className="inline mr-2" />}
                        {tab === 'Suggested Events' && <FaCalendarAlt className="inline mr-2" />}
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </motion.div>

            {/* Tab Content - Each tab panel with better formatting */}
            {activeTab === "Profile" && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl shadow-xl p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">About Me</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700">
                    {user.about || "No description provided. Edit your profile to add details about yourself!"}
                  </p>
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Account Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Username</p>
                        <p className="font-medium text-gray-900">{user.username}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{user.email}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">User ID</p>
                        <p className="font-medium text-gray-900">#{user.id}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Interests Count</p>
                        <p className="font-medium text-gray-900">{user.interests?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Find Friends" && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl shadow-xl overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaUserPlus className="mr-2 text-indigo-600" />
                    Find New Friends
                  </h3>

                  {/* Search Input for Finding Friends */}
                  <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AiOutlineSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search by interests or keywords..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Loading Indicator */}
                  {loadingMatch ? (
                    <div className="flex justify-center py-8">
                      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      {/* Error Message */}
                      {errorMatch && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-red-700">{errorMatch}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Related Users List */}
                      {relatedUsers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {relatedUsers.map((relatedUser) => (
                            <div key={relatedUser.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition">
                              <div className="flex items-start space-x-4">
                                <img 
                                  src={`https://picsum.photos/seed/${relatedUser.id}/80/80`} 
                                  alt={relatedUser.username}
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900">{relatedUser.username}</h4>
                                  <p className="text-sm text-gray-500">{relatedUser.email}</p>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {relatedUser.interests?.slice(0, 3).map((interest, i) => (
                                      <span key={i} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full">
                                        {interest}
                                      </span>
                                    ))}
                                    {relatedUser.interests?.length > 3 && (
                                      <span className="bg-gray-50 text-gray-500 text-xs px-2 py-1 rounded-full">
                                        +{relatedUser.interests.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleAddFriend(relatedUser)}
                                  disabled={friends.find((f) => f.id === relatedUser.id)}
                                  className={`ml-2 inline-flex items-center px-3 py-2 border rounded-full text-sm leading-4 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                    friends.find((f) => f.id === relatedUser.id)
                                      ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                                      : "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700"
                                  }`}
                                >
                                  {friends.find((f) => f.id === relatedUser.id) ? (
                                    <>
                                      <FaUserPlus className="mr-1 -ml-1" size={14} />
                                      Added
                                    </>
                                  ) : (
                                    <>
                                      <FaUserPlus className="mr-1 -ml-1" size={14} />
                                      Add
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 bg-gray-50 rounded-lg">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                          </svg>
                          <p className="mt-2 text-gray-600">No users found matching your interests</p>
                          <p className="text-gray-500 text-sm">Try searching with different keywords</p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Friends List */}
                  {friends.length > 0 && (
                    <div className="mt-10">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Your Friends
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {friends.map((friend) => (
                          <div key={friend.id} className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={`https://picsum.photos/seed/${friend.id}/60/60`} 
                                alt={friend.username}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{friend.username}</p>
                                <p className="text-xs text-gray-500">{friend.interests?.length || 0} interests</p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <button className="w-full text-xs flex items-center justify-center py-1 text-gray-600 hover:text-red-600 transition">
                                <FaUserMinus className="mr-1" size={12} />
                                Remove Friend
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "Suggested Events" && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl shadow-xl overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaCalendarAlt className="mr-2 text-indigo-600" />
                    Suggested Events For You
                  </h3>

                  {/* Loading Indicator */}
                  {loadingEvents ? (
                    <div className="flex justify-center py-12">
                      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      {/* Error Message */}
                      {errorEvents && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                          <p className="text-sm text-red-700">{errorEvents}</p>
                        </div>
                      )}

                      {/* Suggested Events List */}
                      {suggestedEvents.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                          {suggestedEvents.map((event) => (
                            <div key={event.id} className="rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition">
                              <div className="md:flex">
                                <div className="relative overflow-hidden">
                                  <img
                                    className="h-48 w-full object-cover md:w-48 transition-transform duration-500 hover:scale-110"
                                    src={`https://picsum.photos/seed/${event.id}/400/300`}
                                    alt={event.name}
                                  />
                                  <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs px-2 py-1 m-2 rounded-lg opacity-90">
                                    {event.type}
                                  </div>
                                </div>
                                <div className="p-6 flex-1">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold">{event.type}</div>
                                      <h4 className="text-xl font-bold mt-1">{event.name}</h4>
                                    </div>
                                    <button
                                      onClick={() => handleAddFavoriteEvent(event)}
                                      className="ml-4 bg-white rounded-full p-2 border-2 border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200 transition"
                                      aria-label="Add to favorites"
                                    >
                                      <AiOutlineHeart className="text-indigo-500" size={20} />
                                    </button>
                                  </div>
                                  
                                  <div className="flex items-center mt-2 text-gray-600 text-sm">
                                    <FaMapMarkerAlt className="mr-1 text-gray-500" />
                                    <span>{event.location}</span>
                                  </div>
                                  <div className="flex items-center mt-1 text-gray-600 text-sm">
                                    <FaCalendarAlt className="mr-1 text-gray-500" />
                                    <span>{event.date} ({event.day})</span>
                                  </div>
                                  <div className="flex items-center mt-1 text-gray-600 text-sm">
                                    <FaClock className="mr-1 text-gray-500" />
                                    <span>{event.time}</span>
                                  </div>
                                  
                                  <p className="mt-4 text-gray-600 line-clamp-2">
                                    {event.description || 'No description available for this event.'}
                                  </p>
                                  
                                  <div className="mt-4 flex space-x-2">
                                    <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition">
                                      View Details
                                    </button>
                                    <button 
                                      onClick={() => handleAddFavoriteEvent(event)}
                                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition"
                                    >
                                      Add to Favorites
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16 bg-gray-50 rounded-lg">
                          <FaCalendarAlt className="mx-auto text-gray-400" size={40} />
                          <p className="mt-4 text-gray-600">No events matching your interests</p>
                          <p className="text-gray-500 text-sm">Try adding more interests to discover events</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
