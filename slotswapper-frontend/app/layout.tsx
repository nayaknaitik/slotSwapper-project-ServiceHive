// /app/layout.tsx
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'SlotSwapper',
  description: 'Peer-to-peer time-slot swapping app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
