// src/types/post.ts
export interface Post {
  _id: string;
  title: string;
  description?: string;
  location?: string;
  category?: string;
  availability?: string;
  images?: string[];
  favorites?: number;
  userHasLiked?: boolean;
  userId?: string; 
  ownerId?: string; 
}