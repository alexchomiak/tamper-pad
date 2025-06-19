import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useMacros } from './MacroContext';
import { getHostnameFromUrl } from './util';

type Props = {
  onClose: () => void;
  onMacroAdded: () => void;
};

export const AddMacroModal: React.FC<Props> = ({ onClose, onMacroAdded }) => {
  const toast = useToast();
  const { addMacro } = useMacros();

  const [type, setType] = useState<'script' | 'url' | 'deferred-script'>('script');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [url, setUrl] = useState('');
  const [origin, setOrigin] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      toast({
        title: 'Missing name.',
        description: 'Macro name is required.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (type === 'script' && !code.trim()) {
      toast({
        title: 'Missing code.',
        description: 'Script code is required.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (type === 'url' && !url.trim()) {
      toast({
        title: 'Missing URL.',
        description: 'URL is required for URL macros.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (type === 'deferred-script' && (!origin.trim() || !code.trim())) {
      toast({
        title: 'Missing fields.',
        description: 'Both target origin and code are required for deferred scripts.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const macro = {
      name: name.trim(),
      type,
      code: type === 'script' || type === 'deferred-script' ? code.trim() : '',
      url: type === 'url' ? url.trim() : '',
      origin: type === 'deferred-script' ? getHostnameFromUrl(origin.trim()) : '',
    };

    addMacro(macro);
    toast({
      title: 'Macro saved.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });

    setName('');
    setCode('');
    setUrl('');
    setOrigin('');
    onClose();
    onMacroAdded();
  };

  return (
    <Modal isOpen onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Macro</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Macro Name</FormLabel>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Macro Type</FormLabel>
            <Select value={type} onChange={e => setType(e.target.value as any)}>
              <option value="script">Script</option>
              <option value="url">URL Macro</option>
              <option value="deferred-script">Deferred Script</option>
            </Select>
          </FormControl>

          {(type === 'script' || type === 'deferred-script') && (
            <FormControl mb={4}>
              <FormLabel>JavaScript Code</FormLabel>
              <Textarea
                placeholder="JavaScript code to execute"
                value={code}
                onChange={e => setCode(e.target.value)}
                rows={6}
                resize="vertical"
                fontFamily="mono"
              />
            </FormControl>
          )}

          {type === 'url' && (
            <FormControl mb={4}>
              <FormLabel>URL Template (use %s)</FormLabel>
              <Input
                placeholder="e.g. https://google.com/search?q=%s"
                value={url}
                onChange={e => setUrl(e.target.value)}
              />
            </FormControl>
          )}

          {type === 'deferred-script' && (
            <FormControl mb={4}>
              <FormLabel>Target Origin (URL match)</FormLabel>
              <Input
                placeholder="e.g. https://chat.openai.com"
                value={origin}
                onChange={e => setOrigin(e.target.value)}
              />
            </FormControl>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
          <Button colorScheme="blue" onClick={handleSubmit}>Save Macro</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
