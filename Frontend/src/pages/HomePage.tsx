import React, { useState, useEffect, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  Calendar,
  MapPin,
  Users,
  Layers,
  Mail,
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Tag,
  Heart,
  Share2,
  Star,
  Filter,
  Globe,
  Bell,
  User,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

// Enhanced EVENTS Data
const EVENTS = [
  {
    id: 1,
    name: 'Jazz Evening at Marina Bay',
    location: 'Marina Beach',
    type: 'Music',
    date: 'Saturday, Mar 22',
    time: '7:00 PM',
    description: 'Immerse yourself in soothing jazz tunes by the waves with renowned international and local artists performing live.',
    image_url: 'https://picsum.photos/600/400/?random=101',
    attendees: 342,
    price: '$25',
    tags: ['Jazz', 'Live Music', 'Beach'],
    rating: 4.8
  },
  {
    id: 2,
    name: 'Art Fiesta: Chennai Colors',
    location: "Cholamandal Artists' Village",
    type: 'Art',
    date: 'Friday, Mar 28',
    time: '5:00 PM',
    description: "Discover vibrant art inspired by Chennai's rich cultural heritage featuring works from over 50 emerging and established artists.",
    image_url: 'https://picsum.photos/600/400/?random=102',
    attendees: 189,
    price: '$15',
    tags: ['Art Exhibition', 'Cultural', 'Workshops'],
    rating: 4.7
  },
  {
    id: 3,
    name: 'Tech Innovators Summit 2025',
    location: 'Silicon Valley Convention Center',
    type: 'Technology',
    date: 'Sunday, Apr 5',
    time: '10:00 AM',
    description: 'Join industry leaders and visionaries to explore cutting-edge innovations and the future of technology in this premier networking event.',
    image_url: 'https://picsum.photos/600/400/?random=103',
    attendees: 876,
    price: '$195',
    tags: ['Tech', 'Innovation', 'Networking'],
    rating: 4.9
  },
  {
    id: 4,
    name: 'Culinary Fusion Festival',
    location: 'Downtown Food Court',
    type: 'Food',
    date: 'Saturday, Apr 12',
    time: '12:00 PM',
    description: 'Experience a gastronomic journey through global cuisines with interactive cooking demonstrations by celebrity chefs.',
    image_url: 'https://picsum.photos/600/400/?random=104',
    attendees: 654,
    price: '$35',
    tags: ['Food', 'Cooking', 'International'],
    rating: 4.6
  },
  {
    id: 5,
    name: 'Marathon for Charity',
    location: 'City Park Circuit',
    type: 'Sports',
    date: 'Sunday, Apr 19',
    time: '6:00 AM',
    description: 'Run for a cause in this annual charity marathon supporting local education initiatives.',
    image_url: 'https://picsum.photos/600/400/?random=105',
    attendees: 1250,
    price: '$50',
    tags: ['Marathon', 'Charity', 'Fitness'],
    rating: 4.7
  },
  {
    id: 6,
    name: 'Digital Marketing Masterclass',
    location: 'Business Innovation Hub',
    type: 'Education',
    date: 'Friday, Apr 25',
    time: '9:00 AM',
    description: 'Learn advanced digital marketing strategies from industry experts in this comprehensive one-day workshop.',
    image_url: 'https://picsum.photos/600/400/?random=106',
    attendees: 275,
    price: '$120',
    tags: ['Digital Marketing', 'Workshop', 'Business'],
    rating: 4.8
  }
];

// Loading Animation Component
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

function HeroSection() {
  const heroRef = useRef(null);
  const [animationsLoaded, setAnimationsLoaded] = useState(false);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        heroRef.current.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Animation initialization
  useEffect(() => {
    // Trigger animations after a small delay to ensure proper rendering
    const timer = setTimeout(() => {
      setAnimationsLoaded(true);
      
      // Refresh AOS to trigger animations that might have been missed
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
      
      // Trigger the parallax effect on initial load
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        heroRef.current.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-screen bg-cover bg-center flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          'url(https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?cs=srgb&dl=pexels-wolfgang-1002140-2747449.jpg&fm=jpg)'
      }}
    >
      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={animationsLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          data-aos="fade-down"
          data-aos-delay="200"
          data-aos-once="false"
          className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg tracking-tight"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Discover Extraordinary Events
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={animationsLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          data-aos="fade-up"
          data-aos-delay="400"
          data-aos-once="false"
          className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto drop-shadow-lg font-light"
        >
          Join thousands of people discovering unique experiences every day in your city and beyond
        </motion.p>
        
        {/* Search bar - Using motion for guaranteed animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={animationsLoaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex flex-col md:flex-row gap-4 bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20">
            <div className="flex items-center bg-white/10 rounded-full px-4 py-3 flex-1">
              <Search className="w-5 h-5 text-gray-200 mr-2" />
              <input 
                type="text" 
                placeholder="Search for events, venues, or categories..." 
                className="bg-transparent border-none outline-none text-white placeholder-gray-300 w-full"
              />
            </div>
            <div className="flex items-center bg-white/10 rounded-full px-4 py-3 md:w-48">
              <MapPin className="w-5 h-5 text-gray-200 mr-2" />
              <select className="bg-transparent border-none outline-none text-white w-full appearance-none cursor-pointer">
                <option value="" disabled selected className="text-gray-800">Location</option>
              </select>
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center font-medium">
              Find Events
            </button>
          </div>
        </motion.div>
        
        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={animationsLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          data-aos="fade-up"
          data-aos-delay="800"
          data-aos-once="false"
          className="flex justify-center gap-8 mt-12"
        >
          <div className="flex flex-col items-center">
            <p className="text-3xl font-bold">10,000+</p>
            <p className="text-gray-300">Events</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl font-bold">500+</p>
            <p className="text-gray-300">Cities</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl font-bold">1M+</p>
            <p className="text-gray-300">Users</p>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={animationsLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce"
        data-aos="fade-up"
        data-aos-delay="1000"
        data-aos-once="false"
      >
        <p className="text-white text-sm mb-2">Scroll to explore</p>
        <ChevronDown className="w-6 h-6 text-white" />
      </motion.div>
    </section>
  );
}



// Enhanced FeaturedEvents Component
function FeaturedEvents() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleEvents, setVisibleEvents] = useState(3);

  const filters = ['All', 'Trending', 'This Week', 'Free', 'Premium'];

  useEffect(() => {
    // Simulate data fetching
    const fetchFeaturedEvents = async () => {
      try {
        setLoading(true);
        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Get all events
        setFeaturedEvents(EVENTS);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured events:', error);
        setLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, []);

  const loadMoreEvents = () => {
    setVisibleEvents(prev => Math.min(prev + 3, featuredEvents.length));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Filter events based on active filter
  const filteredEvents = featuredEvents.filter(event => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Trending') return event.rating >= 4.8;
    if (activeFilter === 'This Week') return true; // Implement date filtering
    if (activeFilter === 'Free') return event.price === 'Free';
    if (activeFilter === 'Premium') return event.price !== 'Free';
    return true;
  });

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12">
        <h2 
          data-aos="fade-up"
          className="text-4xl font-bold mb-6 md:mb-0"
        >
<span className="text-blue-600">Events</span>
        </h2>
        
        {/* Filter tabs */}
        <div 
          data-aos="fade-up"
          data-aos-delay="200"
          className="flex overflow-x-auto pb-2 gap-2 md:gap-4"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-md whitespace-nowrap transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      {/* Events grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.slice(0, visibleEvents).map((event, index) => (
          <div
            key={event.id}
            data-aos="fade-up"
            data-aos-delay={index * 100}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col border border-gray-100"
          >
            {/* Image container with gradient overlay and badges */}
            <div className="relative">
              <img
                src={event.image_url}
                alt={event.name}
                className="w-full h-52 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              
              {/* Event type badge */}
              <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                {event.type}
              </span>
              
              {/* Price badge */}
              <span className="absolute top-4 right-4 bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
                {event.price}
              </span>
              
              {/* Date and time */}
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center text-sm font-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  {event.date}
                </div>
                <div className="flex items-center text-sm mt-1">
                  <Clock className="w-4 h-4 mr-2" />
                  {event.time}
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold mb-2 line-clamp-2">{event.name}</h3>
              
              <div className="flex items-center mb-3">
                <MapPin className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
                <p className="text-gray-600 text-sm truncate">{event.location}</p>
              </div>
              
              <p className="text-gray-700 mb-4 line-clamp-2">{event.description}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {event.tags.map((tag, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Stats */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1 text-gray-500" />
                  <span className="text-sm text-gray-500">{event.attendees}</span>
                </div>
                
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  <span className="text-sm font-medium">{event.rating}</span>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex mt-4 pt-4 border-t border-gray-100">
                <button className="flex-1 bg-blue-600 text-white rounded-md py-2 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                  Details <ArrowRight className="w-4 h-4" />
                </button>
                <button className="ml-2 p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                  <Heart className="w-5 h-5 text-gray-500" />
                </button>
                <button className="ml-2 p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Load more button */}
      {visibleEvents < filteredEvents.length && (
        <div className="text-center mt-12">
          <button
            onClick={loadMoreEvents}
            className="bg-white text-blue-600 border border-blue-600 font-medium px-6 py-3 rounded-md hover:bg-blue-50 transition-colors"
          >
            Load More Events
          </button>
        </div>
      )}
    </section>
  );
}

function CategoryGrid() {
  const categories = [
    { id: 1, name: 'Music', icon: '🎵', count: 842, color: 'from-blue-600 to-indigo-600' },
    { id: 2, name: 'Art', icon: '🎨', count: 654, color: 'from-pink-500 to-rose-500' },
    { id: 3, name: 'Technology', icon: '💻', count: 762, color: 'from-purple-600 to-violet-600' },
    { id: 4, name: 'Sports', icon: '🏅', count: 583, color: 'from-green-500 to-emerald-500' },
    { id: 5, name: 'Food', icon: '🍔', count: 931, color: 'from-yellow-500 to-amber-500' },
    { id: 6, name: 'Education', icon: '📚', count: 476, color: 'from-red-500 to-orange-500' },
    { id: 7, name: 'Wellness', icon: '🧘', count: 328, color: 'from-teal-500 to-cyan-500' },
    { id: 8, name: 'Business', icon: '💼', count: 512, color: 'from-slate-600 to-gray-600' }
  ];

  // Handle keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent, categoryId: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      console.log(`Category ${categoryId} selected via keyboard`);
      // Implement category selection/navigation logic here
    }
  };

  return (
    
    <section className="relative max-w-7xl mx-auto  py-24 bg-white overflow-hidden">
      {/* Background decorative elements */}

        
      <h2 
        data-aos="fade-up"
        className="text-4xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
      >
        Browse by Category
      </h2>
      <p 
        data-aos="fade-up"
        data-aos-delay="100"
        className="text-gray-600 text-center mb-16 max-w-3xl mx-auto text-lg"
      >
        Discover events tailored to your interests from our extensive collection across multiple categories
      </p>
      
      <div 
        data-aos="fade-up"
        data-aos-delay="200"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-8"
      >
        {categories.map((category, index) => (
          <div
            key={category.id}
            data-aos="zoom-in"
            data-aos-delay={index * 50}
            className="group relative flex flex-col items-center bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden border border-gray-100"
            onClick={() => console.log(`Category selected: ${category.name}`)}
            onKeyDown={(e) => handleKeyDown(e, category.id)}
            role="button"
            tabIndex={0}
            aria-label={`Browse ${category.count} events in ${category.name} category`}
          >
            {/* Background gradient overlay with custom color per category */}
            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-95 transition-opacity duration-500 z-0`}></div>
            
            {/* Decorative circles */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute -top-16 -left-16 w-32 h-32 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            
            {/* Icon with enhanced animation */}
            <div className="relative text-5xl mb-5 bg-gray-50 p-5 rounded-full group-hover:bg-white/20 group-hover:scale-110 transition-all duration-500 z-10 shadow-sm group-hover:shadow-lg">
              <span className="group-hover:animate-pulse">{category.icon}</span>
            </div>
            
            {/* Content with improved typography */}
            <h3 className="text-xl md:text-2xl font-bold group-hover:text-white transition-colors duration-300 z-10 text-center">
              {category.name}
            </h3>
            <div className="mt-2 px-4 py-1 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 z-10">
              <p className="text-white text-sm font-medium">
                {category.count.toLocaleString()} events
              </p>
            </div>
            
            {/* Explore indicator that appears on hover */}
            <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 transform translate-y-4 group-hover:translate-y-0">
              <p className="text-white/90 text-xs font-medium flex items-center">
                Explore <ArrowRight className="w-3 h-3 ml-1 animate-pulse" />
              </p>
            </div>
          </div>
        ))}
      </div>
      
   
      
      {/* Add custom animation keyframes in a style tag */}
      <style jsx>{`
        @keyframes bounce-horizontal {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(5px);
          }
        }
        .animate-bounce-horizontal {
          animation: bounce-horizontal 1s infinite;
        }
      `}</style>
    </section>
  );
}
// Enhanced LatestNews Component
function LatestNews() {
  const news = [
    {
      id: 1,
      title: 'International Music Festival Announced',
      date: 'March 5, 2025',
      summary: 'Join us for the biggest music festival of the year featuring top artists from around the world in an unforgettable 3-day experience.',
      image: 'https://picsum.photos/600/400/?random=201',
      category: 'Music',
      readTime: '3 min'
    },
    {
      id: 2,
      title: 'Contemporary Art Exhibition Opens Downtown',
      date: 'February 20, 2025',
      summary: 'Explore thought-provoking contemporary art from local and international artists in this groundbreaking exhibition.',
      image: 'https://picsum.photos/600/400/?random=202',
      category: 'Art',
      readTime: '4 min'
    },
    {
      id: 3,
      title: 'AI & Innovation Conference Goes Global',
      date: 'April 15, 2025',
      summary: 'Attend our hybrid tech conference featuring keynote speakers from leading tech companies discussing the future of AI and innovation.',
      image: 'https://picsum.photos/600/400/?random=203',
      category: 'Technology',
      readTime: '5 min'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 bg-white">
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12">
 
        
        <div>
          <h2 
            data-aos="fade-up"
            className="text-4xl font-bold mb-4"
          >
            Latest <span className="text-blue-600">News</span>
          </h2>
          <p 
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-gray-600 max-w-xl"
          >
            Stay updated with the latest announcements, event highlights, and industry trends
          </p>
        </div>

      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {news.map((article, index) => (
          <div
            key={article.id}
            data-aos="fade-up"
            data-aos-delay={index * 200}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-100"
          >
            <div className="relative overflow-hidden h-52">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-medium px-3 py-1">
                {article.category}
              </div>
            </div>
            <div className="p-6 flex flex-col h-64">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-500 text-sm">{article.date}</p>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {article.readTime}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 flex-grow">{article.title}</h3>
              <p className="text-gray-600 mb-6">{article.summary}</p>
              <button className="self-start mt-auto font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                Read Full Story <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}

  // Enhanced NewsletterSignup Component
  function NewsletterSignup() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
  
    const handleSignup = async (e) => {
      e.preventDefault();
      
      // Simulate API call
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
      
      // Handle newsletter signup logic here
      console.log(`Subscribed with email: ${email}`);
      setSubmitted(true);
      setEmail('');
    };
  
    return (
      <section className="relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-500 opacity-10"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-purple-500 opacity-10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <div 
            data-aos="fade-up"
            className="bg-gradient-to-r from-blue-800 to-purple-800 rounded-3xl p-12 md:p-16"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 
                data-aos="fade-up"
                className="text-4xl font-bold text-white mb-6"
              >
                Stay Updated with Our Newsletter
              </h2>
              <p 
                data-aos="fade-up"
                data-aos-delay="200"
                className="text-blue-100 text-lg mb-8"
              >
                Get exclusive early access to events, special offers, and insider tips delivered straight to your inbox.
              </p>
              <div 
                data-aos="fade-up"
                data-aos-delay="400"
                className="max-w-xl mx-auto"
              >
                {!submitted ? (
                  <form onSubmit={handleSignup} className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <div className="relative w-full">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="pl-12 pr-6 py-4 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white/50 w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-label="Email Address"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-8 py-4 bg-white text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center min-w-[140px] ${
                        loading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-t-2 border-blue-600 border-r-2 rounded-full animate-spin" />
                      ) : (
                        'Subscribe'
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 animate-fade-in">
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-white rounded-full p-2">
                        <svg className="w-6 h-6 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    </div>
                    <p className="text-white text-lg font-medium">Thank you for subscribing!</p>
                    <p className="text-blue-100 mt-2">We've sent a confirmation to your email.</p>
                  </div>
                )}
              </div>
              <p 
                data-aos="fade-up"
                data-aos-delay="600"
                className="text-blue-100 text-sm mt-6"
              >
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // New Component: Download App Section
  function DownloadApp() {
    return (
      <section className="max-w-7xl mx-auto px-6 py-24 bg-white">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div 
            data-aos="fade-right"
            className="lg:w-1/2"
          >
            <h2 className="text-4xl font-bold mb-6">Get Our Mobile App</h2>
            <p className="text-gray-600 text-lg mb-8">
              Discover events on the go with our mobile app. Search for events, purchase tickets, and receive real-time notifications all from your phone.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.9,19.9L17.9,19.9c-0.1,0.2-0.2,0.3-0.4,0.5c-0.7,0.8-1.7,0.9-2.5,0.4c-0.2-0.1-0.4-0.2-0.6-0.3 c-2.2-1.3-4.4-2.5-6.6-3.8c-0.9-0.5-1.9-1.1-2.8-1.6c-0.9-0.5-1-1.7-0.2-2.4c0.2-0.2,0.5-0.3,0.8-0.5c1.3-0.7,2.5-1.4,3.8-2.2 c1.6-0.9,3.2-1.8,4.8-2.8c0.9-0.5,1.8-1,2.6-1.5c0.3-0.2,0.7-0.3,1-0.3c0.7,0,1.2,0.5,1.2,1.2c0,0.1,0,0.2,0,0.3 c0,2.9,0,5.8,0,8.7c0,1.5,0,3.1,0,4.6C19,17.9,18.6,19.1,17.9,19.9z"></path>
                </svg>
                <div className="text-left">
                  <p className="text-xs">Download on the</p>
                  <p className="text-lg font-semibold">App Store</p>
                </div>
              </button>
              <button className="flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.9,19.9L17.9,19.9c-0.1,0.2-0.2,0.3-0.4,0.5c-0.7,0.8-1.7,0.9-2.5,0.4c-0.2-0.1-0.4-0.2-0.6-0.3 c-2.2-1.3-4.4-2.5-6.6-3.8c-0.9-0.5-1.9-1.1-2.8-1.6c-0.9-0.5-1-1.7-0.2-2.4c0.2-0.2,0.5-0.3,0.8-0.5c1.3-0.7,2.5-1.4,3.8-2.2 c1.6-0.9,3.2-1.8,4.8-2.8c0.9-0.5,1.8-1,2.6-1.5c0.3-0.2,0.7-0.3,1-0.3c0.7,0,1.2,0.5,1.2,1.2c0,0.1,0,0.2,0,0.3 c0,2.9,0,5.8,0,8.7c0,1.5,0,3.1,0,4.6C19,17.9,18.6,19.1,17.9,19.9z"></path>
                </svg>
                <div className="text-left">
                  <p className="text-xs">Get it on</p>
                  <p className="text-lg font-semibold">Google Play</p>
                </div>
              </button>
            </div>
          </div>
          <div 
            data-aos="fade-left"
            className="lg:w-1/2"
          >
            <img
              src="https://images.unsplash.com/photo-1580910051070-7c9b7b0e1b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
              alt="Mobile App"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>
    );
  }
  
  
  
  // Enhanced HomePage Component
  export default function HomePage() {
    useEffect(() => {
      AOS.init({
        duration: 1000,
        once: true,
        easing: 'ease-out-cubic',
      });
    }, []);
  
    return (
      <div className="min-h-screen bg-white">
      
        <div id="hero">
          <HeroSection />
        </div>
        
        <div id="featured">
          <FeaturedEvents />
        </div>
        
        <div id="categories">
          <CategoryGrid />
        </div>
        
        <div id="news">
          <LatestNews />
        </div>
        
      
        
        <div id="newsletter">
          <NewsletterSignup />
        </div>
        
    
      </div>
    );
  }
