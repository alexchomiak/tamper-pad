import {
  Box,
  Input,
  HStack,
  IconButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, SettingsIcon } from '@chakra-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useMacros } from './MacroContext';
import { AddMacroModal } from './AddMacroModal';
import { SettingsModal } from './SettingsModal';

export const MacroPrompt: React.FC = () => {
  const { macros } = useMacros();
  const [input, setInput] = useState('');
  const [visible, setVisible] = useState(false);
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();
  const toast = useToast();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '.') {
        e.preventDefault();
        setVisible(v => !v);
        onAddClose();
        onSettingsClose();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onAddClose, onSettingsClose]);

  const runMacro = (input: string) => {
    const [name, ...args] = input.split(' ');
    const macro = macros.find(m => m.name === name);
    if (!macro) return alert(`Macro "${name}" not found.`);
  
    try {
      if (macro.type === 'script') {
        new Function(macro.code!)();
      } else if (macro.type === 'url') {
        const query = encodeURIComponent(args.join(' '));
        const finalUrl = macro.url?.replace(/%s/g, query);
        if (finalUrl) window.location.href = finalUrl;
      } 
      else if (macro.type == "internal") {
        if(macro.name == "@clearQueue") {
           GM_setValue('__deferred_macro_exec__', '[]')
           toast({
            title: 'Cleared Queue.',
            description: 'Deferred Macro Execution Cleared',
            duration: 3000,
            isClosable: true,
          });
        }
      }
      else if (macro.type === 'deferred-script') {
        const current = GM_getValue('__deferred_macro_exec__', '[]');
        let queue: any[] = [];
  
        try {
          queue = JSON.parse(current);
        } catch (e) {
          console.warn('[Macro] Could not parse deferred queue:', e);
        }
  
        queue.push({
          //@ts-ignore
          origin: macro.origin,
          code: macro.code,
          args: args.join(' ')
        });
  
        GM_setValue('__deferred_macro_exec__', JSON.stringify(queue));
        //@ts-ignore
        window.location.href = macro.origin;
      }
    } catch (err) {
      alert(`Error: ${err}`);
    }
  
    setInput('');
    setVisible(false);
  };

  const handleAddClick = () => {
    setVisible(false);
    onAddOpen();
  };

  const handleSettingsClick = () => {
    setVisible(false);
    onSettingsOpen();
  };

  return (
    <>
      {isAddOpen && <AddMacroModal onClose={onAddClose} onMacroAdded={() => setVisible(false)} />}
      {isSettingsOpen && <SettingsModal onClose={onSettingsClose} />}
      {visible && (
        <>
          <Box
            position="fixed"
            top="0"
            left="0"
            width="150vw"
            height="100vh"
            bg="blackAlpha.500"
            zIndex={1200}
            pointerEvents="none"
            padding={"3rem"}
          />

          <Box
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex={1300}
            bg="white"
            p={4}
            borderRadius="lg"
            boxShadow="lg"
          >
            <HStack spacing={3}>
              <Input
                placeholder="Type a macro..."
                size="lg"
                width="400px"
                value={input}
                ref={inputRef}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') runMacro(input.trim());
                  if (e.key === 'Escape') setVisible(false);
                }}
              />
              <IconButton
                aria-label="Add Macro"
                icon={<AddIcon />}
                colorScheme="blue"
                size="lg"
                borderRadius="full"
                onClick={handleAddClick}
              />
              <IconButton
                aria-label="Settings"
                icon={<SettingsIcon />}
                colorScheme="gray"
                size="lg"
                borderRadius="full"
                onClick={handleSettingsClick}
              />
            </HStack>
          </Box>
        </>
      )}
    </>
  );
};
