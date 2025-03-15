import React from 'react';
import { Message } from '../types';
import { Bot, User } from 'lucide-react';
import EventCard from './EventCard';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <Bot className="w-5 h-5 text-blue-600" />
        </div>
      )}
      <div className={`max-w-[80%] ${isBot ? 'bg-white' : 'bg-blue-600 text-white'} rounded-lg p-3 shadow-sm`}>
        <p className="text-sm">{message.content}</p>
        {message.events && (
          <div className="mt-4 grid gap-2">
            {message.events.map((event, index) => (
              <EventCard key={index} event={event} />
            ))}
          </div>
        )}
      </div>
      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}