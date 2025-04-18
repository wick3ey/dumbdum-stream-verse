
import React, { useState, useEffect } from 'react';
import Avatar from '@/components/Avatar';
import ChatMessage from '@/components/ChatMessage';
import ChatPanel from '@/components/ChatPanel';
import DonateButton from '@/components/DonateButton';
import DumDummiesLogo from '@/components/DumDummiesLogo';
import ProgressBar from '@/components/ProgressBar';
import TargetDisplay from '@/components/TargetDisplay';
import VideoFeed from '@/components/VideoFeed';
import ViewerCount from '@/components/ViewerCount';

// Types
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

// Random usernames based on the images
const USERNAMES = [
  'FearFerret9', 'Captain-Puke88', 'The-Ventricle', 'ShinyGuppy',
  'Razor513', 'BlueThunder', 'CyberNomad', 'BitLord',
  'GlitchMonkey', 'ToxicWaste', 'DigitalDemon', 'VoidWalker'
];

// Random emojis
const EMOJIS = ['😈', '👹', '👽', '🤖', '👻', '💀', '🤡', '👺', '😠', '🤯', '🥴', '🤪'];

// Colors for avatars
const AVATAR_COLORS = [
  'bg-neon-purple', 'bg-neon-green', 'bg-neon-orange', 
  'bg-neon-cyan', 'bg-neon-yellow', 'bg-neon-magenta'
];

// Colors for usernames
const USERNAME_COLORS = [
  'text-neon-purple', 'text-neon-green', 'text-neon-orange', 
  'text-neon-cyan', 'text-neon-yellow', 'text-neon-magenta'
];

// Colors for messages
const MESSAGE_COLORS = ['text-white', 'text-neon-cyan', 'text-neon-blue'];

// Random chat messages
const RANDOM_MESSAGES = [
  'bored.',
  'STICK IT UP YR ASS you nasty',
  'this is wild!',
  'what is he doing lol',
  'do the thing!',
  'I PAID GOOD MONEY FOR THIS',
  'looks painful',
  'this stream is epic',
  'more glitches plz',
  'everyone donate!!!',
  'LMAOOOOO',
  'I can\'t believe he\'s doing this',
  'worth every penny'
];

// Challenge data
const CHALLENGE = {
  name: 'DRINK PISS',
  targetAmount: 20,
  secondChallenge: 'SHITBACK',
  secondChallengeProgress: 65
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [viewers, setViewers] = useState(30);
  const [targetReached, setTargetReached] = useState(false);

  // Generate initial messages on mount
  useEffect(() => {
    const initialMessages: Message[] = [
      createChatMessage('I PAID GOOD MONEY FOR THIS'),
      createChatMessage('this is getting wild'),
      createChatMessage('worth every penny'),
      createDonationMessage(5),
      createChatMessage('LMAOOOOO'),
      createDonationMessage(10),
    ];
    
    setMessages(initialMessages);
    
    // Simulate random viewer count changes
    const viewerInterval = setInterval(() => {
      setViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(10, prev + change);
      });
    }, 5000);
    
    // Simulate random chat messages
    const chatInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        addRandomMessage();
      }
    }, 3000);
    
    return () => {
      clearInterval(viewerInterval);
      clearInterval(chatInterval);
    };
  }, []);
  
  // Function to create a random chat message
  function createChatMessage(overrideMessage?: string): Message {
    const randomUsername = USERNAMES[Math.floor(Math.random() * USERNAMES.length)];
    const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const randomAvatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const randomUsernameColor = USERNAME_COLORS[Math.floor(Math.random() * USERNAME_COLORS.length)];
    const randomMessageColor = MESSAGE_COLORS[Math.floor(Math.random() * MESSAGE_COLORS.length)];
    const randomMessage = overrideMessage || RANDOM_MESSAGES[Math.floor(Math.random() * RANDOM_MESSAGES.length)];
    
    return {
      id: Date.now() + Math.random(),
      username: randomUsername,
      message: randomMessage,
      emoji: randomEmoji,
      type: 'chat',
      avatarColor: randomAvatarColor,
      usernameColor: randomUsernameColor,
      messageColor: randomMessageColor
    };
  }
  
  // Function to create a donation message
  function createDonationMessage(amount: number): Message {
    const randomUsername = USERNAMES[Math.floor(Math.random() * USERNAMES.length)];
    const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const randomAvatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const randomUsernameColor = USERNAME_COLORS[Math.floor(Math.random() * USERNAME_COLORS.length)];
    
    return {
      id: Date.now() + Math.random(),
      username: randomUsername,
      message: 'contributed',
      emoji: randomEmoji,
      type: 'donation',
      amount: amount,
      avatarColor: randomAvatarColor,
      usernameColor: randomUsernameColor,
      messageColor: 'text-white'
    };
  }
  
  // Add a random chat message
  const addRandomMessage = () => {
    const newMessage = createChatMessage();
    setMessages(prev => [...prev.slice(-19), newMessage]);
  };
  
  // Handle user sending a message
  const handleSendMessage = (message: string) => {
    // Generate random username and emoji for the user
    const userMessage = {
      id: Date.now(),
      username: USERNAMES[Math.floor(Math.random() * USERNAMES.length)],
      message,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      type: 'chat' as const,
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      usernameColor: USERNAME_COLORS[Math.floor(Math.random() * USERNAME_COLORS.length)],
      messageColor: 'text-white'
    };
    
    setMessages(prev => [...prev.slice(-19), userMessage]);
  };
  
  // Handle donations
  const handleDonate = (amount: number) => {
    // Create donation message
    const donationMessage = createDonationMessage(amount);
    setMessages(prev => [...prev.slice(-19), donationMessage]);
    
    // Update current amount
    const newAmount = currentAmount + amount;
    setCurrentAmount(newAmount);
    
    // Check if target is reached
    if (newAmount >= CHALLENGE.targetAmount && !targetReached) {
      setTargetReached(true);
      
      // Add target reached message
      setTimeout(() => {
        const targetReachedMessage = {
          id: Date.now(),
          username: 'SYSTEM',
          message: 'TARGET REACHED! Time to drink piss!',
          emoji: '🎉',
          type: 'chat' as const,
          avatarColor: 'bg-neon-red',
          usernameColor: 'text-neon-red',
          messageColor: 'text-neon-yellow'
        };
        setMessages(prev => [...prev.slice(-19), targetReachedMessage]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-stream-dark text-white flex flex-col">
      <div className="scanlines pointer-events-none fixed inset-0 z-50"></div>
      
      <header className="border-b border-stream-border p-4 flex items-center justify-between">
        <DumDummiesLogo />
        <div className="flex items-center gap-4">
          <button className="bg-neon-red text-white px-3 py-1 text-sm font-bold rounded">
            LIVE
          </button>
          
          <div className="hidden md:block">
            <input
              type="text"
              placeholder="Search"
              className="bg-stream-panel border border-stream-border text-white placeholder-gray-500 px-3 py-1 rounded focus:outline-none focus:border-neon-cyan"
            />
          </div>
        </div>
      </header>
      
      <main className="flex flex-col md:flex-row flex-1">
        {/* Main content */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Video feed */}
          <div className="relative aspect-video">
            <VideoFeed 
              targetReached={targetReached} 
              targetText={targetReached ? "TARGET REACHED!" : CHALLENGE.name} 
            />
          </div>
          
          {/* Viewer count and challenge status */}
          <div className="mt-4 flex items-center justify-between bg-stream-panel p-2 border border-stream-border">
            <ViewerCount count={viewers} />
            
            <div className="flex items-center gap-2">
              <span className="text-neon-orange">NOW: {CHALLENGE.secondChallenge}...</span>
              <span className="text-neon-green">{CHALLENGE.secondChallengeProgress}%</span>
              <div className="w-32">
                <ProgressBar 
                  progress={CHALLENGE.secondChallengeProgress} 
                  color="bg-neon-green" 
                />
              </div>
            </div>
            
            {/* Donation buttons */}
            <div className="flex items-center gap-2">
              <DonateButton amount={5} onDonate={handleDonate} />
              <DonateButton amount={10} onDonate={handleDonate} />
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-stream-border flex flex-col">
          {/* Target display */}
          <div className="p-4 border-b border-stream-border">
            <TargetDisplay
              challengeName={CHALLENGE.name}
              targetAmount={CHALLENGE.targetAmount}
              currentAmount={currentAmount}
              isTargetReached={targetReached}
            />
          </div>
          
          {/* Chat panel */}
          <div className="flex-1">
            <ChatPanel 
              messages={messages} 
              onSendMessage={handleSendMessage} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
