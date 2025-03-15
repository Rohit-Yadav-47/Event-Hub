import React, { useState } from 'react';
import { Event } from '../../types';
import EventCard from './EventCard';
import { motion } from 'framer-motion';
import { Grid, List, Loader } from 'lucide-react';

interface EventGridProps {
  events: Event[];
  loading?: boolean;
  className?: string;
  title?: string;
}

export default function EventGrid({ 
  events, 
  loading = false, 
  className = '',
  title = 'Events'
}: EventGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Empty state
  if (!loading && (!events || events.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 rounded-2xl">
        <div className="w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No events available</h3>
        <p className="text-gray-500 text-center max-w-md">
          There are currently no events to display. Check back later for upcoming events.
        </p>
      </div>
    );
  }
  
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader className="w-8 h-8 text-blue-600" />
        </motion.div>
        <p className="mt-4 text-gray-600">Loading events...</p>
      </div>
    );
  }

  // Container variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with title and view toggle */}
      {(title || viewMode) && (
        <div className="flex items-center justify-between mb-6">
          {title && <h2 className="text-2xl font-bold text-gray-900"></h2>}
          
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' 
                ? 'bg-white  shadow-sm' 
                : 'text-gray-500' }`}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' 
                ? 'bg-white  shadow-sm' 
                : 'text-gray-500 '}`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className={`
          ${viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-10 auto-rows-max' 
            : 'flex flex-col space-y-6'}
        `}
      >
        {events.map((event, index) => (
          <motion.div
            key={event.id || index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            className={viewMode === 'list' ? 'w-full' : ''}
          >
            <EventCard 
              event={event} 
              className={viewMode === 'list' ? 'max-w-none' : ''} 
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// Need to import this for the empty state
function Calendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}