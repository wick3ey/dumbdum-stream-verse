
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { CircleDollarSign, Target } from 'lucide-react';

type Challenge = {
  name: string;
  targetAmount: number;
  currentAmount: number;
};

type ChallengesDashboardProps = {
  challenges: Challenge[];
};

const ChallengesDashboard: React.FC<ChallengesDashboardProps> = ({ challenges }) => {
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
          
          return (
            <Card key={index} className="bg-stream-darker border-stream-border overflow-hidden group hover:border-neon-cyan transition-colors">
              <div className="p-4 space-y-4">
                <h3 className="text-neon-cyan font-bold text-lg truncate">
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
    </div>
  );
};

export default ChallengesDashboard;
