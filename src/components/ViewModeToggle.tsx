
import React from "react";
import { useViewMode } from "@/App";
import { Switch } from "@/components/ui/switch";
import { Eye, Video } from "lucide-react";
import { cn } from "@/lib/utils";

const ViewModeToggle = () => {
  const { viewMode, toggleViewMode } = useViewMode();
  const isCreator = viewMode === "creator";

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-stream-darker/60 backdrop-blur rounded-lg border border-stream-border">
      <div className={cn("flex items-center gap-1", isCreator ? "text-gray-400" : "text-neon-cyan")}>
        <Eye size={16} />
        <span className="text-xs font-medium">Viewer</span>
      </div>
      
      <Switch 
        checked={isCreator}
        onCheckedChange={toggleViewMode}
        className="data-[state=checked]:bg-neon-red data-[state=unchecked]:bg-neon-cyan"
      />
      
      <div className={cn("flex items-center gap-1", isCreator ? "text-neon-red" : "text-gray-400")}>
        <Video size={16} />
        <span className="text-xs font-medium">Creator</span>
      </div>
    </div>
  );
};

export default ViewModeToggle;
