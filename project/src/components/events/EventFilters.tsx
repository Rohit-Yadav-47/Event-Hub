import React from 'react';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';

interface EventFiltersProps {
  filters: {
    search?: string;
    type?: string;
    location?: string;
    date?: string;
    timeOfDay?: string;
  };
  locations: string[];
  onFilterChange: (filters: any) => void;
}

const EVENT_TYPES = ['Music', 'Art', 'Technology', 'Sports', 'Food', 'Education', 'Adventure'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_OF_DAY = [
  { label: 'Early Morning', range: '4 AM - 8 AM' },
  { label: 'Morning', range: '8 AM - 12 PM' },
  { label: 'Afternoon', range: '12 PM - 4 PM' },
  { label: 'Evening', range: '4 PM - 8 PM' },
  { label: 'Night', range: '8 PM - 4 AM' }
];

export default function EventFilters({ filters, locations, onFilterChange }: EventFiltersProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      {/* Search */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Search Events</label>
        <input
          type="text"
          name="search"
          value={filters.search || ''}
          onChange={handleInputChange}
          placeholder="Search by name or description..."
          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <MapPin className="inline-block w-4 h-4 mr-2" />
          Location
        </label>
        <select
          name="location"
          value={filters.location || ''}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Locations</option>
          {locations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
      </div>

      {/* Day Filter */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <Calendar className="inline-block w-4 h-4 mr-2" />
          Day
        </label>
        <select
          name="date"
          value={filters.date || ''}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Any Day</option>
          {DAYS.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>

      {/* Time of Day Filter */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          <Clock className="inline-block w-4 h-4 mr-2" />
          Time of Day
        </label>
        <select
          name="timeOfDay"
          value={filters.timeOfDay || ''}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Any Time</option>
          {TIME_OF_DAY.map(time => (
            <option key={time.label} value={time.label}>
              {time.label} ({time.range})
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={() => onFilterChange({})}
        className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
}