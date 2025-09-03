import { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { BaseNode, BaseNodeData } from './base-node';
import { Mic } from 'lucide-react';

interface AudioGenerationNodeData extends BaseNodeData {
  type: 'speech' | 'music' | 'sfx' | 'ambient';
  voiceId?: string;
  text?: string;
  prompt?: string;
  duration?: number;
  style?: string;
}

interface AudioGenerationNodeProps extends NodeProps {
  data: AudioGenerationNodeData;
}

export const AudioGenerationNode = memo(({ data, ...props }: AudioGenerationNodeProps) => {
  const handleExecute = (nodeId: string) => {
    console.log('Generating audio:', nodeId);
    // Implement audio generation logic
  };

  const handleSettings = (nodeId: string) => {
    console.log('Opening audio generation settings:', nodeId);
    // Open settings panel
  };

  const handlePreview = (nodeId: string) => {
    console.log('Previewing generated audio:', nodeId);
    // Show audio player
  };

  return (
    <BaseNode
      {...props}
      data={{
        ...data,
        inputs: [
          { id: 'text', label: 'Script Text', type: 'text' },
          { id: 'character', label: 'Character Voice', type: 'character' },
          { id: 'style', label: 'Audio Style', type: 'text' }
        ],
        outputs: [
          { id: 'audio', label: 'Generated Audio', type: 'audio' },
          { id: 'waveform', label: 'Waveform Data', type: 'data' }
        ]
      }}
      icon={Mic}
      color="hsl(var(--accent))"
      onExecute={handleExecute}
      onSettings={handleSettings}
      onPreview={handlePreview}
    />
  );
});

AudioGenerationNode.displayName = 'AudioGenerationNode';