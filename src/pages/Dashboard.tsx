import { Link } from 'react-router-dom';
import { SpaceBackground } from '@/components/SpaceBackground';
import { Button } from '@/components/ui/button';
import { Globe, Lock, Flame, Clock, LogOut, User, Settings } from 'lucide-react';

const Dashboard = () => {
  // Mock user data
  const user = {
    name: 'Space Cadet',
    avatar: null,
    streak: 12,
    totalHours: 47,
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-lg">🚀</span>
            </div>
            <span className="font-display text-xl font-bold text-foreground hidden sm:block">lockIn</span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="glass-card px-3 sm:px-4 py-2 flex items-center gap-2">
              <Flame className="w-4 h-4 text-secondary" />
              <span className="font-semibold text-foreground">{user.streak}</span>
              <span className="text-sm text-muted-foreground hidden sm:inline">day streak</span>
            </div>
            <Link to="/profile">
              <Button variant="glass" size="icon" className="rounded-xl">
                <User className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="glass" size="icon" className="rounded-xl">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="glass" size="icon" className="rounded-xl">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-28 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* User Stats Section */}
          <div 
            className="glass-card p-8 mb-8 opacity-0 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center cosmic-glow">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-white" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Flame className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="font-display text-2xl font-bold text-foreground mb-1">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-muted-foreground">Ready to lock in and crush your goals?</p>
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Flame className="w-5 h-5 text-secondary" />
                    <span className="font-display text-3xl font-bold text-foreground">{user.streak}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Day Streak</span>
                </div>
                <div className="w-px bg-border" />
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-display text-3xl font-bold text-foreground">{user.totalHours}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Hours Total</span>
                </div>
              </div>
            </div>
          </div>

          {/* Room Type Selection */}
          <h2 
            className="font-display text-xl font-semibold text-foreground mb-6 opacity-0 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            Choose Your Study Mode
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Public Rooms Card */}
            <Link 
              to="/rooms/public"
              className="group opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="glass-card p-8 h-full hover:border-primary/30 transition-all duration-300 group-hover:cosmic-glow">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                    <Globe className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-1">
                      Public Rooms 🌍
                    </h3>
                    <p className="text-muted-foreground">
                      Join study sessions with learners worldwide
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <Feature text="Browse rooms by subject" />
                  <Feature text="Meet new study buddies" />
                  <Feature text="Stay accountable together" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-card"
                      />
                    ))}
                    <div className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">+99</span>
                    </div>
                  </div>
                  <Button variant="cosmic" className="group-hover:animate-pulse-glow">
                    Browse Rooms
                  </Button>
                </div>
              </div>
            </Link>

            {/* Private Rooms Card */}
            <Link 
              to="/rooms/private"
              className="group opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="glass-card p-8 h-full hover:border-secondary/30 transition-all duration-300 group-hover:shadow-[0_0_60px_-15px_hsl(330_81%_60%_/_0.5)]">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center group-hover:from-secondary/30 group-hover:to-secondary/20 transition-colors">
                    <Lock className="w-7 h-7 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-1">
                      Private Rooms 🔐
                    </h3>
                    <p className="text-muted-foreground">
                      Create exclusive sessions for your squad
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <Feature text="Invite-only with unique codes" />
                  <Feature text="Perfect for study groups" />
                  <Feature text="Full control over your space" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">Share code to join</span>
                  </div>
                  <Button variant="glass" className="border-secondary/30 hover:border-secondary/50">
                    Create Room
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

const Feature = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
    <span className="text-sm text-muted-foreground">{text}</span>
  </div>
);

export default Dashboard;
