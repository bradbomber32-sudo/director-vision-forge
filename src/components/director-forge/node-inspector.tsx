import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Scissors, 
  Palette, 
  Layers, 
  Settings2, 
  Camera, 
  Mic,
  User,
  MapPin,
  Wand2,
  Image as ImageIcon,
  Video,
  Volume2
} from 'lucide-react';

interface NodeInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData: any;
  nodeType: string;
}

export const NodeInspector = ({ isOpen, onClose, nodeData, nodeType }: NodeInspectorProps) => {
  const [activeTab, setActiveTab] = useState('properties');

  const renderCharacterEditor = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Character Name</Label>
          <Input placeholder="Enter character name" />
        </div>
        <div>
          <Label>Age Range</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select age range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="teen">Teen (13-19)</SelectItem>
              <SelectItem value="young">Young Adult (20-35)</SelectItem>
              <SelectItem value="middle">Middle Age (36-55)</SelectItem>
              <SelectItem value="senior">Senior (55+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Personality Traits</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['Confident', 'Mysterious', 'Heroic', 'Vulnerable', 'Intelligent', 'Charismatic'].map(trait => (
              <Badge key={trait} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                {trait}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <Label>Outfit Style</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select outfit style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="action">Action/Combat</SelectItem>
              <SelectItem value="period">Period Costume</SelectItem>
              <SelectItem value="fantasy">Fantasy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Consistency Level: {nodeData?.consistency || 85}%</Label>
          <Slider
            value={[nodeData?.consistency || 85]}
            max={100}
            step={1}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );

  const renderImageEditor = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Generation Model</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flux-dev">Flux Dev (High Quality)</SelectItem>
              <SelectItem value="flux-schnell">Flux Schnell (Fast)</SelectItem>
              <SelectItem value="stable-diffusion">Stable Diffusion XL</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Prompt</Label>
          <Textarea placeholder="Describe the image you want to generate..." rows={3} />
        </div>
        <div>
          <Label>Negative Prompt</Label>
          <Textarea placeholder="What to avoid in the image..." rows={2} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Width</Label>
            <Input type="number" placeholder="1024" />
          </div>
          <div>
            <Label>Height</Label>
            <Input type="number" placeholder="1024" />
          </div>
        </div>
        <div>
          <Label>Guidance Scale: {nodeData?.guidance || 7.5}</Label>
          <Slider
            value={[nodeData?.guidance || 7.5]}
            max={20}
            min={1}
            step={0.5}
            className="mt-2"
          />
        </div>
        <div>
          <Label>Steps: {nodeData?.steps || 30}</Label>
          <Slider
            value={[nodeData?.steps || 30]}
            max={100}
            min={10}
            step={5}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );

  const renderAdvancedEditor = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Wand2 className="w-4 h-4" />
          SAM2 Segmentation
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Enable Object Segmentation</Label>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <Label>Auto-detect Objects</Label>
            <Switch />
          </div>
          <Button variant="outline" size="sm" className="w-full">
            <Scissors className="w-4 h-4 mr-2" />
            Segment Selection Tool
          </Button>
        </div>
        
        <Separator />
        
        <h3 className="font-semibold flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Inpainting & Editing
        </h3>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full">
            <Layers className="w-4 h-4 mr-2" />
            Background Removal
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            <Palette className="w-4 h-4 mr-2" />
            Style Transfer
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            <Wand2 className="w-4 h-4 mr-2" />
            Object Replacement
          </Button>
        </div>
        
        <Separator />
        
        <h3 className="font-semibold">Nano Banana Editor</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Smart Enhancement</Label>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <Label>Color Correction</Label>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <Label>Noise Reduction</Label>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAudioEditor = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Voice Model</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aria">Aria (Natural Female)</SelectItem>
              <SelectItem value="roger">Roger (Deep Male)</SelectItem>
              <SelectItem value="sarah">Sarah (Warm Female)</SelectItem>
              <SelectItem value="charlie">Charlie (Young Male)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Speech Speed: {nodeData?.speed || 1.0}x</Label>
          <Slider
            value={[nodeData?.speed || 1.0]}
            max={2.0}
            min={0.5}
            step={0.1}
            className="mt-2"
          />
        </div>
        <div>
          <Label>Emotion</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select emotion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="happy">Happy</SelectItem>
              <SelectItem value="sad">Sad</SelectItem>
              <SelectItem value="angry">Angry</SelectItem>
              <SelectItem value="excited">Excited</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const getTabContent = () => {
    switch (nodeType) {
      case 'character':
        return renderCharacterEditor();
      case 'image':
        return renderImageEditor();
      case 'audio':
        return renderAudioEditor();
      default:
        return renderImageEditor();
    }
  };

  const getIcon = () => {
    switch (nodeType) {
      case 'character':
        return <User className="w-5 h-5" />;
      case 'image':
        return <ImageIcon className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'audio':
        return <Volume2 className="w-5 h-5" />;
      case 'location':
        return <MapPin className="w-5 h-5" />;
      case 'camera':
        return <Camera className="w-5 h-5" />;
      default:
        return <Settings2 className="w-5 h-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {nodeData?.label || 'Node Inspector'}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <div className="overflow-y-auto max-h-[70vh] mt-4">
            <TabsContent value="properties" className="space-y-4">
              {getTabContent()}
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4">
              {renderAdvancedEditor()}
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Preview will appear here</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button>Apply Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};