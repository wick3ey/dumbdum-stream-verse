
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
    .select();
  
  if (error) throw error;
  return data[0] as Profile;
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
    .insert(channel)
    .select();
  
  if (error) throw error;
  return data[0] as Channel;
};

export const updateViewerCount = async (channelId: string, change: number) => {
  await supabase.rpc('update_viewer_count', { channel_uuid: channelId, count_change: change });
};

// Chat services
export const getChatMessages = async (channelId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*, profiles:user_id(username, avatar_url)')
    .eq('channel_id', channelId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
};

export const sendChatMessage = async (message: { channel_id: string; user_id: string; message: string; emoji?: string }) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert(message)
    .select();
  
  if (error) throw error;
  return data[0] as ChatMessage;
};

// Subscribe to new chat messages
export const subscribeToChatMessages = (channelId: string, callback: (message: any) => void) => {
  const channel = supabase
    .channel('public:chat_messages')
    .on('postgres_changes', 
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `channel_id=eq.${channelId}`
      }, 
      (payload) => callback(payload.new)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// Donation services
export const createDonation = async (donation: { channel_id: string; user_id: string; amount: number; message?: string }) => {
  const { data, error } = await supabase
    .from('donations')
    .insert(donation)
    .select();
  
  if (error) throw error;
  return data[0] as Donation;
};

export const getChannelDonations = async (channelId: string) => {
  const { data, error } = await supabase
    .from('donations')
    .select('*, profiles:user_id(username)')
    .eq('channel_id', channelId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Subscribe to new donations
export const subscribeToDonations = (channelId: string, callback: (donation: any) => void) => {
  const channel = supabase
    .channel('public:donations')
    .on('postgres_changes', 
      {
        event: 'INSERT',
        schema: 'public',
        table: 'donations',
        filter: `channel_id=eq.${channelId}`
      }, 
      (payload) => callback(payload.new)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
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
  return data as Challenge;
};

export const createChallenge = async (challenge: { channel_id: string; name: string; target_amount: number }) => {
  const { data, error } = await supabase
    .from('challenges')
    .insert(challenge)
    .select();
  
  if (error) throw error;
  return data[0] as Challenge;
};

// Subscribe to challenge updates
export const subscribeToChallenge = (channelId: string, callback: (challenge: any) => void) => {
  const channel = supabase
    .channel('public:challenges')
    .on('postgres_changes', 
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'challenges',
        filter: `channel_id=eq.${channelId}`
      }, 
      (payload) => callback(payload.new)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
