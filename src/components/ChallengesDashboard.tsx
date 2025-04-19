
import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { 
  CircleDollarSign, 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Clock,
  ThumbsUp,
  Flame,
  AlertCircle,
  Zap,
  Skull,
  X
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { createChallenge } from '@/services/supabaseService';
import { useViewMode } from '@/App';
import { toast } from 'sonner';

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
  onCreateChallenge: (challengeName: string) => void;
  isCreator?: boolean;
};

const ChallengesDashboard: React.FC<ChallengesDashboardProps> = ({ 
  activeChallenges, 
  requestedChallenges,
  onDonate,
  onApproveChallenge,
  onRejectChallenge,
  onCreateChallenge,
  isCreator = false
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { viewMode, isCurrentUserCreator } = useViewMode();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showDonateDialog, setShowDonateDialog] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [targetAmount, setTargetAmount] = useState<string>('20');
  const [selectedRequestedChallenge, setSelectedRequestedChallenge] = useState<Challenge | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeName, setChallengeName] = useState('');
  const [securityChecks, setSecurityChecks] = useState({
    creatorVerified: false,
    buttonDisabled: false
  });
  
  const extremeChallenges = [
    "DRINK PISS",
    "EAT POOP",
    "SHAVE HEAD",
    "SWALLOW LIVE INSECTS",
    "LICK TOILET BOWL",
    "RUB HOT SAUCE IN EYES",
    "CHEW GLASS",
    "STAPLE YOUR LIP",
    "BATHE IN ICE WATER",
    "DRINK TABASCO BOTTLE",
    "EAT RAW ANIMAL ORGAN"
  ];

  // Security verification effect
  useEffect(() => {
    const verifyCreatorPermissions = () => {
      const userIsCreator = isCurrentUserCreator();
      const correctMode = viewMode === "creator";
      
      setSecurityChecks({
        creatorVerified: userIsCreator && correctMode,
        buttonDisabled: !(userIsCreator && correctMode) && isCreator
      });
      
      // If someone tries to manipulate the component props directly
      if (isCreator && !userIsCreator && correctMode) {
        console.error("Security violation: Non-creator attempting to access creator features");
        toast.error("You are not authorized to access creator features");
      }
    };
    
    verifyCreatorPermissions();
  }, [viewMode, isCreator, isCurrentUserCreator]);

  const handleChallengeSelect = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };

  const handleRequestedChallengeSelect = (challenge: Challenge) => {
    setSelectedRequestedChallenge(challenge);
    
    // Only allow creator to open approve dialog
    if (securityChecks.creatorVerified) {
      setShowApproveDialog(true);
      setTargetAmount('20');
    } else if (isCreator) {
      // If someone is trying to access creator features without permission
      toast.error("You don't have permission to approve challenges");
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
    // Additional security check
    if (!securityChecks.creatorVerified) {
      console.error("Security violation: Non-creator attempting to approve challenge");
      toast.error("Security violation: Unauthorized action");
      return;
    }

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
    // Additional security check
    if (!securityChecks.creatorVerified) {
      console.error("Security violation: Non-creator attempting to reject challenge");
      toast.error("Security violation: Unauthorized action");
      return;
    }

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

  const handleCreateChallenge = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "You must be logged in to request a challenge",
        variant: "destructive",
      });
      return;
    }
    
    if (!challengeName.trim()) {
      toast({
        title: "Challenge required",
        description: "Please enter a challenge name",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await createChallenge({
        channel_id: "00000000-0000-0000-0000-000000000000",
        name: challengeName.toUpperCase(),
        user_id: user.id
      });
      
      onCreateChallenge(challengeName);
      
      setShowChallengeModal(false);
      setChallengeName('');
      
      toast({
        title: "Challenge Requested",
        description: `Your challenge "${challengeName.toUpperCase()}" has been submitted for approval`,
      });
    } catch (error: any) {
      console.error('Error creating challenge:', error);
      toast({
        title: "Request failed",
        description: error.message || "Failed to submit your challenge request",
        variant: "destructive",
      });
    }
  };

  const handlePredefinedChallenge = (challenge: string) => {
    onCreateChallenge(challenge);
    setShowChallengeModal(false);
  };

  const isCurrentUserTheCreator = isCurrentUserCreator();
  const canAccessCreatorFeatures = isCreator && isCurrentUserTheCreator && viewMode === "creator";

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
            className="group relative overflow-hidden px-8 py-4 rounded-lg bg-gradient-to-r from-red-600 via-neon-red to-orange-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-red-500/50"
          >
            <span className="absolute inset-0 bg-black/20"></span>
            <div className="relative flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Flame className="h-6 w-6 animate-pulse text-yellow-300" />
                <span className="text-white font-extrabold text-xl tracking-wider uppercase">REQUEST EXTREME CHALLENGE</span>
                <Flame className="h-6 w-6 animate-pulse text-yellow-300" />
              </div>
              <span className="text-yellow-200 text-sm">Click to submit your craziest ideas!</span>
            </div>
            <span className="absolute inset-0 -z-10 bg-gradient-to-r from-red-600 via-neon-red to-orange-600 opacity-50 blur-xl transition-all duration-500 group-hover:opacity-100"></span>
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
                  className="animate-fade-in-up"
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'forwards',
                    opacity: 0,
                    transform: 'translateY(10px)'
                  }}
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
            <div className="mt-4 flex justify-center gap-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
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
            <div className="text-center p-8 text-gray-400 animate-fade-in-up">
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
                className="animate-fade-in-up"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'forwards',
                  opacity: 0,
                  transform: 'translateY(10px)'
                }}
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
                    
                    {/* Only show approve/reject buttons if user is the creator */}
                    {canAccessCreatorFeatures && (
                      <div className="flex items-center justify-end gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequestedChallenge(challenge);
                            handleRejectChallenge();
                          }}
                          disabled={securityChecks.buttonDisabled}
                          className="border-red-600 text-red-500 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          disabled={securityChecks.buttonDisabled}
                          className="bg-green-700 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="text-center p-8 text-gray-400 animate-fade-in-up">
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
              className="bg-gradient-to-r from-yellow-600 to-neon-yellow text-black hover:bg-yellow-400 hover:from-neon-yellow hover:to-neon-yellow"
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
                disabled={securityChecks.buttonDisabled}
              >
                <XCircle className="h-4 w-4 mr-1" /> Reject
              </Button>
              <Button
                onClick={handleApproveChallenge}
                className="bg-green-700 hover:bg-green-600"
                disabled={securityChecks.buttonDisabled}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" /> Approve Challenge
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request Challenge Modal - Enhanced with cartoon style */}
      <Dialog open={showChallengeModal} onOpenChange={setShowChallengeModal}>
        <DialogContent className="bg-stream-darker border-2 border-red-500 max-w-2xl p-0 rounded-lg shadow-glow-red overflow-hidden">
          <DialogHeader className="bg-gradient-to-r from-red-900 to-stream-panel p-4 border-b border-stream-border">
            <DialogTitle className="text-neon-red text-3xl font-extrabold flex items-center gap-2 font-comic">
              <Skull className="h-8 w-8 animate-pulse" />
              REQUEST EXTREME CHALLENGE
              <Skull className="h-8 w-8 animate-pulse" />
            </DialogTitle>
            <DialogDescription className="text-yellow-300 text-xl font-bold">
              Submit your wildest challenge for the streamer to perform!
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 bg-stream-darker">
            <div className="mb-6">
              <h3 className="block text-neon-cyan mb-4 font-extrabold text-2xl text-center uppercase animate-pulse-bright">
                CHOOSE EXTREME CHALLENGE
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                {extremeChallenges.map((challenge, index) => (
                  <div
                    key={index}
                    className="animate-fade-in-up"
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'forwards',
                      opacity: 0,
                      transform: 'translateY(10px)'
                    }}
                  >
                    <button
                      onClick={() => handlePredefinedChallenge(challenge)}
                      className="w-full bg-gradient-to-r from-red-900/80 to-red-600/80 p-4 border-2 border-red-500 rounded-lg hover:border-neon-red hover:shadow-glow-red transition-all duration-200 group"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-neon-red font-extrabold text-lg">{challenge}</span>
                        <Zap className="text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="block text-neon-cyan mb-4 font-extrabold text-2xl text-center uppercase animate-pulse-bright">
                OR CREATE YOUR OWN
              </h3>
              
              <div className="relative">
                <Input
                  type="text"
                  value={challengeName}
                  onChange={(e) => setChallengeName(e.target.value)}
                  placeholder="Enter your extreme challenge here"
                  className="p-4 bg-stream-panel text-2xl text-white font-bold border-2 border-stream-border rounded-lg focus:border-neon-red focus:ring-neon-red placeholder:text-gray-500"
                />
                {challengeName && (
                  <Button 
                    onClick={() => setChallengeName('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent p-1"
                    variant="ghost"
                  >
                    <X size={20} className="text-gray-400 hover:text-white" />
                  </Button>
                )}
              </div>
              
              <div className="mt-2 text-sm text-yellow-300 italic text-center">
                Be creative but ensure your challenge idea is appropriate for streaming!
              </div>
            </div>
            
            <DialogFooter className="flex justify-center pt-4 gap-4">
              <Button
                onClick={() => setShowChallengeModal(false)}
                variant="outline"
                className="border-stream-border text-gray-300 hover:bg-stream-panel w-1/3"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateChallenge}
                disabled={!challengeName.trim()}
                className="w-2/3 bg-gradient-to-r from-red-700 to-neon-red text-white hover:from-neon-red hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-glow-red p-6 text-xl font-extrabold"
              >
                <Flame className="mr-2 h-6 w-6 animate-pulse" />
                SUBMIT CHALLENGE!
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChallengesDashboard;
