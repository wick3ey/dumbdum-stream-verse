import React, { useState, useEffect } from 'react';
import Avatar from '@/components/Avatar';
import ChatPanel from '@/components/ChatPanel';
import DonateButton from '@/components/DonateButton';
import DumDummiesLogo from '@/components/DumDummiesLogo';
import ProgressBar from '@/components/ProgressBar';
import TargetDisplay from '@/components/TargetDisplay';
import VideoFeed from '@/components/VideoFeed';
import ViewerCount from '@/components/ViewerCount';
import ChallengesDashboard from '@/components/ChallengesDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getActiveChallenge,
  getRequestedChallenges,
  sendChatMessage, 
  subscribeToChatMessages,
  subscribeToDonations,
  subscribeToChallenge,
  createDonation,
  updateViewerCount,
  createChallenge,
  approveChallenge,
  rejectChallenge
} from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export type Message = {
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

export type Challenge = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  status: 'requested' | 'active' | 'completed';
  userId?: string;
};

const EMOJIS = ['😈', '👹', '👽', '🤖', '👻', '💀', '🤡', '👺', '😠', '🤯', '🥴', '🤪'];

const AVATAR_COLORS = [
  'bg-neon-purple', 'bg-neon-green', 'bg-neon-orange', 
  'bg-neon-cyan', 'bg-neon-yellow', 'bg-neon-magenta'
];

const USERNAME_COLORS = [
  'text-neon-purple', 'text-neon-green', 'text-neon-orange', 
  'text-neon-cyan', 'text-neon-yellow', 'text-neon-magenta'
];

const MESSAGE_COLORS = ['text-white', 'text-neon-cyan', 'text-neon-blue'];

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
  
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([
    {
      id: "default",
      name: challengeName,
      targetAmount: targetAmount,
      currentAmount: currentAmount,
      status: 'active'
    },
  ]);
  
  const [requestedChallenges, setRequestedChallenges] = useState<Challenge[]>([]);
  const [isCreator, setIsCreator] = useState(true);

  const [userAvatarColor] = useState(() => {
    const storedColor = localStorage.getItem('userAvatarColor');
    if (storedColor && AVATAR_COLORS.includes(storedColor)) {
      return storedColor;
    }
    const newColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    localStorage.setItem('userAvatarColor', newColor);
    return newColor;
  });
  
  const [userEmoji] = useState(() => {
    const storedEmoji = localStorage.getItem('userEmoji');
    if (storedEmoji && EMOJIS.includes(storedEmoji)) {
      return storedEmoji;
    }
    const newEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    localStorage.setItem('userEmoji', newEmoji);
    return newEmoji;
  });
  
  const [usernameColor] = useState(() => {
    const storedColor = localStorage.getItem('userTextColor');
    if (storedColor && USERNAME_COLORS.includes(storedColor)) {
      return storedColor;
    }
    const newColor = USERNAME_COLORS[Math.floor(Math.random() * USERNAME_COLORS.length)];
    localStorage.setItem('userTextColor', newColor);
    return newColor;
  });

  useEffect(() => {
    const fetchActiveChallenge = async () => {
      try {
        const challenge = await getActiveChallenge(DEMO_CHANNEL_ID);
        if (challenge) {
          setChallengeName(challenge.name);
          setTargetAmount(Number(challenge.target_amount));
          setCurrentAmount(Number(challenge.current_amount));
          setTargetReached(challenge.is_completed || Number(challenge.current_amount) >= Number(challenge.target_amount));
          
          setActiveChallenges([{
            id: challenge.id,
            name: challenge.name,
            targetAmount: Number(challenge.target_amount),
            currentAmount: Number(challenge.current_amount),
            status: 'active'
          }]);
        }
      } catch (error) {
        console.error('Error fetching active challenge:', error);
      }
    };
    
    const fetchRequestedChallenges = async () => {
      try {
        const challenges = await getRequestedChallenges(DEMO_CHANNEL_ID);
        if (challenges) {
          const formattedChallenges: Challenge[] = challenges.map(c => ({
            id: c.id,
            name: c.name,
            targetAmount: 0,
            currentAmount: 0,
            status: 'requested',
            userId: c.userId || c.user_id || ''
          }));
          setRequestedChallenges(formattedChallenges);
        }
      } catch (error) {
        console.error('Error fetching requested challenges:', error);
      }
    };

    fetchActiveChallenge();
    fetchRequestedChallenges();
  }, []);

  useEffect(() => {
    updateViewerCount(DEMO_CHANNEL_ID, 1).catch(console.error);

    const unsubscribeChat = subscribeToChatMessages(DEMO_CHANNEL_ID, (newMessage) => {
      const randomEmoji = newMessage.emoji || EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      const randomAvatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
      const randomUsernameColor = USERNAME_COLORS[Math.floor(Math.random() * USERNAME_COLORS.length)];
      const randomMessageColor = MESSAGE_COLORS[Math.floor(Math.random() * MESSAGE_COLORS.length)];

      const formattedMessage: Message = {
        id: newMessage.id,
        username: newMessage.username || 'Anonymous',
        message: newMessage.message,
        emoji: randomEmoji,
        type: 'chat',
        avatarColor: randomAvatarColor,
        usernameColor: randomUsernameColor,
        messageColor: randomMessageColor
      };

      setMessages(prev => [...prev.slice(-49), formattedMessage]);
    });

    const unsubscribeDonations = subscribeToDonations(DEMO_CHANNEL_ID, (newDonation) => {
      const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      const randomAvatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
      const randomUsernameColor = USERNAME_COLORS[Math.floor(Math.random() * USERNAME_COLORS.length)];

      const formattedDonation: Message = {
        id: newDonation.id,
        username: newDonation.username || 'Anonymous',
        message: 'contributed',
        emoji: randomEmoji,
        type: 'donation',
        amount: Number(newDonation.amount),
        avatarColor: randomAvatarColor,
        usernameColor: randomUsernameColor,
        messageColor: 'text-white'
      };

      setMessages(prev => [...prev.slice(-49), formattedDonation]);
      
      setCurrentAmount(prevAmount => {
        const newAmount = prevAmount + Number(newDonation.amount);
        if (newAmount >= targetAmount && !targetReached) {
          setTargetReached(true);
          
          const systemMessage: Message = {
            id: Date.now(),
            username: 'SYSTEM',
            message: `TARGET REACHED! Time to ${challengeName.toLowerCase()}!`,
            emoji: '🎉',
            type: 'chat',
            avatarColor: 'bg-neon-red',
            usernameColor: 'text-neon-red',
            messageColor: 'text-neon-yellow'
          };
          
          setMessages(prev => [...prev.slice(-49), systemMessage]);
          
          toast({
            title: "Challenge completed!",
            description: `${challengeName} target reached!`,
            variant: "default",
          });
        }
        return newAmount;
      });
      
      setActiveChallenges(prev => {
        return prev.map(challenge => {
          if (challenge.name === challengeName) {
            const newAmount = challenge.currentAmount + Number(newDonation.amount);
            return {
              ...challenge,
              currentAmount: newAmount
            };
          }
          return challenge;
        });
      });
    });

    const unsubscribeChallenge = subscribeToChallenge(DEMO_CHANNEL_ID, (updatedChallenge) => {
      if (updatedChallenge.status === 'active') {
        setRequestedChallenges(prev => prev.filter(c => c.id !== updatedChallenge.id));
        
        const existsInActive = activeChallenges.some(c => c.id === updatedChallenge.id);
        if (!existsInActive) {
          setActiveChallenges(prev => [
            ...prev, 
            {
              id: updatedChallenge.id,
              name: updatedChallenge.name,
              targetAmount: Number(updatedChallenge.target_amount),
              currentAmount: Number(updatedChallenge.current_amount),
              status: 'active'
            }
          ]);
        } else {
          setActiveChallenges(prev => prev.map(c => {
            if (c.id === updatedChallenge.id) {
              return {
                ...c,
                name: updatedChallenge.name,
                targetAmount: Number(updatedChallenge.target_amount),
                currentAmount: Number(updatedChallenge.current_amount),
                status: 'active'
              };
            }
            return c;
          }));
        }
      }
      
      if (updatedChallenge.id === activeChallenges[0]?.id) {
        setChallengeName(updatedChallenge.name);
        setTargetAmount(Number(updatedChallenge.target_amount));
        setCurrentAmount(Number(updatedChallenge.current_amount));
        setTargetReached(updatedChallenge.is_completed || Number(updatedChallenge.current_amount) >= Number(updatedChallenge.target_amount));
        
        if (updatedChallenge.is_completed && !targetReached) {
          toast({
            title: "Challenge completed!",
            description: `${challengeName} target reached!`,
            variant: "default",
          });

          const systemMessage: Message = {
            id: Date.now(),
            username: 'SYSTEM',
            message: `TARGET REACHED! Time to ${updatedChallenge.name.toLowerCase()}!`,
            emoji: '🎉',
            type: 'chat',
            avatarColor: 'bg-neon-red',
            usernameColor: 'text-neon-red',
            messageColor: 'text-neon-yellow'
          };

          setMessages(prev => [...prev.slice(-49), systemMessage]);
        }
      }
    });

    const viewerInterval = setInterval(() => {
      setViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(10, prev + change);
      });
    }, 5000);

    return () => {
      unsubscribeChat();
      unsubscribeDonations();
      unsubscribeChallenge();
      clearInterval(viewerInterval);
      
      updateViewerCount(DEMO_CHANNEL_ID, -1).catch(console.error);
    };
  }, [challengeName, targetReached, toast, targetAmount, activeChallenges]);

  const handleSendMessage = async (message: string) => {
    if (!user) return;

    try {
      await sendChatMessage({
        channel_id: DEMO_CHANNEL_ID,
        user_id: user.id,
        message: message,
        emoji: userEmoji
      });
      
      const newMessage: Message = {
        id: `temp-${Date.now()}`,
        username: user.user_metadata.username || user.email?.split('@')[0] || 'You',
        message: message,
        emoji: userEmoji,
        type: 'chat',
        avatarColor: userAvatarColor,
        usernameColor: usernameColor,
        messageColor: 'text-white'
      };
      
      setMessages(prev => [...prev.slice(-49), newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleDonate = async (amount: number, challengeName: string) => {
    if (!user) return;

    try {
      const challenge = activeChallenges.find(c => c.name === challengeName);
      if (!challenge) {
        toast({
          title: "Error",
          description: "Challenge not found",
          variant: "destructive",
        });
        return;
      }

      await createDonation({
        channel_id: DEMO_CHANNEL_ID,
        user_id: user.id,
        amount: amount,
      });

      toast({
        title: "Thank you!",
        description: `You donated $${amount} to ${challengeName}!`,
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

  const handleCreateChallenge = async (challengeName: string) => {
    if (!user || !challengeName.trim()) return;
    
    try {
      await createChallenge({
        channel_id: DEMO_CHANNEL_ID,
        name: challengeName.toUpperCase(),
        user_id: user.id
      });
      
      const newChallenge: Challenge = {
        id: `temp-${Date.now()}`,
        name: challengeName.toUpperCase(),
        targetAmount: 0,
        currentAmount: 0,
        status: 'requested',
        userId: user.id
      };
      
      setRequestedChallenges(prev => [...prev, newChallenge]);
      
      const systemMessage: Message = {
        id: Date.now(),
        username: 'SYSTEM',
        message: `NEW CHALLENGE REQUESTED: ${challengeName.toUpperCase()}`,
        emoji: '🔥',
        type: 'chat',
        avatarColor: 'bg-neon-red',
        usernameColor: 'text-neon-red',
        messageColor: 'text-neon-yellow'
      };
      setMessages(prev => [...prev.slice(-49), systemMessage]);
      
      toast({
        title: "Challenge requested!",
        description: `Your challenge request has been submitted: ${challengeName.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Error creating challenge:', error);
      toast({
        title: "Error",
        description: "Failed to create challenge",
        variant: "destructive",
      });
    }
  };
  
  const handleApproveChallenge = async (challengeId: string, targetAmount: number) => {
    try {
      await approveChallenge(challengeId, targetAmount);
      
      toast({
        title: "Challenge approved",
        description: "Challenge has been approved and is now active",
      });
    } catch (error) {
      console.error('Error approving challenge:', error);
      toast({
        title: "Error",
        description: "Failed to approve challenge",
        variant: "destructive",
      });
    }
  };
  
  const handleRejectChallenge = async (challengeId: string) => {
    try {
      await rejectChallenge(challengeId);
      
      setRequestedChallenges(prev => prev.filter(c => c.id !== challengeId));
      
      toast({
        title: "Challenge rejected",
        description: "Challenge request has been rejected",
      });
    } catch (error) {
      console.error('Error rejecting challenge:', error);
      toast({
        title: "Error",
        description: "Failed to reject challenge",
        variant: "destructive",
      });
    }
  };

  const handleDonateAdapter = (amount: number) => {
    if (activeChallenges.length > 0) {
      handleDonate(amount, activeChallenges[0].name);
    }
  };

  useEffect(() => {
    if (requestedChallenges.length === 0) {
      setRequestedChallenges([
        {
          id: 'demo-req-1',
          name: 'EAT A GHOST PEPPER',
          targetAmount: 0,
          currentAmount: 0,
          status: 'requested',
          userId: 'demo-user-1'
        },
        {
          id: 'demo-req-2',
          name: 'SHAVE HEAD ON STREAM',
          targetAmount: 0,
          currentAmount: 0,
          status: 'requested',
          userId: 'demo-user-2'
        }
      ]);
    }
  }, [requestedChallenges]);

  return (
    <div className="min-h-screen bg-stream-dark text-white flex flex-col">
      <div className="scanlines pointer-events-none fixed inset-0 z-50"></div>
      
      <header className="border-b border-stream-border p-4 flex items-center justify-between bg-stream-panel/50 backdrop-blur-sm">
        <DumDummiesLogo />
        <div className="flex items-center gap-4">
          <button className="bg-neon-red text-white px-3 py-1 text-sm font-bold rounded animate-pulse">
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
            <div className="flex items-center gap-2">
              <div className="hidden md:block text-sm">
                {user.user_metadata.username || user.email?.split('@')[0] || 'User'}
              </div>
              <button
                onClick={() => signOut()}
                className="bg-stream-panel border border-stream-border px-3 py-1 text-sm hover:bg-stream-border rounded"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex flex-col md:flex-row flex-1">
        <div className="flex-1 p-4 flex flex-col gap-4">
          <div className="relative aspect-video">
            <VideoFeed 
              targetReached={targetReached} 
              targetText={targetReached ? "TARGET REACHED!" : challengeName} 
            />
          </div>
          
          <ChallengesDashboard 
            activeChallenges={activeChallenges}
            requestedChallenges={requestedChallenges}
            onDonate={handleDonate}
            onApproveChallenge={handleApproveChallenge}
            onRejectChallenge={handleRejectChallenge}
            isCreator={isCreator}
          />
          
          <div className="flex items-center justify-between bg-stream-panel p-4 border border-stream-border rounded-lg">
            <ViewerCount count={viewers} />
            
            <div className="flex items-center gap-2">
              <span className="text-neon-orange">CURRENT CHALLENGE:</span>
              <span className="text-neon-green font-bold">{challengeName}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <DonateButton amount={5} onDonate={handleDonateAdapter} />
              <DonateButton amount={10} onDonate={handleDonateAdapter} />
              <DonateButton amount={20} onDonate={handleDonateAdapter} />
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-stream-border flex flex-col bg-stream-panel/50 backdrop-blur-sm">
          <div className="p-4 border-b border-stream-border">
            <TargetDisplay
              challengeName={challengeName}
              targetAmount={targetAmount}
              currentAmount={currentAmount}
              isTargetReached={targetReached}
            />
          </div>
          
          <div className="flex-1">
            <ChatPanel 
              messages={messages} 
              onSendMessage={handleSendMessage}
              onCreateChallenge={handleCreateChallenge}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
