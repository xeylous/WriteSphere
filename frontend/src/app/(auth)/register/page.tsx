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
import { User as UserIcon, Mail, Lock, AlertCircle, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import Script from 'next/script';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: signup, googleLogin } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setFormError(null);
      setLoading(true);
      await signup(values);
    } catch (err: any) {
      setFormError(err.message || 'Registration failed. Email might already exist.');
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
        document.getElementById('google-signup-btn'),
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
        {/* Unique Background Grid Pattern for Register: Mesh grid and rotating blobs */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Glow circles */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-secondary/25 blur-3xl"
          animate={{
            x: [30, -30, 30],
            y: [50, -50, 50],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '15%', right: '10%' }}
        />
        <motion.div
          className="absolute w-[450px] h-[450px] rounded-full bg-accent-surface/30 blur-3xl"
          animate={{
            x: [-40, 40, -40],
            y: [-30, 30, -30],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ bottom: '10%', left: '10%' }}
        />

        {/* Left Side Floating Quote Card (Large Screens) */}
        <motion.div
          className="hidden xl:flex absolute left-12 bottom-1/4 max-w-xs bg-surface/30 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-lg flex-col gap-3 relative z-10"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Quote className="w-6 h-6 text-primary/45" />
          <p className="text-xs font-heading font-medium text-heading leading-relaxed italic">
            "We migrated our engineering blogs to WriteSphere in minutes. Markdown parsing and page optimization are superb."
          </p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-secondary/30 text-[9px] font-bold text-primary flex items-center justify-center">
              AR
            </div>
            <div>
              <p className="text-[10px] font-bold text-heading">Alex Rivera</p>
              <p className="text-[8px] text-muted">Lead Systems Architect</p>
            </div>
          </div>
        </motion.div>

        {/* Right Side Floating Quote Card (Large Screens) */}
        <motion.div
          className="hidden xl:flex absolute right-12 top-1/4 max-w-xs bg-surface/30 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-lg flex-col gap-3 relative z-10"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <Quote className="w-6 h-6 text-primary/45" />
          <p className="text-xs font-heading font-medium text-heading leading-relaxed italic">
            "Finally, a writing platform that prioritizes developer experience and typographic clean layouts. Pure joy to write."
          </p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 text-[9px] font-bold text-primary flex items-center justify-center">
              KD
            </div>
            <div>
              <p className="text-[10px] font-bold text-heading">Kian Dev</p>
              <p className="text-[8px] text-muted">Technical Writer</p>
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
            <h1 className="text-2xl font-heading font-extrabold text-heading">Create Account</h1>
            <p className="text-sm text-body">Join our community of readers and writers</p>
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
              label="Full Name"
              type="text"
              placeholder="Sarah Chen"
              icon={<UserIcon className="w-4 h-4" />}
              error={errors.name?.message}
              {...register('name')}
            />

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
              Get Started
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
              <div id="google-signup-btn" className="w-full flex justify-center min-h-[40px]"></div>
            </div>
          </div>

          <p className="text-center text-sm text-muted mt-8 pt-6 border-t border-border-custom/30">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
