// src/components/friends/FriendsSearch.tsx
import React, { useState } from 'react';
import { searchUsers } from '../../services/api';
import { User } from '../../types';
import { Users } from 'lucide-react';

const FriendsSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setMessage('');
    setUsers([]);

    try {
      const { response, users } = await searchUsers(query.trim());

      setMessage(response);
      setUsers(users);
    } catch (error) {
      setMessage('An error occurred while searching for users.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable User List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {users.length === 0 && !isLoading && message ? (
          <p className="text-gray-700">{message}</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="p-4 bg-white rounded-lg shadow flex items-center">
              <img
                src={user.avatar || `https://picsum.photos/50/50?random=${user.id}`}
                alt={`${user.username}'s avatar`}
                className="w-12 h-12 rounded-full mr-4 object-cover"
              />
              <div>
                <h2 className="text-lg font-bold">{user.username}</h2>
                <p className="text-gray-600">{user.about || 'No description available.'}</p>
                <p className="text-sm text-gray-500">Interests: {user.interests.join(', ')}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <p className="text-gray-700">Loading users...</p>
        )}
      </div>

      {/* Fixed Search Container */}
      <div className="sticky bottom-0 left-0 right-0 bg-gray-100 p-4 border-t border-gray-200">
        {message && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg shadow">
            {message}
          </div>
        )}

        <form onSubmit={handleSearch} className="flex items-center bg-white p-2 rounded-lg shadow">
          <input
            type="text"
            className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for friends..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            aria-label="Search for friends"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none flex items-center justify-center"
            disabled={isLoading}
            aria-label="Search"
          >
            {isLoading ? 'Searching...' : <Users className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FriendsSearch;
