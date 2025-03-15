import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Tag } from 'lucide-react';

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showMatchingForm, setShowMatchingForm] = useState(false);
  const [matchingQuery, setMatchingQuery] = useState(''); // Renamed for clarity
  const [matchedCommunities, setMatchedCommunities] = useState([]);
  const [matchResponse, setMatchResponse] = useState(''); // To display LLM response
  const [isMatchLoading, setIsMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);

  const API_BASE_URL = 'http://127.0.0.1:8000';

  // Fetch all communities
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/communities`);
        if (!response.ok) throw new Error('Failed to fetch communities');
        const data = await response.json();
        setCommunities(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunities();
  }, []);

  // Handle matching form submission
  const handleMatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMatchLoading(true);
    setMatchError(null);
    setMatchedCommunities([]);
    setMatchResponse('');

    try {
      const query = matchingQuery.trim();
      if (!query) throw new Error('Please enter a search query');

      const response = await fetch(`${API_BASE_URL}/match/communities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to find matches');
      }

      // Safely handle the response data
      if (Array.isArray(data)) {
        setMatchedCommunities(data);
        setMatchResponse('Here are some communities that match your interests:');
      } else if (data.communities) {
        setMatchedCommunities(data.communities);
        setMatchResponse(data.response || 'Found matching communities');
      } else {
        setMatchedCommunities([]);
        setMatchResponse('No matching communities found');
      }
    } catch (err: any) {
      setMatchError(err.message);
    } finally {
      setIsMatchLoading(false);
    }
  };

  // Filter communities based on search and interests
  const filteredCommunities = communities.filter((community: any) => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesInterests =
      selectedInterests.length === 0 ||
      selectedInterests.some((interest) =>
        community.interests?.includes(interest)
      );

    return matchesSearch && matchesInterests;
  });

  // Get unique interests from all communities
  const allInterests = [
    ...new Set(communities.flatMap((c: any) => c.interests || [])),
  ];

  return (
    <div className="max-w-7xl my-24 mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header with Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Communities</h1>
          <button
            onClick={() => setShowMatchingForm(!showMatchingForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            AI Matching Communities
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        
      </div>

      {/* Matching Form */}
      {showMatchingForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Find Matching Communities
          </h2>
          <form onSubmit={handleMatchSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What kind of community are you looking for?
              </label>
              <textarea
                value={matchingQuery}
                onChange={(e) => setMatchingQuery(e.target.value)}
                placeholder="Describe your interests or the type of community you're looking for..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              />
            </div>
            <button
              type="submit"
              disabled={isMatchLoading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]`}
            >
              {isMatchLoading ? (
                <span className="inline-block animate-spin mr-2">⌛</span>
              ) : null}
              {isMatchLoading ? 'Finding...' : 'Find Matches'}
            </button>
          </form>

          {matchError && (
            <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg">
              {matchError}
            </div>
          )}

          {matchResponse && !matchError && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
              {matchResponse}
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-center py-4">{error}</div>
      )}

      {/* Communities Grid */}
      {loading ? (
        <div className="text-center py-10">Loading communities...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(matchedCommunities.length > 0
            ? matchedCommunities
            : filteredCommunities
          ).map((community: any) => (
            <Link
              key={community.id}
              to={`/community/${community.id}`}
              className="block outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl"
            >
              <div className="relative group bg-white rounded-xl overflow-hidden transition-all duration-300 
                border border-gray-100 hover:border-blue-300
                shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)]
                transform perspective-1000 hover:-translate-y-1 hover:rotate-[0.5deg]">
                
                {/* Card Header with Image */}
                <div className="relative h-56 overflow-hidden">
                  {community.image_url ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300 z-10"></div>
                      <img
                        src={community.image_url}
                        alt={community.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Community';
                        }}
                      />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute -inset-[10px] bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),transparent)] opacity-70"></div>
                      <span className="text-4xl font-extrabold text-white drop-shadow-md z-10">
                        {community.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  {/* Community activity badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      {community.is_active !== false ? "Active" : "Quiet"}
                    </span>
                  </div>
                  
                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-5 z-10">
                    <h2 className="text-xl font-bold text-white drop-shadow-sm">
                      {community.name}
                    </h2>
                    <div className="flex items-center text-xs text-white/90 mt-1">
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1 inline" />
                        {community.member_count || 0} members
                      </span>
                      {community.created_at && (
                        <span className="ml-3 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {new Date(community.created_at).toLocaleDateString(undefined, {year: 'numeric', month: 'short'})}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="p-5">
                  {/* Description with truncation */}
                  <div className="relative">
                    <p className="text-gray-600 text-sm line-clamp-2 min-h-[2.5rem]">
                      {community.description || "No description available"}
                    </p>
                    <div className="absolute bottom-0 right-0 left-0 h-6 bg-gradient-to-t from-white to-transparent group-hover:opacity-0 transition-opacity"></div>
                  </div>
                  
                  {/* Engagement stats */}
                  <div className="flex justify-between items-center mt-4 mb-3 text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                        </svg>
                        {community.post_count || 0} posts
                      </span>
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {community.last_active ? formatTimeAgo(community.last_active) : "N/A"}
                      </span>
                    </div>
                  </div>
                  
                  {/* Interests/Tags */}
                  {community.interests && community.interests.length > 0 ? (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {community.interests.slice(0, 3).map((interest: string, index: number) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-medium rounded-full flex items-center border border-blue-100/50 hover:border-blue-200 transition-colors"
                          >
                            <Tag className="w-2.5 h-2.5 mr-1 opacity-70" />
                            {interest}
                          </span>
                        ))}
                        {community.interests.length > 3 && (
                          <span className="px-2.5 py-1 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-100 hover:bg-gray-100 transition-colors">
                            +{community.interests.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 text-xs text-gray-400 italic">No interests specified</div>
                  )}
                  
                  {/* Call to action */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="w-full py-2 bg-transparent hover:bg-blue-50/80 text-blue-600 font-medium rounded-lg transition-colors flex items-center justify-center group-hover:bg-blue-50/50">
                      <span>View Community</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  
  return date.toLocaleDateString(undefined, {month: 'short', day: 'numeric'});
}