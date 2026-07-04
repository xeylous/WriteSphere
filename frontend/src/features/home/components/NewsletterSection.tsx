'use client';

import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';

/**
 * Newsletter signup section with decorative grid background.
 * Captures email for weekly newsletter delivery.
 */
export function NewsletterSection() {
  return (
    <section className="py-20 border-t border-border-custom relative overflow-hidden">
      {/* Decorative grid background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

      <Container size="sm">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <Mail className="w-5 h-5 text-primary" />
          </div>

          <h2 className="text-2xl md:text-3xl font-heading font-bold text-heading mb-3">
            Stay curious.
          </h2>
          <p className="text-body text-base mb-8 max-w-md mx-auto">
            Get the best stories, tutorials, and insights from WriteSphere delivered to your inbox every week. No spam, ever.
          </p>

          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 h-11 px-4 bg-surface border border-border-custom rounded-[var(--radius-md)] text-heading placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
              aria-label="Email address for newsletter"
              required
            />
            <Button type="submit" size="md" className="shrink-0 h-11">
              Subscribe
            </Button>
          </form>

          <p className="text-xs text-muted mt-4">
            Join 2,400+ readers. Unsubscribe anytime.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
