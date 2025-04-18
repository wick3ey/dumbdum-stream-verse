
import React, { useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { CircleDollarSign, Target } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Challenge = {
  name: string;
  targetAmount: number;
  currentAmount: number;
};

type ChallengesDashboardProps = {
  challenges: Challenge[];
  onDonate: (amount: number, challengeName: string) => void;
  onCreateChallenge: (challengeName: string, targetAmount: number) => void;
};

const ChallengesDashboard: React.FC<ChallengesDashboardProps> = ({ 
  challenges, 
  onDonate,
  onCreateChallenge 
}) => {
  const { toast } = useToast();
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [showDonateDialog, setShowDonateDialog] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>('');

  const handleChallengeSelect = (challengeName: string) => {
    setSelectedChallenge(challengeName);
  };

  const handleDonate = (amount: number) => {
    if (!selectedChallenge) {
      toast({
        title: "No challenge selected",
        description: "Please select a challenge to donate to",
        variant: "destructive",
      });
      return;
    }
    onDonate(amount, selectedChallenge);
    setShowDonateDialog(false);
    setCustomAmount('');
  };

  const handleCustomDonate = () => {
    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid donation amount",
        variant: "destructive",
      });
      return;
    }
    handleDonate(amount);
  };

  return (
    <div className="w-full bg-stream-panel p-4 border border-stream-border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-neon-orange flex items-center gap-2">
          <Target className="h-5 w-5" />
          ACTIVE CHALLENGES
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((challenge, index) => {
          const progress = (challenge.currentAmount / challenge.targetAmount) * 100;
          const isSelected = selectedChallenge === challenge.name;
          
          return (
            <Card 
              key={index} 
              className={`${
                isSelected ? 'bg-stream-darker border-neon-red' : 'bg-stream-darker border-stream-border'
              } overflow-hidden group hover:border-neon-cyan transition-colors cursor-pointer`}
              onClick={() => handleChallengeSelect(challenge.name)}
            >
              <div className="p-4 space-y-4">
                <h3 className={`${
                  isSelected ? 'text-neon-red' : 'text-neon-cyan'
                } font-bold text-lg truncate`}>
                  {challenge.name}
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-neon-green font-bold">{progress.toFixed(1)}%</span>
                  </div>
                  
                  <Progress value={progress} className="h-2 bg-stream-panel" />
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-neon-yellow">
                      <CircleDollarSign className="h-4 w-4" />
                      <span className="font-mono">
                        ${challenge.currentAmount.toFixed(2)} / ${challenge.targetAmount.toFixed(2)}
                      </span>
                    </div>
                    
                    {progress >= 100 && (
                      <span className="text-xs bg-neon-red px-2 py-1 rounded-full animate-pulse">
                        READY TO EXECUTE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <Button
          onClick={() => setShowDonateDialog(true)}
          disabled={!selectedChallenge}
          className="bg-neon-yellow text-black hover:bg-yellow-400"
        >
          DONATE TO SELECTED CHALLENGE
        </Button>
      </div>

      <Dialog open={showDonateDialog} onOpenChange={setShowDonateDialog}>
        <DialogContent className="bg-stream-darker border-stream-border">
          <DialogHeader>
            <DialogTitle className="text-neon-yellow">Donate to Challenge</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedChallenge ? `Supporting: ${selectedChallenge}` : 'Select a challenge first'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-2 my-4">
            <Button onClick={() => handleDonate(5)} className="bg-neon-yellow text-black hover:bg-yellow-400">
              $5
            </Button>
            <Button onClick={() => handleDonate(10)} className="bg-neon-yellow text-black hover:bg-yellow-400">
              $10
            </Button>
            <Button onClick={() => handleDonate(20)} className="bg-neon-yellow text-black hover:bg-yellow-400">
              $20
            </Button>
            <Button onClick={() => handleDonate(50)} className="bg-neon-yellow text-black hover:bg-yellow-400">
              $50
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="bg-stream-panel border-stream-border text-white"
            />
            <Button onClick={handleCustomDonate} className="bg-neon-yellow text-black hover:bg-yellow-400">
              Donate Custom
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChallengesDashboard;
