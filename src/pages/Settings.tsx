import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SpaceBackground } from '@/components/SpaceBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, User, Bell, Volume2, Clock, Moon, 
  Palette, Shield, LogOut, Trash2, Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    displayName: 'Space Cadet',
    email: 'cadet@lockin.study',
    notifications: true,
    soundEffects: true,
    darkMode: true,
    focusDuration: 25,
    breakDuration: 5,
    autoStartBreaks: false,
    publicProfile: true,
  });

  const handleSave = () => {
    toast({
      title: "Settings saved! ✨",
      description: "Your preferences have been updated.",
    });
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link to="/dashboard">
            <Button variant="glass" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <Button variant="cosmic" size="sm" className="gap-2" onClick={handleSave}>
            <Save className="w-4 h-4" />
            Save
          </Button>
        </div>
      </header>

      <main className="relative z-10 pt-24 pb-12 px-4 lg:px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="font-display text-3xl font-bold animate-fade-in">Settings</h1>

          {/* Profile Section */}
          <SettingsSection title="Profile" icon={<User className="w-5 h-5" />} delay="0.1s">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Display Name</label>
                <Input 
                  value={settings.displayName}
                  onChange={(e) => updateSetting('displayName', e.target.value)}
                  className="bg-muted/30 border-white/10"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Email</label>
                <Input 
                  value={settings.email}
                  onChange={(e) => updateSetting('email', e.target.value)}
                  className="bg-muted/30 border-white/10"
                />
              </div>
              <ToggleSetting 
                label="Public Profile"
                description="Allow others to see your stats"
                checked={settings.publicProfile}
                onChange={(v) => updateSetting('publicProfile', v)}
              />
            </div>
          </SettingsSection>

          {/* Timer Section */}
          <SettingsSection title="Timer" icon={<Clock className="w-5 h-5" />} delay="0.2s">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Focus Duration (min)</label>
                  <Input 
                    type="number"
                    value={settings.focusDuration}
                    onChange={(e) => updateSetting('focusDuration', parseInt(e.target.value))}
                    className="bg-muted/30 border-white/10"
                    min={1}
                    max={120}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Break Duration (min)</label>
                  <Input 
                    type="number"
                    value={settings.breakDuration}
                    onChange={(e) => updateSetting('breakDuration', parseInt(e.target.value))}
                    className="bg-muted/30 border-white/10"
                    min={1}
                    max={30}
                  />
                </div>
              </div>
              <ToggleSetting 
                label="Auto-start Breaks"
                description="Automatically start break timer after focus session"
                checked={settings.autoStartBreaks}
                onChange={(v) => updateSetting('autoStartBreaks', v)}
              />
            </div>
          </SettingsSection>

          {/* Notifications Section */}
          <SettingsSection title="Notifications" icon={<Bell className="w-5 h-5" />} delay="0.3s">
            <ToggleSetting 
              label="Push Notifications"
              description="Get reminders for study sessions"
              checked={settings.notifications}
              onChange={(v) => updateSetting('notifications', v)}
            />
          </SettingsSection>

          {/* Audio Section */}
          <SettingsSection title="Audio" icon={<Volume2 className="w-5 h-5" />} delay="0.4s">
            <ToggleSetting 
              label="Sound Effects"
              description="Play sounds for timer events"
              checked={settings.soundEffects}
              onChange={(v) => updateSetting('soundEffects', v)}
            />
          </SettingsSection>

          {/* Appearance Section */}
          <SettingsSection title="Appearance" icon={<Palette className="w-5 h-5" />} delay="0.5s">
            <ToggleSetting 
              label="Dark Mode"
              description="Use dark theme (recommended)"
              checked={settings.darkMode}
              onChange={(v) => updateSetting('darkMode', v)}
            />
          </SettingsSection>

          {/* Danger Zone */}
          <div className="glass-card p-6 border-destructive/30 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <h2 className="font-display text-lg font-semibold text-destructive mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Danger Zone
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
                <div>
                  <p className="font-medium">Sign Out</p>
                  <p className="text-sm text-muted-foreground">Sign out of your account</p>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const SettingsSection = ({ 
  title, 
  icon, 
  children, 
  delay 
}: { 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode; 
  delay: string;
}) => (
  <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: delay }}>
    <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
      {icon}
      {title}
    </h2>
    {children}
  </div>
);

const ToggleSetting = ({ 
  label, 
  description, 
  checked, 
  onChange 
}: { 
  label: string; 
  description: string; 
  checked: boolean; 
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

export default Settings;
