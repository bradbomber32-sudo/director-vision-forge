import { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { BaseNode, BaseNodeData } from './base-node';
import { Video } from 'lucide-react';

interface VideoGenerationNodeData extends BaseNodeData {
  model: string;
  sourceImage?: string;
  motionPrompt: string;
  duration: number;
  fps: number;
  motionStrength: number;
}

interface VideoGenerationNodeProps extends NodeProps {
  data: VideoGenerationNodeData;
}

export const VideoGenerationNode = memo(({ data, ...props }: VideoGenerationNodeProps) => {
  const handleExecute = (nodeId: string) => {
    console.log('Generating video:', nodeId);
    // Implement video generation logic
  };

  const handleSettings = (nodeId: string) => {
    console.log('Opening video generation settings:', nodeId);
    // Open settings panel
  };

  const handlePreview = (nodeId: string) => {
    console.log('Previewing generated video:', nodeId);
    // Show video player
  };

  return (
    <BaseNode
      {...props}
      data={{
        ...data,
        inputs: [
          { id: 'image', label: 'Source Image', type: 'image' },
          { id: 'motion', label: 'Motion Prompt', type: 'text' },
          { id: 'character', label: 'Character', type: 'character' }
        ],
        outputs: [
          { id: 'video', label: 'Generated Video', type: 'video' },
          { id: 'frames', label: 'Key Frames', type: 'image[]' }
        ]
      }}
      icon={Video}
      color="hsl(var(--secondary))"
      onExecute={handleExecute}
      onSettings={handleSettings}
      onPreview={handlePreview}
    />
  );
});

VideoGenerationNode.displayName = 'VideoGenerationNode';