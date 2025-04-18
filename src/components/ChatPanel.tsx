import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { Message } from '@/pages/Index';
import { useAuth } from '@/contexts/AuthContext';
import { Send, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

type ChatPanelProps = {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onCreateChallenge: (challengeName: string) => void;
};

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, onCreateChallenge }) => {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [customChallenge, setCustomChallenge] = useState('');
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
    onCreateChallenge(challengeName);
    setShowChallengeModal(false);
    setCustomChallenge('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-stream-panel p-2 border-b border-stream-border flex justify-between items-center">
        <h2 className="text-neon-orange font-bold animate-pulse-bright">CHATS & PLEDGES</h2>
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

      {/* Challenge Request Modal - Modern UI */}
      <Dialog open={showChallengeModal} onOpenChange={setShowChallengeModal}>
        <DialogContent className="bg-stream-darker border border-stream-border max-w-md p-0 rounded-lg shadow-glow-red overflow-hidden">
          <DialogHeader className="bg-gradient-to-r from-red-900 to-stream-panel p-4 border-b border-stream-border">
            <DialogTitle className="text-neon-red text-xl font-bold flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              REQUEST EXTREME CHALLENGE
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Request a challenge for the streamer to perform
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-neon-cyan mb-2 font-medium">CHOOSE FROM EXTREME CHALLENGES:</label>
              <div className="grid grid-cols-1 gap-2 mb-4 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {extremeChallenges.map((challenge, index) => (
                  <div
                    key={index}
                    className={`
                      opacity-0 translate-y-1
                      animate-fade-in
                      [animation-delay:${index * 50}ms]
                      [animation-fill-mode:forwards]
                    `}
                  >
                    <button
                      onClick={() => handleChallengeSubmit(challenge)}
                      className="w-full text-left bg-stream-panel p-3 border border-stream-border hover:border-neon-red hover:text-neon-red hover:bg-red-900/20 transition-all duration-200 group rounded"
                    >
                      <div className="flex justify-between items-center">
                        <span>{challenge}</span>
                        <span className="text-neon-red opacity-0 group-hover:opacity-100 transition-opacity">
                          REQUEST &rarr;
                        </span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-neon-cyan mb-2 font-medium">OR CREATE YOUR OWN CHALLENGE:</label>
              <div className="relative">
                <input
                  type="text"
                  value={customChallenge}
                  onChange={(e) => setCustomChallenge(e.target.value)}
                  placeholder="Enter your own extreme challenge"
                  className="w-full p-3 bg-stream-panel text-white border border-stream-border rounded focus:border-neon-red focus:outline-none focus:ring-1 focus:ring-neon-red"
                />
                {customChallenge && (
                  <button 
                    onClick={() => setCustomChallenge('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                onClick={() => setShowChallengeModal(false)}
                variant="outline"
                className="border-stream-border text-gray-300 hover:bg-stream-panel"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleChallengeSubmit(customChallenge)}
                disabled={!customChallenge.trim()}
                className="bg-gradient-to-r from-red-700 to-neon-red text-white hover:bg-red-600 hover:from-neon-red hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-glow-red"
              >
                Request Challenge
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatPanel;
