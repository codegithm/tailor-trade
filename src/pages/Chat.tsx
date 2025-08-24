import { useAuth } from "../contexts/AuthContext";
import { StreamChatProvider } from "../contexts/StreamChatProvider";
import {
  Channel,
  Window,
  MessageList,
  MessageInput,
  Thread,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { ChatRoom, User } from "@/types";

const Chat = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    if (user) {
      setCurrentUserId(user.id);
      fetch(`/chat/rooms/${user.id}`)
        .then((res) => res.json())
        .then((data) => setRooms(data.rooms || []));
      fetch("/chat/users")
        .then((res) => res.json())
        .then((data) => setUsers(data.users || []));
    }
  }, [user]);

  // Find the selected room object
  const selectedRoomObj = rooms.find((r) => r.id === selectedRoom) || null;

  if (!user) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="font-bold text-xl mb-3">Please log in</h2>
        <p className="text-slate-600 mb-4">
          You need to be logged in to view your messages.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[80vh] bg-white rounded-lg shadow-md overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50">
        <ChatSidebar
          rooms={rooms}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          currentUserId={currentUserId}
          users={users}
        />
      </div>
      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedRoomObj ? (
          // You can replace this with your StreamChatProvider/Channel logic if needed
          <div className="flex-1 flex flex-col justify-center items-center">
            <h2 className="text-xl font-semibold mb-2">
              Chat with{" "}
              {(() => {
                const otherId = selectedRoomObj.participantIds.find(
                  (id) => id !== currentUserId
                );
                const otherUser = users.find((u) => u.id === otherId);
                return otherUser?.name || "Unknown";
              })()}
            </h2>
            {/* Place your chat window/messages here, e.g. StreamChatProvider/Channel */}
            <div className="w-full h-full flex flex-col">
              {/* TODO: Integrate StreamChatProvider/Channel/Window/MessageList/MessageInput/Thread here */}
              <div className="text-slate-400 text-center mt-8">
                Chat window coming soon...
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-slate-400">
            <span className="text-lg">
              Select a conversation to start chatting
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
