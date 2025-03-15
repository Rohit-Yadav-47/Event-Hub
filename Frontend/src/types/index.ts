export interface Event {
  id: string;
  name: string;
  location: string;
  type: string;
  date: string;
  time: string;
  description: string;
  price: number;
  capacity: number;
  image: string;
  organizer: string;
  tags: string[];
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  events?: any[]; // Add events to the Message type
}

export interface ChatFilters {
  location?: string;
  eventType?: string;
  date?: string;
}

export interface EventFilters {
  search?: string;
  location?: string;
  type?: string;
  date?: string;
  minPrice?: number;
  maxPrice?: number;
}