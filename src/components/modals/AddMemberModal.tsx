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
  HStack,
  Button,
} from '@chakra-ui/react';
import { MemberFormData } from '../../types/team';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<MemberFormData>({
    firstName: '',
    favoriteGame: '',
  });

  const handleSubmit = () => {
    console.log('Member added:', formData);
    // TODO: Add API call to add team member
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader>Add New Member</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text mb={2} fontWeight="600" fontSize="sm" color="gray.600">
                First Name
              </Text>
              <Input
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </Box>

            <Box>
              <Text mb={2} fontWeight="600" fontSize="sm" color="gray.600">
                Favourite Game
              </Text>
              <Select
                placeholder="Select game"
                value={formData.favoriteGame}
                onChange={(e) => setFormData({ ...formData, favoriteGame: e.target.value })}
              >
                <option value="catan">Catan</option>
                <option value="monopoly">Monopoly</option>
                <option value="ludo">Covjece ne ljuti se</option>
              </Select>
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

export default AddMemberModal;
