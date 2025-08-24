export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  location?: string;
};

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  TAILOR = "TAILOR",
}

export type Design = {
  id: string;
  tailorId: string;
  title: string;
  description: string;
  price: number;
  imageUrls: string[];
  imageUrl?: string;
  category: string;
  fabricType?: string;
  created: Date;
  availableSizes?: string[];
  tags?: string[];
};

export type CustomRequest = {
  id: string;
  customerId: string;
  title: string;
  description: string;
  proposedPrice: number;
  imageUrl?: string;
  status: "open" | "accepted" | "completed" | "closed";
  created: Date;
  deadline?: Date;
};

export type Bid = {
  id: string;
  requestId: string;
  tailorId: string;
  price: number;
  message: string;
  created: Date;
  status: "pending" | "accepted" | "declined";
};

export type ChatMessage = {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  designId?: string;
  requestId?: string;
};

export type ChatRoom = {
  id: string;
  participantIds: string[];
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
};

export type Measurement = {
  id: string;
  customerId: string;
  chest?: number;
  waist?: number;
  hip?: number;
  inseam?: number;
  shoulder?: number;
  arm?: number;
  height?: number;
  weight?: number;
  neck?: number;
  aiProcessed: boolean;
  created: Date;
  updated: Date;
};
