
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
import { useAuth } from '@/contexts/AuthContext';
import { 
  getActiveChallenge, 
  sendChatMessage, 
  subscribeToChatMessages,
  subscribeToDonations,
  subscribeToChallenge,
  createDonation,
  updateViewerCount
} from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';

// Types
type Message = {
  id: number | string;
  username: string;
  message: string;
  emoji: string;
  type: 'chat' | 'donation';
  amount?: number;
  avatarColor: string;
  usernameColor: string;
  messageColor: string;
};

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

// This is a demo channel ID - in production you'd get this from the URL or a context
const DEMO_CHANNEL_ID = "00000000-0000-0000-0000-000000000000";

const Index = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [targetAmount, setTargetAmount] = useState(20);
  const [challengeName, setChallengeName] = useState('DRINK PISS');
  const [viewers, setViewers] = useState(30);
  const [targetReached, setTargetReached] = useState(false);
  const [secondChallenge, setSecondChallenge] = useState('SHITBACK');
  const [secondChallengeProgress, setSecondChallengeProgress] = useState(65);

  // Effect to fetch the active challenge on component mount
  useEffect(() => {
    const fetchActiveChallenge = async () => {
      try {
        const challenge = await getActiveChallenge(DEMO_CHANNEL_ID);
        if (challenge) {
          setChallengeName(challenge.name);
          setTargetAmount(Number(challenge.target_amount));
          setCurrentAmount(Number(challenge.current_amount));
          setTargetReached(challenge.is_completed || Number(challenge.current_amount) >= Number(challenge.target_amount));
        }
      } catch (error) {
        console.error('Error fetching active challenge:', error);
      }
    };

    fetchActiveChallenge();
  }, []);

  // Effect to subscribe to real-time updates
  useEffect(() => {
    // Simulate viewer joining
    updateViewerCount(DEMO_CHANNEL_ID, 1).catch(console.error);

    // Subscribe to chat messages
    const unsubscribeChat = subscribeToChatMessages(DEMO_CHANNEL_ID, (newMessage) => {
      const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      const randomAvatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
      const randomUsernameColor = USERNAME_COLORS[Math.floor(Math.random() * USERNAME_COLORS.length)];
      const randomMessageColor = MESSAGE_COLORS[Math.floor(Math.random() * MESSAGE_COLORS.length)];

      const formattedMessage: Message = {
        id: newMessage.id,
        username: newMessage.username || 'User',
        message: newMessage.message,
        emoji: randomEmoji,
        type: 'chat',
        avatarColor: randomAvatarColor,
        usernameColor: randomUsernameColor,
        messageColor: randomMessageColor
      };

      setMessages(prev => [...prev.slice(-19), formattedMessage]);
    });

    // Subscribe to donations
    const unsubscribeDonations = subscribeToDonations(DEMO_CHANNEL_ID, (newDonation) => {
      const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      const randomAvatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
      const randomUsernameColor = USERNAME_COLORS[Math.floor(Math.random() * USERNAME_COLORS.length)];

      const formattedDonation: Message = {
        id: newDonation.id,
        username: newDonation.username || 'User',
        message: 'contributed',
        emoji: randomEmoji,
        type: 'donation',
        amount: Number(newDonation.amount),
        avatarColor: randomAvatarColor,
        usernameColor: randomUsernameColor,
        messageColor: 'text-white'
      };

      setMessages(prev => [...prev.slice(-19), formattedDonation]);
    });

    // Subscribe to challenge updates
    const unsubscribeChallenge = subscribeToChallenge(DEMO_CHANNEL_ID, (updatedChallenge) => {
      setCurrentAmount(Number(updatedChallenge.current_amount));
      setTargetReached(updatedChallenge.is_completed || Number(updatedChallenge.current_amount) >= Number(updatedChallenge.target_amount));

      if (updatedChallenge.is_completed && !targetReached) {
        toast({
          title: "Challenge completed!",
          description: `${challengeName} target reached!`,
          variant: "default",
        });

        // Add system message
        const systemMessage: Message = {
          id: Date.now(),
          username: 'SYSTEM',
          message: 'TARGET REACHED! Time to drink piss!',
          emoji: '🎉',
          type: 'chat',
          avatarColor: 'bg-neon-red',
          usernameColor: 'text-neon-red',
          messageColor: 'text-neon-yellow'
        };

        setMessages(prev => [...prev.slice(-19), systemMessage]);
      }
    });

    // Simulate random viewer count changes
    const viewerInterval = setInterval(() => {
      setViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(10, prev + change);
      });
    }, 5000);

    // Cleanup subscriptions on component unmount
    return () => {
      unsubscribeChat();
      unsubscribeDonations();
      unsubscribeChallenge();
      clearInterval(viewerInterval);
      
      // Simulate viewer leaving
      updateViewerCount(DEMO_CHANNEL_ID, -1).catch(console.error);
    };
  }, [challengeName, targetReached, toast]);

  // Function to send chat message
  const handleSendMessage = async (message: string) => {
    if (!user) return;

    try {
      await sendChatMessage({
        channel_id: DEMO_CHANNEL_ID,
        user_id: user.id,
        message: message,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  // Function to handle donations
  const handleDonate = async (amount: number) => {
    if (!user) return;

    try {
      await createDonation({
        channel_id: DEMO_CHANNEL_ID,
        user_id: user.id,
        amount: amount,
      });

      toast({
        title: "Thank you!",
        description: `You donated $${amount}!`,
      });
    } catch (error) {
      console.error('Error creating donation:', error);
      toast({
        title: "Error",
        description: "Failed to process donation",
        variant: "destructive",
      });
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
          
          {user && (
            <button
              onClick={() => signOut()}
              className="bg-stream-panel border border-stream-border px-3 py-1 text-sm hover:bg-stream-border rounded"
            >
              Log Out
            </button>
          )}
        </div>
      </header>
      
      <main className="flex flex-col md:flex-row flex-1">
        {/* Main content */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Video feed */}
          <div className="relative aspect-video">
            <VideoFeed 
              targetReached={targetReached} 
              targetText={targetReached ? "TARGET REACHED!" : challengeName} 
            />
          </div>
          
          {/* Viewer count and challenge status */}
          <div className="mt-4 flex items-center justify-between bg-stream-panel p-2 border border-stream-border">
            <ViewerCount count={viewers} />
            
            <div className="flex items-center gap-2">
              <span className="text-neon-orange">NOW: {secondChallenge}...</span>
              <span className="text-neon-green">{secondChallengeProgress}%</span>
              <div className="w-32">
                <ProgressBar 
                  progress={secondChallengeProgress} 
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
              challengeName={challengeName}
              targetAmount={targetAmount}
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
