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
  metadataBase: new URL('https://prepacrisis.vercel.app'),
  title: {
    default: 'PrépaCrisis - Résilience & Sécurité Familiale Hors-Ligne',
    template: '%s | PrépaCrisis',
  },
  description:
    'Application PWA autonome de préparation civile : gestion des stocks, autonomie hydrique, défense de domicile R+3, gestion de famille personnalisée et plan d\'urgence 100% hors-ligne.',
  keywords: [
    'résilience civile',
    'préparation urgence',
    'sécurité familiale',
    'autonomie eau',
    'Maroc',
    'PWA hors-ligne',
    'gestion de crise',
    'plan familial',
    'défense R+3',
  ],
  authors: [{ name: 'Nova Squad' }],
  creator: 'Nova Squad',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.svg' },
    ],
    shortcut: ['/icon.svg'],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://prepacrisis.vercel.app',
    siteName: 'PrépaCrisis',
    title: 'PrépaCrisis - Résilience Civile & Sécurité Familiale d\'Urgence',
    description:
      'Application PWA autonome pour assurer la résilience de votre famille en situation de crise (eau, vivres, énergie, statuts des membres, défense R+3) 100% hors-ligne.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PrépaCrisis - Application PWA de Sécurité et Résilience Familiale',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrépaCrisis - Résilience Civile & Sécurité Familiale Hors-Ligne',
    description:
      'Application PWA d\'autonomie civile : stocks, eau, défense R+3, statuts des membres de la famille et fiches d\'urgence sans connexion.',
    images: ['/og-image.png'],
  },
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
