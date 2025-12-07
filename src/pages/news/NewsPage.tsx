import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  VStack,
  Card,
  CardBody,
  Text,
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import { mockNewsItems } from '../../utils/mockData';
import { CreateNewsModal } from '../../components/modals';

const NewsPage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="xl" fontWeight="800">
          Latest News
        </Heading>
        <Button colorScheme="brand" onClick={onOpen} leftIcon={<Text>+</Text>}>
          Create Post
        </Button>
      </Flex>

      <VStack spacing={4} align="stretch">
        {mockNewsItems.map((item) => (
          <Card
            key={item.id}
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'md' }}
            transition="all 0.3s"
          >
            <CardBody>
              <VStack align="stretch" spacing={3}>
                <Heading size="md" fontWeight="700">
                  {item.title}
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  {item.description}
                </Text>
                <HStack spacing={4} color="gray.500" fontSize="sm">
                  <Text>By {item.author}</Text>
                  <Text>•</Text>
                  <Text>{item.date}</Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>

      <CreateNewsModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default NewsPage;
