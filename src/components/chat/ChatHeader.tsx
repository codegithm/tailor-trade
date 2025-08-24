
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";

interface ChatHeaderProps {
  participant: User | undefined;
}

const ChatHeader = ({ participant }: ChatHeaderProps) => {
  return (
    <div className="p-4 border-b border-slate-200">
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage 
            src={participant?.avatarUrl} 
            alt={participant?.name} 
          />
          <AvatarFallback>
            {participant?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{participant?.name}</h3>
          <p className="text-xs text-slate-500">
            {participant?.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
