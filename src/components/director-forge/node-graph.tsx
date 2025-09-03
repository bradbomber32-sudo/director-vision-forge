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
  {
    id: '1',
    type: 'input',
    position: { x: 250, y: 25 },
    data: { label: 'Character Prompt' },
    style: {
      background: 'hsl(var(--node-bg))',
      border: '1px solid hsl(var(--node-border))',
      borderRadius: '12px',
      color: 'hsl(var(--foreground))',
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  {
    id: '2',
    position: { x: 100, y: 125 },
    data: { label: 'Image Generation' },
    style: {
      background: 'hsl(var(--primary) / 0.1)',
      border: '1px solid hsl(var(--primary) / 0.3)',
      borderRadius: '12px',
      color: 'hsl(var(--foreground))',
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  {
    id: '3',
    position: { x: 400, y: 125 },
    data: { label: 'Video Generation' },
    style: {
      background: 'hsl(var(--accent) / 0.1)',
      border: '1px solid hsl(var(--accent) / 0.3)',
      borderRadius: '12px',
      color: 'hsl(var(--foreground))',
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  {
    id: '4',
    position: { x: 250, y: 250 },
    data: { label: 'Audio Sync' },
    style: {
      background: 'linear-gradient(135deg, hsl(var(--accent) / 0.1), hsl(var(--primary) / 0.1))',
      border: '1px solid hsl(var(--primary) / 0.2)',
      borderRadius: '12px',
      color: 'hsl(var(--foreground))',
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  {
    id: '5',
    type: 'output',
    position: { x: 250, y: 375 },
    data: { label: 'Final Export' },
    style: {
      background: 'hsl(var(--primary) / 0.2)',
      border: '1px solid hsl(var(--primary))',
      borderRadius: '12px',
      color: 'hsl(var(--foreground))',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 0 20px hsl(var(--primary) / 0.3)',
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    animated: true,
    style: { stroke: 'hsl(var(--accent))', strokeWidth: 2 },
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    style: { stroke: 'hsl(var(--primary) / 0.7)', strokeWidth: 2 },
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    style: { stroke: 'hsl(var(--accent) / 0.7)', strokeWidth: 2 },
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    animated: true,
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 3 },
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
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-xl border border-border rounded-xl p-4 w-64 shadow-deep">
        <h3 className="font-semibold text-sm mb-3">Node Inspector</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Selected:</span>
            <span>Character Prompt</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <span className="text-primary">Input</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className="text-accent">Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}