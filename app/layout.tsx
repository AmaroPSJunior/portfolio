import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portfólio & Laboratório de Projetos - Amaro Pedro',
  description: 'Painel de Homologação, Roadmap e Portfólio de Projetos por Amaro Pedro da Silva Junior',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
