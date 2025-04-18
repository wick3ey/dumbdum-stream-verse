
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
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([message]);

    if (error) throw error;
    return data?.[0] as ChatMessage;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};

// Real-time chat subscription
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
      (payload) => {
        // Format the message and call the callback
        if (payload.new) {
          const username = payload.new.username || 'Anonymous';
          callback({
            id: payload.new.id,
            channel_id: payload.new.channel_id,
            user_id: payload.new.user_id,
            username: username,
            message: payload.new.message,
            emoji: payload.new.emoji || '😀',
            is_system_message: payload.new.is_system_message || false,
            created_at: payload.new.created_at
          });
        }
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};

// Donation services
export const createDonation = async (donation: { channel_id: string; user_id: string; amount: number; message?: string }) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .insert([donation]);

    if (error) throw error;
    
    return data?.[0] as Donation;
  } catch (error) {
    console.error("Error creating donation:", error);
    throw error;
  }
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

// Real-time donation subscription
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
      (payload) => {
        // Format the donation and call the callback
        if (payload.new) {
          callback({
            id: payload.new.id,
            channel_id: payload.new.channel_id,
            user_id: payload.new.user_id,
            amount: payload.new.amount,
            message: payload.new.message || '',
            created_at: payload.new.created_at
          });
        }
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};

// Challenge services
export const getActiveChallenge = async (channelId: string) => {
  try {
    // Fix: För att undvika "eq(...).eq is not a function", använd filter istället
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
  } catch (error) {
    console.error("Error fetching active challenge:", error);
    throw error;
  }
};

export const createChallenge = async (challenge: { channel_id: string; name: string; target_amount: number }) => {
  try {
    // Fix: För att undvika "eq(...).eq is not a function", använd en annan metod
    const existingChallenges = await supabase
      .from('challenges')
      .select('*')
      .eq('channel_id', challenge.channel_id)
      .eq('name', challenge.name)
      .eq('is_completed', false);

    if (existingChallenges.error) throw existingChallenges.error;
    if (existingChallenges.data && existingChallenges.data.length > 0) {
      throw new Error(`Challenge "${challenge.name}" already exists! Please donate to the existing challenge instead.`);
    }

    const { data, error } = await supabase
      .from('challenges')
      .insert([{
        ...challenge,
        current_amount: 0,
        is_completed: false
      }]);

    if (error) throw error;
    return data?.[0] as Challenge;
  } catch (error) {
    console.error("Error creating challenge:", error);
    throw error;
  }
};

// Real-time challenge updates subscription
export const subscribeToChallenge = (channelId: string, callback: (challenge: any) => void) => {
  const channel = supabase
    .channel('public:challenges')
    .on('postgres_changes', 
      { 
        event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
        schema: 'public', 
        table: 'challenges',
        filter: `channel_id=eq.${channelId}`
      }, 
      (payload) => {
        if (payload.new) {
          callback(payload.new);
        }
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};
