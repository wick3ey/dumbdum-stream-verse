
import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { Message } from '@/pages/Index';
import { useAuth } from '@/contexts/AuthContext';
import { Send } from 'lucide-react';

type ChatPanelProps = {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onCreateChallenge: (challengeName: string, targetAmount: number) => void;
};

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, onCreateChallenge }) => {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [customChallenge, setCustomChallenge] = useState('');
  const [targetAmount, setTargetAmount] = useState(20);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Predefined extreme challenges
  const extremeChallenges = [
    "DRINK PISS",
    "EAT VOMIT",
    "SWALLOW LIVE INSECTS",
    "LICK TOILET BOWL",
    "RUB HOT SAUCE IN EYES",
    "CHEW GLASS",
    "STAPLE YOUR LIP",
    "BATHE IN ICE WATER",
    "DRINK TABASCO BOTTLE",
    "EAT RAW ANIMAL ORGAN"
  ];

  useEffect(() => {
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

  const handleChallengeSubmit = (challengeName: string) => {
    onCreateChallenge(challengeName, targetAmount);
    setShowChallengeModal(false);
    setCustomChallenge('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-stream-panel p-2 border-b border-stream-border flex justify-between items-center">
        <h2 className="text-neon-orange font-bold animate-pulse-bright">CHATS & PLEDGES</h2>
        <button 
          onClick={() => setShowChallengeModal(true)}
          className="text-xs bg-neon-red hover:bg-red-600 text-white px-2 py-1 rounded-sm"
        >
          CREATE CHALLENGE
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 bg-stream-darker">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center p-4">No messages yet. Be the first to chat!</div>
        ) : (
          messages.map(msg => (
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
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-stream-border flex">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Send a message"
          className="w-full p-3 bg-stream-panel text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-neon-cyan"
        />
        <button 
          type="submit" 
          className="px-4 bg-stream-panel border-l border-stream-border hover:bg-stream-border transition-colors"
          disabled={!inputValue.trim()}
        >
          <Send size={18} className="text-neon-cyan" />
        </button>
      </form>

      {/* Challenge Creation Modal */}
      {showChallengeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-stream-panel border border-stream-border w-full max-w-md p-4 rounded animate-fade-in">
            <h2 className="text-neon-red text-xl font-bold mb-4">CREATE EXTREME CHALLENGE</h2>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Select Challenge:</label>
              <div className="grid grid-cols-1 gap-2 mb-4 max-h-48 overflow-y-auto">
                {extremeChallenges.map((challenge, index) => (
                  <button
                    key={index}
                    onClick={() => handleChallengeSubmit(challenge)}
                    className="text-left bg-stream-darker p-2 hover:bg-neon-red hover:text-white transition-colors"
                  >
                    {challenge}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Custom Challenge:</label>
              <input
                type="text"
                value={customChallenge}
                onChange={(e) => setCustomChallenge(e.target.value)}
                placeholder="Enter your own extreme challenge"
                className="w-full p-2 bg-stream-darker text-white border border-stream-border"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Target Amount: ${targetAmount}</label>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowChallengeModal(false)}
                className="px-4 py-2 border border-stream-border text-gray-300 hover:bg-stream-border"
              >
                Cancel
              </button>
              <button
                onClick={() => handleChallengeSubmit(customChallenge)}
                disabled={!customChallenge.trim()}
                className="px-4 py-2 bg-neon-red text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Custom Challenge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPanel;
