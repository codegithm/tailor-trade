import {
  User,
  UserRole,
  Design,
  CustomRequest,
  Bid,
  ChatMessage,
  ChatRoom,
  Measurement,
} from "../types";

// Mock Users
export const users: User[] = [
  {
    id: "user1",
    email: "john@example.com",
    name: "John Smith",
    role: UserRole.CUSTOMER,
    avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    location: "New York, USA",
  },
  {
    id: "user2",
    email: "sarah@example.com",
    name: "Sarah Davis",
    role: UserRole.CUSTOMER,
    avatarUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    location: "London, UK",
  },
  {
    id: "tailor1",
    email: "michael@tailor.com",
    name: "Michael Chen",
    role: UserRole.TAILOR,
    avatarUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    bio: "Master tailor with 15 years of experience specializing in suits and formal wear.",
    location: "Milan, Italy",
  },
  {
    id: "tailor2",
    email: "elena@tailor.com",
    name: "Elena Rodriguez",
    role: UserRole.TAILOR,
    avatarUrl: "https://randomuser.me/api/portraits/women/4.jpg",
    bio: "Fashion designer and tailor focusing on sustainable and ethical clothing.",
    location: "Barcelona, Spain",
  },
];

// Mock Designs
export const designs: Design[] = [
  {
    id: "design1",
    tailorId: "tailor1",
    title: "Classic Fitted Suit",
    description:
      "Timeless three-piece suit in navy wool blend. Perfect for formal occasions.",
    price: 599,
    imageUrls: [
      "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?q=80&w=800",
    ],
    category: "Formal",
    fabricType: "Wool Blend",
    created: new Date("2023-03-15"),
    availableSizes: ["S", "M", "L", "XL"],
    tags: ["suit", "formal", "business"],
  },
  {
    id: "design2",
    tailorId: "tailor1",
    title: "Modern Slim Dress Shirt",
    description:
      "Contemporary slim-fit dress shirt with French cuffs in Egyptian cotton.",
    price: 120,
    imageUrls: [
      "https://images.unsplash.com/photo-1626497764746-6dc36546b388?q=80&w=800",
    ],
    category: "Business",
    fabricType: "Cotton",
    created: new Date("2023-04-22"),
    availableSizes: ["XS", "S", "M", "L", "XL"],
    tags: ["shirt", "business", "cotton"],
  },
  {
    id: "design3",
    tailorId: "tailor2",
    title: "Bohemian Summer Dress",
    description:
      "Light flowy summer dress with embroidered details. Made from organic cotton.",
    price: 245,
    imageUrls: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800",
    ],
    category: "Casual",
    fabricType: "Organic Cotton",
    created: new Date("2023-05-10"),
    availableSizes: ["XS", "S", "M", "L"],
    tags: ["dress", "summer", "bohemian", "sustainable"],
  },
  {
    id: "design4",
    tailorId: "tailor2",
    title: "Linen Blazer with Elbow Patches",
    description:
      "Relaxed fit blazer in natural linen with suede elbow patches. Perfect for summer events.",
    price: 320,
    imageUrls: [
      "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?q=80&w=800",
    ],
    category: "Semi-formal",
    fabricType: "Linen",
    created: new Date("2023-06-18"),
    availableSizes: ["S", "M", "L", "XL"],
    tags: ["blazer", "summer", "linen"],
  },
];

// Mock Custom Requests
export const customRequests: CustomRequest[] = [
  {
    id: "request1",
    customerId: "user1",
    title: "Wedding Tuxedo",
    description:
      "Looking for a bespoke tuxedo for my wedding in September. Prefer black with satin lapels and slim fit.",
    proposedPrice: 850,
    status: "open",
    created: new Date("2023-06-12"),
    deadline: new Date("2023-08-15"),
  },
  {
    id: "request2",
    customerId: "user2",
    title: "Business Casual Wardrobe",
    description:
      "Need a complete business casual wardrobe for a new job. Looking for 3 pairs of pants, 5 shirts, and 2 blazers.",
    proposedPrice: 1200,
    status: "accepted",
    created: new Date("2023-05-20"),
    deadline: new Date("2023-07-10"),
  },
];

// Mock Bids
export const bids: Bid[] = [
  {
    id: "bid1",
    requestId: "request1",
    tailorId: "tailor1",
    price: 920,
    message:
      "I can create your wedding tuxedo with premium materials. The price includes two fittings.",
    created: new Date("2023-06-14"),
    status: "pending",
  },
  {
    id: "bid2",
    requestId: "request1",
    tailorId: "tailor2",
    price: 880,
    message:
      "I specialize in wedding attire and can deliver exactly what you're looking for.",
    created: new Date("2023-06-15"),
    status: "pending",
  },
  {
    id: "bid3",
    requestId: "request2",
    tailorId: "tailor2",
    price: 1150,
    message:
      "I can create a cohesive wardrobe with sustainable fabrics that will last for years.",
    created: new Date("2023-05-23"),
    status: "accepted",
  },
];

// Mock Chat Rooms
export const chatRooms: ChatRoom[] = [
  {
    id: "chat1",
    participantIds: ["user1", "tailor1"],
    lastMessage: "What fabrics do you recommend for the tuxedo?",
    lastMessageTime: new Date("2023-06-16T10:30:00"),
    unreadCount: 1,
  },
  {
    id: "chat2",
    participantIds: ["user2", "tailor2"],
    lastMessage: "Your first fitting is scheduled for next Tuesday at 3pm.",
    lastMessageTime: new Date("2023-06-18T15:45:00"),
    unreadCount: 0,
  },
];

// Mock Chat Messages
export const chatMessages: Record<string, ChatMessage[]> = {
  chat1: [
    {
      id: "msg1",
      senderId: "user1",
      recipientId: "tailor1",
      content: "Hello, I'm interested in your bid for my wedding tuxedo.",
      timestamp: new Date("2023-06-16T09:15:00"),
      read: true,
      requestId: "request1",
    },
    {
      id: "msg2",
      senderId: "tailor1",
      recipientId: "user1",
      content:
        "Thank you for your interest! I'd be happy to discuss the details further.",
      timestamp: new Date("2023-06-16T09:30:00"),
      read: true,
      requestId: "request1",
    },
    {
      id: "msg3",
      senderId: "user1",
      recipientId: "tailor1",
      content: "What fabrics do you recommend for the tuxedo?",
      timestamp: new Date("2023-06-16T10:30:00"),
      read: false,
      requestId: "request1",
    },
  ],
  chat2: [
    {
      id: "msg4",
      senderId: "user2",
      recipientId: "tailor2",
      content:
        "Hi Elena, I've accepted your bid for my business casual wardrobe.",
      timestamp: new Date("2023-06-17T14:20:00"),
      read: true,
      requestId: "request2",
    },
    {
      id: "msg5",
      senderId: "tailor2",
      recipientId: "user2",
      content:
        "That's wonderful! Let's schedule a fitting to get your measurements.",
      timestamp: new Date("2023-06-18T09:10:00"),
      read: true,
      requestId: "request2",
    },
    {
      id: "msg6",
      senderId: "tailor2",
      recipientId: "user2",
      content: "Your first fitting is scheduled for next Tuesday at 3pm.",
      timestamp: new Date("2023-06-18T15:45:00"),
      read: true,
      requestId: "request2",
    },
  ],
};

// Mock Measurements
export const measurements: Measurement[] = [
  {
    id: "measure1",
    customerId: "user1",
    chest: 40,
    waist: 34,
    hip: 41,
    inseam: 32,
    shoulder: 18,
    arm: 26,
    height: 180,
    weight: 78,
    neck: 16,
    aiProcessed: true,
    created: new Date("2023-06-10"),
    updated: new Date("2023-06-10"),
  },
  {
    id: "measure2",
    customerId: "user2",
    chest: 36,
    waist: 28,
    hip: 38,
    inseam: 30,
    shoulder: 16,
    arm: 24,
    height: 165,
    weight: 62,
    neck: 14,
    aiProcessed: true,
    created: new Date("2023-05-15"),
    updated: new Date("2023-05-15"),
  },
];

// Current user for development (will be replaced with auth)
export const currentUser = users[0];
