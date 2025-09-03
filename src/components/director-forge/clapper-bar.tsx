import { Button } from "@/components/ui/button";
import { 
  Camera, 
  Image, 
  Video, 
  Mic, 
  Brain, 
  Save, 
  Download, 
  LogIn,
  Clapperboard
} from "lucide-react";

interface ClapperBarProps {
  onModeChange: (mode: string) => void;
  currentMode: string;
  isZenMode: boolean;
  onZenToggle: () => void;
}

export function ClapperBar({ onModeChange, currentMode, isZenMode, onZenToggle }: ClapperBarProps) {
  const modes = [
    { id: 'audio', label: 'Audio', icon: Mic },
    { id: 'image', label: 'Image', icon: Image },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'record', label: 'Record', icon: Camera },
  ];

  return (
    <div className="h-16 bg-toolbar-bg border-b border-toolbar-border flex items-center justify-between px-6 backdrop-blur-xl">
      {/* Logo Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Clapperboard className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            DirectorForge
          </span>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="flex items-center gap-2">
        {modes.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={currentMode === id ? "clapper" : "toolbar"}
            size="toolbar"
            onClick={() => onModeChange(id)}
            className="relative"
          >
            <Icon className="w-4 h-4" />
            {label}
            {currentMode === id && (
              <div className="absolute inset-0 bg-primary/10 rounded-lg animate-pulse-glow" />
            )}
          </Button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant={isZenMode ? "zen" : "cinema"}
          size="toolbar"
          onClick={onZenToggle}
          className="relative"
        >
          <Brain className="w-4 h-4" />
          Zen
        </Button>
        
        <Button variant="toolbar" size="toolbar">
          <Save className="w-4 h-4" />
          Save
        </Button>
        
        <Button variant="ai" size="toolbar">
          <Download className="w-4 h-4" />
          Export
        </Button>
        
        <Button variant="outline" size="toolbar">
          <LogIn className="w-4 h-4" />
          Sign In
        </Button>
      </div>
    </div>
  );
}