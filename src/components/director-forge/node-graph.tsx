import { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Custom node types
const initialNodes: Node[] = [
  // Character Node
  {
    id: 'char-1',
    position: { x: 50, y: 50 },
    data: { 
      label: 'Sarah Chen',
      type: 'character',
      status: 'completed',
      preview: '/api/placeholder/80/80',
      character: {
        name: 'Sarah Chen',
        age: '28',
        role: 'Lead Detective',
        personality: 'Determined, analytical, empathetic'
      }
    },
    style: {
      background: 'hsl(var(--primary) / 0.1)',
      border: '2px solid hsl(var(--primary) / 0.4)',
      borderRadius: '16px',
      color: 'hsl(var(--foreground))',
      fontSize: '14px',
      fontWeight: '500',
      minWidth: '200px',
    },
  },
  
  // Background Image Node
  {
    id: 'img-bg-1',
    position: { x: 50, y: 250 },
    data: { 
      label: 'City Street - Night',
      type: 'image-generation',
      status: 'completed',
      preview: '/api/placeholder/120/80',
      imageType: 'background'
    },
    style: {
      background: 'hsl(var(--accent) / 0.1)',
      border: '2px solid hsl(var(--accent) / 0.4)',
      borderRadius: '16px',
      color: 'hsl(var(--foreground))',
      fontSize: '14px',
      fontWeight: '500',
      minWidth: '180px',
    },
  },

  // Prop Image Node
  {
    id: 'img-prop-1',
    position: { x: 50, y: 450 },
    data: { 
      label: 'Vintage Car',
      type: 'image-generation',
      status: 'processing',
      progress: 75,
      imageType: 'prop'
    },
    style: {
      background: 'hsl(var(--secondary) / 0.1)',
      border: '2px solid hsl(var(--secondary) / 0.4)',
      borderRadius: '16px',
      color: 'hsl(var(--foreground))',
      fontSize: '14px',
      fontWeight: '500',
      minWidth: '180px',
    },
  },

  // Scene Composition Node
  {
    id: 'img-scene-1',
    position: { x: 400, y: 250 },
    data: { 
      label: 'Detective Scene',
      type: 'image-generation',
      status: 'idle',
      imageType: 'scene-composition'
    },
    style: {
      background: 'hsl(var(--primary) / 0.15)',
      border: '2px solid hsl(var(--primary) / 0.5)',
      borderRadius: '16px',
      color: 'hsl(var(--foreground))',
      fontSize: '14px',
      fontWeight: '500',
      minWidth: '200px',
    },
  },

  // Video Generation Node
  {
    id: 'video-1',
    position: { x: 750, y: 250 },
    data: { 
      label: 'Scene Animation',
      type: 'video-generation',
      status: 'idle'
    },
    style: {
      background: 'hsl(var(--accent) / 0.15)',
      border: '2px solid hsl(var(--accent) / 0.5)',
      borderRadius: '16px',
      color: 'hsl(var(--foreground))',
      fontSize: '14px',
      fontWeight: '500',
      minWidth: '200px',
    },
  },

  // Audio Node
  {
    id: 'audio-1',
    position: { x: 750, y: 450 },
    data: { 
      label: 'Dialogue & Score',
      type: 'audio-generation',
      status: 'idle'
    },
    style: {
      background: 'hsl(var(--secondary) / 0.15)',
      border: '2px solid hsl(var(--secondary) / 0.5)',
      borderRadius: '16px',
      color: 'hsl(var(--foreground))',
      fontSize: '14px',
      fontWeight: '500',
      minWidth: '200px',
    },
  },

  // Final Cut Node
  {
    id: 'final-cut-1',
    position: { x: 1100, y: 350 },
    data: { 
      label: 'Final Cut',
      type: 'final-export',
      status: 'idle'
    },
    style: {
      background: 'linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.2))',
      border: '3px solid hsl(var(--primary))',
      borderRadius: '20px',
      color: 'hsl(var(--foreground))',
      fontSize: '16px',
      fontWeight: '600',
      minWidth: '220px',
      boxShadow: '0 0 30px hsl(var(--primary) / 0.4)',
    },
  },

  // Film Roll Timeline Node
  {
    id: 'timeline-1',
    position: { x: 1400, y: 350 },
    data: { 
      label: 'Timeline',
      type: 'timeline',
      status: 'ready'
    },
    style: {
      background: 'linear-gradient(90deg, hsl(var(--muted)) 0%, hsl(var(--accent) / 0.3) 50%, hsl(var(--muted)) 100%)',
      border: '2px solid hsl(var(--accent))',
      borderRadius: '50px',
      color: 'hsl(var(--foreground))',
      fontSize: '14px',
      fontWeight: '500',
      width: '300px',
      height: '80px',
    },
  },
];

const initialEdges: Edge[] = [
  // Character to Scene Composition
  {
    id: 'char-to-scene',
    source: 'char-1',
    target: 'img-scene-1',
    animated: true,
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 3 },
  },
  
  // Background to Scene Composition
  {
    id: 'bg-to-scene',
    source: 'img-bg-1',
    target: 'img-scene-1',
    style: { stroke: 'hsl(var(--accent))', strokeWidth: 2 },
  },
  
  // Prop to Scene Composition
  {
    id: 'prop-to-scene',
    source: 'img-prop-1',
    target: 'img-scene-1',
    style: { stroke: 'hsl(var(--secondary))', strokeWidth: 2 },
  },
  
  // Scene to Video
  {
    id: 'scene-to-video',
    source: 'img-scene-1',
    target: 'video-1',
    animated: true,
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 3 },
  },
  
  // Video to Final Cut
  {
    id: 'video-to-final',
    source: 'video-1',
    target: 'final-cut-1',
    style: { stroke: 'hsl(var(--accent))', strokeWidth: 3 },
  },
  
  // Audio to Final Cut
  {
    id: 'audio-to-final',
    source: 'audio-1',
    target: 'final-cut-1',
    style: { stroke: 'hsl(var(--secondary))', strokeWidth: 3 },
  },
  
  // Final Cut to Timeline (Film Roll)
  {
    id: 'final-to-timeline',
    source: 'final-cut-1',
    target: 'timeline-1',
    animated: true,
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 4 },
  },
];

interface NodeGraphProps {
  isZenMode: boolean;
}

export function NodeGraph({ isZenMode }: NodeGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="flex-1 bg-background relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        style={{ 
          background: 'hsl(var(--background))',
        }}
        className="director-flow"
      >
        <Controls 
          className="react-flow__controls"
          style={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '12px',
          }}
        />
        
        {!isZenMode && (
          <>
            <MiniMap 
              nodeColor={(node) => {
                switch (node.type) {
                  case 'input':
                    return 'hsl(var(--primary))';
                  case 'output':
                    return 'hsl(var(--accent))';
                  default:
                    return 'hsl(var(--muted))';
                }
              }}
              nodeStrokeWidth={3}
              pannable
              zoomable
              style={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
              }}
            />
            
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={20} 
              size={1}
              color="hsl(var(--muted-foreground) / 0.3)"
            />
          </>
        )}
      </ReactFlow>

      {/* Floating AI Suggestions */}
      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-xl border border-border rounded-xl p-4 w-80 shadow-deep">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          AI Suggestions
        </h3>
        <div className="space-y-2 text-sm">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            💡 Add character consistency validation between nodes
          </div>
          <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
            🎭 Consider voice cloning for character dialogue
          </div>
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            🎵 Auto-sync audio beats with video cuts
          </div>
        </div>
      </div>

      {/* Node Inspector */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-xl border border-border rounded-xl p-4 w-80 shadow-deep">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full" />
          Node Inspector
        </h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Selected:</span>
              <span className="font-semibold">Detective Scene</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Type:</span>
              <span className="text-primary">Image Composition</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-accent">Ready to Generate</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">AI Models:</span>
              <span className="text-xs">SDXL, DALL-E 3</span>
            </div>
          </div>
          
          <div className="space-y-1 text-xs text-muted-foreground">
            <div>• Connected: Character + Background + Prop</div>
            <div>• Resolution: 1024x1024</div>
            <div>• Estimated Cost: $0.08</div>
          </div>
        </div>
      </div>
    </div>
  );
}