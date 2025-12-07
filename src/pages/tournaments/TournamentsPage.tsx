import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { mockTournaments } from '../../utils/mockData';
import { TournamentsTable } from '../../components/tables';
import { CreateTournamentModal } from '../../components/modals';

const TournamentsPage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="xl" fontWeight="800">
          Board Game Tournaments
        </Heading>
        <Button colorScheme="brand" onClick={onOpen} leftIcon={<Text>+</Text>}>
          Create Tournament
        </Button>
      </Flex>

      <TournamentsTable tournaments={mockTournaments} />

      <CreateTournamentModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default TournamentsPage;
