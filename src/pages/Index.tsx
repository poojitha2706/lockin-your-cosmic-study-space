import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SpaceBackground } from '@/components/SpaceBackground';
import { Rocket, Sparkles, Users, Clock } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">lockIn</span>
          </div>
          <Link to="/auth">
            <Button variant="glass" size="default">
              Login
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 opacity-0 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Focus. Flow. Finish.</span>
          </div>

          {/* Main Heading */}
          <h1 
            className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            Your cosmic co-working space for{' '}
            <span className="text-gradient">getting shit done</span>{' '}
            <span className="inline-block animate-float">🚀</span>
          </h1>

          {/* Subtitle */}
          <p 
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            Join focused study sessions with people around the world. 
            Stay accountable. Achieve your goals.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.6s' }}
          >
            <Link to="/auth">
              <Button variant="cosmic" size="xl" className="group">
                <Rocket className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
                Launch Session
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="glass" size="xl">
                Login
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.8s' }}
          >
            <StatCard icon={<Users className="w-5 h-5" />} value="10k+" label="Active Users" />
            <StatCard icon={<Clock className="w-5 h-5" />} value="1M+" label="Hours Focused" />
            <StatCard icon={<Sparkles className="w-5 h-5" />} value="50k+" label="Goals Achieved" />
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-primary/20 blur-xl animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-secondary/20 blur-xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-primary/10 blur-lg animate-float" style={{ animationDelay: '4s' }} />
      </main>
    </div>
  );
};

const StatCard = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="glass-card p-6 text-center hover:border-primary/30 transition-colors duration-300">
    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 text-primary mb-3">
      {icon}
    </div>
    <div className="font-display text-2xl font-bold text-foreground mb-1">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

export default Index;
