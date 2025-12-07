import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from '@chakra-ui/react';
import { Tournament } from '../../types/tournaments';

interface TournamentsTableProps {
  tournaments: Tournament[];
}

const TournamentsTable: React.FC<TournamentsTableProps> = ({ tournaments }) => {
  return (
    <Card>
      <CardBody p={0}>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Tournament</Th>
                <Th>Game</Th>
                <Th isNumeric>Players</Th>
                <Th>Prize Pool</Th>
                <Th>Start Date</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tournaments.map((tournament) => (
                <Tr key={tournament.id} _hover={{ bg: 'gray.50' }} transition="all 0.2s">
                  <Td fontWeight="600">{tournament.name}</Td>
                  <Td>{tournament.game}</Td>
                  <Td isNumeric>{tournament.players}</Td>
                  <Td fontWeight="600" color="green.600">
                    {tournament.prizePool}
                  </Td>
                  <Td>{tournament.startDate}</Td>
                  <Td>
                    <Badge
                      colorScheme={tournament.status === 'Active' ? 'green' : 'orange'}
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {tournament.status}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </CardBody>
    </Card>
  );
};

export default TournamentsTable;
