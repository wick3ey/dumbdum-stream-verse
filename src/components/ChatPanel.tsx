
import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { Message } from '@/pages/Index';
import { useAuth } from '@/contexts/AuthContext';
import { Send, X, AlertCircle, Flame } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createChallenge } from '@/services/supabaseService';

type ChatPanelProps = {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onCreateChallenge: (challengeName: string) => void;
};

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, onCreateChallenge }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState('');
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [customChallenge, setCustomChallenge] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Predefined extreme challenges
  const extremeChallenges = [
    "DRINK PISS",
    "EAT POOP",
    "SHAVE HEAD",
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

  const handleChallengeSubmit = async (challengeName: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "You must be logged in to request a challenge",
        variant: "destructive",
      });
      return;
    }
    
    if (!challengeName.trim()) {
      toast({
        title: "Challenge required",
        description: "Please enter a challenge name",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Submit the challenge to the database
      await createChallenge({
        channel_id: "00000000-0000-0000-0000-000000000000", // Using demo channel ID
        name: challengeName.toUpperCase(),
        user_id: user.id
      });
      
      // Notify parent component
      onCreateChallenge(challengeName);
      
      // Close modal and reset state
      setShowChallengeModal(false);
      setCustomChallenge('');
      
      toast({
        title: "Challenge Requested",
        description: `Your challenge "${challengeName.toUpperCase()}" has been submitted for approval`,
      });
    } catch (error: any) {
      console.error('Error creating challenge:', error);
      toast({
        title: "Request failed",
        description: error.message || "Failed to submit your challenge request",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-stream-panel p-2 border-b border-stream-border flex justify-between items-center">
        <h2 className="text-neon-orange font-bold animate-pulse-bright">CHATS & PLEDGES</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2 bg-stream-darker custom-scrollbar">
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
    </div>
  );
};

export default ChatPanel;
