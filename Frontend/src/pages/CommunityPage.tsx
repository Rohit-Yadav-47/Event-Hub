import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, Tag, MessageSquare, Calendar, Heart, Share2, ExternalLink, ArrowLeft, Search } from 'lucide-react';

export default function CommunityPage() {
  const { communityId } = useParams();
  const [community, setCommunity] = useState(null);
  const [loadingCommunity, setLoadingCommunity] = useState(false);
  const [errorCommunity, setErrorCommunity] = useState(null);

  const [relatedUsers, setRelatedUsers] = useState([]);
  const [relatedCommunities, setRelatedCommunities] = useState([]);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [errorMatch, setErrorMatch] = useState(null);

  const [searchRelated, setSearchRelated] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  const API_BASE_URL = 'http://127.0.0.1:8000';

  // Fetch community details on component mount
  useEffect(() => {
    const fetchCommunity = async () => {
      setLoadingCommunity(true);
      try {
        const response = await fetch(`${API_BASE_URL}/communities/${communityId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch community details');
        }
        const data = await response.json();
        setCommunity(data);
      } catch (err) {
        console.error("Error fetching community details:", err);
        setErrorCommunity(err.message || 'An unexpected error occurred.');
      } finally {
        setLoadingCommunity(false);
      }
    };

    fetchCommunity();
  }, [communityId]);

  // Fetch related users and communities based on community interests
  useEffect(() => {
    const fetchMatches = async () => {
      if (!community || !community.interests || community.interests.length === 0) {
        setRelatedUsers([]);
        setRelatedCommunities([]);
        return;
      }

      setLoadingMatch(true);
      setErrorMatch(null);

      try {
        const response = await fetch(`${API_BASE_URL}/communities/${communityId}/match`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ interests: community.interests }),
        });

        const text = await response.text();
        let data;
        
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('Failed to parse JSON:', text);
          throw new Error('Invalid response format from server');
        }

        if (!response.ok) {
          throw new Error(data.detail || 'Failed to fetch matches');
        }

        // Handle both array and object responses
        if (Array.isArray(data)) {
          const users = data.filter(item => item.username);
          const communities = data.filter(item => item.name && !item.username);
          setRelatedUsers(users);
          setRelatedCommunities(communities);
        } else {
          setRelatedUsers(data.related_users || []);
          setRelatedCommunities(data.related_communities || []);
        }
      } catch (err) {
        console.error("Error fetching matches:", err);
        setErrorMatch(err.message || 'An unexpected error occurred.');
      } finally {
        setLoadingMatch(false);
      }
    };

    fetchMatches();
  }, [community, communityId]);

  // Handle search input for related users and communities
  const handleSearchChange = (e) => {
    setSearchRelated(e.target.value);
  };

  // Filter related users and communities based on search input
  const filteredRelatedUsers = relatedUsers.filter((usr) =>
    usr.username?.toLowerCase().includes(searchRelated.toLowerCase()) ||
    usr.email?.toLowerCase().includes(searchRelated.toLowerCase()) ||
    (usr.interests && usr.interests.some((interest) => interest.toLowerCase().includes(searchRelated.toLowerCase())))
  );

  const filteredRelatedCommunities = relatedCommunities.filter((comm) =>
    comm.name?.toLowerCase().includes(searchRelated.toLowerCase()) ||
    (comm.description && comm.description.toLowerCase().includes(searchRelated.toLowerCase())) ||
    (comm.interests && comm.interests.some((interest) => interest.toLowerCase().includes(searchRelated.toLowerCase())))
  );

  // Render loading state with skeleton
  if (loadingCommunity) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            {/* Hero section skeleton */}
            <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-10 bg-gray-200 w-3/4 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 w-full rounded mb-2"></div>
                <div className="h-4 bg-gray-200 w-5/6 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 w-4/6 rounded mb-6"></div>
                <div className="flex gap-2 mb-8">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-8 w-20 bg-gray-200 rounded-full"></div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-200 h-64 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (errorCommunity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md bg-white rounded-xl shadow-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-red-100">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Community</h2>
          <p className="text-gray-600 mb-6">{errorCommunity}</p>
          <Link to="/communities" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <ArrowLeft size={16} className="mr-2" /> Back to Communities
          </Link>
        </div>
      </div>
    );
  }

  // If community data is not yet fetched
  if (!community) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section with Community Banner & Details */}
      <div className="relative">
        {/* Banner Image */}
        <div className="h-64 md:h-80 w-full overflow-hidden relative">
          {community.banner_url || community.image_url ? (
            <img
              src={community.banner_url || community.image_url}
              alt={`${community.name} banner`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557682250-4b3ea562d755?q=80&w=2029&auto=format&fit=crop';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-violet-600"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70"></div>
          
          {/* Back button */}
          <Link 
            to="/communities" 
            className="absolute top-4 left-4 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-4 py-2 rounded-full flex items-center transition-colors z-10"
          >
            <ArrowLeft size={18} className="mr-2" /> Back
          </Link>
          
          {/* Share button */}
          <button 
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-4 py-2 rounded-full flex items-center transition-colors z-10"
          >
            <Share2 size={18} className="mr-2" /> Share
          </button>
        </div>
        
        {/* Community Avatar & Basic Info - Overlapping the banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-end">
            <div className="bg-white rounded-xl shadow-lg p-1 -mt-16 md:mt-0 md:-ml-6 md:-mb-6 z-10">
              <img
                src={community.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(community.name)}&background=random&size=150`}
                alt={`${community.name} logo`}
                className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover"
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{community.name}</h1>
              <div className="flex items-center text-gray-500 mt-2">
                <Users size={16} className="mr-1" />
                <span className="mr-4">{community.member_count || 0} members</span>
                
                <Calendar size={16} className="mr-1" />
                <span>Created {community.created_at ? 
                  new Date(community.created_at).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}) : 
                  'recently'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3 mt-4 md:mt-0 w-full md:w-auto">
              <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center flex-1 md:flex-none">
                <Heart size={16} className="mr-2" /> Follow
              </button>
              <button className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center flex-1 md:flex-none">
                <MessageSquare size={16} className="mr-2" /> Join Discussion
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Tabs & Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {['details', 'members', 'related'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2">
            {activeTab === 'details' && (
              <div className="bg-white shadow-sm rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">About this Community</h2>
                <div className="prose max-w-none mb-8">
                  <p className="text-gray-700">{community.description || 'No description provided for this community.'}</p>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Interests & Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {community.interests && community.interests.length > 0 ? (
                      community.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg flex items-center"
                        >
                          <Tag className="w-4 h-4 mr-2 opacity-70" />
                          {interest}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No interests listed for this community.</p>
                    )}
                  </div>
                </div>
                
                {community.rules && (
                  <div className="mt-8 border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Community Rules</h3>
                    <ul className="space-y-3">
                      {community.rules.map((rule, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                            {idx + 1}
                          </span>
                          <span className="text-gray-700">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'members' && (
              <div className="bg-white shadow-sm rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-6">Community Members</h2>
                <p className="text-gray-500">Member details coming soon...</p>
              </div>
            )}
            
            {activeTab === 'related' && (
              <div className="bg-white shadow-sm rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Related Content</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Filter results..."
                      value={searchRelated}
                      onChange={handleSearchChange}
                      className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {loadingMatch ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : errorMatch ? (
                  <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                    {errorMatch}
                  </div>
                ) : (
                  <div className="space-y-10">
                    {/* Related Users */}
                    {filteredRelatedUsers.length > 0 && (
                      <div>
                        <h3 className="text-xl font-medium mb-4 flex items-center">
                          <Users size={18} className="mr-2" /> Similar Users
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {filteredRelatedUsers.map((user) => (
                            <div 
                              key={user.id} 
                              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors border border-gray-100"
                            >
                              <img
                                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`}
                                alt={`${user.username}'s avatar`}
                                className="h-14 w-14 rounded-full object-cover border-2 border-white shadow"
                              />
                              <div>
                                <h4 className="font-semibold text-gray-900">{user.username}</h4>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {user.interests && user.interests.slice(0, 2).map((interest, idx) => (
                                    <span key={idx} className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                      {interest}
                                    </span>
                                  ))}
                                  {user.interests && user.interests.length > 2 && (
                                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                                      +{user.interests.length - 2}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Related Communities */}
                    {filteredRelatedCommunities.length > 0 && (
                      <div>
                        <h3 className="text-xl font-medium mb-4 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                          </svg>
                          Similar Communities
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          {filteredRelatedCommunities.map((comm) => (
                            <Link
                              key={comm.id}
                              to={`/community/${comm.id}`}
                              className="block p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors border border-gray-100"
                            >
                              <div className="flex items-center gap-4">
                                <img
                                  src={comm.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comm.name)}&background=random`}
                                  alt={`${comm.name} logo`}
                                  className="h-12 w-12 rounded object-cover shadow"
                                />
                                <div>
                                  <h4 className="font-semibold text-gray-900 flex items-center">
                                    {comm.name}
                                    <ExternalLink size={14} className="ml-1 text-gray-400" />
                                  </h4>
                                  <p className="text-sm text-gray-600 line-clamp-1">
                                    {comm.description || 'No description provided.'}
                                  </p>
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {comm.interests && comm.interests.slice(0, 3).map((interest, idx) => (
                                      <span key={idx} className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                                        {interest}
                                      </span>
                                    ))}
                                    {comm.interests && comm.interests.length > 3 && (
                                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                                        +{comm.interests.length - 3}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {filteredRelatedUsers.length === 0 && filteredRelatedCommunities.length === 0 && (
                      <div className="text-center py-10">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                          <Search size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No matches found</h3>
                        <p className="text-gray-500">Try adjusting your search criteria</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Statistics Card */}
            <div className="bg-white shadow-sm rounded-xl p-5">
              <h3 className="text-lg font-medium mb-4">Community Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">Members</p>
                  <p className="text-2xl font-bold">{community.member_count || 0}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">Posts</p>
                  <p className="text-2xl font-bold">{community.post_count || 0}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-700">Discussions</p>
                  <p className="text-2xl font-bold">{community.discussion_count || 0}</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-700">Events</p>
                  <p className="text-2xl font-bold">{community.event_count || 0}</p>
                </div>
              </div>
            </div>
            
            {/* Top Contributors */}
            <div className="bg-white shadow-sm rounded-xl p-5">
              <h3 className="text-lg font-medium mb-4">Top Contributors</h3>
              {community.top_contributors ? (
                <ul className="divide-y divide-gray-100">
                  {community.top_contributors.map((contributor, idx) => (
                    <li key={idx} className="py-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src={contributor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contributor.username)}`}
                          alt={`${contributor.username}'s avatar`}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <span className="font-medium">{contributor.username}</span>
                      </div>
                      <span className="text-sm text-gray-500">{contributor.contribution_count} contributions</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-4">No contributor data available</p>
              )}
            </div>
            
            {/* Related Tags */}
            {community.related_tags && community.related_tags.length > 0 && (
              <div className="bg-white shadow-sm rounded-xl p-5">
                <h3 className="text-lg font-medium mb-4">Related Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {community.related_tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
