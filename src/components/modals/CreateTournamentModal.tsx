import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Box,
  Text,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  HStack,
  Button,
} from '@chakra-ui/react';
import { TournamentFormData } from '../../types/tournaments';

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateTournamentModal: React.FC<CreateTournamentModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<TournamentFormData>({
    name: '',
    game: '',
    players: 0,
    prizePool: '',
    startDate: '',
  });

  const handleSubmit = () => {
    console.log('Tournament created:', formData);
    // TODO: Add API call to create tournament
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader>Create Tournament</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text mb={2} fontWeight="600" fontSize="sm" color="gray.600">
                Tournament Name
              </Text>
              <Input
                placeholder="Enter tournament name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Box>

            <Box>
              <Text mb={2} fontWeight="600" fontSize="sm" color="gray.600">
                Game
              </Text>
              <Select
                placeholder="Select game"
                value={formData.game}
                onChange={(e) => setFormData({ ...formData, game: e.target.value })}
              >
                <option value="catan">Catan</option>
                <option value="monopoly">Monopoly</option>
                <option value="ludo">Covjece ne ljuti se</option>
              </Select>
            </Box>

            <Box>
              <Text mb={2} fontWeight="600" fontSize="sm" color="gray.600">
                Number of Players
              </Text>
              <NumberInput
                min={2}
                value={formData.players}
                onChange={(_, val) => setFormData({ ...formData, players: val })}
              >
                <NumberInputField placeholder="Enter number of players" />
              </NumberInput>
            </Box>

            <Box>
              <Text mb={2} fontWeight="600" fontSize="sm" color="gray.600">
                Prize Pool
              </Text>
              <Input
                placeholder="e.g., $1000"
                value={formData.prizePool}
                onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
              />
            </Box>

            <Box>
              <Text mb={2} fontWeight="600" fontSize="sm" color="gray.600">
                Start Date
              </Text>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </Box>

            <HStack spacing={3} pt={4}>
              <Button variant="ghost" onClick={onClose} flex={1}>
                Cancel
              </Button>
              <Button colorScheme="brand" onClick={handleSubmit} flex={1}>
                Create
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateTournamentModal;
