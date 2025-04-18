
import React from 'react';
import Avatar from './Avatar';

type MessageType = 'chat' | 'donation' | 'system';

type ChatMessageProps = {
  username: string;
  message: string;
  emoji: string;
  avatarColor: string;
  usernameColor: string;
  messageColor: string;
  type: MessageType;
  amount?: number;
};

const ChatMessage: React.FC<ChatMessageProps> = ({
  username,
  message,
  emoji,
  avatarColor,
  usernameColor,
  messageColor,
  type,
  amount
}) => {
  if (type === 'system') {
    return (
      <div className="py-2 px-3 my-2 bg-stream-panel border border-neon-red rounded text-center animate-pulse-bright">
        <span className="text-neon-red font-bold">{username}: </span>
        <span className="text-neon-yellow">{message}</span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 mb-2 animate-fade-in">
      <Avatar color={avatarColor} emoji={emoji} className="flex-shrink-0" />
      
      <div className="flex flex-col overflow-hidden">
        {type === 'chat' ? (
          <>
            <div className={`font-bold ${usernameColor}`}>{username}</div>
            <div className={`text-sm ${messageColor} break-words`}>{message}</div>
          </>
        ) : (
          <div className="bg-stream-panel p-2 rounded border border-stream-border animate-pulse-bright">
            <span className={`font-bold ${usernameColor}`}>{username}</span>
            <span className="text-neon-cyan"> contributed </span>
            <span className="bg-neon-yellow text-black font-bold px-2 py-1 rounded">
              ${amount?.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
