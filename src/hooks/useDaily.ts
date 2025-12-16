import { useState, useEffect, useCallback } from 'react';

// Demo room URL for testing - in production, this would be created via API
const DEMO_ROOM_URL = 'https://yourteam.daily.co/study-room';

interface UseDailyOptions {
  roomName?: string;
  autoCreate?: boolean;
}

export const useDaily = (options: UseDailyOptions = {}) => {
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For demo purposes, we generate a room URL based on room name
  // In production, you would create rooms via Daily.co API with your API key
  const createRoom = useCallback(async (roomName: string) => {
    setIsCreating(true);
    setError(null);

    try {
      // Simulate room creation - in production, this would be an API call
      // to your backend which would then call Daily.co's REST API
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // For demo, we use a test room URL
      // Replace with your actual Daily.co domain
      const url = `https://yourdomain.daily.co/${roomName.toLowerCase().replace(/\s+/g, '-')}`;
      setRoomUrl(url);
      return url;
    } catch (err) {
      setError('Failed to create room');
      return null;
    } finally {
      setIsCreating(false);
    }
  }, []);

  // Auto-create room if roomName is provided
  useEffect(() => {
    if (options.roomName && options.autoCreate && !roomUrl) {
      createRoom(options.roomName);
    }
  }, [options.roomName, options.autoCreate, roomUrl, createRoom]);

  return {
    roomUrl,
    isCreating,
    error,
    createRoom,
    setRoomUrl,
  };
};
