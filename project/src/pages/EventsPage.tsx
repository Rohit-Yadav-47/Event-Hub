import React, { useState, useEffect, useMemo } from 'react';
import EventGrid from '../components/events/EventGrid';
import EventFilters from '../components/events/EventFilters';
import { Search } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    date: '',
    timeOfDay: '',
  });

  const API_BASE_URL = 'http://127.0.0.1:8000';

  // Extract unique locations from events
  const locations = useMemo(() => {
    return [...new Set(events.map(event => event.location))];
  }, [events]);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Convert filters to query parameters
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });

        const response = await fetch(`${API_BASE_URL}/events?${params}`);
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filters]);

  // Helper function to check if time falls within a time range
  const isTimeInRange = (time: string, timeOfDay: string) => {
    const hour = parseInt(time.split(' ')[0]);
    const isPM = time.includes('PM');
    const hour24 = isPM ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour);

    switch(timeOfDay) {
      case 'Early Morning': return hour24 >= 4 && hour24 < 8;
      case 'Morning': return hour24 >= 8 && hour24 < 12;
      case 'Afternoon': return hour24 >= 12 && hour24 < 16;
      case 'Evening': return hour24 >= 16 && hour24 < 20;
      case 'Night': return hour24 >= 20 || hour24 < 4;
      default: return true;
    }
  };

  // Filter events based on all criteria
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = !filters.search || 
        event.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesLocation = !filters.location || event.location === filters.location;
      const matchesDate = !filters.date || event.date === filters.date;
      const matchesTime = !filters.timeOfDay || isTimeInRange(event.time, filters.timeOfDay);

      return matchesSearch && matchesLocation && matchesDate && matchesTime;
    });
  }, [events, filters]);

  return (
    <div className="max-w-7xl my-24 mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar with Filters */}
        <div className="md:w-1/4">
          <EventFilters 
            filters={filters} 
            locations={locations}
            onFilterChange={setFilters} 
          />
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-gray-600 mt-2">
              {filteredEvents.length} events found
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <EventGrid events={filteredEvents} />
          )}
        </div>
      </div>
    </div>
  );
}