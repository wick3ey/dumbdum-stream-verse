
import React from "react";
import { useViewMode } from "@/App";
import { Switch } from "@/components/ui/switch";
import { Eye, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ViewModeToggle = () => {
  const { viewMode, toggleViewMode } = useViewMode();
  const { user } = useAuth();
  const isCreator = viewMode === "creator";

  const handleToggle = () => {
    // Check if user is trying to switch to creator mode
    if (!isCreator) {
      // Get the stored creator ID from localStorage
      const storedCreatorId = localStorage.getItem('creatorId');
      
      // Verify that this user is the creator
      if (storedCreatorId && user && storedCreatorId === user.id) {
        toggleViewMode();
      } else if (!storedCreatorId && user) {
        // First time using creator mode - set this user as creator
        localStorage.setItem('creatorId', user.id);
        toggleViewMode();
        toast.success("You are now set as the creator for this stream");
      } else {
        // Not authorized to be a creator
        toast.error("You are not authorized to access creator mode");
      }
    } else {
      // Switching back to viewer mode is always allowed
      toggleViewMode();
    }
  };

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-stream-darker/60 backdrop-blur rounded-lg border border-stream-border">
      <div className={cn("flex items-center gap-1", isCreator ? "text-gray-400" : "text-neon-cyan")}>
        <Eye size={16} />
        <span className="text-xs font-medium">Viewer</span>
      </div>
      
      <Switch 
        checked={isCreator}
        onCheckedChange={handleToggle}
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
