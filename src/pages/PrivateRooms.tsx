import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SpaceBackground } from '@/components/SpaceBackground';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Copy, Share2, Lock, Users, Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CreateRoomModal } from '@/components/CreateRoomModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const subjects = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'math', label: 'Math', emoji: '🧮' },
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'languages', label: 'Languages', emoji: '🌐' },
  { id: 'coding', label: 'Coding', emoji: '💻' },
  { id: 'arts', label: 'Arts', emoji: '🎨' },
  { id: 'business', label: 'Business', emoji: '📊' },
  { id: 'other', label: 'Other', emoji: '📚' },
];

interface Room {
  id: string;
  name: string;
  subject: string;
  code: string | null;
  participant_count: number;
  max_participants: number;
  host_id: string | null;
}

const PrivateRooms = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch private rooms from database
  useEffect(() => {
    fetchRooms();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('private-rooms-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: 'type=eq.private'
        },
        () => {
          fetchRooms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('type', 'private')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinWithCode = async () => {
    if (!joinCode || joinCode.length < 6) {
      toast.error('Please enter a valid 6-character code');
      return;
    }

    setIsJoining(true);
    
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', joinCode.toUpperCase())
        .single();

      if (error || !data) {
        toast.error('Room not found. Please check the code and try again.');
        return;
      }

      if (data.participant_count >= data.max_participants) {
        toast.error('This room is full');
        return;
      }

      navigate(`/room/${data.id}?room=${encodeURIComponent(data.name)}`);
    } catch (error) {
      console.error('Error joining room:', error);
      toast.error('Failed to join room. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSubject = selectedSubject === 'all' || room.subject === selectedSubject;
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="glass" size="icon" className="rounded-xl">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Private Rooms 🔐</h1>
              <p className="text-sm text-muted-foreground">{filteredRooms.length} rooms available</p>
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
        <div className="max-w-6xl mx-auto">
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
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleJoinWithCode()}
                className="flex-1 h-12 rounded-xl bg-muted/60 backdrop-blur-xl border border-white/10 px-4 text-center text-xl font-mono tracking-widest text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 uppercase"
              />
              <Button 
                variant="cosmic" 
                size="lg" 
                onClick={handleJoinWithCode}
                disabled={isJoining || joinCode.length < 6}
              >
                {isJoining ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Join'}
              </Button>
            </div>
          </div>

          {/* Search & Filters */}
          <div 
            className="mb-8 space-y-4 opacity-0 animate-fade-in"
            style={{ animationDelay: '0.15s' }}
          >
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search rooms..." 
                className="pl-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Subject Filters */}
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectedSubject === subject.id
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'glass hover:border-primary/30'
                  }`}
                >
                  <span className="mr-2">{subject.emoji}</span>
                  {subject.label}
                </button>
              ))}
            </div>
          </div>

          {/* Your Rooms */}
          <h2 
            className="font-display text-lg font-semibold text-foreground mb-4 opacity-0 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            Available Private Rooms
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredRooms.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRooms.map((room, index) => (
                <PrivateRoomCard key={room.id} room={room} delay={0.2 + index * 0.05} />
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

const PrivateRoomCard = ({ room, delay }: { room: Room; delay: number }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const subjectEmoji = subjects.find(s => s.id === room.subject)?.emoji || '📚';
  const isFull = room.participant_count >= room.max_participants;
  const fillPercentage = (room.participant_count / room.max_participants) * 100;

  const copyCode = () => {
    if (room.code) {
      navigator.clipboard.writeText(room.code);
      setCopied(true);
      toast.success('Code copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareRoom = () => {
    if (room.code) {
      const url = `${window.location.origin}/join/${room.code}`;
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleJoin = () => {
    navigate(`/room/${room.id}?room=${encodeURIComponent(room.name)}`);
  };

  return (
    <div 
      className="glass-card p-5 hover:border-secondary/30 transition-all duration-300 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center text-lg">
            {subjectEmoji}
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground line-clamp-1">{room.name}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              <span className="font-mono">{room.code}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Participants Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{room.participant_count}/{room.max_participants}</span>
          </div>
          {isFull && (
            <span className="text-xs px-2 py-1 rounded-full bg-destructive/20 text-destructive">Full</span>
          )}
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-secondary to-primary transition-all duration-500"
            style={{ width: `${fillPercentage}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="glass" size="sm" onClick={copyCode} className="flex-shrink-0">
          <Copy className="w-4 h-4" />
          {copied ? 'Copied!' : 'Code'}
        </Button>
        <Button variant="glass" size="sm" onClick={shareRoom} className="flex-shrink-0">
          <Share2 className="w-4 h-4" />
        </Button>
        <Button 
          variant="cosmic" 
          size="sm" 
          className="flex-1"
          disabled={isFull}
          onClick={handleJoin}
        >
          {isFull ? 'Full' : 'Enter Room'}
        </Button>
      </div>
    </div>
  );
};

export default PrivateRooms;
