import { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatRoom, User } from "@/types";

interface ChatSidebarProps {
  rooms: ChatRoom[];
  selectedRoom: string | null;
  setSelectedRoom: (roomId: string) => void;
  currentUserId: string;
  users: User[];
  isLoading?: boolean;
  error?: string;
}

const ChatSidebar = ({
  rooms,
  selectedRoom,
  setSelectedRoom,
  currentUserId,
  users,
  isLoading = false,
  error,
}: ChatSidebarProps) => {
  const formatTime = useMemo(() => {
    return (date: Date): string => {
      return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };
  }, []);

  return (
    <div className="md:col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <h2 className="font-semibold">Conversations</h2>
      </div>
      <ScrollArea className="h-[calc(100%-57px)]">
        {error ? (
          <div className="p-4 text-center text-red-500" role="alert">
            {error}
          </div>
        ) : isLoading ? (
          <div className="space-y-4 p-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[160px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {rooms.length > 0 ? (
              rooms.map((room) => {
                const otherParticipantId = room.participantIds.find(
                  (id) => id !== currentUserId
                );
                const otherUser = users.find(
                  (u) => u.id === otherParticipantId
                );

                return (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`w-full text-left p-4 cursor-pointer hover:bg-slate-50 ${
                      selectedRoom === room.id ? "bg-slate-50" : ""
                    }`}
                    aria-selected={selectedRoom === room.id}
                    role="tab"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage
                          src={otherUser?.avatarUrl}
                          alt={`${otherUser?.name}'s avatar`}
                        />
                        <AvatarFallback>
                          {otherUser?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-medium truncate">
                            {otherUser?.name || "Unknown"}
                          </p>
                          {room.lastMessageTime && (
                            <time
                              className="text-xs text-slate-500"
                              dateTime={new Date(
                                room.lastMessageTime
                              ).toISOString()}
                            >
                              {formatTime(room.lastMessageTime)}
                            </time>
                          )}
                        </div>
                        {room.lastMessage && (
                          <p className="text-sm text-slate-500 truncate">
                            {room.lastMessage}
                          </p>
                        )}
                      </div>
                    </div>
                    {room.unreadCount > 0 && (
                      <Badge className="ml-auto mt-1" variant="secondary">
                        {room.unreadCount} new message
                        {room.unreadCount > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-slate-500" role="status">
                No conversations yet
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
