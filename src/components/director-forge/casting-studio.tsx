import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Plus, 
  Upload, 
  Mic, 
  Eye, 
  Heart, 
  Brain,
  Palette,
  Sparkles,
  Users,
  Target
} from 'lucide-react';

interface Character {
  id: string;
  name: string;
  description: string;
  visualDNA: {
    age: string;
    gender: string;
    ethnicity: string;
    facialFeatures: string[];
    style: string;
  };
  personality: {
    mbti: string;
    traits: string[];
    quirks: string[];
  };
  voiceProfile: {
    id?: string;
    description: string;
    emotionalRange: string[];
  };
  consistency: number;
  images: string[];
  status: 'draft' | 'training' | 'ready';
}

export function CastingStudio() {
  const [characters, setCharacters] = useState<Character[]>([
    {
      id: '1',
      name: 'Elena Rodriguez',
      description: 'A determined detective with a mysterious past',
      visualDNA: {
        age: '32',
        gender: 'Female',
        ethnicity: 'Hispanic',
        facialFeatures: ['Sharp jawline', 'Expressive eyes', 'Natural eyebrows'],
        style: 'Professional casual'
      },
      personality: {
        mbti: 'INTJ',
        traits: ['Analytical', 'Intuitive', 'Reserved', 'Determined'],
        quirks: ['Taps pen when thinking', 'Always checks mirrors']
      },
      voiceProfile: {
        description: 'Mid-range, slightly husky, confident tone',
        emotionalRange: ['Determined', 'Suspicious', 'Empathetic', 'Stern']
      },
      consistency: 87,
      images: [],
      status: 'ready'
    }
  ]);

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCharacter = () => {
    setIsCreating(true);
    setSelectedCharacter({
      id: Date.now().toString(),
      name: '',
      description: '',
      visualDNA: {
        age: '',
        gender: '',
        ethnicity: '',
        facialFeatures: [],
        style: ''
      },
      personality: {
        mbti: '',
        traits: [],
        quirks: []
      },
      voiceProfile: {
        description: '',
        emotionalRange: []
      },
      consistency: 0,
      images: [],
      status: 'draft'
    });
  };

  const handleSaveCharacter = (character: Character) => {
    if (character.id && characters.find(c => c.id === character.id)) {
      setCharacters(chars => chars.map(c => c.id === character.id ? character : c));
    } else {
      setCharacters(chars => [...chars, character]);
    }
    setSelectedCharacter(null);
    setIsCreating(false);
  };

  if (selectedCharacter) {
    return <CharacterEditor 
      character={selectedCharacter} 
      onSave={handleSaveCharacter}
      onCancel={() => {
        setSelectedCharacter(null);
        setIsCreating(false);
      }}
    />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" />
              Casting Studio
            </h2>
            <p className="text-muted-foreground mt-1">
              Create and manage digital characters with complete continuity
            </p>
          </div>
          <Button onClick={handleCreateCharacter} className="gap-2">
            <Plus className="w-4 h-4" />
            New Character
          </Button>
        </div>
      </div>

      {/* Character Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <CharacterCard 
              key={character.id} 
              character={character}
              onEdit={() => setSelectedCharacter(character)}
            />
          ))}
          
          {/* Add Character Card */}
          <div 
            className="aspect-[3/4] border-2 border-dashed border-muted-foreground/50 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors group"
            onClick={handleCreateCharacter}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Create Character</h3>
            <p className="text-muted-foreground text-sm text-center mt-2">
              Build a new digital actor with AI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CharacterCard({ character, onEdit }: { character: Character; onEdit: () => void }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-deep transition-all group cursor-pointer" onClick={onEdit}>
      {/* Character Avatar */}
      <div className="aspect-[3/4] bg-gradient-to-b from-muted/50 to-muted flex items-center justify-center relative overflow-hidden">
        {character.images.length > 0 ? (
          <img src={character.images[0]} alt={character.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-12 h-12 text-primary" />
          </div>
        )}
        
        {/* Status Badge */}
        <Badge 
          className="absolute top-3 right-3"
          variant={character.status === 'ready' ? 'default' : character.status === 'training' ? 'secondary' : 'outline'}
        >
          {character.status}
        </Badge>

        {/* Consistency Score */}
        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
          <div className="flex items-center gap-2">
            <Target className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-white">{character.consistency}%</span>
          </div>
        </div>
      </div>

      {/* Character Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{character.name}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {character.description}
        </p>

        {/* Traits */}
        <div className="flex flex-wrap gap-1 mb-3">
          {character.personality.traits.slice(0, 3).map((trait) => (
            <Badge key={trait} variant="outline" className="text-xs">
              {trait}
            </Badge>
          ))}
          {character.personality.traits.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{character.personality.traits.length - 3}
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-2">
            <Sparkles className="w-3 h-3" />
            Generate
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function CharacterEditor({ character, onSave, onCancel }: { 
  character: Character; 
  onSave: (character: Character) => void;
  onCancel: () => void;
}) {
  const [editedCharacter, setEditedCharacter] = useState<Character>(character);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {editedCharacter.name || 'New Character'}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={() => onSave(editedCharacter)}>Save Character</Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Left Panel - Basic Info */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Basic Information
            </h3>
            
            <Input
              placeholder="Character Name"
              value={editedCharacter.name}
              onChange={(e) => setEditedCharacter(prev => ({ ...prev, name: e.target.value }))}
            />
            
            <Textarea
              placeholder="Character Description"
              value={editedCharacter.description}
              onChange={(e) => setEditedCharacter(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Palette className="w-5 h-5 text-accent" />
              Visual DNA
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Age"
                value={editedCharacter.visualDNA.age}
                onChange={(e) => setEditedCharacter(prev => ({
                  ...prev,
                  visualDNA: { ...prev.visualDNA, age: e.target.value }
                }))}
              />
              <Input
                placeholder="Gender"
                value={editedCharacter.visualDNA.gender}
                onChange={(e) => setEditedCharacter(prev => ({
                  ...prev,
                  visualDNA: { ...prev.visualDNA, gender: e.target.value }
                }))}
              />
            </div>
            
            <Input
              placeholder="Ethnicity"
              value={editedCharacter.visualDNA.ethnicity}
              onChange={(e) => setEditedCharacter(prev => ({
                ...prev,
                visualDNA: { ...prev.visualDNA, ethnicity: e.target.value }
              }))}
            />
            
            <Input
              placeholder="Style (e.g., Professional, Casual, Gothic)"
              value={editedCharacter.visualDNA.style}
              onChange={(e) => setEditedCharacter(prev => ({
                ...prev,
                visualDNA: { ...prev.visualDNA, style: e.target.value }
              }))}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5 text-secondary" />
              Personality
            </h3>
            
            <Input
              placeholder="MBTI Type (e.g., INTJ, ENFP)"
              value={editedCharacter.personality.mbti}
              onChange={(e) => setEditedCharacter(prev => ({
                ...prev,
                personality: { ...prev.personality, mbti: e.target.value }
              }))}
            />
            
            <Textarea
              placeholder="Personality Traits (comma separated)"
              value={editedCharacter.personality.traits.join(', ')}
              onChange={(e) => setEditedCharacter(prev => ({
                ...prev,
                personality: { 
                  ...prev.personality, 
                  traits: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                }
              }))}
              rows={2}
            />
          </div>
        </div>

        {/* Right Panel - Voice & Generation */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Mic className="w-5 h-5 text-accent" />
              Voice Profile
            </h3>
            
            <Textarea
              placeholder="Voice Description (e.g., Deep, warm baritone with slight accent)"
              value={editedCharacter.voiceProfile.description}
              onChange={(e) => setEditedCharacter(prev => ({
                ...prev,
                voiceProfile: { ...prev.voiceProfile, description: e.target.value }
              }))}
              rows={2}
            />

            <Button variant="outline" className="w-full gap-2">
              <Upload className="w-4 h-4" />
              Upload Voice Sample
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Generation
            </h3>
            
            <Button variant="ai" className="w-full gap-2">
              <Sparkles className="w-4 h-4" />
              Generate Character Images
            </Button>
            
            <Button variant="outline" className="w-full gap-2">
              <Heart className="w-4 h-4" />
              Clone Voice Profile
            </Button>
            
            <Button variant="outline" className="w-full gap-2">
              <Target className="w-4 h-4" />
              Run Consistency Check
            </Button>
          </div>

          {/* Character Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preview</h3>
            <div className="aspect-square bg-muted rounded-xl flex items-center justify-center">
              <div className="text-center">
                <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Generate images to see character preview</p>
              </div>
            </div>
          </div>

          {/* Consistency Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Consistency Score</span>
              <span className="text-sm text-muted-foreground">{editedCharacter.consistency}%</span>
            </div>
            <Progress value={editedCharacter.consistency} className="h-2" />
          </div>
        </div>
      </div>
    </div>
  );
}