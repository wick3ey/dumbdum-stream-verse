
import React from 'react';
import ChatMessage from './ChatMessage';

type Message = {
  id: number;
  username: string;
  message: string;
  emoji: string;
  type: 'chat' | 'donation';
  amount?: number;
  avatarColor: string;
  usernameColor: string;
  messageColor: string;
};

type ChatPanelProps = {
  messages: Message[];
  onSendMessage: (message: string) => void;
};

// Map of available avatar colors
const AVATAR_COLORS = {
  purple: 'bg-neon-purple',
  green: 'bg-neon-green',
  orange: 'bg-neon-orange',
  cyan: 'bg-neon-cyan',
  yellow: 'bg-neon-yellow',
  magenta: 'bg-neon-magenta'
};

// Map of available username colors
const USERNAME_COLORS = {
  purple: 'text-neon-purple',
  green: 'text-neon-green',
  orange: 'text-neon-orange',
  cyan: 'text-neon-cyan',
  yellow: 'text-neon-yellow',
  magenta: 'text-neon-magenta'
};

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage }) => {
  const [inputValue, setInputValue] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-stream-panel p-2 border-b border-stream-border">
        <h2 className="text-neon-orange font-bold animate-pulse-bright">CHATS & PLEDGES</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2 bg-stream-darker">
        {messages.map(msg => (
          <ChatMessage
            key={msg.id}
            username={msg.username}
            message={msg.message}
            emoji={msg.emoji}
            avatarColor={msg.avatarColor}
            usernameColor={msg.usernameColor}
            messageColor={msg.messageColor}
            type={msg.type}
            amount={msg.amount}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-stream-border">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Send a message"
          className="w-full p-3 bg-stream-panel text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-neon-cyan"
        />
      </form>
    </div>
  );
};

export default ChatPanel;
