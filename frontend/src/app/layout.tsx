import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { AppProviders } from '@/components/providers/AppProviders';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'WriteSphere — Where Ideas Take Shape',
    template: '%s | WriteSphere',
  },
  description:
    'A premium AI-powered blogging platform for creators and readers. Write beautifully, read intelligently.',
  keywords: ['blog', 'writing', 'AI', 'content', 'publishing', 'WriteSphere'],
  authors: [{ name: 'WriteSphere' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'WriteSphere',
    title: 'WriteSphere — Where Ideas Take Shape',
    description:
      'A premium AI-powered blogging platform for creators and readers.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WriteSphere — Where Ideas Take Shape',
    description:
      'A premium AI-powered blogging platform for creators and readers.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preload editorial fonts from Google Fonts CDN */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap"
          rel="stylesheet"
        />
        {/* Prevent theme flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('writesphere-theme') || 'dark';
                if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-bg text-body antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <AppProviders>
          <main id="main-content">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
