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

// Import preview images
import characterSarahPreview from '@/assets/previews/character-sarah.jpg';
import characterNeoPreview from '@/assets/previews/character-neo.jpg';
import locationCityPreview from '@/assets/previews/location-city.jpg';
import locationWarehousePreview from '@/assets/previews/location-warehouse.jpg';

// Import components
import { NodeInspector } from './node-inspector';
import { TimelineNode } from './timeline-node';
import { CharacterNode } from './nodes/character-node';
import { ImageGenerationNode } from './nodes/image-generation-node';
import { VideoGenerationNode } from './nodes/video-generation-node';
import { AudioGenerationNode } from './nodes/audio-generation-node';

const nodeTypes = {
  character: CharacterNode,
  imageGeneration: ImageGenerationNode,
  videoGeneration: VideoGenerationNode,
  audioGeneration: AudioGenerationNode,
  timeline: TimelineNode,
};

// ENHANCED PRODUCTION PIPELINE WITH HORIZONTAL TIMELINE
const initialNodes: Node[] = [
  // ========== CHARACTER NODES TOP ROW ==========
  {
    id: 'char-sarah',
    type: 'character',
    position: { x: 100, y: 50 },
    data: { 
      label: 'Sarah Chen',
      type: 'character',
      status: 'completed',
      preview: characterSarahPreview,
      consistency: 92,
      character: {
        name: 'Sarah Chen',
        visualDNA: { style: 'photorealistic', lighting: 'natural' },
        personality: { traits: ['determined', 'analytical'] },
        voiceProfile: 'aria',
        consistency: 92
      }
    },
  },
  
  {
    id: 'char-neo',
    type: 'character',
    position: { x: 300, y: 50 },
    data: { 
      label: 'Neo',
      type: 'character', 
      status: 'completed',
      preview: characterNeoPreview,
      consistency: 89,
      character: {
        name: 'Neo',
        visualDNA: { style: 'cinematic', lighting: 'dramatic' },
        personality: { traits: ['heroic', 'mysterious'] },
        voiceProfile: 'roger',
        consistency: 89
      }
    },
  },

  {
    id: 'char-agent',
    type: 'character', 
    position: { x: 500, y: 50 },
    data: {
      label: 'Agent Smith',
      type: 'character',
      status: 'processing',
      preview: '/api/placeholder/100/100',
      consistency: 95,
    },
  },

  // ========== LOCATION NODES ==========
  {
    id: 'location-city',
    type: 'imageGeneration',
    position: { x: 100, y: 200 },
    data: {
      label: 'Cyberpunk City',
      type: 'location',
      status: 'completed',
      preview: locationCityPreview,
      model: 'flux-dev',
      prompt: 'Futuristic cyberpunk cityscape with neon lights',
      width: 1920,
      height: 1080,
    },
  },

  {
    id: 'location-warehouse', 
    type: 'imageGeneration',
    position: { x: 300, y: 200 },
    data: {
      label: 'Industrial Warehouse',
      type: 'location',
      status: 'completed', 
      preview: locationWarehousePreview,
      model: 'flux-dev',
      prompt: 'Dark industrial warehouse interior',
      width: 1920,
      height: 1080,
    },
  },

  {
    id: 'location-office',
    type: 'imageGeneration',
    position: { x: 500, y: 200 },
    data: {
      label: 'Corporate Office',
      type: 'location',
      status: 'idle',
      preview: '/api/placeholder/150/100',
    },
  },

  // ========== SCENE COMPOSITION NODES ==========
  {
    id: 'scene-opening',
    type: 'videoGeneration', 
    position: { x: 150, y: 350 },
    data: {
      label: 'Opening Scene',
      type: 'scene',
      status: 'completed',
      preview: '/api/placeholder/150/100',
      duration: 30,
      sceneNumber: 1,
    },
  },

  {
    id: 'scene-chase',
    type: 'videoGeneration',
    position: { x: 350, y: 350 },
    data: {
      label: 'Chase Scene', 
      type: 'scene',
      status: 'processing',
      progress: 45,
      duration: 60,
      sceneNumber: 2,
    },
  },

  {
    id: 'scene-confrontation',
    type: 'videoGeneration',
    position: { x: 550, y: 350 },
    data: {
      label: 'Final Confrontation',
      type: 'scene', 
      status: 'idle',
      duration: 90,
      sceneNumber: 3,
    },
  },

  {
    id: 'scene-resolution',
    type: 'videoGeneration',
    position: { x: 750, y: 350 },
    data: {
      label: 'Resolution',
      type: 'scene',
      status: 'idle', 
      duration: 45,
      sceneNumber: 4,
    },
  },

  // ========== AUDIO NODES ==========
  {
    id: 'audio-dialogue',
    type: 'audioGeneration',
    position: { x: 100, y: 500 },
    data: {
      label: 'Dialogue Track',
      type: 'audio',
      status: 'completed',
      preview: 'Character voices and dialogue',
    },
  },

  {
    id: 'audio-music',
    type: 'audioGeneration', 
    position: { x: 300, y: 500 },
    data: {
      label: 'Musical Score',
      type: 'audio',
      status: 'processing',
      progress: 70,
    },
  },

  {
    id: 'audio-sfx',
    type: 'audioGeneration',
    position: { x: 500, y: 500 },
    data: {
      label: 'Sound Effects',
      type: 'audio', 
      status: 'idle',
    },
  },

  // ========== MASTER TIMELINE (HORIZONTAL BAR) ==========
  {
    id: 'master-timeline',
    type: 'timeline',
    position: { x: 100, y: 650 },
    data: {
      label: 'Master Film Timeline',
      type: 'timeline',
      scenes: [
        { id: 'scene-1', name: 'Opening', duration: 30, status: 'completed', thumbnail: '/api/placeholder/60/40' },
        { id: 'scene-2', name: 'Chase', duration: 60, status: 'processing' },
        { id: 'scene-3', name: 'Confrontation', duration: 90, status: 'pending' },
        { id: 'scene-4', name: 'Resolution', duration: 45, status: 'pending' },
      ],
      totalDuration: 225,
      progress: 35,
      isExporting: false,
    },
  },
];

const initialEdges: Edge[] = [
  // Characters to scenes
  { id: 'sarah-to-opening', source: 'char-sarah', target: 'scene-opening', animated: true },
  { id: 'neo-to-chase', source: 'char-neo', target: 'scene-chase', animated: true },
  { id: 'agent-to-confrontation', source: 'char-agent', target: 'scene-confrontation' },
  
  // Locations to scenes
  { id: 'city-to-opening', source: 'location-city', target: 'scene-opening' },
  { id: 'warehouse-to-chase', source: 'location-warehouse', target: 'scene-chase' },
  { id: 'office-to-confrontation', source: 'location-office', target: 'scene-confrontation' },
  
  // Scenes to timeline
  { id: 'opening-to-timeline', source: 'scene-opening', target: 'master-timeline', 
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 4 } },
  { id: 'chase-to-timeline', source: 'scene-chase', target: 'master-timeline',
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 4 } },
  { id: 'confrontation-to-timeline', source: 'scene-confrontation', target: 'master-timeline',
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 4 } },
  { id: 'resolution-to-timeline', source: 'scene-resolution', target: 'master-timeline',
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 4 } },
    
  // Audio to timeline
  { id: 'dialogue-to-timeline', source: 'audio-dialogue', target: 'master-timeline',
    style: { stroke: 'hsl(var(--secondary))', strokeWidth: 2 } },
  { id: 'music-to-timeline', source: 'audio-music', target: 'master-timeline',
    style: { stroke: 'hsl(var(--secondary))', strokeWidth: 2 } },
  { id: 'sfx-to-timeline', source: 'audio-sfx', target: 'master-timeline',
    style: { stroke: 'hsl(var(--secondary))', strokeWidth: 2 } },
];

interface NodeGraphProps {
  isZenMode: boolean;
}

export function NodeGraphEnhanced({ isZenMode }: NodeGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.stopPropagation();
    setSelectedNode(node);
    setInspectorOpen(true);
  }, []);

  return (
    <div className="flex-1 bg-background relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.1,
          includeHiddenNodes: false,
          minZoom: 0.1,
          maxZoom: 1.5,
        }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
        minZoom={0.1}
        maxZoom={2}
        style={{ 
          background: 'hsl(var(--background))',
        }}
        className="director-flow w-full h-full"
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
                  case 'character':
                    return 'hsl(var(--primary))';
                  case 'imageGeneration':
                    return 'hsl(var(--accent))';
                  case 'videoGeneration':
                    return 'hsl(var(--secondary))';
                  case 'audioGeneration':
                    return 'hsl(var(--destructive))';
                  case 'timeline':
                    return 'hsl(var(--primary))';
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
              gap={25} 
              size={1.5}
              color="hsl(var(--muted-foreground) / 0.2)"
            />
          </>
        )}
      </ReactFlow>

      <NodeInspector
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        nodeData={selectedNode?.data}
        nodeType={selectedNode?.type || 'default'}
      />
    </div>
  );
}