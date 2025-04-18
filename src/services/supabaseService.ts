import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Channel = Database['public']['Tables']['channels']['Row'];
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];
export type Donation = Database['public']['Tables']['donations']['Row'];
export type Challenge = Database['public']['Tables']['challenges']['Row'];

// Profile services
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as Profile;
};

export const updateProfile = async (userId: string, updates: { username?: string; bio?: string; avatar_url?: string }) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
};

// Channel services
export const getChannels = async () => {
  const { data, error } = await supabase
    .from('channels')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Channel[];
};

export const getChannel = async (channelId: string) => {
  const { data, error } = await supabase
    .from('channels')
    .select('*')
    .eq('id', channelId)
    .single();

  if (error) throw error;
  return data as Channel;
};

export const createChannel = async (channel: { title: string; description?: string; owner_id: string }) => {
  const { data, error } = await supabase
    .from('channels')
    .insert([channel])
    .select()
    .single();

  if (error) throw error;
  return data as Channel;
};

export const updateViewerCount = async (channelId: string, change: number) => {
  console.log(`Updating viewer count for channel ${channelId} by ${change}`);
  // This would call a server function in a real implementation
  // For the demo, we'll keep the mock
  return { success: true };
};

// Chat services
export const getChatMessages = async (channelId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select(`
      *,
      profiles:user_id (username, avatar_url)
    `)
    .eq('channel_id', channelId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const sendChatMessage = async (message: { channel_id: string; user_id: string; message: string; emoji?: string }) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([message])
    .select()
    .single();

  if (error) throw error;
  return data as ChatMessage;
};

// Subscribe to new chat messages
export const subscribeToChatMessages = (channelId: string, callback: (message: any) => void) => {
  // In a real implementation, this would use Supabase's real-time subscriptions
  // For now, we'll use a simulated approach with random messages and a timer
  
  // Using localStorage to store user-specific data
  const savedUsernames = [
    'ToxicGamer', 'EdgyLord', 'XtremeFan', 'NightRider', 'ChaosCreator',
    'DangerZone', 'RiskyBiz', 'DeathWish', 'AdrenalineJunkie', 'WildOne',
    'DarkSoul', 'RageMachine', 'InsanityLevel', 'MadMax', 'PsychoKiller'
  ];
  
  const randomMessages = [
    "omg can't wait to see this",
    "do it you coward",
    "this is gonna be epic",
    "10 bucks says they chicken out",
    "I've seen worse, this is nothing",
    "my sister did this once. she's in therapy now",
    "live stream legends right here",
    "this channel is sick, literally",
    "somebody call an ambulance... but not for me",
    "they're actually gonna do it...",
    "this is why the internet was invented",
    "my mom walked in and now I'm grounded",
    "saving this to show my therapist",
    "how is this even legal",
    "i'm both disgusted and intrigued",
    "can't look away",
    "did anyone record that last part?",
    "we need more extreme challenges",
    "humanity was a mistake",
    "this is peak entertainment"
  ];

  // Create interval for simulated messages
  const intervalId = setInterval(() => {
    // Random chance (30%) to send a new message every 5 seconds
    if (Math.random() > 0.7) {
      const username = savedUsernames[Math.floor(Math.random() * savedUsernames.length)];
      const message = randomMessages[Math.floor(Math.random() * randomMessages.length)];
      
      callback({
        id: `message-${Date.now()}`,
        channel_id: channelId,
        user_id: `user-${Math.floor(Math.random() * 100)}`,
        username: username,
        message: message,
        emoji: '😀',
        is_system_message: false,
        created_at: new Date().toISOString()
      });
    }
  }, 5000);

  // Return unsubscribe function
  return () => {
    clearInterval(intervalId);
  };
};

// Donation services
export const createDonation = async (donation: { channel_id: string; user_id: string; amount: number; message?: string }) => {
  const { data, error } = await supabase
    .from('donations')
    .insert([donation])
    .select()
    .single();

  if (error) throw error;
  return data as Donation;
};

export const getChannelDonations = async (channelId: string) => {
  const { data, error } = await supabase
    .from('donations')
    .select(`
      *,
      profiles:user_id (username)
    `)
    .eq('channel_id', channelId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Subscribe to new donations
export const subscribeToDonations = (channelId: string, callback: (donation: any) => void) => {
  // In a real implementation, this would use Supabase's real-time subscriptions
  // For now, we'll use a simulated approach with random donations
  
  const donorUsernames = [
    'BigSpender', 'MoneyBags', 'RichKid', 'GoldDigger', 'Philanthropist',
    'SugarDaddy', 'LotteryWinner', 'TrustFundBaby', 'CryptoMillionaire', 'GenerousTipper'
  ];
  
  // Create interval for simulated donations
  const intervalId = setInterval(() => {
    // Random chance (20%) to send a new donation every 15 seconds
    if (Math.random() > 0.8) {
      const username = donorUsernames[Math.floor(Math.random() * donorUsernames.length)];
      const amount = [5, 10, 15, 20, 25, 50, 100][Math.floor(Math.random() * 7)];
      
      callback({
        id: `donation-${Date.now()}`,
        channel_id: channelId,
        user_id: `user-${Math.floor(Math.random() * 10)}`,
        username: username,
        amount: amount,
        message: `Keep it up!`,
        created_at: new Date().toISOString()
      });
    }
  }, 15000);

  // Return unsubscribe function
  return () => {
    clearInterval(intervalId);
  };
};

// Challenge services
export const getActiveChallenge = async (channelId: string) => {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('channel_id', channelId)
    .eq('is_completed', false)
    .order('created_at', { ascending: false })
    .maybeSingle();

  if (error) throw error;
  
  // Return default challenge if none found
  if (!data) {
    return {
      id: `challenge-default`,
      channel_id: channelId,
      name: 'DRINK PISS',
      target_amount: 20,
      current_amount: 0,
      is_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as Challenge;
  }
  
  return data as Challenge;
};

export const createChallenge = async (challenge: { channel_id: string; name: string; target_amount: number }) => {
  const { data, error } = await supabase
    .from('challenges')
    .insert([{
      ...challenge,
      current_amount: 0,
      is_completed: false
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Challenge;
};

// Subscribe to challenge updates
export const subscribeToChallenge = (channelId: string, callback: (challenge: any) => void) => {
  // In a real implementation, this would use Supabase's real-time subscriptions
  // We'll keep the mock implementation for the demo
  
  // Create interval for simulated challenge updates
  const intervalId = setInterval(() => {
    // Only update challenge state every 30 seconds with 30% chance
    if (Math.random() > 0.7) {
      getActiveChallenge(channelId)
        .then(challenge => {
          callback(challenge);
        })
        .catch(console.error);
    }
  }, 30000);

  // Return unsubscribe function
  return () => {
    clearInterval(intervalId);
  };
};
