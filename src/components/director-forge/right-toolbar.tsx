import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { 
  Bot, 
  Users, 
  Database, 
  User, 
  BarChart3, 
  HelpCircle,
  Send,
  Sparkles
} from "lucide-react";

interface RightToolbarProps {
  isZenMode: boolean;
}

export function RightToolbar({ isZenMode }: RightToolbarProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");

  const sections = [
    { 
      id: 'ai-chat', 
      label: 'AI Chat', 
      icon: Bot,
      description: 'Context-aware AI Assistant'
    },
    { 
      id: 'collaboration', 
      label: 'Collab', 
      icon: Users,
      description: 'Team Coordination'
    },
    { 
      id: 'memory', 
      label: 'Memory', 
      icon: Database,
      description: 'Project Patterns'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User,
      description: 'Account Settings'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3,
      description: 'Performance Insights'
    },
    { 
      id: 'help', 
      label: 'Help', 
      icon: HelpCircle,
      description: 'Support & Docs'
    },
  ];

  if (isZenMode) {
    return (
      <div className="w-16 bg-toolbar-bg/50 backdrop-blur-xl border-l border-toolbar-border/50 flex flex-col items-center py-4">
        <Button
          variant="zen"
          size="icon"
          className="w-12 h-12 animate-pulse-glow"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-16 bg-toolbar-bg border-l border-toolbar-border flex flex-col">
      {sections.map(({ id, label, icon: Icon, description }) => (
        <Sheet key={id}>
          <SheetTrigger asChild>
            <Button
              variant={selectedSection === id ? "ai" : "toolbar"}
              size="icon"
              className="w-14 h-14 m-1 flex-col gap-1 text-xs"
              onClick={() => setSelectedSection(selectedSection === id ? null : id)}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] leading-none">{label}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0 bg-card border-l border-toolbar-border">
            <div className="p-6 border-b border-toolbar-border">
              <div className="flex items-center gap-3">
                <Icon className="w-6 h-6 text-accent" />
                <div>
                  <h3 className="text-lg font-semibold">{label}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 h-[calc(100vh-120px)] overflow-y-auto">
              {id === 'ai-chat' && <AIChatContent chatMessage={chatMessage} setChatMessage={setChatMessage} />}
              {id === 'collaboration' && <CollaborationContent />}
              {id === 'memory' && <MemoryContent />}
              {id === 'profile' && <ProfileContent />}
              {id === 'analytics' && <AnalyticsContent />}
              {id === 'help' && <HelpContent />}
            </div>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}

function AIChatContent({ chatMessage, setChatMessage }: { chatMessage: string; setChatMessage: (msg: string) => void }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI Director Assistant. I can help you with script writing, character development, scene planning, and production optimization. What would you like to create today?'
    }
  ]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    setMessages(prev => [...prev, 
      { role: 'user', content: chatMessage },
      { role: 'assistant', content: 'I\'d be happy to help you with that! Let me analyze your project and provide some suggestions...' }
    ]);
    setChatMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4 mb-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg ${
              message.role === 'user' 
                ? 'bg-primary/10 border border-primary/20 ml-4' 
                : 'bg-accent/10 border border-accent/20 mr-4'
            }`}
          >
            <div className="flex items-start gap-2">
              {message.role === 'assistant' && <Sparkles className="w-4 h-4 text-accent mt-0.5" />}
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Input
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          placeholder="Ask me anything about your project..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="bg-node-bg border-node-border"
        />
        <Button 
          variant="ai" 
          size="icon"
          onClick={handleSendMessage}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function CollaborationContent() {
  const collaborators = [
    { name: 'Alex Chen', role: 'Director', status: 'online', avatar: '👨‍🎬' },
    { name: 'Sarah Kim', role: 'Editor', status: 'editing', avatar: '👩‍💻' },
    { name: 'Mike Rodriguez', role: 'Sound', status: 'away', avatar: '👨‍🎤' },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h4 className="font-medium flex items-center gap-2">
          <Users className="w-4 h-4" />
          Active Collaborators
        </h4>
        {collaborators.map((user) => (
          <div key={user.name} className="flex items-center gap-3 p-3 rounded-lg bg-node-bg border border-node-border">
            <div className="text-2xl">{user.avatar}</div>
            <div className="flex-1">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
            <div className={`w-2 h-2 rounded-full ${
              user.status === 'online' ? 'bg-primary' : 
              user.status === 'editing' ? 'bg-accent animate-pulse' : 
              'bg-muted-foreground'
            }`} />
          </div>
        ))}
      </div>
      
      <Button variant="ai" className="w-full">
        Invite Collaborator
      </Button>
    </div>
  );
}

function MemoryContent() {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Project Patterns</h4>
      <div className="space-y-3">
        {[
          'Character consistency across scenes',
          'Preferred lighting styles',
          'Audio mixing preferences',
          'Export format settings'
        ].map((pattern) => (
          <div key={pattern} className="p-3 rounded-lg bg-node-bg border border-node-border">
            <p className="text-sm">{pattern}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileContent() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">
          🎬
        </div>
        <h3 className="font-semibold">Director Studio</h3>
        <p className="text-sm text-muted-foreground">Premium Account</p>
      </div>
      
      <div className="space-y-2">
        <Button variant="cinema" className="w-full justify-start">Account Settings</Button>
        <Button variant="cinema" className="w-full justify-start">Billing & Usage</Button>
        <Button variant="cinema" className="w-full justify-start">Team Management</Button>
        <Button variant="destructive" className="w-full justify-start">Sign Out</Button>
      </div>
    </div>
  );
}

function AnalyticsContent() {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Production Metrics</h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-node-bg border border-node-border text-center">
          <p className="text-2xl font-bold text-primary">127</p>
          <p className="text-xs text-muted-foreground">Scenes Created</p>
        </div>
        <div className="p-3 rounded-lg bg-node-bg border border-node-border text-center">
          <p className="text-2xl font-bold text-accent">42</p>
          <p className="text-xs text-muted-foreground">Hours Saved</p>
        </div>
        <div className="p-3 rounded-lg bg-node-bg border border-node-border text-center">
          <p className="text-2xl font-bold text-primary">95%</p>
          <p className="text-xs text-muted-foreground">Quality Score</p>
        </div>
        <div className="p-3 rounded-lg bg-node-bg border border-node-border text-center">
          <p className="text-2xl font-bold text-accent">8</p>
          <p className="text-xs text-muted-foreground">Projects</p>
        </div>
      </div>
    </div>
  );
}

function HelpContent() {
  return (
    <div className="space-y-3">
      <Button variant="ai" className="w-full justify-start">
        Getting Started Guide
      </Button>
      <Button variant="cinema" className="w-full justify-start">
        DirectorScript Documentation
      </Button>
      <Button variant="cinema" className="w-full justify-start">
        Video Tutorials
      </Button>
      <Button variant="cinema" className="w-full justify-start">
        Community Forum
      </Button>
      <Button variant="cinema" className="w-full justify-start">
        Contact Support
      </Button>
    </div>
  );
}