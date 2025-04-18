
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
        </CardContent>
      </Card>
    </div>
  );
};

const LoginForm = ({ onLogin }: { onLogin: (email: string, password: string) => Promise<boolean> }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await onLogin(email, password);
    setIsLoading(false);
    
    if (success) {
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="bg-stream-dark border-stream-border"
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
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-neon-cyan hover:bg-neon-cyan/80 text-black"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};

const RegisterForm = ({ onRegister }: { onRegister: (email: string, password: string, username: string) => Promise<boolean> }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await onRegister(email, password, username);
    setIsLoading(false);
    
    if (success) {
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="bg-stream-dark border-stream-border"
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
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-neon-magenta hover:bg-neon-magenta/80 text-black"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default Auth;
