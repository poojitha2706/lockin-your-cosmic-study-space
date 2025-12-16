import { useState, useEffect, useCallback, useRef } from 'react';
import DailyIframe, { DailyCall, DailyParticipant } from '@daily-co/daily-js';
import { VideoParticipant } from './VideoParticipant';
import { VideoControls } from './VideoControls';
import { Users, AlertCircle, Wifi } from 'lucide-react';
import { toast } from 'sonner';

interface VideoSidebarProps {
  roomUrl?: string;
  userName: string;
  onLeave: () => void;
}

export const VideoSidebar = ({ roomUrl, userName, onLeave }: VideoSidebarProps) => {
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [participants, setParticipants] = useState<DailyParticipant[]>([]);
  const [isMuted, setIsMuted] = useState(true); // Default: muted on join
  const [isCameraOff, setIsCameraOff] = useState(true); // Default: camera off on join
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [viewMode, setViewMode] = useState<'gallery' | 'focus'>('gallery');
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'error' | 'reconnecting'>('connecting');
  const [error, setError] = useState<string | null>(null);
  const callObjectRef = useRef<DailyCall | null>(null);

  // Initialize Daily.co
  useEffect(() => {
    if (!roomUrl) return;

    const daily = DailyIframe.createCallObject({
      audioSource: true,
      videoSource: true,
    });

    callObjectRef.current = daily;
    setCallObject(daily);

    // Event handlers
    daily.on('joined-meeting', () => {
      setConnectionState('connected');
      // Apply default settings (muted, camera off)
      daily.setLocalAudio(false);
      daily.setLocalVideo(false);
    });

    daily.on('participant-joined', (event) => {
      if (event?.participant) {
        toast.success(`${event.participant.user_name || 'Someone'} joined the room`);
      }
      updateParticipants(daily);
    });

    daily.on('participant-left', (event) => {
      if (event?.participant) {
        toast.info(`${event.participant.user_name || 'Someone'} left the room`);
      }
      updateParticipants(daily);
    });

    daily.on('participant-updated', () => {
      updateParticipants(daily);
    });

    daily.on('track-started', () => {
      updateParticipants(daily);
    });

    daily.on('track-stopped', () => {
      updateParticipants(daily);
    });

    daily.on('error', (event) => {
      console.error('Daily error:', event);
      setError('Connection error occurred');
      setConnectionState('error');
    });

    daily.on('network-quality-change', (event) => {
      // Quality is a number: 0-100, lower means worse
      if (event && event.quality < 30) {
        setConnectionState('reconnecting');
      } else if (event && event.quality >= 30 && connectionState === 'reconnecting') {
        setConnectionState('connected');
      }
    });

    daily.on('camera-error', (event) => {
      if (event?.error) {
        toast.error('Camera access denied. You can still participate with audio.');
        setIsCameraOff(true);
      }
    });

    daily.on('nonfatal-error', () => {
      toast.error('A minor error occurred, but you can continue.');
    });

    // Join the room
    daily
      .join({ url: roomUrl, userName })
      .then(() => {
        updateParticipants(daily);
      })
      .catch((err) => {
        console.error('Failed to join:', err);
        setError('Failed to join the room. Please try again.');
        setConnectionState('error');
      });

    return () => {
      daily.leave();
      daily.destroy();
    };
  }, [roomUrl, userName]);

  const updateParticipants = useCallback((daily: DailyCall) => {
    const allParticipants = daily.participants();
    const participantList = Object.values(allParticipants);
    setParticipants(participantList);
  }, []);

  const handleToggleMic = useCallback(() => {
    if (callObject) {
      const newState = !isMuted;
      callObject.setLocalAudio(!newState);
      setIsMuted(newState);
    }
  }, [callObject, isMuted]);

  const handleToggleCamera = useCallback(() => {
    if (callObject) {
      const newState = !isCameraOff;
      callObject.setLocalVideo(!newState);
      setIsCameraOff(newState);
    }
  }, [callObject, isCameraOff]);

  const handleToggleScreenShare = useCallback(async () => {
    if (callObject) {
      if (isScreenSharing) {
        callObject.stopScreenShare();
        setIsScreenSharing(false);
      } else {
        try {
          await callObject.startScreenShare();
          setIsScreenSharing(true);
        } catch (err) {
          toast.error('Failed to start screen share');
        }
      }
    }
  }, [callObject, isScreenSharing]);

  const handleLeaveRoom = useCallback(() => {
    if (callObjectRef.current) {
      callObjectRef.current.leave();
    }
    onLeave();
  }, [onLeave]);

  const handleToggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === 'gallery' ? 'focus' : 'gallery'));
  }, []);

  // Get local participant
  const localParticipant = participants.find((p) => p.local);
  const remoteParticipants = participants.filter((p) => !p.local);

  // Determine grid columns based on participant count
  const getGridClass = () => {
    const count = participants.length;
    if (count <= 1) return 'grid-cols-1';
    if (count <= 4) return 'grid-cols-2';
    return 'grid-cols-3';
  };

  if (!roomUrl) {
    return (
      <div className="w-full lg:w-80 xl:w-96 glass-card p-4 flex flex-col items-center justify-center min-h-[300px]">
        <AlertCircle className="w-8 h-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground text-center">
          No video room available
        </p>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-3 h-full max-h-[calc(100vh-160px)]">
      {/* Header */}
      <div className="glass-card p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{participants.length} in call</span>
        </div>
        {connectionState === 'reconnecting' && (
          <div className="flex items-center gap-1 text-yellow-400">
            <Wifi className="w-4 h-4 animate-pulse" />
            <span className="text-xs">Reconnecting...</span>
          </div>
        )}
        {connectionState === 'connecting' && (
          <span className="text-xs text-muted-foreground">Connecting...</span>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="glass-card p-3 bg-red-500/10 border-red-500/20">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Video Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className={`grid ${getGridClass()} gap-2`}>
          {/* Local participant first */}
          {localParticipant && (
            <VideoParticipant
              participant={localParticipant}
              videoTrack={localParticipant.tracks?.video?.track}
              isLocal={true}
              focusStatus="focused"
            />
          )}

          {/* Remote participants */}
          {remoteParticipants.slice(0, 9).map((participant) => (
            <VideoParticipant
              key={participant.session_id}
              participant={participant}
              videoTrack={participant.tracks?.video?.track}
              isLocal={false}
              focusStatus="focused"
            />
          ))}
        </div>

        {/* Overflow indicator */}
        {remoteParticipants.length > 9 && (
          <div className="mt-2 text-center text-xs text-muted-foreground">
            +{remoteParticipants.length - 9} more participants
          </div>
        )}
      </div>

      {/* Controls */}
      <VideoControls
        isMuted={isMuted}
        isCameraOff={isCameraOff}
        isScreenSharing={isScreenSharing}
        viewMode={viewMode}
        onToggleMic={handleToggleMic}
        onToggleCamera={handleToggleCamera}
        onToggleScreenShare={handleToggleScreenShare}
        onLeaveRoom={handleLeaveRoom}
        onToggleViewMode={handleToggleViewMode}
      />
    </div>
  );
};
