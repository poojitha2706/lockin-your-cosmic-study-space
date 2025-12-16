import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, Flame, Target, Trophy, Star, Sparkles } from 'lucide-react';

interface SessionSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionData: {
    duration: number; // in seconds
    focusSessions: number;
    goal?: string;
    tasksCompleted: number;
    totalTasks: number;
  };
}

// Confetti particle component
const Confetti = () => {
  const colors = ['#8b5cf6', '#ec4899', '#22c55e', '#eab308', '#3b82f6'];
  const [particles] = useState(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      size: 4 + Math.random() * 8,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.x}%`,
            top: '-20px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export const SessionSummaryModal = ({ isOpen, onClose, sessionData }: SessionSummaryModalProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins} minutes`;
  };

  const getMotivationalMessage = () => {
    if (sessionData.focusSessions >= 4) return "Absolute legend! 🔥 You crushed it today!";
    if (sessionData.focusSessions >= 2) return "Great work! 💪 Keep the momentum going!";
    return "Good start! 🌟 Every session counts!";
  };

  const earnedBadge = sessionData.focusSessions >= 3 ? {
    name: 'Focus Master',
    icon: <Trophy className="w-6 h-6 text-yellow-400" />,
  } : null;

  return (
    <>
      {showConfetti && <Confetti />}
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="glass-card border-white/10 max-w-md p-0 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              Session Complete! 🎉
            </h2>
            <p className="text-white/80 text-sm">{getMotivationalMessage()}</p>
          </div>

          {/* Stats */}
          <div className="p-6 space-y-4">
            {/* Goal */}
            {sessionData.goal && (
              <div className="glass p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Session Goal</p>
                    <p className="font-medium">{sessionData.goal}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="glass p-4 rounded-xl text-center">
                <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="font-display text-xl font-bold">{formatDuration(sessionData.duration)}</p>
                <p className="text-xs text-muted-foreground">Total Time</p>
              </div>
              <div className="glass p-4 rounded-xl text-center">
                <Flame className="w-5 h-5 text-secondary mx-auto mb-2" />
                <p className="font-display text-xl font-bold">{sessionData.focusSessions}</p>
                <p className="text-xs text-muted-foreground">Focus Sessions</p>
              </div>
              <div className="glass p-4 rounded-xl text-center">
                <Star className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                <p className="font-display text-xl font-bold">{sessionData.tasksCompleted}/{sessionData.totalTasks}</p>
                <p className="text-xs text-muted-foreground">Tasks Done</p>
              </div>
            </div>

            {/* Badge earned */}
            {earnedBadge && (
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    {earnedBadge.icon}
                  </div>
                  <div>
                    <p className="text-xs text-yellow-400/80">Badge Earned!</p>
                    <p className="font-display font-bold text-yellow-400">{earnedBadge.name}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button variant="glass" className="flex-1" onClick={onClose}>
                Back to Dashboard
              </Button>
              <Button variant="cosmic" className="flex-1" onClick={onClose}>
                New Session
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
