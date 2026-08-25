import type { Metadata } from 'next';
import Script from 'next/script';
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TY1D31838G"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-TY1D31838G');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
