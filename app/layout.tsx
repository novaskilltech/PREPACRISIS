import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/components/AppContext';
import BottomNav from '@/components/BottomNav';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'PrépaCrisis - Résilience & Sécurité Familiale',
  description: 'Application autonome de préparation civile et résilience familiale hors-ligne.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PrépaCrisis',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="moderne" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="bg-slate-100 font-sans text-slate-800 min-h-screen flex flex-col selection:bg-blue-600 selection:text-white antialiased">
        <AppProvider>
          <div className="flex-1 flex flex-col max-w-lg mx-auto w-full relative bg-slate-50 border-x border-slate-200/80 shadow-sm min-h-screen">
            {children}
            <BottomNav />
          </div>
        </AppProvider>

        {/* Enregistrement automatique du Service Worker pour PWA 100% hors-ligne */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('[PWA] ServiceWorker enregistré avec succès:', registration.scope);
                      registration.update();
                    },
                    function(err) {
                      console.log('[PWA] Échec enregistrement ServiceWorker:', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
