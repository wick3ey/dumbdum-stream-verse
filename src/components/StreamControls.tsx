
import React, { useState } from 'react';
import { Copy, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { StreamInfo } from '@/pages/Index';

type StreamControlsProps = {
  isLive: boolean;
  streamKey?: string;
  streamInfo: StreamInfo | null;
  onToggleStream: () => Promise<void>;
};

const StreamControls: React.FC<StreamControlsProps> = ({ 
  isLive, 
  streamKey,
  streamInfo,
  onToggleStream 
}) => {
  const [showStreamInfo, setShowStreamInfo] = useState(false);

  const copyStreamKey = () => {
    if (streamKey) {
      navigator.clipboard.writeText(streamKey);
      toast.success("Stream key copied to clipboard");
    }
  };

  return (
    <div className="bg-stream-panel p-4 border border-stream-border rounded-lg">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold mb-1">{isLive ? "Stream Live" : "Stream Setup"}</h2>
          <p className="text-sm text-gray-400">
            {isLive 
              ? "Your stream is currently live to viewers" 
              : "Configure your streaming software with the details below"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowStreamInfo(true)}
          >
            <Info className="mr-2 h-4 w-4" /> Stream Info
          </Button>
          
          <Button 
            className={`${
              isLive 
                ? "bg-red-700 hover:bg-red-800" 
                : "bg-neon-red hover:bg-red-600"
            } text-white px-4 py-2 rounded-md font-bold transition`}
            onClick={onToggleStream}
          >
            {isLive ? "END STREAM" : "START STREAM"}
          </Button>
        </div>
      </div>

      <Dialog open={showStreamInfo} onOpenChange={setShowStreamInfo}>
        <DialogContent className="bg-stream-dark border border-stream-border text-white">
          <DialogHeader>
            <DialogTitle className="text-neon-cyan">Stream Information</DialogTitle>
            <DialogDescription className="text-gray-400">
              Use these details in your streaming software (OBS, Streamlabs, etc.)
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-neon-orange mb-1">Server URL</h3>
              <div className="flex items-center justify-between p-2 bg-black/50 border border-stream-border rounded">
                <code className="text-sm text-white">rtmp://stream.example.com/live</code>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText("rtmp://stream.example.com/live");
                    toast.success("URL copied to clipboard");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">This is a simulation. In a real application, you'd use your streaming provider's RTMP URL.</p>
            </div>
            
            {streamKey && (
              <div>
                <h3 className="text-sm font-medium text-neon-orange mb-1">Stream Key</h3>
                <div className="flex items-center justify-between p-2 bg-black/50 border border-stream-border rounded">
                  <code className="text-sm text-white">••••••••••••••••••••••</code>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={copyStreamKey}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Keep this private. Anyone with this key can stream to your channel.</p>
              </div>
            )}

            <div className="border-t border-stream-border pt-4">
              <h3 className="text-sm font-medium text-neon-orange mb-1">Recommended Settings</h3>
              <ul className="text-sm space-y-1 text-gray-300">
                <li>• Video Bitrate: 4000-6000 Kbps</li>
                <li>• Resolution: 1920x1080 (1080p)</li>
                <li>• Framerate: 30 FPS</li>
                <li>• Audio Bitrate: 160 Kbps</li>
                <li>• Audio Sample Rate: 48 kHz</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StreamControls;
