// src/services/api.ts
import axios from 'axios';
import { Event, Community, User } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000'; // Adjust based on your backend URL

export const getChatResponse = async (query: string): Promise<{ response: string; events: Event[] }> => {
  const res = await axios.post(`${API_BASE_URL}/chatbot`, { query });
  return res.data;
};

export const searchCommunities = async (query: string): Promise<{ response: string; communities: Community[] }> => {
  const res = await axios.post(`${API_BASE_URL}/match/communities`, { query });
  return res.data;
};

export const searchUsers = async (query: string): Promise<{ response: string; users: User[] }> => {
  const res = await axios.post(`${API_BASE_URL}/match/users`, { query });
  return res.data;
};
