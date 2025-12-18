import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Share2, Rocket, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const subjects = [
  { id: 'math', label: 'Math', emoji: '🧮' },
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'languages', label: 'Languages', emoji: '🌐' },
  { id: 'coding', label: 'Coding', emoji: '💻' },
  { id: 'arts', label: 'Arts', emoji: '🎨' },
  { id: 'business', label: 'Business', emoji: '📊' },
  { id: 'other', label: 'Other', emoji: '📚' },
];

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPrivate: boolean;
}

export const CreateRoomModal = ({ isOpen, onClose, isPrivate }: CreateRoomModalProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'created'>('form');
  const [roomName, setRoomName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [generatedCode, setGeneratedCode] = useState('');
  const [createdRoomId, setCreatedRoomId] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreate = async () => {
    if (!roomName || !selectedSubject) return;
    
    setIsLoading(true);
    
    try {
      const code = isPrivate ? generateCode() : null;
      
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('rooms')
        .insert({
          name: roomName,
          subject: selectedSubject,
          type: isPrivate ? 'private' : 'public',
          code: code,
          max_participants: maxParticipants,
          host_id: user?.id || null,
        })
        .select()
        .single();

      if (error) throw error;

      if (isPrivate && code) {
        setGeneratedCode(code);
        setCreatedRoomId(data.id);
        setStep('created');
      } else {
        // For public rooms, navigate directly to the room
        toast.success('Room created successfully!');
        handleClose();
        navigate(`/room/${data.id}?room=${encodeURIComponent(roomName)}`);
      }
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    const url = `${window.location.origin}/join/${generatedCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setStep('form');
    setRoomName('');
    setSelectedSubject('');
    setMaxParticipants(10);
    setGeneratedCode('');
    setCreatedRoomId('');
    onClose();
  };

  const handleEnterRoom = () => {
    handleClose();
    navigate(`/room/${createdRoomId}?room=${encodeURIComponent(roomName)}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-card border-white/10 max-w-md">
        {step === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-foreground">
                Create {isPrivate ? 'Private' : 'Public'} Room {isPrivate ? '🔐' : '🌍'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              {/* Room Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Room Name</label>
                <Input
                  placeholder="e.g., Calculus Study Session"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
              </div>

              {/* Subject Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                <div className="grid grid-cols-4 gap-2">
                  {subjects.map((subject) => (
                    <button
                      key={subject.id}
                      onClick={() => setSelectedSubject(subject.id)}
                      className={`p-3 rounded-xl text-center transition-all duration-300 ${
                        selectedSubject === subject.id
                          ? 'bg-gradient-to-r from-primary to-secondary text-white'
                          : 'glass hover:border-primary/30'
                      }`}
                    >
                      <span className="text-xl block mb-1">{subject.emoji}</span>
                      <span className="text-xs">{subject.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Participants */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Max Participants: <span className="text-primary">{maxParticipants}</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="25"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>2</span>
                  <span>25</span>
                </div>
              </div>

              {/* Create Button */}
              <Button
                variant="cosmic"
                size="lg"
                className="w-full"
                onClick={handleCreate}
                disabled={!roomName || !selectedSubject || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Rocket className="w-5 h-5" />
                )}
                {isLoading ? 'Creating...' : 'Launch Room'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-foreground text-center">
                Room Created! 🎉
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 pt-4 text-center">
              <p className="text-muted-foreground">
                Share this code with your friends to join your study session
              </p>

              {/* Room Code Display */}
              <div className="glass p-6 rounded-2xl">
                <p className="text-sm text-muted-foreground mb-2">Room Code</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-4xl font-bold text-gradient tracking-widest">
                    {generatedCode}
                  </span>
                  <button
                    onClick={copyCode}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              {/* Share Link */}
              <div className="glass p-4 rounded-xl">
                <p className="text-xs text-muted-foreground mb-2">Shareable Link</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm text-foreground bg-muted/50 px-3 py-2 rounded-lg truncate">
                    {window.location.origin}/join/{generatedCode}
                  </code>
                  <Button variant="glass" size="icon" onClick={copyLink}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="glass" className="flex-1" onClick={handleClose}>
                  Done
                </Button>
                <Button variant="cosmic" className="flex-1" onClick={handleEnterRoom}>
                  Enter Room
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
