import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

export interface BaseNodeData extends Record<string, unknown> {
  id: string;
  type: string;
  label: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress?: number;
  preview?: string;
  cost?: number;
  metadata?: Record<string, any>;
  inputs?: Array<{ id: string; label: string; type: string; }>;
  outputs?: Array<{ id: string; label: string; type: string; }>;
}

interface BaseNodeProps extends NodeProps {
  data: BaseNodeData;
  icon: React.ComponentType<any>;
  color: string;
  onExecute?: (nodeId: string) => void;
  onSettings?: (nodeId: string) => void;
  onPreview?: (nodeId: string) => void;
}

export const BaseNode = memo(({ 
  data, 
  icon: Icon, 
  color, 
  onExecute, 
  onSettings, 
  onPreview 
}: BaseNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusIcon = () => {
    switch (data.status) {
      case 'processing':
        return <Clock className="w-3 h-3 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-primary" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (data.status) {
      case 'processing':
        return 'border-accent shadow-accent';
      case 'completed':
        return 'border-primary shadow-primary';
      case 'error':
        return 'border-destructive shadow-destructive';
      default:
        return 'border-node-border';
    }
  };

  return (
    <div 
      className={`
        min-w-48 bg-node-bg rounded-xl border-2 transition-all duration-300
        ${getStatusColor()}
        ${data.status === 'processing' ? 'animate-pulse-glow' : ''}
        hover:scale-105 group
      `}
      style={{
        boxShadow: data.status !== 'idle' ? `0 0 20px ${color}30` : undefined
      }}
    >
      {/* Input Handles */}
      {data.inputs?.map((input, index) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          className="w-3 h-3 border-2 border-node-border bg-node-bg"
          style={{ 
            top: `${30 + (index * 20)}px`,
            background: color,
            borderColor: color
          }}
        />
      ))}

      {/* Node Header */}
      <div className="p-4 border-b border-node-border">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}20`, color }}
          >
            <Icon className="w-4 h-4" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">{data.label}</h3>
              {getStatusIcon()}
            </div>
            <Badge 
              variant="outline" 
              className="text-xs mt-1"
              style={{ borderColor: color, color }}
            >
              {data.type}
            </Badge>
          </div>

          <div className="flex gap-1">
            {onSettings && (
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onSettings(data.id)}
              >
                <Settings className="w-3 h-3" />
              </Button>
            )}
            
            {onPreview && data.preview && (
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onPreview(data.id)}
              >
                <Eye className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {data.status === 'processing' && data.progress !== undefined && (
        <div className="px-4 py-2">
          <Progress value={data.progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {data.progress}% complete
          </p>
        </div>
      )}

      {/* Preview */}
      {data.preview && (
        <div className="p-4">
          <div className="w-full h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
            {data.type === 'image' ? (
              <img 
                src={data.preview} 
                alt="Preview" 
                className="w-full h-full object-cover rounded"
              />
            ) : data.type === 'video' ? (
              <video 
                src={data.preview} 
                className="w-full h-full object-cover rounded"
                muted
                loop
                autoPlay
              />
            ) : (
              <div className="text-xs text-muted-foreground text-center">
                {data.preview}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-4 pt-0 flex gap-2">
        {onExecute && (
          <Button
            variant="ai"
            size="sm"
            className="flex-1"
            onClick={() => onExecute(data.id)}
            disabled={data.status === 'processing'}
          >
            {data.status === 'processing' ? (
              <Pause className="w-3 h-3" />
            ) : (
              <Play className="w-3 h-3" />
            )}
            {data.status === 'processing' ? 'Stop' : 'Generate'}
          </Button>
        )}
        
        {data.status === 'error' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExecute?.(data.id)}
          >
            <RotateCcw className="w-3 h-3" />
            Retry
          </Button>
        )}
      </div>

      {/* Metadata */}
      {data.cost !== undefined && (
        <div className="px-4 pb-4">
          <div className="text-xs text-muted-foreground">
            Cost: ${data.cost.toFixed(4)}
          </div>
        </div>
      )}

      {/* Output Handles */}
      {data.outputs?.map((output, index) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          className="w-3 h-3 border-2 border-node-border bg-node-bg"
          style={{ 
            top: `${30 + (index * 20)}px`,
            background: color,
            borderColor: color
          }}
        />
      ))}
    </div>
  );
});

BaseNode.displayName = 'BaseNode';