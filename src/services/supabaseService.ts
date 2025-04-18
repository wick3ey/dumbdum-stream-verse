
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Channel = Database['public']['Tables']['channels']['Row'];
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];
export type Donation = Database['public']['Tables']['donations']['Row'];
export type Challenge = Database['public']['Tables']['challenges']['Row'];

// Mock implementation for the services
// These functions will return mock data instead of actual data from Supabase

// Profile services
export const getProfile = async (userId: string) => {
  // Return a mock profile
  return {
    id: userId,
    username: 'DemoUser',
    avatar_url: null,
    bio: 'This is a mock profile',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } as Profile;
};

export const updateProfile = async (userId: string, updates: { username?: string; bio?: string; avatar_url?: string }) => {
  // Return the updated profile
  return {
    id: userId,
    username: updates.username || 'DemoUser',
    avatar_url: updates.avatar_url || null,
    bio: updates.bio || 'This is a mock profile',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } as Profile;
};

// Channel services
export const getChannels = async () => {
  // Return a mock channel list
  return [{
    id: '00000000-0000-0000-0000-000000000000',
    title: 'Demo Channel',
    description: 'This is a mock channel',
    owner_id: '00000000-0000-0000-0000-000000000001',
    is_live: true,
    viewer_count: 30,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }] as Channel[];
};

export const getChannel = async (channelId: string) => {
  // Return a mock channel
  return {
    id: channelId,
    title: 'Demo Channel',
    description: 'This is a mock channel',
    owner_id: '00000000-0000-0000-0000-000000000001',
    is_live: true,
    viewer_count: 30,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } as Channel;
};

export const createChannel = async (channel: { title: string; description?: string; owner_id: string }) => {
  // Return the created channel
  return {
    id: '00000000-0000-0000-0000-000000000000',
    title: channel.title,
    description: channel.description || null,
    owner_id: channel.owner_id,
    is_live: false,
    viewer_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } as Channel;
};

export const updateViewerCount = async (channelId: string, change: number) => {
  // Mock implementation
  console.log(`Updating viewer count for channel ${channelId} by ${change}`);
};

// Chat services
export const getChatMessages = async (channelId: string, limit = 50) => {
  // Return mock messages
  return Array.from({ length: 5 }, (_, i) => ({
    id: `message-${i}`,
    channel_id: channelId,
    user_id: `user-${i}`,
    message: `This is mock message ${i}`,
    emoji: '😀',
    is_system_message: false,
    created_at: new Date().toISOString(),
    profiles: {
      username: `User${i}`,
      avatar_url: null
    }
  }));
};

export const sendChatMessage = async (message: { channel_id: string; user_id: string; message: string; emoji?: string }) => {
  // Return the created message
  return {
    id: `message-${Date.now()}`,
    channel_id: message.channel_id,
    user_id: message.user_id,
    message: message.message,
    emoji: message.emoji || '😀',
    is_system_message: false,
    created_at: new Date().toISOString()
  } as ChatMessage;
};

// Subscribe to new chat messages
export const subscribeToChatMessages = (channelId: string, callback: (message: any) => void) => {
  // Mock subscription
  const intervalId = setInterval(() => {
    // Simulate receiving a new message every 10 seconds
    if (Math.random() > 0.7) {
      callback({
        id: `message-${Date.now()}`,
        channel_id: channelId,
        user_id: `user-${Math.floor(Math.random() * 10)}`,
        message: `Random mock message at ${new Date().toLocaleTimeString()}`,
        emoji: '😀',
        is_system_message: false,
        created_at: new Date().toISOString()
      });
    }
  }, 10000);

  return () => {
    clearInterval(intervalId);
  };
};

// Donation services
export const createDonation = async (donation: { channel_id: string; user_id: string; amount: number; message?: string }) => {
  // Return the created donation
  return {
    id: `donation-${Date.now()}`,
    channel_id: donation.channel_id,
    user_id: donation.user_id,
    amount: donation.amount,
    message: donation.message || null,
    created_at: new Date().toISOString()
  } as Donation;
};

export const getChannelDonations = async (channelId: string) => {
  // Return mock donations
  return Array.from({ length: 3 }, (_, i) => ({
    id: `donation-${i}`,
    channel_id: channelId,
    user_id: `user-${i}`,
    amount: 5 + i * 5,
    message: `Thank you for the stream! Mock donation ${i}`,
    created_at: new Date().toISOString(),
    profiles: {
      username: `Donor${i}`
    }
  }));
};

// Subscribe to new donations
export const subscribeToDonations = (channelId: string, callback: (donation: any) => void) => {
  // Mock subscription
  const intervalId = setInterval(() => {
    // Simulate receiving a new donation every 30 seconds
    if (Math.random() > 0.8) {
      callback({
        id: `donation-${Date.now()}`,
        channel_id: channelId,
        user_id: `user-${Math.floor(Math.random() * 10)}`,
        amount: Math.floor(Math.random() * 50) + 5,
        message: `Random mock donation at ${new Date().toLocaleTimeString()}`,
        created_at: new Date().toISOString()
      });
    }
  }, 30000);

  return () => {
    clearInterval(intervalId);
  };
};

// Challenge services
export const getActiveChallenge = async (channelId: string) => {
  // Return a mock challenge
  return {
    id: `challenge-${Date.now()}`,
    channel_id: channelId,
    name: 'DRINK PISS',
    target_amount: 20,
    current_amount: 10,
    is_completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } as Challenge;
};

export const createChallenge = async (challenge: { channel_id: string; name: string; target_amount: number }) => {
  // Return the created challenge
  return {
    id: `challenge-${Date.now()}`,
    channel_id: challenge.channel_id,
    name: challenge.name,
    target_amount: challenge.target_amount,
    current_amount: 0,
    is_completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } as Challenge;
};

// Subscribe to challenge updates
export const subscribeToChallenge = (channelId: string, callback: (challenge: any) => void) => {
  // Mock subscription
  const intervalId = setInterval(() => {
    // Simulate receiving a challenge update every 15 seconds
    if (Math.random() > 0.7) {
      const currentAmount = Math.floor(Math.random() * 20);
      callback({
        id: `challenge-${Date.now()}`,
        channel_id: channelId,
        name: 'DRINK PISS',
        target_amount: 20,
        current_amount: currentAmount,
        is_completed: currentAmount >= 20,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  }, 15000);

  return () => {
    clearInterval(intervalId);
  };
};
