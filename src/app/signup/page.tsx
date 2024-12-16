'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import { useLanguage } from '@/hooks/useLanguage';
import pagesContent from '@/app/content/pages';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();
  const lang = useLanguage();
  const t = pagesContent[lang as keyof typeof pagesContent].signup;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await register(email, password);
      router.push('/');
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            setError(t.errors.emailInUse);
            break;
          case 'auth/weak-password':
            setError(t.errors.weakPassword);
            break;
          case 'auth/invalid-email':
            setError(t.errors.invalidEmail);
            break;
          default:
            setError(t.errors.generic);
        }
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Input
              type="email"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <Input
              type="password"
              placeholder={t.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              minLength={6}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t.loading : t.signUp}
            </Button>
            <Link href="/login" className="text-sm text-muted-foreground hover:underline">
              {t.loginLink}
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 