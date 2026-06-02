import { LocaleProvider } from '@/lib/LocaleContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import { Toaster } from 'react-hot-toast';
import '../globals.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgba(15, 23, 42, 0.95)',
              color: '#fff',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              backdropFilter: 'blur(12px)',
            },
          }}
        />
      </LocaleProvider>
    </ThemeProvider>
  );
}
