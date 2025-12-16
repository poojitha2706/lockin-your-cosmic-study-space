import { Link } from 'react-router-dom';
import { SpaceBackground } from '@/components/SpaceBackground';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, User, Flame, Clock, Trophy, Star, 
  Calendar, Target, BookOpen, Zap, Award, Medal
} from 'lucide-react';

const Profile = () => {
  // Mock user data
  const user = {
    name: 'Space Cadet',
    email: 'cadet@lockin.study',
    avatar: null,
    streak: 12,
    longestStreak: 21,
    totalHours: 47,
    totalSessions: 89,
    joinedDate: 'Nov 2024',
    level: 7,
    xp: 2450,
    xpToNext: 3000,
  };

  const badges = [
    { id: 1, name: 'Early Bird', icon: <Star className="w-5 h-5" />, earned: true, description: '5 morning sessions' },
    { id: 2, name: 'Night Owl', icon: <Zap className="w-5 h-5" />, earned: true, description: '5 late night sessions' },
    { id: 3, name: 'Focus Master', icon: <Trophy className="w-5 h-5" />, earned: true, description: '10 uninterrupted sessions' },
    { id: 4, name: 'Week Warrior', icon: <Flame className="w-5 h-5" />, earned: true, description: '7 day streak' },
    { id: 5, name: 'Century Club', icon: <Medal className="w-5 h-5" />, earned: false, description: '100 total sessions' },
    { id: 6, name: 'Time Lord', icon: <Clock className="w-5 h-5" />, earned: false, description: '100 study hours' },
  ];

  const recentActivity = [
    { date: 'Today', sessions: 2, hours: 1.5, subject: 'Mathematics' },
    { date: 'Yesterday', sessions: 3, hours: 2, subject: 'Physics' },
    { date: '2 days ago', sessions: 1, hours: 0.5, subject: 'History' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/dashboard">
            <Button variant="glass" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="glass" size="sm">Settings</Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 pt-24 pb-12 px-4 lg:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <div className="glass-card p-6 lg:p-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center cosmic-glow">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center border-2 border-background">
                  <span className="font-display font-bold text-white text-sm">{user.level}</span>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-1">
                  {user.name}
                </h1>
                <p className="text-muted-foreground mb-3">{user.email}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {user.joinedDate}</span>
                </div>
              </div>

              {/* Level Progress */}
              <div className="w-full sm:w-48">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Level {user.level}</span>
                  <span className="text-primary">{user.xp}/{user.xpToNext} XP</span>
                </div>
                <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${(user.xp / user.xpToNext) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <StatCard icon={<Flame className="w-6 h-6 text-secondary" />} value={user.streak} label="Day Streak" />
            <StatCard icon={<Award className="w-6 h-6 text-yellow-400" />} value={user.longestStreak} label="Best Streak" />
            <StatCard icon={<Clock className="w-6 h-6 text-primary" />} value={`${user.totalHours}h`} label="Total Time" />
            <StatCard icon={<Target className="w-6 h-6 text-green-400" />} value={user.totalSessions} label="Sessions" />
          </div>

          {/* Badges */}
          <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Badges
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {badges.map((badge) => (
                <div 
                  key={badge.id}
                  className={`p-4 rounded-xl text-center transition-all ${
                    badge.earned 
                      ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30' 
                      : 'bg-muted/30 opacity-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    badge.earned 
                      ? 'bg-gradient-to-br from-primary to-secondary text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {badge.icon}
                  </div>
                  <p className="font-medium text-sm">{badge.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">{activity.date}</p>
                    <p className="text-sm text-muted-foreground">{activity.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{activity.hours}h studied</p>
                    <p className="text-sm text-muted-foreground">{activity.sessions} sessions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) => (
  <div className="glass-card p-4 text-center">
    <div className="flex justify-center mb-2">{icon}</div>
    <p className="font-display text-2xl font-bold">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

export default Profile;
