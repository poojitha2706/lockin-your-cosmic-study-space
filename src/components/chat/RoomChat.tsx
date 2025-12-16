import { useState, useRef, useEffect } from 'react';
import { Send, Smile, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessage {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  reactions: { emoji: string; count: number }[];
}

interface RoomChatProps {
  roomName: string;
}

const EMOJIS = ['👍', '🔥', '💡', '❤️', '😊', '🎉'];

// Demo messages
const DEMO_MESSAGES: ChatMessage[] = [
  { id: '1', user: 'Alex', content: 'Hey everyone! Ready to grind today 💪', timestamp: new Date(Date.now() - 300000), reactions: [{ emoji: '🔥', count: 2 }] },
  { id: '2', user: 'Maya', content: 'Just finished my first pomodoro!', timestamp: new Date(Date.now() - 180000), reactions: [{ emoji: '🎉', count: 3 }] },
  { id: '3', user: 'Jordan', content: 'Anyone else studying for finals?', timestamp: new Date(Date.now() - 60000), reactions: [] },
];

export const RoomChat = ({ roomName }: RoomChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_MESSAGES);
  const [input, setInput] = useState('');
  const [showEmojis, setShowEmojis] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate typing indicator
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setTypingUsers(['Someone']);
        setTimeout(() => setTypingUsers([]), 2000);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      content: input,
      timestamp: new Date(),
      reactions: [],
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;
      
      const existingReaction = msg.reactions.find(r => r.emoji === emoji);
      if (existingReaction) {
        return {
          ...msg,
          reactions: msg.reactions.map(r => 
            r.emoji === emoji ? { ...r, count: r.count + 1 } : r
          ),
        };
      }
      return {
        ...msg,
        reactions: [...msg.reactions, { emoji, count: 1 }],
      };
    }));
    setShowEmojis(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Room Header */}
      <div className="p-3 border-b border-white/10">
        <h3 className="font-display font-semibold text-sm">{roomName}</h3>
        <p className="text-xs text-muted-foreground">{messages.length} messages</p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="group">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-primary/50 to-secondary/50 flex items-center justify-center text-xs font-semibold">
                  {msg.user[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-sm">{msg.user}</span>
                    <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
                  </div>
                  <p className="text-sm text-foreground/90 break-words">{msg.content}</p>
                  
                  {/* Reactions */}
                  {msg.reactions.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {msg.reactions.map((reaction, i) => (
                        <button
                          key={i}
                          onClick={() => handleReaction(msg.id, reaction.emoji)}
                          className="text-xs bg-muted/50 hover:bg-muted px-1.5 py-0.5 rounded-full flex items-center gap-1"
                        >
                          {reaction.emoji} {reaction.count}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Add reaction button */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setShowEmojis(showEmojis === msg.id ? null : msg.id)}
                  >
                    <Smile className="w-3 h-3" />
                  </Button>
                  
                  {showEmojis === msg.id && (
                    <div className="absolute right-0 top-full mt-1 bg-card border border-white/10 rounded-lg p-2 flex gap-1 z-10 shadow-xl">
                      {EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(msg.id, emoji)}
                          className="hover:scale-125 transition-transform text-sm"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="px-3 py-1 text-xs text-muted-foreground flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          {typingUsers.join(', ')} is typing...
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
            className="flex-1 bg-muted/30 border-white/10 text-sm"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
