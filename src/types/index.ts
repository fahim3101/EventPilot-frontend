export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface EventItem {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  imageUrl: string;
  images: string[];
  tags: string[];
  organizer: { _id: string; name: string; avatarUrl?: string; email?: string };
  attendeesCount: number;
  createdAt: string;
}

export interface Review {
  _id: string;
  event: string;
  user: { _id: string; name: string; avatarUrl?: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoryStat {
  category: string;
  count: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
