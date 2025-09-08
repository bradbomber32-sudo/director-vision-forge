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

// MASSIVE HOLLYWOOD PRODUCTION PIPELINE - HUNDREDS OF NODES
const initialNodes: Node[] = [
  // ========== MAIN CHARACTERS (ROW 1) ==========
  { id: 'char-neo', type: 'character', position: { x: 50, y: 50 }, data: { label: 'Neo', type: 'character', status: 'completed', preview: characterNeoPreview, consistency: 95 }},
  { id: 'char-trinity', type: 'character', position: { x: 250, y: 50 }, data: { label: 'Trinity', type: 'character', status: 'completed', preview: characterSarahPreview, consistency: 92 }},
  { id: 'char-morpheus', type: 'character', position: { x: 450, y: 50 }, data: { label: 'Morpheus', type: 'character', status: 'completed', preview: characterNeoPreview, consistency: 94 }},
  { id: 'char-smith', type: 'character', position: { x: 650, y: 50 }, data: { label: 'Agent Smith', type: 'character', status: 'processing', preview: characterSarahPreview, consistency: 91 }},
  { id: 'char-oracle', type: 'character', position: { x: 850, y: 50 }, data: { label: 'The Oracle', type: 'character', status: 'completed', preview: characterNeoPreview, consistency: 88 }},
  { id: 'char-cypher', type: 'character', position: { x: 1050, y: 50 }, data: { label: 'Cypher', type: 'character', status: 'idle', preview: characterSarahPreview, consistency: 87 }},
  { id: 'char-apoc', type: 'character', position: { x: 1250, y: 50 }, data: { label: 'Apoc', type: 'character', status: 'idle', preview: characterNeoPreview, consistency: 85 }},
  { id: 'char-switch', type: 'character', position: { x: 1450, y: 50 }, data: { label: 'Switch', type: 'character', status: 'idle', preview: characterSarahPreview, consistency: 86 }},

  // ========== SECONDARY CHARACTERS (ROW 2) ==========
  { id: 'char-tank', type: 'character', position: { x: 50, y: 200 }, data: { label: 'Tank', type: 'character', status: 'idle', preview: characterNeoPreview, consistency: 84 }},
  { id: 'char-dozer', type: 'character', position: { x: 250, y: 200 }, data: { label: 'Dozer', type: 'character', status: 'idle', preview: characterSarahPreview, consistency: 83 }},
  { id: 'char-mouse', type: 'character', position: { x: 450, y: 200 }, data: { label: 'Mouse', type: 'character', status: 'idle', preview: characterNeoPreview, consistency: 82 }},
  { id: 'char-rhineheart', type: 'character', position: { x: 650, y: 200 }, data: { label: 'Mr. Rhineheart', type: 'character', status: 'idle', preview: characterSarahPreview, consistency: 80 }},

  // ========== ENVIRONMENTS - MATRIX WORLD (ROW 3) ==========
  { id: 'env-construct', type: 'imageGeneration', position: { x: 50, y: 350 }, data: { label: 'Construct', type: 'environment', status: 'completed', preview: locationCityPreview, model: 'flux-dev' }},
  { id: 'env-office', type: 'imageGeneration', position: { x: 250, y: 350 }, data: { label: 'Office Building', type: 'environment', status: 'completed', preview: locationWarehousePreview, model: 'flux-dev' }},
  { id: 'env-hotel', type: 'imageGeneration', position: { x: 450, y: 350 }, data: { label: 'Hotel Lafayette', type: 'environment', status: 'processing', preview: locationCityPreview, model: 'flux-dev' }},
  { id: 'env-subway', type: 'imageGeneration', position: { x: 650, y: 350 }, data: { label: 'Subway Station', type: 'environment', status: 'completed', preview: locationWarehousePreview, model: 'flux-dev' }},
  { id: 'env-building', type: 'imageGeneration', position: { x: 850, y: 350 }, data: { label: 'Government Building', type: 'environment', status: 'idle', preview: locationCityPreview, model: 'flux-dev' }},
  { id: 'env-street', type: 'imageGeneration', position: { x: 1050, y: 350 }, data: { label: 'City Street', type: 'environment', status: 'completed', preview: locationWarehousePreview, model: 'flux-dev' }},
  { id: 'env-apartment', type: 'imageGeneration', position: { x: 1250, y: 350 }, data: { label: 'Neo\'s Apartment', type: 'environment', status: 'idle', preview: locationCityPreview, model: 'flux-dev' }},
  { id: 'env-club', type: 'imageGeneration', position: { x: 1450, y: 350 }, data: { label: 'Nightclub', type: 'environment', status: 'idle', preview: locationWarehousePreview, model: 'flux-dev' }},

  // ========== ENVIRONMENTS - REAL WORLD (ROW 4) ==========
  { id: 'env-nebuchadnezzar', type: 'imageGeneration', position: { x: 50, y: 500 }, data: { label: 'Nebuchadnezzar Ship', type: 'environment', status: 'completed', preview: locationWarehousePreview, model: 'flux-dev' }},
  { id: 'env-zion', type: 'imageGeneration', position: { x: 250, y: 500 }, data: { label: 'Zion City', type: 'environment', status: 'processing', preview: locationCityPreview, model: 'flux-dev' }},
  { id: 'env-fields', type: 'imageGeneration', position: { x: 450, y: 500 }, data: { label: 'Pod Fields', type: 'environment', status: 'idle', preview: locationWarehousePreview, model: 'flux-dev' }},
  { id: 'env-machine-city', type: 'imageGeneration', position: { x: 650, y: 500 }, data: { label: 'Machine City', type: 'environment', status: 'idle', preview: locationCityPreview, model: 'flux-dev' }},

  // ========== ACT 1 SCENES (ROW 5) ==========
  { id: 'scene-01-wake', type: 'videoGeneration', position: { x: 50, y: 650 }, data: { label: 'S01: Neo Wakes', type: 'scene', status: 'completed', duration: 120, sceneNumber: 1, preview: locationWarehousePreview }},
  { id: 'scene-02-office', type: 'videoGeneration', position: { x: 250, y: 650 }, data: { label: 'S02: Office Job', type: 'scene', status: 'completed', duration: 180, sceneNumber: 2, preview: locationCityPreview }},
  { id: 'scene-03-search', type: 'videoGeneration', position: { x: 450, y: 650 }, data: { label: 'S03: Searching', type: 'scene', status: 'processing', duration: 90, sceneNumber: 3, preview: locationWarehousePreview }},
  { id: 'scene-04-club', type: 'videoGeneration', position: { x: 650, y: 650 }, data: { label: 'S04: Nightclub Meet', type: 'scene', status: 'idle', duration: 240, sceneNumber: 4, preview: locationCityPreview }},
  { id: 'scene-05-bug', type: 'videoGeneration', position: { x: 850, y: 650 }, data: { label: 'S05: The Bug', type: 'scene', status: 'idle', duration: 150, sceneNumber: 5, preview: locationWarehousePreview }},
  { id: 'scene-06-pills', type: 'videoGeneration', position: { x: 1050, y: 650 }, data: { label: 'S06: Red/Blue Pills', type: 'scene', status: 'idle', duration: 300, sceneNumber: 6, preview: locationCityPreview }},
  { id: 'scene-07-real', type: 'videoGeneration', position: { x: 1250, y: 650 }, data: { label: 'S07: Real World', type: 'scene', status: 'idle', duration: 360, sceneNumber: 7, preview: locationWarehousePreview }},
  { id: 'scene-08-construct', type: 'videoGeneration', position: { x: 1450, y: 650 }, data: { label: 'S08: Construct', type: 'scene', status: 'idle', duration: 420, sceneNumber: 8, preview: locationCityPreview }},

  // ========== ACT 2 SCENES (ROW 6) ==========
  { id: 'scene-09-training', type: 'videoGeneration', position: { x: 50, y: 800 }, data: { label: 'S09: Training', type: 'scene', status: 'idle', duration: 480, sceneNumber: 9, preview: locationWarehousePreview }},
  { id: 'scene-10-oracle', type: 'videoGeneration', position: { x: 250, y: 800 }, data: { label: 'S10: Oracle Visit', type: 'scene', status: 'idle', duration: 300, sceneNumber: 10, preview: locationCityPreview }},
  { id: 'scene-11-betrayal', type: 'videoGeneration', position: { x: 450, y: 800 }, data: { label: 'S11: Cypher Betrayal', type: 'scene', status: 'idle', duration: 240, sceneNumber: 11, preview: locationWarehousePreview }},
  { id: 'scene-12-rescue', type: 'videoGeneration', position: { x: 650, y: 800 }, data: { label: 'S12: Morpheus Rescue', type: 'scene', status: 'idle', duration: 600, sceneNumber: 12, preview: locationCityPreview }},
  { id: 'scene-13-lobby', type: 'videoGeneration', position: { x: 850, y: 800 }, data: { label: 'S13: Lobby Shootout', type: 'scene', status: 'idle', duration: 360, sceneNumber: 13, preview: locationWarehousePreview }},
  { id: 'scene-14-helicopter', type: 'videoGeneration', position: { x: 1050, y: 800 }, data: { label: 'S14: Helicopter', type: 'scene', status: 'idle', duration: 180, sceneNumber: 14, preview: locationCityPreview }},
  { id: 'scene-15-rooftop', type: 'videoGeneration', position: { x: 1250, y: 800 }, data: { label: 'S15: Rooftop Jump', type: 'scene', status: 'idle', duration: 120, sceneNumber: 15, preview: locationWarehousePreview }},

  // ========== ACT 3 SCENES (ROW 7) ==========
  { id: 'scene-16-subway', type: 'videoGeneration', position: { x: 50, y: 950 }, data: { label: 'S16: Subway Fight', type: 'scene', status: 'idle', duration: 480, sceneNumber: 16, preview: locationCityPreview }},
  { id: 'scene-17-phone', type: 'videoGeneration', position: { x: 250, y: 950 }, data: { label: 'S17: Phone Booth', type: 'scene', status: 'idle', duration: 90, sceneNumber: 17, preview: locationWarehousePreview }},
  { id: 'scene-18-apartment', type: 'videoGeneration', position: { x: 450, y: 950 }, data: { label: 'S18: Apartment', type: 'scene', status: 'idle', duration: 180, sceneNumber: 18, preview: locationCityPreview }},
  { id: 'scene-19-resurrection', type: 'videoGeneration', position: { x: 650, y: 950 }, data: { label: 'S19: Resurrection', type: 'scene', status: 'idle', duration: 240, sceneNumber: 19, preview: locationWarehousePreview }},
  { id: 'scene-20-the-one', type: 'videoGeneration', position: { x: 850, y: 950 }, data: { label: 'S20: The One', type: 'scene', status: 'idle', duration: 300, sceneNumber: 20, preview: locationCityPreview }},

  // ========== VISUAL EFFECTS NODES (ROW 8) ==========
  { id: 'vfx-bullet-time', type: 'imageGeneration', position: { x: 50, y: 1100 }, data: { label: 'Bullet Time VFX', type: 'vfx', status: 'processing', preview: locationWarehousePreview, model: 'flux-dev' }},
  { id: 'vfx-digital-rain', type: 'imageGeneration', position: { x: 250, y: 1100 }, data: { label: 'Digital Rain', type: 'vfx', status: 'completed', preview: locationCityPreview, model: 'flux-dev' }},
  { id: 'vfx-mirrors', type: 'imageGeneration', position: { x: 450, y: 1100 }, data: { label: 'Mirror Morphing', type: 'vfx', status: 'idle', preview: locationWarehousePreview, model: 'flux-dev' }},
  { id: 'vfx-agents', type: 'imageGeneration', position: { x: 650, y: 1100 }, data: { label: 'Agent Morphing', type: 'vfx', status: 'idle', preview: locationCityPreview, model: 'flux-dev' }},
  { id: 'vfx-constructs', type: 'imageGeneration', position: { x: 850, y: 1100 }, data: { label: 'Construct Loading', type: 'vfx', status: 'idle', preview: locationWarehousePreview, model: 'flux-dev' }},
  { id: 'vfx-explosions', type: 'imageGeneration', position: { x: 1050, y: 1100 }, data: { label: 'Building Explosions', type: 'vfx', status: 'idle', preview: locationCityPreview, model: 'flux-dev' }},

  // ========== TRANSITIONS (ROW 9) ==========
  { id: 'transition-fade', type: 'videoGeneration', position: { x: 50, y: 1250 }, data: { label: 'Fade Transition', type: 'transition', status: 'completed', duration: 2, preview: locationWarehousePreview }},
  { id: 'transition-cut', type: 'videoGeneration', position: { x: 250, y: 1250 }, data: { label: 'Hard Cut', type: 'transition', status: 'completed', duration: 0, preview: locationCityPreview }},
  { id: 'transition-dissolve', type: 'videoGeneration', position: { x: 450, y: 1250 }, data: { label: 'Dissolve', type: 'transition', status: 'idle', duration: 3, preview: locationWarehousePreview }},
  { id: 'transition-wipe', type: 'videoGeneration', position: { x: 650, y: 1250 }, data: { label: 'Wipe Effect', type: 'transition', status: 'idle', duration: 2, preview: locationCityPreview }},
  { id: 'transition-morph', type: 'videoGeneration', position: { x: 850, y: 1250 }, data: { label: 'Matrix Morph', type: 'transition', status: 'idle', duration: 4, preview: locationWarehousePreview }},

  // ========== AUDIO TRACKS (ROW 10) ==========
  { id: 'audio-main-theme', type: 'audioGeneration', position: { x: 50, y: 1400 }, data: { label: 'Main Theme', type: 'audio', status: 'completed', preview: 'Orchestral main theme' }},
  { id: 'audio-action-music', type: 'audioGeneration', position: { x: 250, y: 1400 }, data: { label: 'Action Sequences', type: 'audio', status: 'processing', preview: 'High-energy action music' }},
  { id: 'audio-ambient', type: 'audioGeneration', position: { x: 450, y: 1400 }, data: { label: 'Ambient Sounds', type: 'audio', status: 'idle', preview: 'Environmental ambience' }},
  { id: 'audio-dialogue', type: 'audioGeneration', position: { x: 650, y: 1400 }, data: { label: 'Dialogue ADR', type: 'audio', status: 'completed', preview: 'Character dialogue' }},
  { id: 'audio-sfx', type: 'audioGeneration', position: { x: 850, y: 1400 }, data: { label: 'Sound Effects', type: 'audio', status: 'processing', preview: 'Foley and SFX' }},
  { id: 'audio-matrix-sounds', type: 'audioGeneration', position: { x: 1050, y: 1400 }, data: { label: 'Matrix Sounds', type: 'audio', status: 'idle', preview: 'Digital effects audio' }},

  // ========== COLOR GRADING (ROW 11) ==========
  { id: 'color-matrix-green', type: 'imageGeneration', position: { x: 50, y: 1550 }, data: { label: 'Matrix Green Tint', type: 'color', status: 'completed', preview: locationCityPreview, model: 'flux-dev' }},
  { id: 'color-real-blue', type: 'imageGeneration', position: { x: 250, y: 1550 }, data: { label: 'Real World Blue', type: 'color', status: 'completed', preview: locationWarehousePreview, model: 'flux-dev' }},
  { id: 'color-sepia', type: 'imageGeneration', position: { x: 450, y: 1550 }, data: { label: 'Sepia Construct', type: 'color', status: 'idle', preview: locationCityPreview, model: 'flux-dev' }},
  { id: 'color-desaturated', type: 'imageGeneration', position: { x: 650, y: 1550 }, data: { label: 'Desaturated Office', type: 'color', status: 'idle', preview: locationWarehousePreview, model: 'flux-dev' }},

  // ========== MASTER TIMELINE (HORIZONTAL BAR AT BOTTOM) ==========
  {
    id: 'master-timeline',
    type: 'timeline',
    position: { x: 50, y: 1700 },
    data: {
      label: 'The Matrix - Master Timeline',
      type: 'timeline',
      scenes: [
        { id: 'act1', name: 'Act 1: Discovery', duration: 2700, status: 'completed', thumbnail: locationCityPreview },
        { id: 'act2', name: 'Act 2: Training & Rescue', duration: 3600, status: 'processing', thumbnail: locationWarehousePreview },
        { id: 'act3', name: 'Act 3: The One', duration: 1800, status: 'pending', thumbnail: locationCityPreview },
      ],
      totalDuration: 8100, // 135 minutes
      progress: 45,
      isExporting: false,
    },
  },
];

const initialEdges: Edge[] = [
  // ========== CHARACTERS TO SCENES ==========
  // Main characters to Act 1 scenes
  { id: 'neo-to-scene-01', source: 'char-neo', target: 'scene-01-wake', animated: true },
  { id: 'neo-to-scene-02', source: 'char-neo', target: 'scene-02-office', animated: true },
  { id: 'trinity-to-scene-04', source: 'char-trinity', target: 'scene-04-club', animated: true },
  { id: 'morpheus-to-scene-06', source: 'char-morpheus', target: 'scene-06-pills', animated: true },
  
  // Characters to Act 2 scenes
  { id: 'neo-to-scene-09', source: 'char-neo', target: 'scene-09-training', animated: true },
  { id: 'oracle-to-scene-10', source: 'char-oracle', target: 'scene-10-oracle', animated: true },
  { id: 'cypher-to-scene-11', source: 'char-cypher', target: 'scene-11-betrayal', animated: true },
  { id: 'trinity-to-scene-12', source: 'char-trinity', target: 'scene-12-rescue', animated: true },
  { id: 'neo-to-scene-13', source: 'char-neo', target: 'scene-13-lobby', animated: true },
  
  // Characters to Act 3 scenes
  { id: 'smith-to-scene-16', source: 'char-smith', target: 'scene-16-subway', animated: true },
  { id: 'neo-to-scene-19', source: 'char-neo', target: 'scene-19-resurrection', animated: true },
  
  // ========== ENVIRONMENTS TO SCENES ==========
  // Matrix environments to scenes
  { id: 'office-to-scene-02', source: 'env-office', target: 'scene-02-office' },
  { id: 'club-to-scene-04', source: 'env-club', target: 'scene-04-club' },
  { id: 'construct-to-scene-08', source: 'env-construct', target: 'scene-08-construct' },
  { id: 'building-to-scene-13', source: 'env-building', target: 'scene-13-lobby' },
  { id: 'subway-to-scene-16', source: 'env-subway', target: 'scene-16-subway' },
  
  // Real world environments to scenes
  { id: 'nebuchadnezzar-to-scene-07', source: 'env-nebuchadnezzar', target: 'scene-07-real' },
  { id: 'construct-to-scene-09', source: 'env-construct', target: 'scene-09-training' },
  
  // ========== VFX TO SCENES ==========
  { id: 'bullet-time-to-scene-15', source: 'vfx-bullet-time', target: 'scene-15-rooftop' },
  { id: 'digital-rain-to-scene-08', source: 'vfx-digital-rain', target: 'scene-08-construct' },
  { id: 'agent-morph-to-scene-16', source: 'vfx-agents', target: 'scene-16-subway' },
  
  // ========== TRANSITIONS BETWEEN SCENES ==========
  { id: 'fade-scene-01-02', source: 'transition-fade', target: 'scene-02-office' },
  { id: 'cut-scene-12-13', source: 'transition-cut', target: 'scene-13-lobby' },
  { id: 'morph-scene-19-20', source: 'transition-morph', target: 'scene-20-the-one' },
  
  // ========== COLOR GRADING TO SCENES ==========
  { id: 'matrix-green-to-scenes', source: 'color-matrix-green', target: 'scene-04-club' },
  { id: 'real-blue-to-scenes', source: 'color-real-blue', target: 'scene-07-real' },
  { id: 'sepia-to-construct', source: 'color-sepia', target: 'scene-08-construct' },
  
  // ========== ALL SCENES TO MASTER TIMELINE ==========
  // Act 1 scenes to timeline
  { id: 'scene-01-to-timeline', source: 'scene-01-wake', target: 'master-timeline', style: { stroke: '#ffd700', strokeWidth: 3 } },
  { id: 'scene-02-to-timeline', source: 'scene-02-office', target: 'master-timeline', style: { stroke: '#ffd700', strokeWidth: 3 } },
  { id: 'scene-03-to-timeline', source: 'scene-03-search', target: 'master-timeline', style: { stroke: '#ffd700', strokeWidth: 3 } },
  { id: 'scene-04-to-timeline', source: 'scene-04-club', target: 'master-timeline', style: { stroke: '#ffd700', strokeWidth: 3 } },
  { id: 'scene-05-to-timeline', source: 'scene-05-bug', target: 'master-timeline', style: { stroke: '#ffd700', strokeWidth: 3 } },
  { id: 'scene-06-to-timeline', source: 'scene-06-pills', target: 'master-timeline', style: { stroke: '#ffd700', strokeWidth: 3 } },
  { id: 'scene-07-to-timeline', source: 'scene-07-real', target: 'master-timeline', style: { stroke: '#ffd700', strokeWidth: 3 } },
  { id: 'scene-08-to-timeline', source: 'scene-08-construct', target: 'master-timeline', style: { stroke: '#ffd700', strokeWidth: 3 } },
  
  // Act 2 scenes to timeline
  { id: 'scene-09-to-timeline', source: 'scene-09-training', target: 'master-timeline', style: { stroke: '#ffd700', strokeWidth: 3 } },
  { id: 'scene-10-to-timeline', source: 'scene-10-oracle', target: 'master-timeline', style: { stroke: '#ffd700', strokeWidth: 3 } },
  { id: 'scene-11-to-timeline', source: 'scene-11-betrayal', target: 'master-timeline', style: { stroke: '#ffd700', strokeWidth: 3 } },
  { id: 'scene-12-to-timeline', source: 'scene-12-rescue', target: 'master-timeline', style: { stroke: '#ffd700', strokeWidth: 3 } },
  { id: 'scene-13-to-timeline', source: 'scene-13-lobby', target: 'master-timeline', style: { stroke: '#ffd700', strokeWidth: 3 } },
  { id: 'scene-14-to-timeline', source: 'scene-14-helicopter', target: 'master-timeline', style: { stroke: '#ffd700', strokeWidth: 3 } },
  { id: 'scene-15-to-timeline', source: 'scene-15-rooftop', target: 'master-timeline', style: { stroke: '#ffd700', strokeWidth: 3 } },
  
  // Act 3 scenes to timeline
  { id: 'scene-16-to-timeline', source: 'scene-16-subway', target: 'master-timeline', style: { stroke: '#ffd700', strokeWidth: 3 } },
  { id: 'scene-17-to-timeline', source: 'scene-17-phone', target: 'master-timeline', style: { stroke: '#ffd700', strokeWidth: 3 } },
  { id: 'scene-18-to-timeline', source: 'scene-18-apartment', target: 'master-timeline', style: { stroke: '#ffd700', strokeWidth: 3 } },
  { id: 'scene-19-to-timeline', source: 'scene-19-resurrection', target: 'master-timeline', style: { stroke: '#ffd700', strokeWidth: 3 } },
  { id: 'scene-20-to-timeline', source: 'scene-20-the-one', target: 'master-timeline', style: { stroke: '#ffd700', strokeWidth: 3 } },
  
  // ========== AUDIO TO TIMELINE ==========
  { id: 'main-theme-to-timeline', source: 'audio-main-theme', target: 'master-timeline', style: { stroke: '#60a5fa', strokeWidth: 2 } },
  { id: 'action-music-to-timeline', source: 'audio-action-music', target: 'master-timeline', style: { stroke: '#60a5fa', strokeWidth: 2 } },
  { id: 'ambient-to-timeline', source: 'audio-ambient', target: 'master-timeline', style: { stroke: '#60a5fa', strokeWidth: 2 } },
  { id: 'dialogue-to-timeline', source: 'audio-dialogue', target: 'master-timeline', style: { stroke: '#60a5fa', strokeWidth: 2 } },
  { id: 'sfx-to-timeline', source: 'audio-sfx', target: 'master-timeline', style: { stroke: '#60a5fa', strokeWidth: 2 } },
  { id: 'matrix-sounds-to-timeline', source: 'audio-matrix-sounds', target: 'master-timeline', style: { stroke: '#60a5fa', strokeWidth: 2 } },
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
          background: 'radial-gradient(circle at 50% 50%, hsl(220 15% 12%) 0%, hsl(220 15% 8%) 100%)',
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
              gap={30} 
              size={2}
              color="hsl(var(--primary) / 0.1)"
              style={{
                background: `
                  radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.05) 0%, transparent 50%),
                  radial-gradient(circle at 75% 75%, hsl(var(--accent) / 0.05) 0%, transparent 50%),
                  linear-gradient(45deg, hsl(220 15% 8%) 0%, hsl(220 15% 12%) 100%)
                `
              }}
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