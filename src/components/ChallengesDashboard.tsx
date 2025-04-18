import React, { useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { 
  CircleDollarSign, 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  ThumbsUp,
  Flame,
  AlertCircle
} from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

type Challenge = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  status?: 'requested' | 'active' | 'completed';
  userId?: string;
};

type ChallengesDashboardProps = {
  activeChallenges: Challenge[];
  requestedChallenges: Challenge[];
  onDonate: (amount: number, challengeName: string) => void;
  onApproveChallenge?: (challengeId: string, targetAmount: number) => void;
  onRejectChallenge?: (challengeId: string) => void;
  isCreator?: boolean;
};

const ChallengesDashboard: React.FC<ChallengesDashboardProps> = ({ 
  activeChallenges, 
  requestedChallenges,
  onDonate,
  onApproveChallenge,
  onRejectChallenge,
  isCreator = false
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showDonateDialog, setShowDonateDialog] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [targetAmount, setTargetAmount] = useState<string>('20');
  const [selectedRequestedChallenge, setSelectedRequestedChallenge] = useState<Challenge | null>(null);
  const [showRequestedSection, setShowRequestedSection] = useState(true);
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  const handleChallengeSelect = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };

  const handleRequestedChallengeSelect = (challenge: Challenge) => {
    setSelectedRequestedChallenge(challenge);
    if (isCreator) {
      setShowApproveDialog(true);
      setTargetAmount('20');
    }
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
    onDonate(amount, selectedChallenge.name);
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

  const handleApproveChallenge = () => {
    const amount = parseFloat(targetAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid target amount",
        variant: "destructive",
      });
      return;
    }

    if (selectedRequestedChallenge && onApproveChallenge) {
      onApproveChallenge(selectedRequestedChallenge.id, amount);
      setShowApproveDialog(false);
      setSelectedRequestedChallenge(null);
      toast({
        title: "Challenge Approved",
        description: "The challenge has been approved and is now active",
        variant: "default",
      });
    }
  };

  const handleRejectChallenge = () => {
    if (selectedRequestedChallenge && onRejectChallenge) {
      onRejectChallenge(selectedRequestedChallenge.id);
      setShowApproveDialog(false);
      setSelectedRequestedChallenge(null);
      toast({
        title: "Challenge Rejected",
        description: "The challenge request has been rejected",
        variant: "default",
      });
    }
  };

  return (
    <div className="w-full bg-stream-panel p-4 border border-stream-border rounded-lg">
      <Tabs defaultValue="active" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-stream-darker">
            <TabsTrigger value="active" className="data-[state=active]:bg-stream-panel data-[state=active]:text-neon-orange">
              <Target className="h-4 w-4 mr-1" /> ACTIVE CHALLENGES
            </TabsTrigger>
            <TabsTrigger value="requested" className="data-[state=active]:bg-stream-panel data-[state=active]:text-neon-yellow">
              <Clock className="h-4 w-4 mr-1" /> REQUESTED CHALLENGES {requestedChallenges.length > 0 && 
                <span className="ml-1 bg-neon-red text-white text-xs px-1.5 rounded-full">{requestedChallenges.length}</span>}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="mb-6 flex justify-center">
          <button 
            onClick={() => setShowChallengeModal(true)}
            className="group relative overflow-hidden px-6 py-3 rounded-lg bg-gradient-to-r from-neon-red via-neon-orange to-neon-yellow hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <span className="absolute inset-0 bg-black/20"></span>
            <span className="relative flex items-center gap-2 text-white font-bold tracking-wider">
              <Flame className="h-5 w-5 animate-pulse" />
              REQUEST EXTREME CHALLENGE
              <Flame className="h-5 w-5 animate-pulse" />
            </span>
            <span className="absolute inset-0 -z-10 bg-gradient-to-r from-neon-red via-neon-orange to-neon-yellow opacity-50 blur-xl transition-all duration-500 group-hover:opacity-100"></span>
          </button>
        </div>
        
        <TabsContent value="active" className="pt-0 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeChallenges.map((challenge, index) => {
              const progress = (challenge.currentAmount / challenge.targetAmount) * 100;
              const isSelected = selectedChallenge?.id === challenge.id;
              
              return (
                <div
                  key={challenge.id}
                  className={`
                    opacity-0 translate-y-2
                    animate-fade-in
                    [animation-delay:${index * 50}ms]
                    [animation-fill-mode:forwards]
                  `}
                >
                  <Card 
                    className={`${
                      isSelected ? 'bg-stream-darker border-neon-red shadow-glow-red' : 'bg-stream-darker border-stream-border'
                    } overflow-hidden group hover:border-neon-cyan transition-all duration-300 cursor-pointer`}
                    onClick={() => handleChallengeSelect(challenge)}
                  >
                    <div className="p-4 space-y-4">
                      <h3 className={`${
                        isSelected ? 'text-neon-red' : 'text-neon-cyan'
                      } font-bold text-lg truncate group-hover:text-neon-cyan transition-colors`}>
                        {challenge.name}
                      </h3>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-neon-green font-bold">{progress.toFixed(1)}%</span>
                        </div>
                        
                        <Progress 
                          value={progress} 
                          className="h-2 bg-stream-panel"
                          indicatorClassName={progress >= 100 ? "bg-neon-red animate-pulse" : "bg-neon-green"}
                        />
                        
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
                </div>
              );
            })}
          </div>

          {activeChallenges.length > 0 && (
            <div 
              className="mt-4 flex justify-center gap-2 opacity-0 animate-fade-in [animation-delay:200ms] [animation-fill-mode:forwards]"
            >
              <Button
                onClick={() => setShowDonateDialog(true)}
                disabled={!selectedChallenge}
                className="bg-gradient-to-r from-yellow-500 to-neon-yellow text-black hover:bg-yellow-400 hover:from-neon-yellow hover:to-yellow-500 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CircleDollarSign className="h-4 w-4 mr-1" /> DONATE TO SELECTED CHALLENGE
              </Button>
            </div>
          )}

          {activeChallenges.length === 0 && (
            <div 
              className="text-center p-8 text-gray-400 opacity-0 animate-fade-in [animation-fill-mode:forwards]"
            >
              <AlertTriangle className="mx-auto h-12 w-12 text-neon-orange mb-4 opacity-70" />
              <h3 className="text-lg font-medium text-neon-orange">No Active Challenges</h3>
              <p className="mt-2">There are currently no active challenges to donate to.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="requested" className="pt-0 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requestedChallenges.map((challenge, index) => (
              <div 
                key={challenge.id}
                className={`
                  opacity-0 translate-y-2
                  animate-fade-in
                  [animation-delay:${index * 50}ms]
                  [animation-fill-mode:forwards]
                `}
              >
                <Card 
                  className={`${
                    selectedRequestedChallenge?.id === challenge.id ? 'bg-stream-darker border-neon-yellow shadow-glow-yellow' : 'bg-stream-darker border-stream-border'
                  } overflow-hidden group hover:border-neon-yellow transition-all duration-300 cursor-pointer`}
                  onClick={() => handleRequestedChallengeSelect(challenge)}
                >
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className={`${
                        selectedRequestedChallenge?.id === challenge.id ? 'text-neon-yellow' : 'text-neon-cyan'
                      } font-bold text-lg truncate group-hover:text-neon-yellow transition-colors`}>
                        {challenge.name}
                      </h3>
                      <span className="text-xs bg-neon-yellow text-black px-2 py-0.5 rounded-full">
                        PENDING
                      </span>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Status</span>
                        <span className="text-neon-yellow font-medium flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> Awaiting Approval
                        </span>
                      </div>
                    </div>
                    
                    {isCreator && (
                      <div className="flex items-center justify-end gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequestedChallenge(challenge);
                            handleRejectChallenge();
                          }}
                          className="border-red-600 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequestedChallenge(challenge);
                            setShowApproveDialog(true);
                          }}
                          className="bg-green-700 hover:bg-green-600 text-white"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {requestedChallenges.length === 0 && (
            <div 
              className="text-center p-8 text-gray-400 opacity-0 animate-fade-in [animation-fill-mode:forwards]"
            >
              <ThumbsUp className="mx-auto h-12 w-12 text-neon-yellow mb-4 opacity-70" />
              <h3 className="text-lg font-medium text-neon-yellow">No Pending Requests</h3>
              <p className="mt-2">There are no challenge requests pending approval.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Donate Dialog */}
      <Dialog open={showDonateDialog} onOpenChange={setShowDonateDialog}>
        <DialogContent className="bg-stream-darker border-stream-border shadow-glow-yellow">
          <DialogHeader>
            <DialogTitle className="text-neon-yellow">Donate to Challenge</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedChallenge ? `Supporting: ${selectedChallenge.name}` : 'Select a challenge first'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-2 my-4">
            <button 
              className="flex flex-col items-center justify-center bg-stream-panel border border-neon-yellow p-3 rounded-md hover:bg-yellow-900/20 transition-colors hover:scale-105"
              onClick={() => handleDonate(5)} 
            >
              <span className="text-neon-yellow font-bold text-xl">$5</span>
              <span className="text-xs text-gray-400">Quick Donate</span>
            </button>
            
            <button 
              className="flex flex-col items-center justify-center bg-stream-panel border border-neon-yellow p-3 rounded-md hover:bg-yellow-900/20 transition-colors hover:scale-105"
              onClick={() => handleDonate(10)} 
            >
              <span className="text-neon-yellow font-bold text-xl">$10</span>
              <span className="text-xs text-gray-400">Standard</span>
            </button>
            
            <button 
              className="flex flex-col items-center justify-center bg-stream-panel border border-neon-yellow p-3 rounded-md hover:bg-yellow-900/20 transition-colors hover:scale-105"
              onClick={() => handleDonate(20)} 
            >
              <span className="text-neon-yellow font-bold text-xl">$20</span>
              <span className="text-xs text-gray-400">Premium</span>
            </button>
            
            <button 
              className="flex flex-col items-center justify-center bg-stream-panel border border-neon-yellow p-3 rounded-md hover:bg-yellow-900/20 transition-colors hover:scale-105"
              onClick={() => handleDonate(50)} 
            >
              <span className="text-neon-yellow font-bold text-xl">$50</span>
              <span className="text-xs text-gray-400">Ultimate</span>
            </button>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="bg-stream-panel border-stream-border text-white focus-visible:ring-neon-yellow"
            />
            <Button 
              onClick={handleCustomDonate} 
              className="bg-gradient-to-r from-yellow-600 to-neon-yellow text-black hover:bg-yellow-400 hover:from-yellow-500 hover:to-neon-yellow"
            >
              Donate Custom
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Approve Challenge Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="bg-stream-darker border-stream-border">
          <DialogHeader>
            <DialogTitle className="text-neon-green">Approve Challenge</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedRequestedChallenge ? `Setting target amount for: ${selectedRequestedChallenge.name}` : 'No challenge selected'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Set Target Amount ($):</label>
              <Input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="bg-stream-panel border-stream-border text-white"
                min="1"
                step="5"
              />
              <span className="text-xs text-gray-500">This is the amount viewers need to donate to complete the challenge</span>
            </div>
            
            <div className="pt-4 flex justify-end space-x-2">
              <Button
                onClick={() => {
                  setShowApproveDialog(false);
                  setSelectedRequestedChallenge(null);
                }}
                variant="outline"
                className="border-stream-border text-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectChallenge}
                variant="destructive"
                className="bg-red-700 hover:bg-red-600"
              >
                <XCircle className="h-4 w-4 mr-1" /> Reject
              </Button>
              <Button
                onClick={handleApproveChallenge}
                className="bg-green-700 hover:bg-green-600"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" /> Approve Challenge
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request Challenge Modal */}
      <Dialog open={showChallengeModal} onOpenChange={setShowChallengeModal}>
        <DialogContent className="bg-stream-darker border-stream-border">
          <DialogHeader>
            <DialogTitle className="text-neon-red">Request Extreme Challenge</DialogTitle>
            <DialogDescription className="text-gray-400">
              Please fill out the form below to request an extreme challenge.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Challenge Name:</label>
              <Input
                type="text"
                placeholder="Enter challenge name"
                className="bg-stream-panel border-stream-border text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Target Amount ($):</label>
              <Input
                type="number"
                placeholder="Enter target amount"
                className="bg-stream-panel border-stream-border text-white"
                min="1"
                step="5"
              />
            </div>
            
            <div className="pt-4 flex justify-end space-x-2">
              <Button
                onClick={() => setShowChallengeModal(false)}
                variant="outline"
                className="border-stream-border text-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowChallengeModal(false);
                  // Handle request logic here
                }}
                className="bg-green-700 hover:bg-green-600"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" /> Request Challenge
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChallengesDashboard;
