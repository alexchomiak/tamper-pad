import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  Input,
  Select,
  Textarea,
  VStack,
  HStack,
  Box,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useMacros } from './MacroContext';

export const SettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { macros, deleteMacro, addMacro } = useMacros();
  const toast = useToast();
  const [editing, setEditing] = useState<string | null>(null);
  const [editState, setEditState] = useState({ name: '', type: 'script', code: '', url: '', origin: '' });
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const handleDelete = (name: string) => {
    deleteMacro(name);
    toast({
      title: `Macro "${name}" deleted`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const startEditing = (macro: any) => {
    setEditing(macro.name);
    setEditState({
      name: macro.name,
      type: macro.type,
      code: macro.code || '',
      url: macro.url || '',
      origin: macro.origin || '',
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditState({ name: '', type: 'script', code: '', url: '', origin: '' });
  };

  const saveEdit = () => {
    addMacro({
      name: editState.name,
      //@ts-ignore
      type: editState.type,
      code: editState.type === 'script' || editState.type === 'deferred-script' ? editState.code : '',
      url: editState.type === 'url' ? editState.url : '',
      origin: editState.type === 'deferred-script' ? editState.origin : '',
    });
    toast({
      title: `Macro "${editState.name}" updated`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    cancelEdit();
  };

  const filteredMacros = macros.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || m.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <Modal isOpen onClose={onClose} size="5xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Manage Macros</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack mb={4} spacing={4} align="start">
            <Input
              placeholder="Search macros"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              width="200px"
            >
              <option value="all">All Types</option>
              <option value="script">Script</option>
              <option value="url">URL</option>
              <option value="deferred-script">Deferred Script</option>
            </Select>
          </HStack>

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Type</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredMacros.map((macro) => (
                <Tr key={macro.name}>
                  <Td colSpan={3}>
                    {editing === macro.name ? (
                      <VStack align="stretch" spacing={2}>
                        <Input
                          placeholder="Name"
                          value={editState.name}
                          onChange={(e) => setEditState({ ...editState, name: e.target.value })}
                        />
                        <Select
                          value={editState.type}
                          onChange={(e) => setEditState({ ...editState, type: e.target.value })}
                        >
                          <option value="script">Script</option>
                          <option value="url">URL</option>
                          <option value="deferred-script">Deferred Script</option>
                        </Select>
                        {(editState.type === 'script' || editState.type === 'deferred-script') && (
                          <Textarea
                            placeholder="JS Code"
                            value={editState.code}
                            onChange={(e) => setEditState({ ...editState, code: e.target.value })}
                          />
                        )}
                        {editState.type === 'url' && (
                          <Input
                            placeholder="https://example.com/?q=%s"
                            value={editState.url}
                            onChange={(e) => setEditState({ ...editState, url: e.target.value })}
                          />
                        )}
                        {editState.type === 'deferred-script' && (
                          <Input
                            placeholder="https://targetsite.com"
                            value={editState.origin}
                            onChange={(e) => setEditState({ ...editState, origin: e.target.value })}
                          />
                        )}
                        <HStack>
                          <IconButton aria-label="Save" icon={<CheckIcon />} onClick={saveEdit} />
                          <IconButton aria-label="Cancel" icon={<CloseIcon />} onClick={cancelEdit} />
                        </HStack>
                      </VStack>
                    ) : (
                      <HStack justify="space-between" w="100%">
                        <Box>{macro.name}</Box>
                        <Box>{macro.type}</Box>
                        <Box>
                          <IconButton
                            aria-label="Edit"
                            icon={<EditIcon />}
                            size="sm"
                            mr={2}
                            onClick={() => startEditing(macro)}
                          />
                          <IconButton
                            aria-label="Delete"
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleDelete(macro.name)}
                          />
                        </Box>
                      </HStack>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
