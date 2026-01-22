import React, { useRef } from "react";
import {
  Box,
  Text,
  Input,
  Avatar,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

interface ImageUploadProps {
  currentImageUrl?: string;
  userName?: string;
  imagePreview: string | null;
  selectedFile: File | null;
  onFileSelect: (file: File | null, preview: string | null) => void;
  label?: string;
  maxSizeMB?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  userName = "User",
  imagePreview,
  selectedFile,
  onFileSelect,
  label = "Profile Image",
  maxSizeMB = 5,
}) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `Please select an image smaller than ${maxSizeMB}MB.`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onFileSelect(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Text mb={2} fontWeight="600" fontSize="sm" color="gray.600">
        {label}
      </Text>
      <Box position="relative">
        <Avatar
          size="xl"
          name={userName}
          src={imagePreview || currentImageUrl}
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
  );
};
