import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SpaceBackground } from '@/components/SpaceBackground';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Copy, Share2, Lock, Users } from 'lucide-react';
import { CreateRoomModal } from '@/components/CreateRoomModal';

const mockPrivateRooms = [
  { id: '1', name: 'Physics Study Group', code: 'PHY123', participants: 4, maxParticipants: 6, subject: 'science' },
  { id: '2', name: 'CS101 Team', code: 'CS1010', participants: 3, maxParticipants: 5, subject: 'coding' },
];

const PrivateRooms = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="glass" size="icon" className="rounded-xl">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Private Rooms 🔐</h1>
              <p className="text-sm text-muted-foreground">Your exclusive study spaces</p>
            </div>
          </div>
          
          <Button variant="cosmic" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Create Room
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-28 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Join with Code Section */}
          <div 
            className="glass-card p-6 mb-8 opacity-0 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">Join with Code</h2>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="flex-1 h-12 rounded-xl bg-muted/60 backdrop-blur-xl border border-white/10 px-4 text-center text-xl font-mono tracking-widest text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 uppercase"
              />
              <Button variant="cosmic" size="lg">
                Join
              </Button>
            </div>
          </div>

          {/* Your Rooms */}
          <h2 
            className="font-display text-lg font-semibold text-foreground mb-4 opacity-0 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            Your Rooms
          </h2>

          {mockPrivateRooms.length > 0 ? (
            <div className="space-y-4">
              {mockPrivateRooms.map((room, index) => (
                <PrivateRoomCard key={room.id} room={room} delay={0.2 + index * 0.1} />
              ))}
            </div>
          ) : (
            <div 
              className="glass-card p-12 text-center opacity-0 animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">No private rooms yet</h3>
              <p className="text-muted-foreground mb-6">Create your first private room and invite your study buddies!</p>
              <Button variant="cosmic" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4" />
                Create Your First Room
              </Button>
            </div>
          )}
        </div>
      </main>

      <CreateRoomModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        isPrivate={true}
      />
    </div>
  );
};

const PrivateRoomCard = ({ room, delay }: { room: typeof mockPrivateRooms[0]; delay: number }) => {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareRoom = () => {
    const url = `${window.location.origin}/join/${room.code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="glass-card p-6 hover:border-secondary/30 transition-all duration-300 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">{room.name}</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{room.participants}/{room.maxParticipants}</span>
              </div>
              <span>•</span>
              <span className="font-mono">{room.code}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="glass" size="sm" onClick={copyCode}>
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Code'}
          </Button>
          <Button variant="glass" size="sm" onClick={shareRoom}>
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button variant="cosmic" size="sm">
            Enter Room
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivateRooms;
