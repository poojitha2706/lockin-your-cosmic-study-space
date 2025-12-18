import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { SpaceBackground } from '@/components/SpaceBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VideoSidebar } from '@/components/video/VideoSidebar';
import { NovaSidebar } from '@/components/chat/NovaSidebar';
import { TaskList } from '@/components/TaskList';
import { SessionSummaryModal } from '@/components/SessionSummaryModal';
import { supabase } from '@/integrations/supabase/client';
import { 
  Play, 
  Pause, 
  Square, 
  Users, 
  Clock, 
  LogOut, 
  Coffee, 
  CloudRain, 
  Radio, 
  VolumeX,
  Music,
  Target,
  Zap
} from 'lucide-react';

const WORK_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60; // 5 minutes

type TimerMode = 'work' | 'break';
type AmbientSound = 'lofi' | 'cafe' | 'rain' | 'white-noise' | 'silence';

interface Room {
  id: string;
  name: string;
  subject: string;
  type: string;
  participant_count: number;
  max_participants: number;
}

const StudyRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState<Room | null>(null);
  const roomName = searchParams.get('room') || room?.name || 'Study Room';
  
  // Daily.co room URL
  const [roomUrl] = useState(`https://lovablehackathon.daily.co/${roomId || 'default-room'}`);
  const [userName] = useState('Guest User'); // In production, get from auth
  
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>('work');
  const [sessionGoal, setSessionGoal] = useState('');
  const [ambientSound, setAmbientSound] = useState<AmbientSound>('silence');
  const [deepFocusMode, setDeepFocusMode] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [focusSessions, setFocusSessions] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // Fetch room data
  useEffect(() => {
    if (roomId) {
      const fetchRoom = async () => {
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', roomId)
          .single();
        
        if (error) {
          console.error('Error fetching room:', error);
        } else {
          setRoom(data);
        }
      };
      fetchRoom();
    }
  }, [roomId]);

  const participantCount = room?.participant_count || 1;

  const totalTime = mode === 'work' ? WORK_TIME : BREAK_TIME;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setSessionTime((prev) => prev + 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Switch modes
      if (mode === 'work') {
        setFocusSessions(prev => prev + 1);
        setMode('break');
        setTimeLeft(BREAK_TIME);
      } else {
        setMode('work');
        setTimeLeft(WORK_TIME);
      }
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const handleLeaveRoom = useCallback(() => {
    if (sessionTime > 60) { // Only show summary if session was > 1 minute
      setShowSummary(true);
    } else {
      navigate('/dashboard');
    }
  }, [sessionTime, navigate]);

  const handleSummaryClose = () => {
    setShowSummary(false);
    navigate('/dashboard');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleStop = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? WORK_TIME : BREAK_TIME);
  }, [mode]);

  const ambientOptions: { id: AmbientSound; icon: React.ReactNode; label: string }[] = [
    { id: 'lofi', icon: <Music className="w-4 h-4" />, label: 'Lo-Fi' },
    { id: 'cafe', icon: <Coffee className="w-4 h-4" />, label: 'Café' },
    { id: 'rain', icon: <CloudRain className="w-4 h-4" />, label: 'Rain' },
    { id: 'white-noise', icon: <Radio className="w-4 h-4" />, label: 'White Noise' },
    { id: 'silence', icon: <VolumeX className="w-4 h-4" />, label: 'Silence' },
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden ${deepFocusMode ? 'deep-focus' : ''}`}>
      <SpaceBackground />

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-6">
            <h1 className="text-lg font-display font-semibold text-foreground truncate max-w-[150px] lg:max-w-none">
              {roomName}
            </h1>
            <div className="hidden sm:flex items-center gap-4">
              <div className="glass-card px-4 py-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{participantCount} studying</span>
              </div>
              <div className="glass-card px-4 py-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium">{formatTime(sessionTime)} session</span>
              </div>
            </div>
          </div>
          <Link to="/dashboard">
            <Button variant="glass" size="sm" className="gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Leave Room</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Layout with Video Sidebar and Nova Sidebar */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen pt-20 pb-32 px-4 lg:px-6 gap-4 lg:gap-6">
        {/* Video Sidebar - Left side on desktop */}
        <aside className="w-full lg:w-auto order-2 lg:order-1 mt-4 lg:mt-0">
          <VideoSidebar
            roomUrl={roomUrl}
            userName={userName}
            onLeave={handleLeaveRoom}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center order-1 lg:order-2">
        {/* Session Goal */}
        <div className="w-full max-w-md mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Session Goal</span>
            </div>
            <Input
              placeholder="What are you focusing on today?"
              value={sessionGoal}
              onChange={(e) => setSessionGoal(e.target.value)}
              className="bg-transparent border-white/10"
            />
          </div>
        </div>

        {/* Timer */}
        <div 
          className="relative mb-8 opacity-0 animate-scale-in"
          style={{ animationDelay: '0.2s' }}
        >
          {/* Cosmic Ring Animation */}
          <div className="absolute inset-0 -m-4">
            <svg className="w-full h-full" viewBox="0 0 280 280">
              {/* Background ring */}
              <circle
                cx="140"
                cy="140"
                r="130"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-white/5"
              />
              {/* Progress ring */}
              <circle
                cx="140"
                cy="140"
                r="130"
                fill="none"
                stroke="url(#cosmicGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 130}`}
                strokeDashoffset={`${2 * Math.PI * 130 * (1 - progress / 100)}`}
                className="transition-all duration-1000 ease-out"
                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
              />
              {/* Glow effect */}
              <circle
                cx="140"
                cy="140"
                r="130"
                fill="none"
                stroke="url(#cosmicGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 130}`}
                strokeDashoffset={`${2 * Math.PI * 130 * (1 - progress / 100)}`}
                className="transition-all duration-1000 ease-out opacity-30 blur-sm"
                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
              />
              <defs>
                <linearGradient id="cosmicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Timer Display */}
          <div className="glass-card w-64 h-64 rounded-full flex flex-col items-center justify-center cosmic-glow">
            <span className={`text-xs font-medium uppercase tracking-wider mb-2 ${mode === 'work' ? 'text-primary' : 'text-green-400'}`}>
              {mode === 'work' ? 'Focus Time' : 'Break Time'}
            </span>
            <span className="font-display text-6xl font-bold text-foreground tabular-nums">
              {formatTime(timeLeft)}
            </span>
            <span className="text-sm text-muted-foreground mt-2">
              {mode === 'work' ? '25 min session' : '5 min break'}
            </span>
          </div>

          {/* Animated particles around timer */}
          {isRunning && (
            <>
              <div className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              <div className="absolute bottom-0 left-1/2 w-2 h-2 rounded-full bg-secondary animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-primary animate-pulse-glow" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-secondary animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
            </>
          )}
        </div>

        {/* Controls */}
        <div 
          className="flex items-center gap-4 mb-8 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          {!isRunning ? (
            <Button variant="cosmic" size="lg" onClick={handleStart} className="gap-2 px-8">
              <Play className="w-5 h-5" />
              Start
            </Button>
          ) : (
            <Button variant="glass" size="lg" onClick={handlePause} className="gap-2 px-8">
              <Pause className="w-5 h-5" />
              Pause
            </Button>
          )}
          <Button variant="glass" size="lg" onClick={handleStop} className="gap-2">
            <Square className="w-5 h-5" />
            Reset
          </Button>
        </div>

        {/* Deep Focus Mode Toggle */}
        <div 
          className="opacity-0 animate-fade-in"
          style={{ animationDelay: '0.5s' }}
        >
          <button
            onClick={() => setDeepFocusMode(!deepFocusMode)}
            className={`glass-card px-6 py-3 flex items-center gap-3 transition-all duration-300 ${
              deepFocusMode 
                ? 'border-primary/50 bg-primary/10' 
                : 'hover:border-primary/30'
            }`}
          >
            <Zap className={`w-5 h-5 ${deepFocusMode ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={`font-medium ${deepFocusMode ? 'text-primary' : 'text-muted-foreground'}`}>
              Deep Focus Mode
            </span>
            <div className={`w-10 h-6 rounded-full transition-colors duration-300 ${
              deepFocusMode ? 'bg-primary' : 'bg-white/10'
            } relative`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                deepFocusMode ? 'translate-x-5' : 'translate-x-1'
              }`} />
            </div>
          </button>
        </div>
        </main>

        {/* Nova AI Sidebar - Right side on desktop */}
        <aside className="w-full lg:w-auto order-3 mt-4 lg:mt-0">
          <NovaSidebar roomName={roomName} />
        </aside>
      </div>

      {/* Bottom Ambient Controls */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-4">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {ambientOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setAmbientSound(option.id)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                    ambientSound === option.id
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'glass hover:border-primary/30 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {option.icon}
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Deep Focus Overlay */}
      {deepFocusMode && (
        <div className="fixed inset-0 pointer-events-none z-40">
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" />
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(circle at center, transparent 30%, hsl(var(--background)) 70%)'
          }} />
        </div>
      )}

      {/* Task List - Bottom Right */}
      <TaskList />

      {/* Session Summary Modal */}
      <SessionSummaryModal 
        isOpen={showSummary}
        onClose={handleSummaryClose}
        sessionData={{
          duration: sessionTime,
          focusSessions: focusSessions,
          goal: sessionGoal || undefined,
          tasksCompleted: 2,
          totalTasks: 3,
        }}
      />
    </div>
  );
};

export default StudyRoom;