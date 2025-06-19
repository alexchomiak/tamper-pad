import React from 'react';
import { MacroProvider } from './MacroContext';
import { MacroPrompt } from './MacroPrompt';
import { AddMacroModal } from './AddMacroModal';

export const App: React.FC = () => {
  return (
    <MacroProvider>
      <MacroPrompt />
    </MacroProvider>
  );
};
