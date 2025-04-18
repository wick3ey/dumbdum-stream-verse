
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShieldAlert, Info } from 'lucide-react';

const Auth = () => {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-stream-dark text-white flex items-center justify-center p-4">
      <div className="scanlines pointer-events-none fixed inset-0 z-50"></div>
      <Card className="w-full max-w-md border border-stream-border bg-stream-panel">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl text-center text-neon-cyan">DumDummies</CardTitle>
          <CardDescription className="text-neon-green text-center">Join the craziest stream community</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6 bg-stream-dark">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm onLogin={signIn} />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm onRegister={signUp} />
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 border-t border-stream-border pt-4">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <ShieldAlert size={16} />
              <span>Account protection enabled</span>
            </div>
            <p className="text-xs text-gray-400">
              For your security, multiple failed login attempts will temporarily lock your account.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const LoginForm = ({ onLogin }: { onLogin: (username: string, password: string) => Promise<boolean> }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    if (!username || !password) {
      setError("Username and password are required");
      setIsLoading(false);
      return;
    }
    
    try {
      const success = await onLogin(username, password);
      
      if (success) {
        navigate('/');
      } else {
        // Error message is handled by the onLogin function
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="bg-red-900 border-red-700 text-white">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="YourUsername"
          className="bg-stream-dark border-stream-border"
          autoComplete="username"
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="bg-stream-dark border-stream-border"
          autoComplete="current-password"
          disabled={isLoading}
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-neon-cyan hover:bg-neon-cyan/80 text-black"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Verifying...
          </>
        ) : 'Login'}
      </Button>
    </form>
  );
};

const RegisterForm = ({ onRegister }: { onRegister: (username: string, password: string) => Promise<boolean> }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate inputs
    if (!username) {
      setError("Username is required");
      return;
    }
    
    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    
    // Check for suspicious usernames
    if (/^(admin|root|system)$/i.test(username)) {
      setError("This username is reserved. Please choose another.");
      return;
    }
    
    if (!password) {
      setError("Password is required");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    // Additional password strength check
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasUpperCase || !hasNumber) {
      setError("Password must include at least one uppercase letter and one number");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    const success = await onRegister(username, password);
    setIsLoading(false);
    
    if (success) {
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="bg-red-900 border-red-700 text-white">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="CoolUser123"
          className="bg-stream-dark border-stream-border"
          autoComplete="username"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-400">Must be at least 3 characters</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="bg-stream-dark border-stream-border"
          autoComplete="new-password"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-400">Must be at least 6 characters with 1 uppercase letter and 1 number</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="bg-stream-dark border-stream-border"
          autoComplete="new-password"
          disabled={isLoading}
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-neon-magenta hover:bg-neon-magenta/80 text-black"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Creating account...
          </>
        ) : 'Create Account'}
      </Button>
      
      <div className="flex items-center gap-2 mt-4 p-2 bg-stream-dark/50 rounded-md">
        <Info size={16} className="text-yellow-400" />
        <p className="text-xs text-yellow-400">
          Strong passwords are crucial for account security.
        </p>
      </div>
    </form>
  );
};

export default Auth;
