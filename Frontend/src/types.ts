export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  events?: Event[];
}

export interface Event {
  id: number;
  name: string;
  location: string;
  date: string;
  time: string;
  description?: string;
  // Add other event fields as needed
}
