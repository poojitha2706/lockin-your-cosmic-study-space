import { Button } from '@/components/ui/button';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  LogOut,
  LayoutGrid,
  Focus,
} from 'lucide-react';

interface VideoControlsProps {
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  viewMode: 'gallery' | 'focus';
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onLeaveRoom: () => void;
  onToggleViewMode: () => void;
}

export const VideoControls = ({
  isMuted,
  isCameraOff,
  isScreenSharing,
  viewMode,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onLeaveRoom,
  onToggleViewMode,
}: VideoControlsProps) => {
  return (
    <div className="glass-card p-3 flex items-center justify-center gap-2 flex-wrap">
      {/* Microphone Toggle */}
      <Button
        variant="glass"
        size="icon"
        onClick={onToggleMic}
        className={`transition-all ${isMuted ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' : ''}`}
      >
        {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </Button>

      {/* Camera Toggle */}
      <Button
        variant="glass"
        size="icon"
        onClick={onToggleCamera}
        className={`transition-all ${isCameraOff ? 'text-muted-foreground' : ''}`}
      >
        {isCameraOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
      </Button>

      {/* Screen Share */}
      <Button
        variant="glass"
        size="icon"
        onClick={onToggleScreenShare}
        className={`transition-all ${isScreenSharing ? 'bg-primary/20 text-primary' : ''}`}
      >
        <MonitorUp className="w-4 h-4" />
      </Button>

      {/* View Mode Toggle */}
      <Button
        variant="glass"
        size="sm"
        onClick={onToggleViewMode}
        className="gap-2"
      >
        {viewMode === 'gallery' ? (
          <>
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Gallery</span>
          </>
        ) : (
          <>
            <Focus className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Focus</span>
          </>
        )}
      </Button>

      {/* Leave Room */}
      <Button
        variant="destructive"
        size="icon"
        onClick={onLeaveRoom}
        className="bg-red-500/80 hover:bg-red-500"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
};
