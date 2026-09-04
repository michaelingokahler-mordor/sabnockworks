import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sabnock Works | Independent Game Studio',
  description: 'Old souls. New tools. Strange routes and fallen worlds.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
