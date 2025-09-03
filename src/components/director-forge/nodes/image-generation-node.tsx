import { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { BaseNode, BaseNodeData } from './base-node';
import { Image } from 'lucide-react';

interface ImageGenerationNodeData extends BaseNodeData {
  model: string;
  prompt: string;
  negativePrompt?: string;
  width: number;
  height: number;
  steps: number;
  guidance: number;
  seed?: number;
}

interface ImageGenerationNodeProps extends NodeProps {
  data: ImageGenerationNodeData;
}

export const ImageGenerationNode = memo(({ data, ...props }: ImageGenerationNodeProps) => {
  const handleExecute = (nodeId: string) => {
    console.log('Generating image:', nodeId);
    // Implement image generation logic using AI providers
  };

  const handleSettings = (nodeId: string) => {
    console.log('Opening image generation settings:', nodeId);
    // Open settings panel
  };

  const handlePreview = (nodeId: string) => {
    console.log('Previewing generated image:', nodeId);
    // Show full-size image
  };

  return (
    <BaseNode
      {...props}
      data={{
        ...data,
        inputs: [
          { id: 'prompt', label: 'Text Prompt', type: 'text' },
          { id: 'character', label: 'Character', type: 'character' },
          { id: 'style', label: 'Style Reference', type: 'image' }
        ],
        outputs: [
          { id: 'image', label: 'Generated Image', type: 'image' },
          { id: 'metadata', label: 'Generation Data', type: 'metadata' }
        ]
      }}
      icon={Image}
      color="hsl(var(--accent))"
      onExecute={handleExecute}
      onSettings={handleSettings}
      onPreview={handlePreview}
    />
  );
});

ImageGenerationNode.displayName = 'ImageGenerationNode';