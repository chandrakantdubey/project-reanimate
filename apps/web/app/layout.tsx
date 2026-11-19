import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'REANIMATE — Incident Command',
  description: 'Evidence-driven incident investigation with human-approved recovery.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
