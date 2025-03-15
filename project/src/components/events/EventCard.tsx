import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Heart, Share2, Users, ChevronRight } from 'lucide-react';
import { Event } from '../../types';
import { motion } from 'framer-motion';
import { formatDistanceToNow, format } from 'date-fns';

interface EventCardProps {
  event: Event;
  className?: string;
}

export default function EventCard({ event, className = '' }: EventCardProps) {
  const [liked, setLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!event) return null;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setLiked(!liked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    // Implement share functionality
    navigator.share?.({
      title: event.name,
      text: `Check out this event: ${event.name}`,
      url: `/events/${event.id}`
    }).catch(() => {
      navigator.clipboard.writeText(window.location.origin + `/events/${event.id}`);
      alert('Link copied to clipboard!');
    });
  };

  const formatEventDate = () => {
    try {
      const date = new Date(event.date);
      return {
        day: format(date, 'd'),
        month: format(date, 'MMM'),
        relative: formatDistanceToNow(date, { addSuffix: true })
      };
    } catch (e) {
      return { day: '??', month: '???', relative: 'Date unknown' };
    }
  };

  const eventDate = formatEventDate();

  const getEventStatusColor = () => {
    try {
      const date = new Date(event.date);
      const now = new Date();
      
      if (date < now) return 'bg-gray-100 text-gray-700';
      if (date.getTime() - now.getTime() < 3 * 24 * 60 * 60 * 1000) return 'bg-red-100 text-red-700';
      return 'bg-emerald-100 text-emerald-700';
    } catch (e) {
      return 'bg-gray-100 text-gray-700';
    }
  };

  const getRandomGradient = () => {
    const gradients = [
      'from-purple-500 to-blue-500',
      'from-emerald-500 to-teal-500',
      'from-orange-500 to-amber-500',
      'from-pink-500 to-rose-500',
      'from-blue-500 to-cyan-500',
    ];
    return gradients[event.id % gradients.length];
  };

  return (
    <motion.div 
      className={`w-full ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link to={`/events/${event.id}`} className="block">
        <motion.div 
          className="relative overflow-hidden bg-white rounded-2xl"
          whileHover={{ 
            scale: 1.02, 
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
          }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8 rounded-full bg-gradient-radial from-blue-100/40 via-transparent to-transparent" />

          <div className="flex flex-col md:flex-row h-full">
            {/* Left column - Date and image */}
            <div className="md:w-2/5 relative">
              {/* Date badge */}
              <div className="absolute top-4 left-4 z-20 flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-white shadow-lg backdrop-blur-sm bg-opacity-80">
                <span className="text-xl font-black text-gray-900">{eventDate.day}</span>
                <span className="text-xs font-medium uppercase text-gray-600">{eventDate.month}</span>
              </div>
              
              {/* Actions */}
              <div className="absolute bottom-4 left-4 z-20 flex space-x-2">
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className={`p-2 rounded-full backdrop-blur-sm bg-white/80 shadow-sm ${liked ? 'text-red-500' : 'text-gray-600'}`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="p-2 rounded-full backdrop-blur-sm bg-white/80 shadow-sm text-gray-600"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
              </div>
              
              {/* Image or gradient */}
              <div className="relative h-48 md:h-full overflow-hidden">
                {event.image_url ? (
                  <motion.img 
                    src={event.image_url} 
                    alt={event.name}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                    transition={{ duration: 1 }}
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${getRandomGradient()}`}>
                    <div className="absolute inset-0 mix-blend-overlay opacity-30">
                      <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
                          </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#grid)" />
                      </svg>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10 mix-blend-multiply" />
              </div>
            </div>
            
            {/* Right column - Content */}
            <div className="p-5 md:w-3/5 md:p-6 flex flex-col justify-between">
              <div>
                {/* Status & Category */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventStatusColor()}`}>
                    {eventDate.relative}
                  </span>
                  {event.category && (
                    <span className="text-xs font-medium text-gray-500">
                      {event.category}
                    </span>
                  )}
                </div>
                
                {/* Title */}
                <h2 className="text-xl font-extrabold text-gray-800 leading-tight mb-2">
                  {event.name}
                </h2>
                
                {/* Price */}
                {typeof event.price !== 'undefined' && (
                  <div className="mb-4">
                    {event.price > 0 ? (
                      <div className="inline-flex items-center">
                        <span className="text-2xl font-bold text-gray-900">${event.price}</span>
                        {event.originalPrice && event.originalPrice > event.price && (
                          <span className="ml-2 text-sm text-gray-500 line-through">${event.originalPrice}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-emerald-600 font-bold">Free Event</span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Details grid */}
              <div className="grid grid-cols-2 gap-4 my-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 flex-shrink-0 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="ml-3 text-sm text-gray-600">{event.location}</div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 flex-shrink-0 rounded-md bg-amber-50 flex items-center justify-center text-amber-600">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="ml-3 text-sm text-gray-600">{event.time}</div>
                </div>
                
                {event.organizer && (
                  <div className="flex items-center col-span-2">
                    <div className="w-8 h-8 flex-shrink-0 rounded-md bg-violet-50 flex items-center justify-center text-violet-600">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="ml-3 text-sm text-gray-600">
                      By {event.organizer}
                      {event.attendees && <span className="text-gray-500 text-xs ml-2">({event.attendees} attending)</span>}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center justify-center h-6 px-3 rounded-full bg-gray-100 text-xs font-medium text-gray-800"
                    >
                      #{tag}
                    </span>
                  ))}
                  {event.tags.length > 3 && (
                    <span className="inline-flex items-center justify-center h-6 px-3 rounded-full bg-gray-100 text-xs font-medium text-gray-800">
                      +{event.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
              
              {/* CTA */}
              <div className="mt-auto">
                <motion.div 
                  className="flex items-center justify-center py-3 px-4 rounded-xl bg-blue-600 text-white font-medium"
                  whileHover={{ 
                    backgroundColor: '#1E40AF',
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>View Event Details</span>
                  <ChevronRight className="ml-2 w-4 h-4" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
