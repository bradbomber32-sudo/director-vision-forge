import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Film, Play, Pause, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface TimelineNodeData extends Record<string, unknown> {
  id: string;
  label: string;
  scenes: Array<{
    id: string;
    name: string;
    duration: number;
    thumbnail?: string;
    status: 'pending' | 'processing' | 'completed';
  }>;
  totalDuration: number;
  progress: number;
  isExporting: boolean;
}

interface TimelineNodeProps extends NodeProps {
  data: TimelineNodeData;
}

export const TimelineNode = memo(({ data }: TimelineNodeProps) => {
  const FRAME_WIDTH = 60;
  const FRAME_HEIGHT = 40;
  const timelineWidth = Math.max(800, data.scenes.length * FRAME_WIDTH);

  return (
    <div className="relative">
      {/* Input handles for scenes */}
      {data.scenes.map((_, index) => (
        <Handle
          key={`scene-${index}`}
          type="target"
          position={Position.Top}
          id={`scene-${index}`}
          className="w-3 h-3 border-2 border-primary bg-background"
          style={{ 
            left: `${50 + (index * FRAME_WIDTH)}px`,
            top: '-6px'
          }}
        />
      ))}

      {/* Timeline Container */}
      <div 
        className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl border-2 border-accent shadow-2xl relative overflow-hidden"
        style={{ width: timelineWidth, minHeight: '120px' }}
      >
        {/* Film strip holes */}
        <div className="absolute top-2 left-0 right-0 flex justify-center">
          <div className="flex gap-2">
            {Array.from({ length: Math.floor(timelineWidth / 20) }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-slate-700 rounded-full" />
            ))}
          </div>
        </div>
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <div className="flex gap-2">
            {Array.from({ length: Math.floor(timelineWidth / 20) }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-slate-700 rounded-full" />
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <Film className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{data.label}</h3>
              <p className="text-xs text-slate-300">
                {data.scenes.length} scenes • {Math.floor(data.totalDuration / 60)}:{(data.totalDuration % 60).toString().padStart(2, '0')}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" className="text-white hover:text-accent">
              <Play className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" className="text-white hover:text-accent">
              <Download className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Film frames */}
        <div className="flex items-center p-4 gap-1">
          {data.scenes.map((scene, index) => (
            <div
              key={scene.id}
              className="relative group"
              style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT }}
            >
              <div 
                className="w-full h-full rounded border-2 border-slate-600 bg-slate-700 overflow-hidden relative"
                style={{
                  borderColor: scene.status === 'completed' ? '#10b981' : 
                               scene.status === 'processing' ? '#f59e0b' : '#6b7280'
                }}
              >
                {scene.thumbnail ? (
                  <img 
                    src={scene.thumbnail} 
                    alt={scene.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                    <span className="text-xs text-white font-mono">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                )}
                
                {scene.status === 'processing' && (
                  <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                    <div className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              
              {/* Scene info tooltip */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {scene.name}
              </div>
            </div>
          ))}
          
          {/* Add scene placeholder */}
          <div
            className="border-2 border-dashed border-slate-600 rounded flex items-center justify-center text-slate-400 hover:border-accent hover:text-accent transition-colors cursor-pointer"
            style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT }}
          >
            <span className="text-xs">+</span>
          </div>
        </div>

        {/* Progress bar */}
        {data.isExporting && (
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <Progress value={data.progress} className="h-1 bg-slate-800" />
          </div>
        )}
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="timeline-output"
        className="w-4 h-4 border-2 border-accent bg-background"
        style={{ 
          left: '50%',
          bottom: '-8px',
          transform: 'translateX(-50%)'
        }}
      />
    </div>
  );
});

TimelineNode.displayName = 'TimelineNode';