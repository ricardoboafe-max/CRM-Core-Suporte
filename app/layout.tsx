import type {Metadata} from 'next';
import { Chivo, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const chivo = Chivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-chivo',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  title: 'Field Operations Precision CRM',
  description: 'CRM de alta precisão técnica para gerenciamento eficiente de contatos corporativos, clientes de campo e ordens de serviço.',
  openGraph: {
    title: 'Field Operations Precision CRM',
    description: 'CRM de alta precisão técnica para gerenciamento eficiente de contatos corporativos, clientes de campo e ordens de serviço.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Field Operations Precision CRM',
    description: 'CRM de alta precisão técnica para gerenciamento eficiente de contatos corporativos, clientes de campo e ordens de serviço.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${chivo.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#F4F6F9] text-[#121820] antialiased min-h-screen selection:bg-[#00A3BF]/20 selection:text-[#0A2540]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
