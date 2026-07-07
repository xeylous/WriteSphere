'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { HeroSection } from '@/features/home/components/HeroSection';
import { TrendingSection } from '@/features/home/components/TrendingSection';
import { CategoriesSection } from '@/features/home/components/CategoriesSection';
import { LatestBlogsSection } from '@/features/home/components/LatestBlogsSection';
import { FeaturedAuthorsSection } from '@/features/home/components/FeaturedAuthorsSection';

/**
 * WriteSphere Homepage
 * Premium editorial layout with hero, trending, categories, latest blogs,
 * and featured authors sections.
 */
export default function HomePage() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        <HeroSection />

        <div className="space-y-0">
          <TrendingSection />

          <CategoriesSection />

          <LatestBlogsSection />

          <FeaturedAuthorsSection />
        </div>
      </div>
      <Footer />
    </>
  );
}
