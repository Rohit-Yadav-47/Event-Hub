import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Users, Tag, Loader2, AlertTriangle, 
  CheckCircle, ArrowLeft, Mail, Phone, ExternalLink, Heart, Share, DollarSign,
  Percent, Star, ChevronRight, Bookmark, Info, Globe, Check, Lock
} from 'lucide-react';
import axios from 'axios';

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/events/${id}`);
        if (response.data) {
          setEvent(response.data);
        } else {
          setError('Event not found');
        }
      } catch (error) {
        setError(error.message || 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  // Format date for display
  const formatEventDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  // Format price display
  const formatPrice = (price, originalPrice) => {
    if (!price && price !== 0) return 'Free';
    if (originalPrice && originalPrice > price) {
      const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
      return (
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">${price}</span>
            <span className="text-base text-gray-400 line-through ml-2">${originalPrice}</span>
          </div>
          <div className="flex items-center text-green-600 text-sm font-medium">
            <Percent className="w-4 h-4 mr-1" />
            {discount}% off
          </div>
        </div>
      );
    }
    return <span className="text-2xl font-bold text-blue-600">${price}</span>;
  };

  // Format attendees display
  const formatAttendees = (attendees, capacity) => {
    if (!attendees && !capacity) return '0 attendees';
    if (attendees && capacity) {
      const percentFilled = Math.round((attendees / capacity) * 100);
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{attendees}/{capacity} attendees</span>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${percentFilled}%` }}
            ></div>
          </div>
        </div>
      );
    }
    return `${attendees || 0} attendees`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin text-blue-600 w-16 h-16 mb-4" />
        <span className="text-xl font-medium text-gray-700">Retrieving event details...</span>
        <p className="text-gray-500 mt-2">Please wait while we load the information</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <AlertTriangle className="text-red-500 w-16 h-16 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Oops! Something went wrong.</h2>
        <span className="text-lg text-red-500 mt-2">Error: {error}</span>
        <Link to="/events" className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <CheckCircle className="text-gray-500 w-16 h-16 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">No Event Found</h2>
        <p className="text-gray-500 mt-2">The event you're looking for might have been removed.</p>
        <Link to="/events" className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
        </Link>
      </div>
    );
  }

  // Determine event status
  const eventDate = new Date(event.date);
  const today = new Date();
  const isUpcoming = eventDate > today;
  const statusClass = isUpcoming ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  const statusText = isUpcoming ? "Upcoming" : "Past Event";

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Back Button with Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link to="/events" className="hover:text-blue-600 transition">Events</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900 font-medium">{event?.name || 'Event Details'}</span>
        </div>
      </div>

      {/* Hero Section with Enhanced Styling */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-800 to-indigo-900 opacity-90"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div className="text-white mb-8 md:mb-0">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                  {statusText}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {event.category || 'Event'}
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mt-2 text-white">{event.name}</h1>
              <div className="mt-4 flex items-center text-gray-200">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <Star className="w-5 h-5 text-gray-400" />
                </div>
                <p className="ml-2 text-gray-200">(4.0) · {event.attendees || 0} attendees</p>
              </div>
              <p className="mt-4 text-gray-200 max-w-2xl text-lg">{event.description?.slice(0, 120)}...</p>
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-300 mr-2" />
                  <span>{formatEventDate(event.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-300 mr-2" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-blue-300 mr-2" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button 
                className="p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition flex flex-col items-center"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Heart className={`w-6 h-6 ${isBookmarked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                <span className="text-xs text-white mt-1">Save</span>
              </button>
              <button className="p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition flex flex-col items-center">
                <Share className="w-6 h-6 text-white" />
                <span className="text-xs text-white mt-1">Share</span>
              </button>
              <button className="p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition flex flex-col items-center">
                <Bookmark className="w-6 h-6 text-white" />
                <span className="text-xs text-white mt-1">Save</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Enhanced Bottom Info Bar */}
        <div className="bg-white border-t border-b border-gray-200 shadow-sm relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between py-4">
              <div className="flex items-center space-x-6 mb-3 md:mb-0">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-700 mr-2" />
                  <span className="text-gray-700 font-medium">{formatEventDate(event.date)}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-blue-700 mr-2" />
                  <span className="text-gray-700 font-medium">{event.location}</span>
                </div>
              </div>
              <div>
                <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Event Image */}
              <div className="relative">
                <img 
                  src={event.image_url || 'https://via.placeholder.com/800x400?text=Event+Image'} 
                  alt={event.name}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-1 rounded-full font-medium">
                  {event.category}
                </div>
              </div>
              
              {/* Event Info Sections */}
              <div className="p-8">
                {/* Key Event Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-gray-200 pb-8">
                  <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg transition hover:shadow-md hover:bg-blue-100">
                    <Calendar className="w-8 h-8 text-blue-600 mb-2" />
                    <h3 className="text-xs text-gray-500 font-medium uppercase">Date</h3>
                    <p className="text-sm font-medium text-center">{formatEventDate(event.date)}</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg transition hover:shadow-md hover:bg-purple-100">
                    <Clock className="w-8 h-8 text-purple-600 mb-2" />
                    <h3 className="text-xs text-gray-500 font-medium uppercase">Time</h3>
                    <p className="text-sm font-medium text-center">{event.time}</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg transition hover:shadow-md hover:bg-green-100">
                    <MapPin className="w-8 h-8 text-green-600 mb-2" />
                    <h3 className="text-xs text-gray-500 font-medium uppercase">Location</h3>
                    <p className="text-sm font-medium text-center">{event.location}</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg transition hover:shadow-md hover:bg-yellow-100">
                    <Users className="w-8 h-8 text-yellow-600 mb-2" />
                    <h3 className="text-xs text-gray-500 font-medium uppercase">Attendees</h3>
                    <p className="text-sm font-medium text-center">{formatAttendees(event.attendees, event.capacity)}</p>
                  </div>
                </div>
                
                {/* About Section with Enhanced Styling */}
                <div className="mt-8">
                  <div className="flex items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">About This Event</h2>
                    <div className="ml-3 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {event.category}
                    </div>
                  </div>
                  <div className="mt-4 prose prose-blue max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      Join us for an intensive workshop on modern web development techniques and frameworks. 
                      This hands-on session covers the latest tools and best practices for creating 
                      responsive, accessible, and high-performance web applications.
                      {event.description}
                    </p>
                    <p className="mt-4 text-gray-700 leading-relaxed">
                      You'll learn directly from industry professionals with years of experience 
                      building production-grade web applications. Whether you're a beginner or experienced 
                      developer, this workshop will provide valuable insights to enhance your skills.
                    </p>
                  </div>

                  {/* What you'll learn section */}
                  <div className="mt-8 bg-blue-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">What You'll Learn</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {["Modern JavaScript fundamentals", "React component architecture", 
                       "State management strategies", "Responsive design principles", 
                       "Performance optimization", "Debugging techniques"].map((item, index) => (
                        <div key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Event Schedule */}
                <div className="mt-8 border-t border-gray-200 pt-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Schedule</h2>
                  <div className="space-y-4">
                    {[
                      {time: "2:00 PM", title: "Introduction to Web Development", desc: "Overview of modern web technologies"},
                      {time: "2:30 PM", title: "Hands-on Coding Session", desc: "Practical implementation of concepts"},
                      {time: "3:30 PM", title: "Q&A and Discussion", desc: "Interactive problem-solving session"},
                      {time: "4:00 PM", title: "Networking", desc: "Connect with fellow developers"}
                    ].map((item, index) => (
                      <div key={index} className="flex items-start border-l-2 border-blue-500 pl-4">
                        <div className="min-w-[80px] font-medium text-blue-700">{item.time}</div>
                        <div>
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-gray-600 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Tags Section with Enhanced Styling */}
                <div className="mt-8 border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills & Topics</h2>
                  <div className="flex flex-wrap gap-2">
                    {event.tags && event.tags.length > 0 ? (
                      event.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 transition-all cursor-pointer"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">No tags available</span>
                    )}
                  </div>
                </div>
                
                {/* Location Map Placeholder */}
                <div className="mt-8 border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Event Location</h2>
                  <div className="h-64 bg-gray-200 rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                        <p className="font-medium text-gray-700">{event.location}</p>
                        <button className="mt-3 px-4 py-2 bg-white text-blue-700 rounded-md border border-blue-200 shadow-sm hover:bg-blue-50 transition">
                          View on Map
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Attendee Reviews</h2>
                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <Star className="w-6 h-6 text-gray-300" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800 ml-3">4.0</span>
                  <span className="text-gray-500 ml-2">(24 reviews)</span>
                </div>
                
                <div className="space-y-6">
                  {[
                    {name: "Alex Johnson", date: "April 12, 2023", rating: 5, comment: "Excellent workshop! Learned a ton about React and modern web dev practices."},
                    {name: "Sarah Miller", date: "March 22, 2023", rating: 4, comment: "Great content and knowledgeable instructors. Would have liked a bit more hands-on time."},
                  ].map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium mr-3">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{review.name}</h4>
                            <p className="text-sm text-gray-500">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {Array(5).fill(0).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card with Enhanced Styling */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6  top-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h3 className="text-lg font-semibold text-white">Reserve Your Spot</h3>
                <p className="text-blue-100 text-sm">Limited seats available</p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Price</h3>
                  {formatPrice(event.price, event.originalPrice)}
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg mb-6">
                  <div className="flex items-center text-green-800">
                    <Info className="w-5 h-5 mr-2" />
                    <p className="text-sm font-medium">Only {event.capacity - event.attendees || 10} spots left</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-medium rounded-lg transition flex items-center justify-center"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Now for ${event.price}
                  </button>
                  <button
                    className="w-full py-4 bg-white text-blue-600 border-2 border-blue-600 text-lg font-medium rounded-lg hover:bg-blue-50 transition flex items-center justify-center"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Contact Organizer
                  </button>
                </div>
                
                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>Secure payment powered by Stripe</p>
                  <p className="flex items-center justify-center mt-1">
                    <Lock className="w-4 h-4 mr-1" />
                    Your information is protected
                  </p>
                </div>
              </div>
            </div>
            
            {/* Organizer Info with Enhanced Styling */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Organizer</h3>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden mr-3 border-2 border-blue-200">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{event.organizer || 'Code Masters Academy'}</h4>
                    <p className="text-sm text-blue-600">View profile</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Code Masters Academy specializes in delivering high-quality tech workshops and training
                  for developers of all skill levels. With over 5 years of experience in technical education.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 text-gray-500 mr-2" />
                    <span>contact@codemasters.dev</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 text-gray-500 mr-2" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Globe className="w-4 h-4 text-gray-500 mr-2" />
                    <span>www.codemasters.dev</span>
                  </div>
                  <a 
                    href="#" 
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800 mt-2"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View organizer profile
                  </a>
                </div>
              </div>
            </div>
            
            {/* Similar Events */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Similar Events</h3>
                <div className="space-y-4">
                  {[
                    {name: "Advanced React Patterns", date: "June 15, 2023", price: 30},
                    {name: "Full-Stack Development Bootcamp", date: "July 3, 2023", price: 125},
                    {name: "UI/UX Design for Developers", date: "May 29, 2023", price: 35}
                  ].map((item, index) => (
                    <div key={index} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                      <div className="bg-blue-100 h-12 w-12 rounded flex items-center justify-center text-blue-600 mr-3">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.date}</p>
                      </div>
                      <div className="text-blue-600 font-medium">${item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
