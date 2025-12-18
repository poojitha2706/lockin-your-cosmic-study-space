import { useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';

interface VideoParticipantProps {
  participant: {
    session_id: string;
    user_name?: string;
    video?: boolean;
    audio?: boolean;
    local?: boolean;
  };
  videoTrack?: MediaStreamTrack | null;
  audioTrack?: MediaStreamTrack | null;
  isLocal?: boolean;
  focusStatus?: 'focused' | 'break';
}

export const VideoParticipant = ({
  participant,
  videoTrack,
  isLocal = false,
  focusStatus = 'focused',
}: VideoParticipantProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Attach video track to video element using useEffect
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !videoTrack) {
      if (videoEl) {
        videoEl.srcObject = null;
      }
      return;
    }

    // Create MediaStream and attach to video element
    const stream = new MediaStream([videoTrack]);
    videoEl.srcObject = stream;
    
    // Ensure video plays
    videoEl.play().catch((err) => {
      console.log('Video autoplay failed:', err);
    });

    return () => {
      videoEl.srcObject = null;
    };
  }, [videoTrack]);

  const hasVideo = participant.video && videoTrack;
  const userName = participant.user_name || 'Guest';

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-muted/40 aspect-video transition-all duration-300 ${
        isLocal ? 'ring-2 ring-primary shadow-lg shadow-primary/20' : ''
      }`}
    >
      {/* Video element - always rendered but hidden when no video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`w-full h-full object-cover ${hasVideo ? '' : 'hidden'}`}
      />
      
      {/* Placeholder when no video */}
      {!hasVideo && (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/60 to-muted/40">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {/* Glassmorphism overlay for controls */}
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Focus status dot */}
            <div
              className={`w-2 h-2 rounded-full ${
                focusStatus === 'focused' ? 'bg-green-400' : 'bg-yellow-400'
              }`}
            />
            <span className="text-sm font-medium text-white truncate max-w-[100px]">
              {userName}
              {isLocal && ' (You)'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Mic indicator */}
            <div
              className={`p-1.5 rounded-full ${
                participant.audio ? 'bg-white/20' : 'bg-red-500/80'
              }`}
            >
              {participant.audio ? (
                <Mic className="w-3 h-3 text-white" />
              ) : (
                <MicOff className="w-3 h-3 text-white" />
              )}
            </div>

            {/* Camera indicator */}
            <div
              className={`p-1.5 rounded-full ${
                participant.video ? 'bg-white/20' : 'bg-white/10'
              }`}
            >
              {participant.video ? (
                <Video className="w-3 h-3 text-white" />
              ) : (
                <VideoOff className="w-3 h-3 text-white/60" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Active speaker glow */}
      {participant.audio && (
        <div className="absolute inset-0 pointer-events-none ring-2 ring-primary/50 rounded-2xl animate-pulse" />
      )}
    </div>
  );
};
