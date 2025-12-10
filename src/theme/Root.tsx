import React from 'react';
import { AuthProvider } from '../components/Auth/AuthProvider';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}