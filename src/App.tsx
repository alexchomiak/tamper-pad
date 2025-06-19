import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

import { MacroProvider } from './MacroContext';
import { MacroPrompt } from './MacroPrompt';

// Custom Chakra theme with unique CSS var prefix
const theme = extendTheme({
  config: {
    cssVarPrefix: 'macro', // Avoids collision with host page's chakra
  },
});

export const App: React.FC = () => {
  const chakraStylesPresent = !!document.querySelector('style[data-emotion]');
  const isDenyListed = window.location.hostname.includes('chat.openai.com') || window.location.hostname.includes("chatgpt.com") || window.location.hostname.includes("github.com")
  if(chakraStylesPresent || isDenyListed) {
    return (
        <MacroProvider>
          <MacroPrompt />
        </MacroProvider>
    )
  }

  return (
      <ChakraProvider theme={theme}>
        <MacroProvider>
          <MacroPrompt />
        </MacroProvider>
      </ChakraProvider>
  );
};
