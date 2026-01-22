import React, { useState, useEffect } from "react";
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
  HStack,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "../../../context";
import { ImageUpload } from "../../inputs/ImageUpload";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getAvatarUrl = (userId: number | undefined) => {
  if (!userId) return undefined;
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
};

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      });
    }
    if (!isOpen) {
      setImagePreview(null);
      setSelectedFile(null);
    }
  }, [user, isOpen]);

  const handleFileSelect = (file: File | null, preview: string | null) => {
    setSelectedFile(file);
    setImagePreview(preview);
  };

  const handleSubmit = () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <ImageUpload
              currentImageUrl={getAvatarUrl(user?.id)}
              userName={user ? `${user.first_name} ${user.last_name}` : "User"}
              imagePreview={imagePreview}
              selectedFile={selectedFile}
              onFileSelect={handleFileSelect}
            />

            <Box>
              <Text mb={2} fontWeight="600" fontSize="sm" color="gray.600">
                First Name
              </Text>
              <Input
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </Box>

            <Box>
              <Text mb={2} fontWeight="600" fontSize="sm" color="gray.600">
                Last Name
              </Text>
              <Input
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </Box>

            <Box>
              <Text mb={2} fontWeight="600" fontSize="sm" color="gray.600">
                Email
              </Text>
              <Input
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Box>

            <HStack spacing={3} pt={4}>
              <Button variant="ghost" onClick={onClose} flex={1}>
                Cancel
              </Button>
              <Button
                colorScheme="brand"
                onClick={handleSubmit}
                flex={1}
                isDisabled={!formData.firstName || !formData.lastName || !formData.email}
              >
                Save Changes
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
