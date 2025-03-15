import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import UserProfilePage from './pages/UserProfilePage';
import CommunityPage from './pages/CommunityPage';
import AssistantPage from './pages/AssistantPage';
import CommunitiesPage from './pages/CommunitiesPage';
import './index.css'; // Import the CSS file

function App() {
  // Initialize theme and prevent transition flash
  useEffect(() => {
    // Check user preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // If no preference, use system setting
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    }

    // Remove no-transition class after page load
    document.body.classList.add('no-transition');
    setTimeout(() => {
      document.body.classList.remove('no-transition');
    }, 100);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (!localStorage.getItem('theme')) {
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/profile" element={<UserProfilePage />} /> 
          <Route path="/profile/:userId" element={<UserProfilePage />} />
          <Route path="/community" element={<CommunitiesPage />} /> 
          <Route path="/community/:communityId" element={<CommunityPage />} />
        </Routes>
        <AssistantPage />
      </Layout>
    </Router>
  );
}

export default App;