import React, { useState, useEffect, useRef } from "react";
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
  Avatar,
  IconButton,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { useAuth } from "../../../context";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
            <Box display="flex" flexDirection="column" alignItems="center">
              <Text mb={2} fontWeight="600" fontSize="sm" color="gray.600">
                Profile Image
              </Text>
              <Box position="relative">
                <Avatar
                  size="xl"
                  name={user ? `${user.first_name} ${user.last_name}` : "User"}
                  src={imagePreview || getAvatarUrl(user?.id)}
                />
                <IconButton
                  aria-label="Change profile image"
                  icon={<EditIcon />}
                  size="sm"
                  colorScheme="brand"
                  rounded="full"
                  position="absolute"
                  bottom={0}
                  right={0}
                  onClick={() => fileInputRef.current?.click()}
                />
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  display="none"
                />
              </Box>
              {selectedFile && (
                <Text fontSize="xs" color="gray.500" mt={2}>
                  {selectedFile.name}
                </Text>
              )}
            </Box>

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
