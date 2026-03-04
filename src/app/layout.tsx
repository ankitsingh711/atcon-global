import type { Metadata } from 'next';
import ClientLayout from '@/components/layout/ClientLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'Operations Hub - Project Management',
  description: 'Manage all projects, tasks, and timesheets',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
