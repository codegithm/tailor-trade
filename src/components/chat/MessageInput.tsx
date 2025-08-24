import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MessageInput = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message...",
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedMessage = message.trim();
      if (!trimmedMessage || disabled || isSubmitting) return;

      try {
        setIsSubmitting(true);
        await onSendMessage(trimmedMessage);
        setMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [message, disabled, isSubmitting, onSendMessage]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as any);
      }
    },
    [handleSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200">
      <div className="flex space-x-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled || isSubmitting}
          className="flex-1"
          aria-label="Message input"
        />
        <Button
          type="submit"
          disabled={!message.trim() || disabled || isSubmitting}
          aria-label="Send message"
          className="px-4"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;
