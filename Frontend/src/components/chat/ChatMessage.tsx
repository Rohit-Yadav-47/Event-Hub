import React from 'react';
import { Message } from '../../types';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <div
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div
        className={`max-w-[80%] ${
          isBot
            ? 'bg-white text-gray-800'
            : 'bg-blue-600 text-white'
        } rounded-2xl px-4 py-3 shadow-sm`}
      >
        {/* Message Content */}
        <p className="whitespace-pre-wrap break-words">{message.content}</p>

        {/* Events List (if any) */}
        {message.events && message.events.length > 0 && (
          <div className="mt-4 space-y-4">
            <h4 className="font-semibold text-sm opacity-75">
              Related Events:
            </h4>
            <div className="space-y-3">
              {message.events.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-50 rounded-lg p-3 text-gray-800 text-sm"
                >
                  <h5 className="font-semibold mb-2">{event.name}</h5>
                  <div className="space-y-1">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <button 
                    className="mt-2 text-blue-600 hover:underline text-sm font-medium"
                    onClick={() => window.open(`/events/${event.id}`, '_blank')}
                  >
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div
          className={`text-xs mt-1 ${
            isBot ? 'text-gray-500' : 'text-blue-100'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
