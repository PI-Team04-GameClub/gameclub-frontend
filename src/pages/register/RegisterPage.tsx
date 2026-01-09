import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Heading,
  useToast,
  InputGroup,
  InputRightElement,
  Spinner,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth_service';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isErrorOpen, onOpen: onErrorOpen, onClose: onErrorClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  const errorCancelRef = React.useRef(null);

  const handleRegister = async () => {
    if (!email || !password || !firstName) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        first_name: firstName,
        last_name: lastName || '',
        email,
        password,
      });

      onOpen();
    } catch (error: any) {
      let message = 'Registration failed';

      if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.message) {
        message = error.message;
      }

      setErrorMessage(message);
      onErrorOpen();
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    onClose();
    navigate('/login');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <Container maxW="md" py={{ base: '12', md: '24' }}>
      <VStack spacing="8">
        <Box textAlign="center">
          <Heading mb="2" fontWeight="800">GameClub</Heading>
          <Text color="gray.600">
            Create a new account
          </Text>
        </Box>

        <Box
          width="full"
          bg="white"
          borderRadius="xl"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.100"
          p={8}
        >
          <VStack spacing="4">
            <Input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onKeyPress={handleKeyPress}
              autoComplete="given-name"
            />
            <Input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onKeyPress={handleKeyPress}
              autoComplete="family-name"
            />
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              autoComplete="email"
            />

            <InputGroup>
              <Input
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                autoComplete="new-password"
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>

            <Button
              width="full"
              colorScheme="brand"
              onClick={handleRegister}
              isDisabled={loading}
            >
              {loading ? <Spinner size="sm" /> : 'Create Account'}
            </Button>
          </VStack>
        </Box>

        <HStack justify="center" width="full">
          <Text fontSize="sm" color="gray.600">
            Already have an account?
          </Text>
          <Button
            as={Link}
            to="/login"
            variant="link"
            colorScheme="brand"
            fontSize="sm"
          >
            Sign in
          </Button>
        </HStack>
      </VStack>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleDialogClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Registration Successful
            </AlertDialogHeader>
            <AlertDialogBody>
              Your account has been created. Welcome to GameClub!
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button colorScheme="brand" onClick={handleDialogClose}>
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isErrorOpen}
        leastDestructiveRef={errorCancelRef}
        onClose={onErrorClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="red.600">
              Error
            </AlertDialogHeader>
            <AlertDialogBody>
              {errorMessage}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button colorScheme="red" onClick={onErrorClose}>
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default RegisterPage;
