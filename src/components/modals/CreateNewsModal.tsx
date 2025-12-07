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
  Textarea,
  HStack,
  Button,
} from '@chakra-ui/react';
import { NewsFormData } from '../../types/news';

interface CreateNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateNewsModal: React.FC<CreateNewsModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    description: '',
  });

  const handleSubmit = () => {
    console.log('News post created:', formData);
    // TODO: Add API call to create news post
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader>Create News Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text mb={2} fontWeight="600" fontSize="sm" color="gray.600">
                Title
              </Text>
              <Input
                placeholder="Enter post title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Box>

            <Box>
              <Text mb={2} fontWeight="600" fontSize="sm" color="gray.600">
                Description
              </Text>
              <Textarea
                placeholder="Enter post description"
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

export default CreateNewsModal;
