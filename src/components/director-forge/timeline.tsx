import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  Maximize2,
  Minimize2
} from "lucide-react";

interface TimelineProps {
  isZenMode: boolean;
}

export function Timeline({ isZenMode }: TimelineProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState([30]);
  const [volume, setVolume] = useState([80]);
  const [timelineHeight, setTimelineHeight] = useState<'mini' | 'medium' | 'full'>('medium');

  const tracks = [
    { 
      id: 'video', 
      name: 'Video Track', 
      color: 'hsl(var(--primary))',
      clips: [
        { start: 0, duration: 15, name: 'Character Intro' },
        { start: 20, duration: 25, name: 'Action Scene' },
        { start: 50, duration: 20, name: 'Dialogue' },
      ]
    },
    { 
      id: 'audio', 
      name: 'Audio Track', 
      color: 'hsl(var(--accent))',
      clips: [
        { start: 0, duration: 70, name: 'Background Music' },
        { start: 15, duration: 5, name: 'Sound Effect' },
        { start: 45, duration: 10, name: 'Voice Over' },
      ]
    },
    { 
      id: 'effects', 
      name: 'Effects Track', 
      color: 'hsl(var(--secondary))',
      clips: [
        { start: 10, duration: 8, name: 'Fade In' },
        { start: 40, duration: 12, name: 'Color Grade' },
      ]
    },
  ];

  const getHeightClass = () => {
    switch (timelineHeight) {
      case 'mini': return 'h-16';
      case 'medium': return 'h-32';
      case 'full': return 'h-48';
      default: return 'h-32';
    }
  };

  if (isZenMode) {
    return (
      <div className="h-16 bg-toolbar-bg/50 backdrop-blur-xl border-t border-toolbar-border/50 flex items-center justify-center px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="zen"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          
          <div className="flex-1 max-w-md">
            <Slider
              value={currentTime}
              onValueChange={setCurrentTime}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          
          <span className="text-sm text-muted-foreground font-mono">
            00:30 / 01:40
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-timeline-bg border-t border-border transition-all duration-300 ${getHeightClass()}`}>
      {/* Timeline Controls */}
      <div className="h-12 bg-toolbar-bg border-b border-toolbar-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="toolbar"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button variant="toolbar" size="icon">
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button variant="toolbar" size="icon">
            <SkipForward className="w-4 h-4" />
          </Button>
          
          <span className="text-sm font-mono text-muted-foreground">
            00:{currentTime[0].toString().padStart(2, '0')} / 01:40
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="w-20"
            />
          </div>
          
          <Button
            variant="toolbar"
            size="icon"
            onClick={() => {
              const heights: ('mini' | 'medium' | 'full')[] = ['mini', 'medium', 'full'];
              const currentIndex = heights.indexOf(timelineHeight);
              const nextIndex = (currentIndex + 1) % heights.length;
              setTimelineHeight(heights[nextIndex]);
            }}
          >
            {timelineHeight === 'full' ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Timeline Tracks */}
      <div className="flex-1 flex overflow-hidden">
        {/* Track Labels */}
        <div className="w-32 bg-toolbar-bg border-r border-toolbar-border">
          {tracks.map((track) => (
            <div 
              key={track.id} 
              className="h-8 flex items-center px-3 border-b border-toolbar-border text-xs font-medium"
              style={{ color: track.color }}
            >
              {track.name}
            </div>
          ))}
        </div>

        {/* Timeline Content */}
        <div className="flex-1 relative overflow-x-auto">
          {/* Time Ruler */}
          <div className="h-6 bg-muted border-b border-border flex">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="w-12 border-r border-border flex items-center justify-center text-xs text-muted-foreground">
                {i * 5}s
              </div>
            ))}
          </div>

          {/* Playhead */}
          <div 
            className="absolute top-6 bottom-0 w-0.5 bg-timeline-playhead shadow-glow z-10 transition-all duration-100"
            style={{ left: `${(currentTime[0] / 100) * 240 * 4}px` }}
          />

          {/* Tracks */}
          <div className="relative">
            {tracks.map((track, trackIndex) => (
              <div key={track.id} className="h-8 border-b border-border relative">
                {/* Track Background */}
                <div className="absolute inset-0 bg-timeline-track" />
                
                {/* Clips */}
                {track.clips.map((clip, clipIndex) => (
                  <div
                    key={clipIndex}
                    className="absolute top-1 bottom-1 rounded-md border hover:scale-105 transition-transform cursor-pointer group"
                    style={{
                      left: `${(clip.start / 100) * 240 * 4}px`,
                      width: `${(clip.duration / 100) * 240 * 4}px`,
                      backgroundColor: track.color,
                      borderColor: track.color,
                      opacity: 0.8,
                    }}
                  >
                    <div className="px-2 py-1 text-xs font-medium text-white truncate">
                      {clip.name}
                    </div>
                    
                    {/* Clip Handles */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Timing Suggestions */}
      {timelineHeight === 'full' && (
        <div className="h-8 bg-muted/50 border-t border-border flex items-center px-4 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-accent">AI Suggestions:</span>
            </div>
            <span className="text-muted-foreground">
              Sync audio beat at 0:45 • Add transition at 1:12 • Extend dialogue scene
            </span>
          </div>
        </div>
      )}
    </div>
  );
}