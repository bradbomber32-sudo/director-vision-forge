import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Plus, 
  Play, 
  Download, 
  Save,
  Wand2,
  Users,
  BarChart3,
  FileCode,
  Zap
} from 'lucide-react';

interface Script {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
  status: 'draft' | 'compiling' | 'ready' | 'error';
  collaborators: string[];
  analysisScore: number;
  budgetEstimate: number;
}

export function ScriptForge() {
  const [scripts, setScripts] = useState<Script[]>([
    {
      id: '1',
      title: 'Main Story',
      content: `# Character Intro
FADE IN:

Elena stands in the rain, examining a crime scene. The camera slowly circles her as she notices something others missed.

ELENA
(determined)
There's more to this than meets the eye.

CAMERA MOVE: Slow zoom on her face
LIGHTING: Dramatic, rain-soaked
AUDIO: Ambient rain, distant thunder

# Scene Analysis
- Character: Elena Rodriguez (Detective)
- Mood: Mysterious, Determined
- Location: Crime Scene, Night, Rain
- Duration: 45 seconds
- Budget: $2,400

TRANSITION: Quick cut to...`,
      lastModified: new Date(),
      status: 'ready',
      collaborators: ['Sarah Kim', 'Mike Rodriguez'],
      analysisScore: 92,
      budgetEstimate: 12500
    }
  ]);

  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateScript = () => {
    setIsCreating(true);
    setSelectedScript({
      id: Date.now().toString(),
      title: 'Untitled Script',
      content: '',
      lastModified: new Date(),
      status: 'draft',
      collaborators: [],
      analysisScore: 0,
      budgetEstimate: 0
    });
  };

  if (selectedScript) {
    return <ScriptEditor 
      script={selectedScript} 
      onSave={(script) => {
        if (scripts.find(s => s.id === script.id)) {
          setScripts(prev => prev.map(s => s.id === script.id ? script : s));
        } else {
          setScripts(prev => [...prev, script]);
        }
        setSelectedScript(null);
        setIsCreating(false);
      }}
      onCancel={() => {
        setSelectedScript(null);
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
              <FileText className="w-6 h-6 text-primary" />
              ScriptForge
            </h2>
            <p className="text-muted-foreground mt-1">
              Write executable scripts that become production pipelines
            </p>
          </div>
          <Button onClick={handleCreateScript} className="gap-2">
            <Plus className="w-4 h-4" />
            New Script
          </Button>
        </div>
      </div>

      {/* Scripts Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scripts.map((script) => (
            <ScriptCard 
              key={script.id} 
              script={script}
              onEdit={() => setSelectedScript(script)}
            />
          ))}
          
          {/* Add Script Card */}
          <div 
            className="aspect-[3/4] border-2 border-dashed border-muted-foreground/50 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors group"
            onClick={handleCreateScript}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">New Script</h3>
            <p className="text-muted-foreground text-sm text-center mt-2">
              Create a DirectorScript
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScriptCard({ script, onEdit }: { script: Script; onEdit: () => void }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-deep transition-all group cursor-pointer" onClick={onEdit}>
      {/* Script Preview */}
      <div className="p-4 bg-muted/30">
        <div className="h-32 bg-gradient-to-b from-background to-muted rounded-lg p-3 overflow-hidden">
          <pre className="text-xs text-muted-foreground font-mono leading-relaxed">
            {script.content.slice(0, 200)}...
          </pre>
        </div>
      </div>

      {/* Script Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{script.title}</h3>
          <Badge 
            variant={script.status === 'ready' ? 'default' : script.status === 'compiling' ? 'secondary' : 'outline'}
          >
            {script.status}
          </Badge>
        </div>

        <p className="text-muted-foreground text-sm mb-3">
          Modified {script.lastModified.toLocaleDateString()}
        </p>

        {/* Analysis Score */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Quality Score</span>
            <span className="text-sm text-muted-foreground">{script.analysisScore}%</span>
          </div>
          <Progress value={script.analysisScore} className="h-2" />
        </div>

        {/* Budget Estimate */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Est. Budget</span>
          <span className="text-sm font-semibold">${script.budgetEstimate.toLocaleString()}</span>
        </div>

        {/* Collaborators */}
        {script.collaborators.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {script.collaborators.length} collaborator{script.collaborators.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="ai" size="sm" className="flex-1 gap-2">
            <Play className="w-3 h-3" />
            Compile
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ScriptEditor({ script, onSave, onCancel }: { 
  script: Script; 
  onSave: (script: Script) => void;
  onCancel: () => void;
}) {
  const [editedScript, setEditedScript] = useState(script);
  const [isCompiling, setIsCompiling] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const handleCompile = async () => {
    setIsCompiling(true);
    // Simulate compilation
    setTimeout(() => {
      setAnalysisResults({
        scenes: 5,
        characters: 3,
        estimatedDuration: '2m 30s',
        budgetBreakdown: {
          'Character Generation': 2400,
          'Scene Creation': 4200,
          'Audio Production': 1800,
          'Post Processing': 800
        },
        suggestions: [
          'Add transition between Scene 2 and 3',
          'Consider voice cloning for character consistency',
          'Optimize lighting setup for budget efficiency'
        ]
      });
      setEditedScript(prev => ({ ...prev, status: 'ready', analysisScore: 89 }));
      setIsCompiling(false);
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Input
              value={editedScript.title}
              onChange={(e) => setEditedScript(prev => ({ ...prev, title: e.target.value }))}
              className="text-xl font-bold border-none px-0 bg-transparent"
            />
            <Badge variant={editedScript.status === 'ready' ? 'default' : 'outline'}>
              {editedScript.status}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button variant="outline" onClick={handleCompile} disabled={isCompiling} className="gap-2">
              {isCompiling ? <Zap className="w-4 h-4 animate-spin" /> : <FileCode className="w-4 h-4" />}
              {isCompiling ? 'Compiling...' : 'Compile'}
            </Button>
            <Button onClick={() => onSave(editedScript)} className="gap-2">
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          {/* Editor Toolbar */}
          <div className="p-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Wand2 className="w-3 h-3" />
                AI Assist
              </Button>
              <Button variant="outline" size="sm">Format</Button>
              <Button variant="outline" size="sm">Insert Scene</Button>
              <Button variant="outline" size="sm">Insert Character</Button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 relative">
            <textarea
              ref={editorRef}
              value={editedScript.content}
              onChange={(e) => setEditedScript(prev => ({ ...prev, content: e.target.value }))}
              className="w-full h-full p-6 bg-background font-mono text-sm resize-none border-none outline-none"
              placeholder="# Write your DirectorScript here...

FADE IN:

# Scene 1 - Character Introduction
Location: Interior Cafe, Day
Characters: Alex, Sarah
Mood: Casual, Friendly

Alex sits at a corner table, nervously checking their phone.

ALEX
(anxious)
Where is she?

CAMERA MOVE: Slow push in on Alex's face
LIGHTING: Warm, natural window light
AUDIO: Cafe ambience, gentle chatter

Sarah enters, scanning the room until she spots Alex.

SARAH
(relieved, waving)
Sorry I'm late!

# AI Instructions:
- Generate consistent character appearance for Alex and Sarah
- Use warm color palette throughout scene
- Sync dialogue with natural lip movement
- Add subtle background music"
            />

            {/* Line Numbers */}
            <div className="absolute left-0 top-0 w-12 h-full bg-muted/50 border-r border-border p-6 text-xs text-muted-foreground font-mono">
              {editedScript.content.split('\n').map((_, i) => (
                <div key={i} className="leading-6">{i + 1}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Analysis Panel */}
        <div className="w-80 border-l border-border bg-card/50">
          {/* Analysis Header */}
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent" />
              Script Analysis
            </h3>
          </div>

          {/* Analysis Content */}
          <div className="p-4 space-y-4">
            {isCompiling ? (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">Analyzing script...</div>
                <Progress value={66} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  • Parsing scenes and characters<br/>
                  • Calculating budget estimates<br/>
                  • Generating optimization suggestions
                </div>
              </div>
            ) : analysisResults ? (
              <div className="space-y-4">
                {/* Overview */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                    <div className="text-lg font-bold text-primary">{analysisResults.scenes}</div>
                    <div className="text-xs text-muted-foreground">Scenes</div>
                  </div>
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-center">
                    <div className="text-lg font-bold text-accent">{analysisResults.characters}</div>
                    <div className="text-xs text-muted-foreground">Characters</div>
                  </div>
                </div>

                {/* Duration */}
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-sm font-medium">Estimated Duration</div>
                  <div className="text-lg font-bold">{analysisResults.estimatedDuration}</div>
                </div>

                {/* Budget Breakdown */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Budget Breakdown</div>
                  {Object.entries(analysisResults.budgetBreakdown).map(([item, cost]) => (
                    <div key={item} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item}</span>
                      <span className="font-medium">${(cost as number).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${Object.values(analysisResults.budgetBreakdown).reduce((a: number, b: any) => a + b, 0).toLocaleString()}</span>
                  </div>
                </div>

                {/* AI Suggestions */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">AI Suggestions</div>
                  {analysisResults.suggestions.map((suggestion: string, index: number) => (
                    <div key={index} className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-xs">
                      💡 {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <FileCode className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Compile script to see analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}