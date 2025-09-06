import { useState } from "react";
import { ClapperBar } from "@/components/director-forge/clapper-bar";
import { LeftToolbar } from "@/components/director-forge/left-toolbar";
import { RightToolbar } from "@/components/director-forge/right-toolbar";
import { NodeGraphEnhanced } from "@/components/director-forge/node-graph-enhanced";
import { Timeline } from "@/components/director-forge/timeline";

const Index = () => {
  const [currentMode, setCurrentMode] = useState('video');
  const [isZenMode, setIsZenMode] = useState(false);

  const handleModeChange = (mode: string) => {
    setCurrentMode(mode);
  };

  const handleZenToggle = () => {
    setIsZenMode(!isZenMode);
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Clapper Bar */}
      <ClapperBar 
        currentMode={currentMode}
        onModeChange={handleModeChange}
        isZenMode={isZenMode}
        onZenToggle={handleZenToggle}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <LeftToolbar isZenMode={isZenMode} />

        {/* Central Workspace */}
        <div className="flex-1 flex flex-col">
          <NodeGraphEnhanced isZenMode={isZenMode} />
        </div>

        {/* Right Toolbar */}
        <RightToolbar isZenMode={isZenMode} />
      </div>

      {/* Timeline */}
      <Timeline isZenMode={isZenMode} />
    </div>
  );
};

export default Index;
