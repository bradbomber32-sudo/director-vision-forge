import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Image, 
  Plus, 
  Wand2, 
  Upload, 
  Settings,
  Download,
  Eye,
  Shuffle,
  Sparkles,
  Palette,
  Layers,
  Zap
} from 'lucide-react';

interface GeneratedImage {
  id: string;
  prompt: string;
  negativePrompt?: string;
  url: string;
  model: string;
  parameters: {
    width: number;
    height: number;
    steps: number;
    guidance: number;
    seed?: number;
  };
  status: 'generating' | 'completed' | 'error';
  cost: number;
  qualityScore: number;
  createdAt: Date;
}

export function ImageForge() {
  const [images, setImages] = useState<GeneratedImage[]>([
    {
      id: '1',
      prompt: 'A determined detective in a noir setting, cinematic lighting, professional photography',
      url: '/api/placeholder/512/512',
      model: 'SDXL',
      parameters: { width: 512, height: 512, steps: 30, guidance: 7.5 },
      status: 'completed',
      cost: 0.004,
      qualityScore: 92,
      createdAt: new Date()
    }
  ]);

  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationParams, setGenerationParams] = useState({
    prompt: '',
    negativePrompt: 'blurry, low quality, distorted',
    model: 'sdxl',
    width: 1024,
    height: 1024,
    steps: 30,
    guidance: 7.5,
    seed: null as number | null
  });

  const models = [
    { id: 'sdxl', name: 'Stable Diffusion XL', provider: 'Replicate', cost: 0.004 },
    { id: 'dall-e-3', name: 'DALL-E 3', provider: 'OpenAI', cost: 0.04 },
    { id: 'flux-dev', name: 'Flux Dev', provider: 'DeepInfra', cost: 0.003 },
    { id: 'midjourney', name: 'Midjourney', provider: 'API', cost: 0.02 }
  ];

  const handleGenerate = async () => {
    if (!generationParams.prompt.trim()) return;

    setIsGenerating(true);
    const newImage: GeneratedImage = {
      id: Date.now().toString(),
      prompt: generationParams.prompt,
      negativePrompt: generationParams.negativePrompt,
      url: '',
      model: generationParams.model,
      parameters: {
        width: generationParams.width,
        height: generationParams.height,
        steps: generationParams.steps,
        guidance: generationParams.guidance,
        seed: generationParams.seed
      },
      status: 'generating',
      cost: models.find(m => m.id === generationParams.model)?.cost || 0.004,
      qualityScore: 0,
      createdAt: new Date()
    };

    setImages(prev => [newImage, ...prev]);

    // Simulate generation
    setTimeout(() => {
      setImages(prev => prev.map(img => 
        img.id === newImage.id 
          ? { ...img, status: 'completed', url: '/api/placeholder/512/512', qualityScore: 88 }
          : img
      ));
      setIsGenerating(false);
    }, 5000);
  };

  if (selectedImage) {
    return <ImageEditor 
      image={selectedImage} 
      onClose={() => setSelectedImage(null)}
      onSave={(updatedImage) => {
        setImages(prev => prev.map(img => img.id === updatedImage.id ? updatedImage : img));
        setSelectedImage(null);
      }}
    />;
  }

  return (
    <div className="h-full flex">
      {/* Generation Panel */}
      <div className="w-96 border-r border-border bg-card/50 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <Image className="w-5 h-5 text-accent" />
            ImageForge
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            AI-powered image generation studio
          </p>
        </div>

        {/* Generation Form */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Prompt */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Prompt</label>
            <Textarea
              value={generationParams.prompt}
              onChange={(e) => setGenerationParams(prev => ({ ...prev, prompt: e.target.value }))}
              placeholder="A cinematic portrait of a detective in noir lighting..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Negative Prompt */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Negative Prompt</label>
            <Textarea
              value={generationParams.negativePrompt}
              onChange={(e) => setGenerationParams(prev => ({ ...prev, negativePrompt: e.target.value }))}
              placeholder="blurry, low quality, distorted..."
              rows={2}
              className="resize-none"
            />
          </div>

          {/* Model Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">AI Model</label>
            <div className="grid grid-cols-1 gap-2">
              {models.map((model) => (
                <div
                  key={model.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    generationParams.model === model.id 
                      ? 'border-accent bg-accent/10' 
                      : 'border-border hover:border-accent/50'
                  }`}
                  onClick={() => setGenerationParams(prev => ({ ...prev, model: model.id }))}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm">{model.name}</div>
                      <div className="text-xs text-muted-foreground">{model.provider}</div>
                    </div>
                    <div className="text-xs font-medium">${model.cost}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dimensions */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Dimensions</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Width</label>
                <Input
                  type="number"
                  value={generationParams.width}
                  onChange={(e) => setGenerationParams(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                  min={256}
                  max={2048}
                  step={64}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Height</label>
                <Input
                  type="number"
                  value={generationParams.height}
                  onChange={(e) => setGenerationParams(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                  min={256}
                  max={2048}
                  step={64}
                />
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <label className="text-sm font-medium">Advanced Settings</label>
            
            {/* Steps */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Steps</span>
                <span>{generationParams.steps}</span>
              </div>
              <Slider
                value={[generationParams.steps]}
                onValueChange={([value]) => setGenerationParams(prev => ({ ...prev, steps: value }))}
                min={10}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Guidance Scale */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Guidance Scale</span>
                <span>{generationParams.guidance}</span>
              </div>
              <Slider
                value={[generationParams.guidance]}
                onValueChange={([value]) => setGenerationParams(prev => ({ ...prev, guidance: value }))}
                min={1}
                max={20}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Seed */}
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Seed (optional)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={generationParams.seed || ''}
                  onChange={(e) => setGenerationParams(prev => ({ 
                    ...prev, 
                    seed: e.target.value ? parseInt(e.target.value) : null 
                  }))}
                  placeholder="Random"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setGenerationParams(prev => ({ 
                    ...prev, 
                    seed: Math.floor(Math.random() * 1000000) 
                  }))}
                >
                  <Shuffle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            className="w-full gap-2" 
            onClick={handleGenerate}
            disabled={isGenerating || !generationParams.prompt.trim()}
          >
            {isGenerating ? (
              <>
                <Zap className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Image
              </>
            )}
          </Button>

          {/* Cost Estimate */}
          <div className="text-center text-sm text-muted-foreground">
            Est. cost: ${models.find(m => m.id === generationParams.model)?.cost || 0.004}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="flex-1 flex flex-col">
        {/* Gallery Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated Images</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="w-4 h-4" />
                Upload
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Layers className="w-4 h-4" />
                Batch
              </Button>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <ImageCard 
                key={image.id} 
                image={image}
                onEdit={() => setSelectedImage(image)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageCard({ image, onEdit }: { image: GeneratedImage; onEdit: () => void }) {
  return (
    <div className="group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-deep transition-all">
      {/* Image */}
      <div className="aspect-square bg-muted relative overflow-hidden">
        {image.status === 'generating' ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Zap className="w-8 h-8 text-accent mx-auto mb-2 animate-spin" />
              <Progress value={67} className="w-24 h-2 mb-2" />
              <p className="text-xs text-muted-foreground">Generating...</p>
            </div>
          </div>
        ) : (
          <img 
            src={image.url} 
            alt={image.prompt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        )}

        {/* Status Badge */}
        <Badge 
          className="absolute top-2 right-2"
          variant={image.status === 'completed' ? 'default' : 'secondary'}
        >
          {image.status}
        </Badge>

        {/* Quality Score */}
        {image.status === 'completed' && (
          <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-white">{image.qualityScore}%</span>
            </div>
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button variant="secondary" size="sm" onClick={onEdit} className="gap-2">
            <Eye className="w-3 h-3" />
            Edit
          </Button>
          <Button variant="secondary" size="sm" className="gap-2">
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Image Info */}
      <div className="p-3">
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
          {image.prompt}
        </p>
        
        <div className="flex items-center justify-between text-xs">
          <Badge variant="outline">{image.model}</Badge>
          <span className="text-muted-foreground">${image.cost}</span>
        </div>
      </div>
    </div>
  );
}

function ImageEditor({ image, onClose, onSave }: { 
  image: GeneratedImage; 
  onClose: () => void;
  onSave: (image: GeneratedImage) => void;
}) {
  const [editedImage, setEditedImage] = useState(image);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Image Editor</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={() => onSave(editedImage)}>Save Changes</Button>
          </div>
        </div>
      </div>

      {/* Editor Layout */}
      <div className="flex-1 flex">
        {/* Canvas */}
        <div className="flex-1 bg-muted/30 flex items-center justify-center">
          <div className="max-w-full max-h-full">
            <img 
              src={editedImage.url} 
              alt={editedImage.prompt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-deep"
            />
          </div>
        </div>

        {/* Tools Panel */}
        <div className="w-80 border-l border-border bg-card/50 p-6 space-y-6 overflow-y-auto">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Palette className="w-4 h-4 text-accent" />
              Image Tools
            </h3>
            
            <Button variant="ai" className="w-full gap-2">
              <Wand2 className="w-4 h-4" />
              Upscale 2x
            </Button>
            
            <Button variant="outline" className="w-full gap-2">
              <Sparkles className="w-4 h-4" />
              Style Transfer
            </Button>
            
            <Button variant="outline" className="w-full gap-2">
              <Settings className="w-4 h-4" />
              Color Correction
            </Button>
          </div>

          {/* Image Details */}
          <div className="space-y-3">
            <h3 className="font-semibold">Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Model:</span>
                <span>{editedImage.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dimensions:</span>
                <span>{editedImage.parameters.width}×{editedImage.parameters.height}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Steps:</span>
                <span>{editedImage.parameters.steps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guidance:</span>
                <span>{editedImage.parameters.guidance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cost:</span>
                <span>${editedImage.cost}</span>
              </div>
            </div>
          </div>

          {/* Prompt */}
          <div className="space-y-3">
            <h3 className="font-semibold">Prompt</h3>
            <Textarea
              value={editedImage.prompt}
              onChange={(e) => setEditedImage(prev => ({ ...prev, prompt: e.target.value }))}
              rows={4}
              className="resize-none text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}