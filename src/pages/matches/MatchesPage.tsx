import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { mockMatches } from '../../utils/mockData';
import { MatchesTable } from '../../components/tables';

const MatchesPage: React.FC = () => {
  return (
    <Box>
      <Heading size="xl" fontWeight="800" mb={6}>
        Upcoming Matches
      </Heading>

      <MatchesTable matches={mockMatches} />
    </Box>
  );
};

export default MatchesPage;
