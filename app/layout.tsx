import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Amaro Pedro da Silva Junior | Desenvolvedor Full Stack',
  description: 'Portfólio profissional e currículo de Amaro Pedro da Silva Junior - Desenvolvedor Full Stack especializado em E-commerce, ERPs, APIs escaláveis e automação.',
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
