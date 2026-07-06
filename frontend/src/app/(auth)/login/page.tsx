'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Navbar } from '@/components/layout/Navbar';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Mail, Lock, AlertCircle, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import Script from 'next/script';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setFormError(null);
      setLoading(true);
      await login(values);
    } catch (err: any) {
      setFormError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleResponse = async (response: any) => {
    try {
      setFormError(null);
      setLoading(true);
      await googleLogin(response.credential);
    } catch (err: any) {
      setFormError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const initGoogleSdk = () => {
    if (typeof window !== 'undefined' && (window as any).google) {
      (window as any).google.accounts.id.initialize({
        client_id: '967264024254-16n0bkeq3dm8kc69ubh65qjteqtf6mio.apps.googleusercontent.com',
        callback: handleGoogleResponse,
      });
      (window as any).google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'outline', size: 'large', width: '370' }
      );
    }
  };

  useEffect(() => {
    initGoogleSdk();
  }, []);

  return (
    <>
      <Navbar />
      <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" onLoad={initGoogleSdk} />
      <div className="min-h-screen flex items-center justify-center bg-bg relative overflow-hidden px-4 pt-20 pb-12">
        {/* Subtle grid pattern spanning the background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

        {/* Diagonal stripes grid lines overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-stripes-pattern" />
        
        {/* Unique Background Pattern for Login: Abstract rotating primary HSL blobs */}
        <motion.div
          className="absolute w-[450px] h-[450px] rounded-full bg-primary/20 blur-3xl"
          animate={{
            x: [-50, 50, -50],
            y: [-30, 30, -30],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-[350px] h-[350px] rounded-full bg-secondary/25 blur-3xl"
          animate={{
            x: [50, -50, 50],
            y: [30, -30, 30],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ bottom: '15%', right: '10%' }}
        />

        {/* Floating geometric dots */}
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.05] pointer-events-none" />

        {/* Left Side Floating Quote Card (Large Screens) */}
        <motion.div
          className="hidden xl:flex absolute left-12 top-1/3 max-w-xs bg-surface/30 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-lg flex-col gap-3 relative z-10"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Quote className="w-6 h-6 text-primary/45" />
          <p className="text-xs font-heading font-medium text-heading leading-relaxed italic">
            "The slash command editor is a total game changer. Writing draft blogs has never felt this fluid and fast."
          </p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 text-[9px] font-bold text-primary flex items-center justify-center">
              SC
            </div>
            <div>
              <p className="text-[10px] font-bold text-heading">Sarah Chen</p>
              <p className="text-[8px] text-muted">AI Research Scientist</p>
            </div>
          </div>
        </motion.div>

        {/* Right Side Floating Quote Card (Large Screens) */}
        <motion.div
          className="hidden xl:flex absolute right-12 bottom-1/4 max-w-xs bg-surface/30 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-lg flex-col gap-3 relative z-10"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Quote className="w-6 h-6 text-primary/45" />
          <p className="text-xs font-heading font-medium text-heading leading-relaxed italic">
            "Finally, a blog platform with a premium editorial layout and no bloated widgets. Extremely aesthetic."
          </p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-secondary/35 text-[9px] font-bold text-primary flex items-center justify-center">
              MJ
            </div>
            <div>
              <p className="text-[10px] font-bold text-heading">Maya Johnson</p>
              <p className="text-[8px] text-muted">Senior Product Designer</p>
            </div>
          </div>
        </motion.div>

        {/* Glassmorphic Form Card */}
        <motion.div
          className="w-full max-w-md relative z-10 bg-surface/40 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl rounded-2xl p-8 sm:p-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-center space-y-3 mb-8">
            <Link href="/" className="inline-flex items-center gap-2 group mb-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-heading font-heading font-extrabold text-lg tracking-tight">
                WriteSphere
              </span>
            </Link>
            <h1 className="text-2xl font-heading font-extrabold text-heading">Welcome back</h1>
            <p className="text-sm text-body">Enter your email and password to sign in</p>
          </div>

          {formError && (
            <motion.div
              className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-[var(--radius-md)] flex items-center gap-2 text-xs font-semibold"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" fullWidth isLoading={loading} className="py-2.5 mt-2">
              Sign In
            </Button>
          </form>

          {/* Google Sign In Divider & Button */}
          <div className="space-y-4 mt-6">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-border-custom/50"></div>
              <span className="flex-shrink mx-4 text-xs text-muted">or continue with</span>
              <div className="flex-grow border-t border-border-custom/50"></div>
            </div>

            <div className="flex justify-center w-full">
              <div id="google-signin-btn" className="w-full flex justify-center min-h-[40px]"></div>
            </div>
          </div>

          <p className="text-center text-sm text-muted mt-8 pt-6 border-t border-border-custom/30">
            New to WriteSphere?{' '}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              Get Started
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
