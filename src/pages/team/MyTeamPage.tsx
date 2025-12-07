import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  VStack,
  HStack,
  Card,
  CardBody,
  Avatar,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  Grid,
  useDisclosure,
} from '@chakra-ui/react';
import { mockTeamMembers } from '../../utils/mockData';
import { AddMemberModal } from '../../components/modals';

const MyTeamPage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="xl" fontWeight="800">
          My Team
        </Heading>
        <Button colorScheme="brand" onClick={onOpen} leftIcon={<Text>+</Text>}>
          Add Member
        </Button>
      </Flex>

      <VStack spacing={4} align="stretch">
        {mockTeamMembers.map((member) => (
          <Card
            key={member.id}
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'md' }}
            transition="all 0.3s"
          >
            <CardBody>
              <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                <HStack spacing={4}>
                  <Avatar name={member.name} bg="brand.500" color="white" />
                  <Box>
                    <Heading size="sm" fontWeight="700">
                      {member.name}
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                      {member.role}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Favorite: {member.favorite}
                    </Text>
                  </Box>
                </HStack>

                <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                  <Stat>
                    <StatLabel fontSize="xs" color="gray.500">
                      Wins
                    </StatLabel>
                    <StatNumber fontSize="2xl" fontWeight="800">
                      {member.wins}
                    </StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel fontSize="xs" color="gray.500">
                      Losses
                    </StatLabel>
                    <StatNumber fontSize="2xl" fontWeight="800">
                      {member.losses}
                    </StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel fontSize="xs" color="gray.500">
                      Win Rate
                    </StatLabel>
                    <StatNumber fontSize="2xl" fontWeight="800" color="green.500">
                      {member.winRate}
                    </StatNumber>
                  </Stat>
                </Grid>
              </Flex>
            </CardBody>
          </Card>
        ))}
      </VStack>

      <AddMemberModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default MyTeamPage;
