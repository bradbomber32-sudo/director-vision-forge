import { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { BaseNode, BaseNodeData } from './base-node';
import { User } from 'lucide-react';

interface CharacterNodeData extends BaseNodeData {
  character: {
    name: string;
    visualDNA: Record<string, any>;
    personality: Record<string, any>;
    voiceProfile?: string;
    consistency: number;
  };
}

interface CharacterNodeProps extends NodeProps {
  data: CharacterNodeData;
}

export const CharacterNode = memo(({ data, ...props }: CharacterNodeProps) => {
  const handleExecute = (nodeId: string) => {
    console.log('Generating character:', nodeId);
    // Implement character generation logic
  };

  const handleSettings = (nodeId: string) => {
    console.log('Opening character settings:', nodeId);
    // Open character editor
  };

  const handlePreview = (nodeId: string) => {
    console.log('Previewing character:', nodeId);
    // Show character preview
  };

  return (
    <BaseNode
      {...props}
      data={{
        ...data,
        inputs: [
          { id: 'prompt', label: 'Character Prompt', type: 'text' },
          { id: 'reference', label: 'Reference Image', type: 'image' }
        ],
        outputs: [
          { id: 'character', label: 'Character', type: 'character' },
          { id: 'images', label: 'Generated Images', type: 'image[]' }
        ]
      }}
      icon={User}
      color="hsl(var(--primary))"
      onExecute={handleExecute}
      onSettings={handleSettings}
      onPreview={handlePreview}
    />
  );
});

CharacterNode.displayName = 'CharacterNode';