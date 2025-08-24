
import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/types";

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
}

const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);
  
  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };
  
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((msg, index) => {
          const isCurrentUser = msg.senderId === currentUserId;
          const showDate = index === 0 || 
            formatDate(messages[index - 1].timestamp) !== formatDate(msg.timestamp);
          
          return (
            <div key={msg.id}>
              {showDate && (
                <div className="text-center my-4">
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-500">
                    {formatDate(msg.timestamp)}
                  </span>
                </div>
              )}
              
              <div
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isCurrentUser
                      ? "bg-teal-600 text-white"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  <p>{msg.content}</p>
                  <div
                    className={`text-xs mt-1 ${
                      isCurrentUser ? "text-teal-200" : "text-slate-500"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;
