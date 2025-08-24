
import React from "react";

const ChatEmptyState = () => {
  return (
    <div className="flex-1 flex items-center justify-center text-slate-500">
      <div className="text-center">
        <h3 className="font-semibold mb-2">Select a conversation</h3>
        <p className="text-sm">Choose a conversation from the list to start chatting</p>
      </div>
    </div>
  );
};

export default ChatEmptyState;
