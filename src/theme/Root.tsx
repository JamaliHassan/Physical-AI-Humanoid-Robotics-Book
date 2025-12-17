import React from 'react';
import { UserProvider } from '../context/UserContext';
import { PersonalizationProvider } from '../services/personalization';
import { TranslationProvider } from '../services/translation';
import ChatWidget from '../components/Chat/ChatWidget';
import SelectionListener from '../components/Chat/SelectionListener';
import AuthSpecificControls from './AuthSpecificControls';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <PersonalizationProvider>
        <TranslationProvider>
          {children}
          <AuthSpecificControls />
          <ChatWidget />
          <SelectionListener />
        </TranslationProvider>
      </PersonalizationProvider>
    </UserProvider>
  );
}