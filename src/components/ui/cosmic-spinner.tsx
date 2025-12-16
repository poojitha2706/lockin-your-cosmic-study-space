import { cn } from '@/lib/utils';

interface CosmicSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CosmicSpinner = ({ size = 'md', className }: CosmicSpinnerProps) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className={cn('relative', sizes[size], className)}>
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
      
      {/* Spinning gradient ring */}
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-secondary animate-spin" />
      
      {/* Inner glow */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse" />
      
      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary" />
      </div>
    </div>
  );
};

export const CosmicLoader = ({ text = 'Loading...' }: { text?: string }) => (
  <div className="flex flex-col items-center justify-center gap-4 p-8">
    <CosmicSpinner size="lg" />
    <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
  </div>
);
