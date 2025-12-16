import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Lightbulb, HelpCircle, BookOpen, MessageCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NovaChat } from './NovaChat';
import { RoomChat } from './RoomChat';

interface NovaSidebarProps {
  roomName: string;
}

export const NovaSidebar = ({ roomName }: NovaSidebarProps) => {
  const [activeTab, setActiveTab] = useState<'nova' | 'room'>('nova');

  return (
    <div className="glass-card w-full lg:w-80 h-[500px] lg:h-[600px] flex flex-col overflow-hidden">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'nova' | 'room')} className="flex flex-col h-full">
        <TabsList className="grid w-full grid-cols-2 bg-transparent border-b border-white/10 rounded-none p-0">
          <TabsTrigger 
            value="nova" 
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Nova
          </TabsTrigger>
          <TabsTrigger 
            value="room" 
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary gap-2"
          >
            <Users className="w-4 h-4" />
            Room Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nova" className="flex-1 m-0 overflow-hidden">
          <NovaChat />
        </TabsContent>

        <TabsContent value="room" className="flex-1 m-0 overflow-hidden">
          <RoomChat roomName={roomName} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
