export type Language = 'en' | 'bn' | 'hi';

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  modelUsed?: string;
  error?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  language: Language;
  model: string;
}

export interface ModelOption {
  id: string;
  name: string;
  tag: string;
  badge: string;
  description: string;
  isDefault?: boolean;
}
