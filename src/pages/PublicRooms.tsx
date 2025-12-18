import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SpaceBackground } from '@/components/SpaceBackground';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CreateRoomModal } from '@/components/CreateRoomModal';

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

const mockRooms = [
  { id: '1', name: 'Calculus Grind', subject: 'math', participants: 8, maxParticipants: 12, host: 'MathWiz' },
  { id: '2', name: 'React Masters', subject: 'coding', participants: 15, maxParticipants: 20, host: 'DevGuru' },
  { id: '3', name: 'Physics Lab', subject: 'science', participants: 5, maxParticipants: 10, host: 'QuantumLeap' },
  { id: '4', name: 'Spanish Practice', subject: 'languages', participants: 7, maxParticipants: 8, host: 'Polyglot' },
  { id: '5', name: 'Startup Ideas', subject: 'business', participants: 12, maxParticipants: 15, host: 'Founder' },
  { id: '6', name: 'Digital Art Session', subject: 'arts', participants: 4, maxParticipants: 8, host: 'Artisan' },
  { id: '7', name: 'Python Beginners', subject: 'coding', participants: 18, maxParticipants: 25, host: 'CodeCoach' },
  { id: '8', name: 'Essay Writing', subject: 'other', participants: 6, maxParticipants: 10, host: 'WordSmith' },
];

const PublicRooms = () => {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredRooms = mockRooms.filter(room => {
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
              <h1 className="font-display text-xl font-bold text-foreground">Public Rooms 🌍</h1>
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
          {/* Search & Filters */}
          <div 
            className="mb-8 space-y-4 opacity-0 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
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

          {/* Rooms Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room, index) => (
              <RoomCard key={room.id} room={room} delay={0.1 + index * 0.05} />
            ))}
          </div>

          {filteredRooms.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No rooms found. Try a different filter or create your own!</p>
            </div>
          )}
        </div>
      </main>

      <CreateRoomModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        isPrivate={false}
      />
    </div>
  );
};

const RoomCard = ({ room, delay }: { room: typeof mockRooms[0]; delay: number }) => {
  const navigate = useNavigate();
  const subjectEmoji = subjects.find(s => s.id === room.subject)?.emoji || '📚';
  const isFull = room.participants >= room.maxParticipants;
  const fillPercentage = (room.participants / room.maxParticipants) * 100;

  return (
    <div 
      className="glass-card p-5 hover:border-primary/30 transition-all duration-300 opacity-0 animate-fade-in-up group"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-lg">
            {subjectEmoji}
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground line-clamp-1">{room.name}</h3>
            <p className="text-xs text-muted-foreground">by {room.host}</p>
          </div>
        </div>
      </div>

      {/* Participants Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{room.participants}/{room.maxParticipants}</span>
          </div>
          {isFull && (
            <span className="text-xs px-2 py-1 rounded-full bg-destructive/20 text-destructive">Full</span>
          )}
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${fillPercentage}%` }}
          />
        </div>
      </div>

      {/* Join Button */}
      <Button 
        variant={isFull ? 'glass' : 'cosmic'} 
        size="sm" 
        className="w-full"
        disabled={isFull}
        onClick={() => navigate(`/room/${room.id}`)}
      >
        {isFull ? 'Room Full' : 'Join Session'}
      </Button>
    </div>
  );
};

export default PublicRooms;
