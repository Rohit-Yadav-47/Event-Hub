import React from 'react';
import { ChatFilters as ChatFiltersType } from '../../types';
import { Filter } from 'lucide-react';

interface ChatFiltersPanelProps {
  filters: ChatFiltersType;
  onFilterChange: (filters: ChatFiltersType) => void;
}

export default function ChatFiltersPanel({ filters, onFilterChange }: ChatFiltersPanelProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold">Filters</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Location"
          value={filters.location || ''}
          onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
          className="px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Event Type"
          value={filters.eventType || ''}
          onChange={(e) => onFilterChange({ ...filters, eventType: e.target.value })}
          className="px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Date (e.g., Saturday)"
          value={filters.date || ''}
          onChange={(e) => onFilterChange({ ...filters, date: e.target.value })}
          className="px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}