import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SpaceBackground } from '@/components/SpaceBackground';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const JoinRoom = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const joinRoom = async () => {
      if (!code) {
        setError('Invalid room code');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .eq('code', code.toUpperCase())
          .single();

        if (error || !data) {
          setError('Room not found. Please check the code and try again.');
          toast.error('Room not found');
          setTimeout(() => navigate('/rooms/private'), 2000);
          return;
        }

        if (data.participant_count >= data.max_participants) {
          setError('This room is full');
          toast.error('Room is full');
          setTimeout(() => navigate('/rooms/private'), 2000);
          return;
        }

        // Navigate to the room
        navigate(`/room/${data.id}?room=${encodeURIComponent(data.name)}`);
      } catch (err) {
        console.error('Error joining room:', err);
        setError('Failed to join room');
        toast.error('Failed to join room');
        setTimeout(() => navigate('/rooms/private'), 2000);
      }
    };

    joinRoom();
  }, [code, navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <SpaceBackground />
      <div className="glass-card p-8 text-center z-10">
        {error ? (
          <>
            <p className="text-destructive mb-2">{error}</p>
            <p className="text-sm text-muted-foreground">Redirecting...</p>
          </>
        ) : (
          <>
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-foreground">Joining room...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default JoinRoom;
