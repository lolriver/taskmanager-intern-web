'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getApiErrorMessage, type ApiErrorPayload } from '@/lib/api-errors';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json().catch(() => null)) as ApiErrorPayload | { user: { id: string; name: string; email: string } } | null;

      if (res.ok && data && 'user' in data) {
        toast.success('Logged in successfully');
        login(data.user);
      } else {
        toast.error(getApiErrorMessage(data as ApiErrorPayload | null, 'Login failed'));
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/3 w-[800px] h-[800px] opacity-20 pointer-events-none blur-[120px] bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full" />

      <div className="hidden lg:flex w-1/2 border-r border-border/50 bg-muted/20 items-center justify-center relative p-12">
        <div className="z-10 max-w-lg space-y-6">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
          </Link>
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/30">
            <svg className="w-8 h-8 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Welcome back to FocusFlow</h1>
          <p className="text-lg text-muted-foreground">Log in to securely access your workspace, manage tasks, and drive your projects forward.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
            </Link>
          </div>

          <Card className="border border-border/50 shadow-2xl shadow-primary/5 bg-background/80 backdrop-blur-xl rounded-2xl">
            <CardHeader className="space-y-2 text-center pb-8 pt-8">
              <CardTitle className="text-3xl font-bold tracking-tight">Sign In</CardTitle>
              <CardDescription className="text-base">Enter your email and password to continue.</CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-5 px-8">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 bg-muted/50 focus:bg-background transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 bg-muted/50 focus:bg-background transition-colors"
                    placeholder="********"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 px-8 pb-8 pt-4">
                <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20" disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                </Button>
                <div className="text-center text-sm text-muted-foreground mt-4">
                  Don't have an account?{' '}
                  <Link href="/register" className="font-semibold text-primary hover:underline">
                    Create one
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
