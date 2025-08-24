import { createContext, useContext, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";

const StreamChatContext = createContext(null);

export function useStreamChat() {
  return useContext(StreamChatContext);
}

export function StreamChatProvider({ user, children }) {
  const [client, setClient] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (!user) return;
    // Fetch Stream token from backend
    fetch("/api/stream/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setToken(data.token);
        const streamClient = StreamChat.getInstance(
          import.meta.env.VITE_STREAM_API_KEY
        );
        streamClient.connectUser(
          { id: user.id, name: user.name, image: user.avatar },
          data.token
        );
        setClient(streamClient);
      });
    return () => {
      if (client) client.disconnectUser();
    };
    // eslint-disable-next-line
  }, [user]);

  if (!client) return null;
  return (
    <StreamChatContext.Provider value={client}>
      <Chat client={client}>{children}</Chat>
    </StreamChatContext.Provider>
  );
}
