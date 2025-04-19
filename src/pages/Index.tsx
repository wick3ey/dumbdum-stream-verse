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
import { useViewMode } from '@/App';
import ViewModeToggle from '@/components/ViewModeToggle';
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
  rejectChallenge,
  createStreamSession,
  getStreamSessionForChannel,
  startStream,
  endStream,
  subscribeToStreamSessions,
  getStreamKey
} from '@/services/supabaseService';
import { enforceCreatorSecurity, logSecurityViolation, verifyCreatorAccess } from '@/services/securityService';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import StreamControls from '@/components/StreamControls';

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

export type StreamInfo = {
  id: string;
  title: string;
  description?: string;
  streamKey?: string;
  streamUrl?: string;
  isActive: boolean;
  startedAt?: string;
  endedAt?: string;
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
  const { viewMode, isCurrentUserCreator } = useViewMode();
  const { toast: uiToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [targetAmount, setTargetAmount] = useState(20);
  const [challengeName, setChallengeName] = useState('DRINK PISS');
  const [viewers, setViewers] = useState(30);
  const [targetReached, setTargetReached] = useState(false);
  
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [requestedChallenges, setRequestedChallenges] = useState<Challenge[]>([]);
  const [isStreamLive, setIsStreamLive] = useState(false);
  const [streamSession, setStreamSession] = useState<StreamInfo | null>(null);
  const [showStreamSettings, setShowStreamSettings] = useState(false);
  
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

  // Verify if the current user is authorized as a creator
  useEffect(() => {
    const userIsCreator = isCurrentUserCreator();
    
    if (viewMode === "creator" && !userIsCreator && user) {
      toast.error("You are not authorized to access creator mode", {
        description: "Switching to viewer mode",
        duration: 5000,
      });
      
      // Log unauthorized access attempt
      logSecurityViolation("Unauthorized creator mode access attempt", user.id);
    }
  }, [user, viewMode, isCurrentUserCreator]);

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
        if (challenges && challenges.length > 0) {
          const formattedChallenges: Challenge[] = challenges.map(c => {
            let userId = '';
            
            if ('user_id' in c && typeof c.user_id === 'string') {
              userId = c.user_id;
            }
            else if ('userId' in c && typeof (c as any).userId === 'string') {
              userId = (c as any).userId;
            }
            
            return {
              id: c.id,
              name: c.name,
              targetAmount: 0,
              currentAmount: 0,
              status: 'requested' as const,
              userId: userId
            };
          });
          setRequestedChallenges(formattedChallenges);
        }
      } catch (error) {
        console.error('Error fetching requested challenges:', error);
      }
    };
    
    const fetchStreamSession = async () => {
      if (isCurrentUserCreator()) {
        try {
          const session = await getStreamSessionForChannel(DEMO_CHANNEL_ID);
          
          if (session) {
            setStreamSession({
              id: session.id,
              title: session.title,
              description: session.description || undefined,
              isActive: session.is_active || false,
              streamUrl: session.stream_url || undefined,
              startedAt: session.started_at || undefined,
              endedAt: session.ended_at || undefined
            });
            
            setIsStreamLive(session.is_active || false);
          } else if (user) {
            // Create default stream session for channel if none exists
            const newSession = await createStreamSession(
              DEMO_CHANNEL_ID, 
              "My Extreme Challenge Stream", 
              "Watch and donate as I complete extreme challenges!"
            );
            
            setStreamSession({
              id: newSession.id,
              title: newSession.title,
              description: newSession.description || undefined,
              isActive: newSession.is_active || false,
              streamUrl: newSession.stream_url || undefined
            });
          }
        } catch (error) {
          console.error('Error fetching stream session:', error);
        }
      }
    };

    fetchActiveChallenge();
    fetchRequestedChallenges();
    fetchStreamSession();
  }, [isCurrentUserCreator, user]);

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
          
          uiToast({
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
          
          // Add system message about the new active challenge
          const systemMessage: Message = {
            id: Date.now(),
            username: 'SYSTEM',
            message: `NEW ACTIVE CHALLENGE: ${updatedChallenge.name} - Target: $${updatedChallenge.target_amount}`,
            emoji: '🎯',
            type: 'chat',
            avatarColor: 'bg-neon-red',
            usernameColor: 'text-neon-red',
            messageColor: 'text-neon-yellow'
          };
          
          setMessages(prev => [...prev.slice(-49), systemMessage]);
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
          uiToast({
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
    
    const unsubscribeStreams = subscribeToStreamSessions(DEMO_CHANNEL_ID, (updatedStream) => {
      if (updatedStream) {
        setStreamSession({
          id: updatedStream.id,
          title: updatedStream.title,
          description: updatedStream.description || undefined,
          isActive: updatedStream.is_active || false,
          streamUrl: updatedStream.stream_url || undefined,
          startedAt: updatedStream.started_at || undefined,
          endedAt: updatedStream.ended_at || undefined
        });
        
        setIsStreamLive(updatedStream.is_active || false);
        
        if (updatedStream.is_active && !isStreamLive) {
          const systemMessage: Message = {
            id: Date.now(),
            username: 'SYSTEM',
            message: 'STREAM STARTED',
            emoji: '🎬',
            type: 'chat',
            avatarColor: 'bg-neon-red',
            usernameColor: 'text-neon-red',
            messageColor: 'text-neon-yellow'
          };
          
          setMessages(prev => [...prev.slice(-49), systemMessage]);
        } else if (!updatedStream.is_active && isStreamLive) {
          const systemMessage: Message = {
            id: Date.now(),
            username: 'SYSTEM',
            message: 'STREAM ENDED',
            emoji: '🛑',
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
      unsubscribeStreams();
      clearInterval(viewerInterval);
      
      updateViewerCount(DEMO_CHANNEL_ID, -1).catch(console.error);
    };
  }, [challengeName, targetReached, uiToast, targetAmount, activeChallenges, isStreamLive]);

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
      uiToast({
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
        uiToast({
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

      uiToast({
        title: "Thank you!",
        description: `You donated $${amount} to ${challengeName}!`,
      });
    } catch (error) {
      console.error('Error creating donation:', error);
      uiToast({
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
      
      uiToast({
        title: "Challenge requested!",
        description: `Your challenge request has been submitted: ${challengeName.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Error creating challenge:', error);
      uiToast({
        title: "Error",
        description: "Failed to create challenge",
        variant: "destructive",
      });
    }
  };

  const handleApproveChallenge = async (challengeId: string, targetAmount: number) => {
    if (!user) return;
    
    // Security check - verify user is the creator
    if (!enforceCreatorSecurity(user.id, "Approve Challenge")) {
      return;
    }

    try {
      const approvedChallenge = await approveChallenge(challengeId, targetAmount);
      
      // Update requested challenges list
      setRequestedChallenges(prev => prev.filter(c => c.id !== challengeId));
      
      // Get the challenge details from requested challenges
      const challengeDetails = requestedChallenges.find(c => c.id === challengeId);
      
      if (challengeDetails) {
        // Add to active challenges
        const newChallenge: Challenge = {
          id: challengeId,
          name: challengeDetails.name,
          targetAmount: targetAmount,
          currentAmount: 0,
          status: 'active'
        };
        
        setActiveChallenges(prev => [newChallenge, ...prev]);
        
        // Update current challenge display
        setChallengeName(challengeDetails.name);
        setTargetAmount(targetAmount);
        setCurrentAmount(0);
        setTargetReached(false);
        
        // Send system message to chat
        const systemMessage: Message = {
          id: Date.now(),
          username: 'SYSTEM',
          message: `NEW CHALLENGE ACTIVATED: ${challengeDetails.name} - Target: $${targetAmount}`,
          emoji: '🎯',
          type: 'chat',
          avatarColor: 'bg-neon-red',
          usernameColor: 'text-neon-red',
          messageColor: 'text-neon-yellow'
        };
        
        setMessages(prev => [...prev.slice(-49), systemMessage]);
        
        uiToast({
          title: "Challenge Activated",
          description: `${challengeDetails.name} is now active with a target of $${targetAmount}`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error approving challenge:', error);
      uiToast({
        title: "Error",
        description: "Failed to approve challenge",
        variant: "destructive",
      });
    }
  };
  
  const handleRejectChallenge = async (challengeId: string) => {
    if (!user) return;
    
    // Security check - verify user is the creator
    if (!enforceCreatorSecurity(user.id, "Reject Challenge")) {
      return;
    }

    try {
      await rejectChallenge(challengeId);
      
      setRequestedChallenges(prev => prev.filter(c => c.id !== challengeId));
      
      uiToast({
        title: "Challenge rejected",
        description: "Challenge request has been rejected",
      });
    } catch (error) {
      console.error('Error rejecting challenge:', error);
      uiToast({
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

  const toggleStreamLive = async () => {
    if (!user || !streamSession) return;
    
    // Security check - verify user is the creator
    if (!enforceCreatorSecurity(user.id, "Toggle Stream Status")) {
      return;
    }
    
    try {
      if (!isStreamLive) {
        // Start stream
        await startStream(streamSession.id);
        
        // In a real implementation, this is where you'd provide stream details to the user
        if (isCurrentUserCreator()) {
          try {
            const streamKey = await getStreamKey(streamSession.id, user.id);
            
            // Update stream key for user
            setStreamSession(prev => prev ? {
              ...prev,
              streamKey
            } : null);
            
            uiToast({
              title: "Stream Started",
              description: "Your stream is now live. Use your streaming software with the provided stream key.",
            });
          } catch (error) {
            console.error('Error getting stream key:', error);
          }
        }
      } else {
        // End stream
        await endStream(streamSession.id);
        
        uiToast({
          title: "Stream Ended",
          description: "Your live stream has ended",
        });
      }
    } catch (error) {
      console.error('Error toggling stream:', error);
      uiToast({
        title: "Error",
        description: "Failed to toggle stream status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-stream-dark text-white flex flex-col">
      <div className="scanlines pointer-events-none fixed inset-0 z-50"></div>
      
      <header className="border-b border-stream-border p-4 flex items-center justify-between bg-stream-panel/50 backdrop-blur-sm">
        <DumDummiesLogo />
        <div className="flex items-center gap-4">
          <button className={`${isStreamLive ? "bg-neon-red" : viewMode === "creator" ? "bg-yellow-500" : "bg-neon-cyan"} text-white px-3 py-1 text-sm font-bold rounded ${isStreamLive ? "animate-pulse" : ""}`}>
            {isStreamLive ? "LIVE" : viewMode === "creator" ? "CREATOR MODE" : "OFFLINE"}
          </button>
          
          <div className="hidden md:block">
            <input
              type="text"
              placeholder="Search"
              className="bg-stream-panel border border-stream-border text-white placeholder-gray-500 px-3 py-1 rounded focus:outline-none focus:border-neon-cyan"
            />
          </div>
          
          <ViewModeToggle />
          
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
              streamUrl={streamSession?.streamUrl} 
              isLive={isStreamLive}
            />
          </div>
          
          {viewMode === "creator" && isCurrentUserCreator() && (
            <StreamControls
              isLive={isStreamLive}
              onToggleStream={toggleStreamLive}
              streamKey={streamSession?.streamKey}
              streamInfo={streamSession}
            />
          )}
          
          <ChallengesDashboard 
            activeChallenges={activeChallenges}
            requestedChallenges={requestedChallenges}
            onDonate={handleDonate}
            onApproveChallenge={handleApproveChallenge}
            onRejectChallenge={handleRejectChallenge}
            onCreateChallenge={handleCreateChallenge}
            isCreator={viewMode === "creator" && isCurrentUserCreator()}
          />
          
          <div className="flex items-center justify-between bg-stream-panel p-4 border border-stream-border rounded-lg">
            <ViewerCount count={viewers} />
            
            <div className="flex items-center gap-2">
              <span className="text-neon-orange">CURRENT CHALLENGE:</span>
              <span className="text-neon-green font-bold">{challengeName}</span>
            </div>
            
            {viewMode !== "creator" && (
              <div className="flex items-center gap-2">
                <DonateButton amount={5} onDonate={handleDonateAdapter} />
                <DonateButton amount={10} onDonate={handleDonateAdapter} />
                <DonateButton amount={20} onDonate={handleDonateAdapter} />
              </div>
            )}
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
