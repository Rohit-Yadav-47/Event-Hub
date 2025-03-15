// src/components/community/CommunitySearch.tsx
import React, { useState } from 'react';
import { searchCommunities } from '../../services/api';
import { Community } from '../../types';
import { Search } from 'lucide-react';

const CommunitySearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setMessage('');
    setCommunities([]);

    try {
      const { response, communities } = await searchCommunities(query.trim());

      setMessage(response);
      setCommunities(communities);
    } catch (error) {
      setMessage('An error occurred while searching for communities.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Community List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {communities.length === 0 && !isLoading && message ? (
          <p className="text-gray-700">{message}</p>
        ) : (
          communities.map((community) => (
            <div
              key={community.id}
              className="p-4 bg-white rounded-lg shadow flex items-center"
            >
              <img
                src={
                  community.image_url ||
                  `https://picsum.photos/100/100?random=${community.id}`
                }
                alt={`${community.name} Image`}
                className="w-16 h-16 rounded-full mr-4 object-cover"
              />
              <div>
                <h2 className="text-lg font-bold">{community.name}</h2>
                <p className="text-gray-600">
                  {community.description || 'No description available.'}
                </p>
                <p className="text-sm text-gray-500">
                  Interests: {community.interests.join(', ')}
                </p>
                <p className="text-sm text-gray-500">
                  Members: {community.member_count || 'N/A'}
                </p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <p className="text-gray-700">Loading communities...</p>
        )}
      </div>

      {/* Fixed Search Container */}
      <div className="sticky bottom-0 left-0 right-0 bg-gray-100 p-4 border-t border-gray-200">
        {message && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg shadow">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white p-2 rounded-lg shadow"
        >
          <input
            type="text"
            className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for communities..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              'Searching...'
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommunitySearch;