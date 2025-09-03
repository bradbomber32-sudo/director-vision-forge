import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Package, 
  Cpu, 
  FileText, 
  Target, 
  FolderOpen, 
  Settings,
  ChevronRight
} from "lucide-react";

interface LeftToolbarProps {
  isZenMode: boolean;
}

export function LeftToolbar({ isZenMode }: LeftToolbarProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const sections = [
    { 
      id: 'library', 
      label: 'Library', 
      icon: Package,
      description: 'Characters, Objects, Environments'
    },
    { 
      id: 'apis', 
      label: 'APIs', 
      icon: Cpu,
      description: 'Model Atlas & AI Services'
    },
    { 
      id: 'scripts', 
      label: 'Scripts', 
      icon: FileText,
      description: 'DirectorScript Editor'
    },
    { 
      id: 'nodes', 
      label: 'Nodes', 
      icon: Target,
      description: 'Node Library'
    },
    { 
      id: 'projects', 
      label: 'Projects', 
      icon: FolderOpen,
      description: 'Project Management'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      description: 'Preferences'
    },
  ];

  if (isZenMode) {
    return null;
  }

  return (
    <div className="w-16 bg-toolbar-bg border-r border-toolbar-border flex flex-col">
      {sections.map(({ id, label, icon: Icon, description }) => (
        <Sheet key={id}>
          <SheetTrigger asChild>
            <Button
              variant={selectedSection === id ? "cinema" : "toolbar"}
              size="icon"
              className="w-14 h-14 m-1 flex-col gap-1 text-xs"
              onClick={() => setSelectedSection(selectedSection === id ? null : id)}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] leading-none">{label}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0 bg-card border-r border-toolbar-border">
            <div className="p-6 border-b border-toolbar-border">
              <div className="flex items-center gap-3">
                <Icon className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">{label}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {id === 'library' && <LibraryContent />}
              {id === 'apis' && <APIsContent />}
              {id === 'scripts' && <ScriptsContent />}
              {id === 'nodes' && <NodesContent />}
              {id === 'projects' && <ProjectsContent />}
              {id === 'settings' && <SettingsContent />}
            </div>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}

function LibraryContent() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Button variant="cinema" className="h-20 flex-col gap-2">
          <Package className="w-6 h-6" />
          <span className="text-xs">Characters</span>
        </Button>
        <Button variant="cinema" className="h-20 flex-col gap-2">
          <Package className="w-6 h-6" />
          <span className="text-xs">Objects</span>
        </Button>
        <Button variant="cinema" className="h-20 flex-col gap-2">
          <Package className="w-6 h-6" />
          <span className="text-xs">Environments</span>
        </Button>
        <Button variant="cinema" className="h-20 flex-col gap-2">
          <Package className="w-6 h-6" />
          <span className="text-xs">Audio Assets</span>
        </Button>
      </div>
    </div>
  );
}

function APIsContent() {
  return (
    <div className="space-y-3">
      {['OpenAI', 'Anthropic', 'Google Veo', 'Replicate', 'ElevenLabs'].map((api) => (
        <div key={api} className="flex items-center justify-between p-3 rounded-lg bg-node-bg border border-node-border">
          <span className="font-medium">{api}</span>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow"></div>
        </div>
      ))}
    </div>
  );
}

function ScriptsContent() {
  return (
    <div className="space-y-3">
      <Button variant="ai" className="w-full justify-start">
        <FileText className="w-4 h-4" />
        New DirectorScript
      </Button>
      <div className="space-y-2">
        {['Main Story', 'Character Intro', 'Action Sequence'].map((script) => (
          <div key={script} className="flex items-center justify-between p-3 rounded-lg bg-node-bg border border-node-border hover:border-primary/50 cursor-pointer">
            <span>{script}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}

function NodesContent() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        'Text Input', 'Image Gen', 'Video Gen', 'Audio Gen', 
        'Character', 'Processing', 'Output', 'Connection'
      ].map((node) => (
        <Button 
          key={node} 
          variant="cinema" 
          size="sm"
          className="h-12 text-xs"
        >
          {node}
        </Button>
      ))}
    </div>
  );
}

function ProjectsContent() {
  return (
    <div className="space-y-3">
      <Button variant="ai" className="w-full">
        New Project
      </Button>
      <div className="space-y-2">
        {['Epic Adventure', 'Character Study', 'Music Video'].map((project) => (
          <div key={project} className="p-3 rounded-lg bg-node-bg border border-node-border">
            <h4 className="font-medium">{project}</h4>
            <p className="text-xs text-muted-foreground">Last edited 2 hours ago</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsContent() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="font-medium">Rendering Quality</h4>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="cinema" size="sm">Draft</Button>
          <Button variant="ai" size="sm">Preview</Button>
          <Button variant="cinema" size="sm">Final</Button>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">AI Models</h4>
        <div className="space-y-1">
          {['Auto Select', 'High Quality', 'Fast Generation'].map((setting) => (
            <Button key={setting} variant="cinema" size="sm" className="w-full justify-start">
              {setting}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}