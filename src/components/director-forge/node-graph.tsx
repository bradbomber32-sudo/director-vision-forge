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

// MASSIVE COMPLEX PRODUCTION PIPELINE
const initialNodes: Node[] = [
  // ========== CHARACTER NODES ==========
  {
    id: 'char-sarah',
    position: { x: 50, y: 100 },
    data: { 
      label: 'Sarah Chen - Detective',
      type: 'character',
      status: 'completed',
      preview: '/api/placeholder/100/100',
      character: {
        name: 'Sarah Chen',
        age: '28',
        role: 'Lead Detective',
        personality: 'Determined, analytical, empathetic',
        casting: 'Lucy Liu inspired',
        wardrobe: 'Dark coat, badge, holster'
      }
    },
    style: {
      background: 'hsl(var(--primary) / 0.15)',
      border: '3px solid hsl(var(--primary))',
      borderRadius: '20px',
      color: 'hsl(var(--foreground))',
      fontSize: '12px',
      fontWeight: '600',
      minWidth: '180px',
      minHeight: '120px',
    },
  },
  
  {
    id: 'char-marcus',
    position: { x: 50, y: 280 },
    data: { 
      label: 'Marcus Webb - Suspect',
      type: 'character',
      status: 'completed',
      preview: '/api/placeholder/100/100',
      character: {
        name: 'Marcus Webb',
        age: '35',
        role: 'Prime Suspect',
        personality: 'Nervous, evasive, desperate',
        casting: 'Oscar Isaac type',
        wardrobe: 'Rumpled suit, nervous energy'
      }
    },
    style: {
      background: 'hsl(var(--destructive) / 0.15)',
      border: '3px solid hsl(var(--destructive))',
      borderRadius: '20px',
      color: 'hsl(var(--foreground))',
      fontSize: '12px',
      fontWeight: '600',
      minWidth: '180px',
      minHeight: '120px',
    },
  },

  {
    id: 'char-witness',
    position: { x: 50, y: 460 },
    data: { 
      label: 'Elena Rodriguez - Witness',
      type: 'character',
      status: 'processing',
      progress: 60,
      character: {
        name: 'Elena Rodriguez',
        age: '42',
        role: 'Key Witness',
        personality: 'Cautious, observant, helpful',
        casting: 'Salma Hayek inspired',
        wardrobe: 'Business casual, worried expression'
      }
    },
    style: {
      background: 'hsl(var(--secondary) / 0.15)',
      border: '3px solid hsl(var(--secondary))',
      borderRadius: '20px',
      color: 'hsl(var(--foreground))',
      fontSize: '12px',
      fontWeight: '600',
      minWidth: '180px',
      minHeight: '120px',
    },
  },

  // ========== BACKGROUND IMAGE NODES ==========
  {
    id: 'bg-police-station',
    position: { x: 300, y: 50 },
    data: { 
      label: 'Police Station Interior',
      type: 'image-generation',
      status: 'completed',
      preview: '/api/placeholder/150/100',
      imageType: 'background',
      prompt: 'Modern police station interior, fluorescent lighting, desks, evidence boards, realistic'
    },
    style: {
      background: 'hsl(var(--accent) / 0.12)',
      border: '2px solid hsl(var(--accent))',
      borderRadius: '16px',
      color: 'hsl(var(--foreground))',
      fontSize: '12px',
      fontWeight: '500',
      minWidth: '160px',
    },
  },

  {
    id: 'bg-city-street',
    position: { x: 300, y: 180 },
    data: { 
      label: 'City Street - Night',
      type: 'image-generation',
      status: 'completed',
      preview: '/api/placeholder/150/100',
      imageType: 'background',
      prompt: 'Dark city street at night, neon lights, rain reflections, film noir atmosphere'
    },
    style: {
      background: 'hsl(var(--accent) / 0.12)',
      border: '2px solid hsl(var(--accent))',
      borderRadius: '16px',
      color: 'hsl(var(--foreground))',
      fontSize: '12px',
      fontWeight: '500',
      minWidth: '160px',
    },
  },

  {
    id: 'bg-warehouse',
    position: { x: 300, y: 310 },
    data: { 
      label: 'Abandoned Warehouse',
      type: 'image-generation',
      status: 'completed',
      preview: '/api/placeholder/150/100',
      imageType: 'background',
      prompt: 'Dark abandoned warehouse, dramatic lighting, shadows, industrial decay'
    },
    style: {
      background: 'hsl(var(--accent) / 0.12)',
      border: '2px solid hsl(var(--accent))',
      borderRadius: '16px',
      color: 'hsl(var(--foreground))',
      fontSize: '12px',
      fontWeight: '500',
      minWidth: '160px',
    },
  },

  {
    id: 'bg-apartment',
    position: { x: 300, y: 440 },
    data: { 
      label: 'Luxury Apartment',
      type: 'image-generation',
      status: 'processing',
      progress: 45,
      imageType: 'background',
      prompt: 'Modern luxury apartment, floor-to-ceiling windows, city view, elegant interior'
    },
    style: {
      background: 'hsl(var(--accent) / 0.12)',
      border: '2px solid hsl(var(--accent))',
      borderRadius: '16px',
      color: 'hsl(var(--foreground))',
      fontSize: '12px',
      fontWeight: '500',
      minWidth: '160px',
    },
  },

  {
    id: 'bg-courtroom',
    position: { x: 300, y: 570 },
    data: { 
      label: 'Courtroom',
      type: 'image-generation',
      status: 'idle',
      imageType: 'background',
      prompt: 'Traditional courtroom, judge bench, jury box, dramatic lighting, justice theme'
    },
    style: {
      background: 'hsl(var(--accent) / 0.12)',
      border: '2px solid hsl(var(--accent))',
      borderRadius: '16px',
      color: 'hsl(var(--foreground))',
      fontSize: '12px',
      fontWeight: '500',
      minWidth: '160px',
    },
  },

  // ========== PROP IMAGE NODES ==========
  {
    id: 'prop-evidence',
    position: { x: 550, y: 80 },
    data: { 
      label: 'Evidence Files',
      type: 'image-generation',
      status: 'completed',
      preview: '/api/placeholder/120/80',
      imageType: 'prop',
      prompt: 'Police evidence files, photos, documents scattered on desk'
    },
    style: {
      background: 'hsl(var(--muted) / 0.3)',
      border: '2px solid hsl(var(--muted-foreground))',
      borderRadius: '12px',
      color: 'hsl(var(--foreground))',
      fontSize: '11px',
      fontWeight: '500',
      minWidth: '140px',
    },
  },

  {
    id: 'prop-gun',
    position: { x: 550, y: 180 },
    data: { 
      label: 'Service Weapon',
      type: 'image-generation',
      status: 'completed',
      preview: '/api/placeholder/120/80',
      imageType: 'prop',
      prompt: 'Police service pistol in holster, realistic detail'
    },
    style: {
      background: 'hsl(var(--muted) / 0.3)',
      border: '2px solid hsl(var(--muted-foreground))',
      borderRadius: '12px',
      color: 'hsl(var(--foreground))',
      fontSize: '11px',
      fontWeight: '500',
      minWidth: '140px',
    },
  },

  {
    id: 'prop-car',
    position: { x: 550, y: 280 },
    data: { 
      label: 'Police Cruiser',
      type: 'image-generation',
      status: 'processing',
      progress: 75,
      imageType: 'prop',
      prompt: 'Modern police car, emergency lights, realistic details'
    },
    style: {
      background: 'hsl(var(--muted) / 0.3)',
      border: '2px solid hsl(var(--muted-foreground))',
      borderRadius: '12px',
      color: 'hsl(var(--foreground))',
      fontSize: '11px',
      fontWeight: '500',
      minWidth: '140px',
    },
  },

  {
    id: 'prop-phone',
    position: { x: 550, y: 380 },
    data: { 
      label: 'Crime Scene Photos',
      type: 'image-generation',
      status: 'completed',
      preview: '/api/placeholder/120/80',
      imageType: 'prop',
      prompt: 'Crime scene photographs spread on table, evidence markers'
    },
    style: {
      background: 'hsl(var(--muted) / 0.3)',
      border: '2px solid hsl(var(--muted-foreground))',
      borderRadius: '12px',
      color: 'hsl(var(--foreground))',
      fontSize: '11px',
      fontWeight: '500',
      minWidth: '140px',
    },
  },

  // ========== SCENE COMPOSITION NODES ==========
  {
    id: 'scene-interrogation',
    position: { x: 800, y: 120 },
    data: { 
      label: 'Interrogation Scene',
      type: 'image-generation',
      status: 'completed',
      preview: '/api/placeholder/200/150',
      imageType: 'scene-composition',
      prompt: 'Detective interrogating suspect in police station room'
    },
    style: {
      background: 'linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.15))',
      border: '3px solid hsl(var(--primary))',
      borderRadius: '20px',
      color: 'hsl(var(--foreground))',
      fontSize: '14px',
      fontWeight: '600',
      minWidth: '220px',
      minHeight: '140px',
      boxShadow: '0 8px 25px hsl(var(--primary) / 0.3)',
    },
  },

  {
    id: 'scene-chase',
    position: { x: 800, y: 300 },
    data: { 
      label: 'Street Chase Scene',
      type: 'image-generation',
      status: 'processing',
      progress: 60,
      imageType: 'scene-composition',
      prompt: 'Detective chasing suspect through dark city streets'
    },
    style: {
      background: 'linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.15))',
      border: '3px solid hsl(var(--primary))',
      borderRadius: '20px',
      color: 'hsl(var(--foreground))',
      fontSize: '14px',
      fontWeight: '600',
      minWidth: '220px',
      minHeight: '140px',
      boxShadow: '0 8px 25px hsl(var(--primary) / 0.3)',
    },
  },

  {
    id: 'scene-confrontation',
    position: { x: 800, y: 480 },
    data: { 
      label: 'Warehouse Confrontation',
      type: 'image-generation',
      status: 'idle',
      imageType: 'scene-composition',
      prompt: 'Final confrontation in abandoned warehouse, dramatic lighting'
    },
    style: {
      background: 'linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.15))',
      border: '3px solid hsl(var(--primary))',
      borderRadius: '20px',
      color: 'hsl(var(--foreground))',
      fontSize: '14px',
      fontWeight: '600',
      minWidth: '220px',
      minHeight: '140px',
      boxShadow: '0 8px 25px hsl(var(--primary) / 0.3)',
    },
  },

  {
    id: 'scene-resolution',
    position: { x: 800, y: 660 },
    data: { 
      label: 'Court Resolution',
      type: 'image-generation',
      status: 'idle',
      imageType: 'scene-composition',
      prompt: 'Courtroom scene with judge delivering verdict'
    },
    style: {
      background: 'linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.15))',
      border: '3px solid hsl(var(--primary))',
      borderRadius: '20px',
      color: 'hsl(var(--foreground))',
      fontSize: '14px',
      fontWeight: '600',
      minWidth: '220px',
      minHeight: '140px',
      boxShadow: '0 8px 25px hsl(var(--primary) / 0.3)',
    },
  },

  // ========== VIDEO GENERATION NODES ==========
  {
    id: 'video-interrogation',
    position: { x: 1100, y: 120 },
    data: { 
      label: 'Interrogation Video',
      type: 'video-generation',
      status: 'completed',
      preview: '/api/placeholder/180/120',
      duration: '45s',
      model: 'RunwayML Gen-3'
    },
    style: {
      background: 'linear-gradient(135deg, hsl(var(--accent) / 0.2), hsl(var(--primary) / 0.1))',
      border: '3px solid hsl(var(--accent))',
      borderRadius: '18px',
      color: 'hsl(var(--foreground))',
      fontSize: '13px',
      fontWeight: '600',
      minWidth: '200px',
      minHeight: '120px',
      boxShadow: '0 6px 20px hsl(var(--accent) / 0.3)',
    },
  },

  {
    id: 'video-chase',
    position: { x: 1100, y: 300 },
    data: { 
      label: 'Chase Sequence',
      type: 'video-generation',
      status: 'processing',
      progress: 30,
      duration: '2m 15s',
      model: 'Pika Labs 1.5'
    },
    style: {
      background: 'linear-gradient(135deg, hsl(var(--accent) / 0.2), hsl(var(--primary) / 0.1))',
      border: '3px solid hsl(var(--accent))',
      borderRadius: '18px',
      color: 'hsl(var(--foreground))',
      fontSize: '13px',
      fontWeight: '600',
      minWidth: '200px',
      minHeight: '120px',
      boxShadow: '0 6px 20px hsl(var(--accent) / 0.3)',
    },
  },

  {
    id: 'video-confrontation',
    position: { x: 1100, y: 480 },
    data: { 
      label: 'Final Confrontation',
      type: 'video-generation',
      status: 'idle',
      duration: '3m 30s',
      model: 'Gemini Veo-3'
    },
    style: {
      background: 'linear-gradient(135deg, hsl(var(--accent) / 0.2), hsl(var(--primary) / 0.1))',
      border: '3px solid hsl(var(--accent))',
      borderRadius: '18px',
      color: 'hsl(var(--foreground))',
      fontSize: '13px',
      fontWeight: '600',
      minWidth: '200px',
      minHeight: '120px',
      boxShadow: '0 6px 20px hsl(var(--accent) / 0.3)',
    },
  },

  {
    id: 'video-resolution',
    position: { x: 1100, y: 660 },
    data: { 
      label: 'Resolution Scene',
      type: 'video-generation',
      status: 'idle',
      duration: '1m 45s',
      model: 'Luma Dream Machine'
    },
    style: {
      background: 'linear-gradient(135deg, hsl(var(--accent) / 0.2), hsl(var(--primary) / 0.1))',
      border: '3px solid hsl(var(--accent))',
      borderRadius: '18px',
      color: 'hsl(var(--foreground))',
      fontSize: '13px',
      fontWeight: '600',
      minWidth: '200px',
      minHeight: '120px',
      boxShadow: '0 6px 20px hsl(var(--accent) / 0.3)',
    },
  },

  // ========== AUDIO GENERATION NODES ==========
  {
    id: 'audio-dialogue',
    position: { x: 1400, y: 180 },
    data: { 
      label: 'Character Dialogue',
      type: 'audio-generation',
      status: 'completed',
      preview: 'Voice cloning: Sarah, Marcus, Elena',
      model: 'ElevenLabs + MusicGen'
    },
    style: {
      background: 'linear-gradient(135deg, hsl(var(--secondary) / 0.2), hsl(var(--muted) / 0.3))',
      border: '3px solid hsl(var(--secondary))',
      borderRadius: '16px',
      color: 'hsl(var(--foreground))',
      fontSize: '12px',
      fontWeight: '600',
      minWidth: '180px',
      minHeight: '100px',
      boxShadow: '0 5px 15px hsl(var(--secondary) / 0.25)',
    },
  },

  {
    id: 'audio-score',
    position: { x: 1400, y: 320 },
    data: { 
      label: 'Cinematic Score',
      type: 'audio-generation',
      status: 'processing',
      progress: 70,
      preview: 'Tension, action, resolution themes',
      model: 'Suno AI + Udio'
    },
    style: {
      background: 'linear-gradient(135deg, hsl(var(--secondary) / 0.2), hsl(var(--muted) / 0.3))',
      border: '3px solid hsl(var(--secondary))',
      borderRadius: '16px',
      color: 'hsl(var(--foreground))',
      fontSize: '12px',
      fontWeight: '600',
      minWidth: '180px',
      minHeight: '100px',
      boxShadow: '0 5px 15px hsl(var(--secondary) / 0.25)',
    },
  },

  {
    id: 'audio-sfx',
    position: { x: 1400, y: 460 },
    data: { 
      label: 'Sound Effects',
      type: 'audio-generation',
      status: 'idle',
      preview: 'Footsteps, sirens, ambient city',
      model: 'AudioCraft + Custom'
    },
    style: {
      background: 'linear-gradient(135deg, hsl(var(--secondary) / 0.2), hsl(var(--muted) / 0.3))',
      border: '3px solid hsl(var(--secondary))',
      borderRadius: '16px',
      color: 'hsl(var(--foreground))',
      fontSize: '12px',
      fontWeight: '600',
      minWidth: '180px',
      minHeight: '100px',
      boxShadow: '0 5px 15px hsl(var(--secondary) / 0.25)',
    },
  },

  // ========== FINAL CUT NODES ==========
  {
    id: 'final-cut-episode',
    position: { x: 1700, y: 350 },
    data: { 
      label: 'Episode 1: The Investigation',
      type: 'final-export',
      status: 'processing',
      progress: 85,
      duration: '7m 45s',
      resolution: '4K HDR'
    },
    style: {
      background: 'linear-gradient(135deg, hsl(var(--primary) / 0.3), hsl(var(--accent) / 0.25), hsl(var(--secondary) / 0.2))',
      border: '4px solid hsl(var(--primary))',
      borderRadius: '24px',
      color: 'hsl(var(--foreground))',
      fontSize: '16px',
      fontWeight: '700',
      minWidth: '280px',
      minHeight: '160px',
      boxShadow: '0 12px 40px hsl(var(--primary) / 0.4), inset 0 2px 8px hsl(var(--background) / 0.1)',
    },
  },

  // ========== FILM ROLL TIMELINE ==========
  {
    id: 'timeline-filmroll',
    position: { x: 2100, y: 250 },
    data: { 
      label: '🎬 DETECTIVE SERIES - SEASON 1 🎬',
      type: 'timeline',
      status: 'active',
      episodes: 4,
      totalDuration: '32m 15s'
    },
    style: {
      background: `
        repeating-linear-gradient(
          90deg,
          hsl(var(--card)) 0px,
          hsl(var(--card)) 20px,
          hsl(var(--accent) / 0.3) 20px,
          hsl(var(--accent) / 0.3) 22px,
          hsl(var(--card)) 22px,
          hsl(var(--card)) 42px,
          hsl(var(--primary) / 0.2) 42px,
          hsl(var(--primary) / 0.2) 44px
        )
      `,
      border: '3px solid hsl(var(--primary))',
      borderRadius: '60px',
      color: 'hsl(var(--foreground))',
      fontSize: '14px',
      fontWeight: '700',
      width: '500px',
      height: '120px',
      boxShadow: `
        0 0 0 2px hsl(var(--accent) / 0.3),
        0 0 30px hsl(var(--primary) / 0.5),
        inset 0 4px 12px hsl(var(--background) / 0.2)
      `,
      position: 'relative',
      overflow: 'hidden',
    },
  },
];

const initialEdges: Edge[] = [
  // ========== CHARACTER TO SCENE CONNECTIONS ==========
  // Sarah Chen to Interrogation Scene
  {
    id: 'sarah-to-interrogation',
    source: 'char-sarah',
    target: 'scene-interrogation',
    animated: true,
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 3 },
  },
  
  // Marcus Webb to Interrogation Scene
  {
    id: 'marcus-to-interrogation',
    source: 'char-marcus',
    target: 'scene-interrogation',
    animated: true,
    style: { stroke: 'hsl(var(--destructive))', strokeWidth: 3 },
  },
  
  // Sarah Chen to Chase Scene
  {
    id: 'sarah-to-chase',
    source: 'char-sarah',
    target: 'scene-chase',
    animated: true,
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 3 },
  },
  
  // Marcus Webb to Chase Scene
  {
    id: 'marcus-to-chase',
    source: 'char-marcus',
    target: 'scene-chase',
    animated: true,
    style: { stroke: 'hsl(var(--destructive))', strokeWidth: 3 },
  },
  
  // Characters to Confrontation
  {
    id: 'chars-to-confrontation',
    source: 'char-sarah',
    target: 'scene-confrontation',
    animated: true,
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 3 },
  },
  
  // Elena to Resolution
  {
    id: 'elena-to-resolution',
    source: 'char-witness',
    target: 'scene-resolution',
    animated: true,
    style: { stroke: 'hsl(var(--secondary))', strokeWidth: 3 },
  },

  // ========== BACKGROUND TO SCENE CONNECTIONS ==========
  // Police Station to Interrogation
  {
    id: 'station-to-interrogation',
    source: 'bg-police-station',
    target: 'scene-interrogation',
    style: { stroke: 'hsl(var(--accent))', strokeWidth: 2 },
  },
  
  // City Street to Chase
  {
    id: 'street-to-chase',
    source: 'bg-city-street',
    target: 'scene-chase',
    style: { stroke: 'hsl(var(--accent))', strokeWidth: 2 },
  },
  
  // Warehouse to Confrontation
  {
    id: 'warehouse-to-confrontation',
    source: 'bg-warehouse',
    target: 'scene-confrontation',
    style: { stroke: 'hsl(var(--accent))', strokeWidth: 2 },
  },
  
  // Courtroom to Resolution
  {
    id: 'courtroom-to-resolution',
    source: 'bg-courtroom',
    target: 'scene-resolution',
    style: { stroke: 'hsl(var(--accent))', strokeWidth: 2 },
  },

  // ========== PROP TO SCENE CONNECTIONS ==========
  // Evidence to Interrogation
  {
    id: 'evidence-to-interrogation',
    source: 'prop-evidence',
    target: 'scene-interrogation',
    style: { stroke: 'hsl(var(--muted-foreground))', strokeWidth: 2 },
  },
  
  // Gun to Chase
  {
    id: 'gun-to-chase',
    source: 'prop-gun',
    target: 'scene-chase',
    style: { stroke: 'hsl(var(--muted-foreground))', strokeWidth: 2 },
  },
  
  // Car to Chase
  {
    id: 'car-to-chase',
    source: 'prop-car',
    target: 'scene-chase',
    style: { stroke: 'hsl(var(--muted-foreground))', strokeWidth: 2 },
  },
  
  // Crime Photos to Interrogation
  {
    id: 'photos-to-interrogation',
    source: 'prop-phone',
    target: 'scene-interrogation',
    style: { stroke: 'hsl(var(--muted-foreground))', strokeWidth: 2 },
  },

  // ========== SCENE TO VIDEO CONNECTIONS ==========
  // Interrogation Scene to Video
  {
    id: 'interrogation-to-video',
    source: 'scene-interrogation',
    target: 'video-interrogation',
    animated: true,
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 4 },
  },
  
  // Chase Scene to Video
  {
    id: 'chase-to-video',
    source: 'scene-chase',
    target: 'video-chase',
    animated: true,
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 4 },
  },
  
  // Confrontation Scene to Video
  {
    id: 'confrontation-to-video',
    source: 'scene-confrontation',
    target: 'video-confrontation',
    animated: true,
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 4 },
  },
  
  // Resolution Scene to Video
  {
    id: 'resolution-to-video',
    source: 'scene-resolution',
    target: 'video-resolution',
    animated: true,
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 4 },
  },

  // ========== VIDEO TO FINAL CUT CONNECTIONS ==========
  // All Videos to Final Cut
  {
    id: 'interrogation-video-to-final',
    source: 'video-interrogation',
    target: 'final-cut-episode',
    style: { stroke: 'hsl(var(--accent))', strokeWidth: 3 },
  },
  
  {
    id: 'chase-video-to-final',
    source: 'video-chase',
    target: 'final-cut-episode',
    style: { stroke: 'hsl(var(--accent))', strokeWidth: 3 },
  },
  
  {
    id: 'confrontation-video-to-final',
    source: 'video-confrontation',
    target: 'final-cut-episode',
    style: { stroke: 'hsl(var(--accent))', strokeWidth: 3 },
  },
  
  {
    id: 'resolution-video-to-final',
    source: 'video-resolution',
    target: 'final-cut-episode',
    style: { stroke: 'hsl(var(--accent))', strokeWidth: 3 },
  },

  // ========== AUDIO TO FINAL CUT CONNECTIONS ==========
  // All Audio to Final Cut
  {
    id: 'dialogue-to-final',
    source: 'audio-dialogue',
    target: 'final-cut-episode',
    style: { stroke: 'hsl(var(--secondary))', strokeWidth: 3 },
  },
  
  {
    id: 'score-to-final',
    source: 'audio-score',
    target: 'final-cut-episode',
    style: { stroke: 'hsl(var(--secondary))', strokeWidth: 3 },
  },
  
  {
    id: 'sfx-to-final',
    source: 'audio-sfx',
    target: 'final-cut-episode',
    style: { stroke: 'hsl(var(--secondary))', strokeWidth: 3 },
  },

  // ========== FINAL CUT TO FILM ROLL TIMELINE ==========
  {
    id: 'final-to-filmroll',
    source: 'final-cut-episode',
    target: 'timeline-filmroll',
    animated: true,
    style: { 
      stroke: 'hsl(var(--primary))', 
      strokeWidth: 6,
      strokeDasharray: '10 5',
    },
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