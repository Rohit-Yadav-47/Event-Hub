// src/pages/AssistantPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Maximize2, Minimize2 } from 'lucide-react';
import CommunitySearch from '../components/chat/CommunitySearch';
import FriendsSearch from '../components/chat/FriendsSearch';
import { Message } from '../types';
import { getChatResponse } from '../services/api';
import ChatContainer from '../components/chat/ChatContainer';

const AssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your event discovery assistant. How can I help you find the perfect event today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'community' | 'friends'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string, interests: string[]) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { response, events } = await getChatResponse(content);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date(),
        events: events,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  // Render different sections based on activeTab
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <ChatContainer
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        );
      case 'community':
        return <CommunitySearch />;
      case 'friends':
        return <FriendsSearch />;
      default:
        return null;
    }
  };

  return (
    <>
      <button
        className="  fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isOpen && (
        <div
          className={`fixed ${
            isMaximized
              ? 'inset-28 max-w-none'
              : 'bottom-20 right-4 w-full md:w-[600px] h-[700px]'
          } flex flex-col bg-white rounded-lg shadow-xl z-40 transition-all duration-300`}
        >
          <div className="p-4 bg-blue-600 rounded-t-lg flex justify-between items-center">
            <h1 className="text-xl font-bold text-white">AI Event Assistant</h1>
            <div className="flex items-center gap-2">
              <button
                className="text-white hover:text-blue-100"
                onClick={toggleMaximize}
              >
                {isMaximized ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </button>
              <button
                className="text-white text-xl hover:text-blue-100"
                onClick={() => setIsOpen(false)}
              >
                &times;
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-2 px-4 text-center ${
                activeTab === 'chat'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
              onClick={() => setActiveTab('chat')}
            >
              Chat
            </button>
            <button
              className={`flex-1 py-2 px-4 text-center ${
                activeTab === 'community'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
              onClick={() => setActiveTab('community')}
            >
              Find Community
            </button>
            <button
              className={`flex-1 py-2 px-4 text-center ${
                activeTab === 'friends'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
              onClick={() => setActiveTab('friends')}
            >
              Find Friends
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {renderActiveTab()}
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantPage;

