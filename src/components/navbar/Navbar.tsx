import React from 'react';
import { Box, Flex, Button, Heading } from '@chakra-ui/react';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'news', label: 'News' },
    { id: 'tournaments', label: 'Tournaments' },
    { id: 'team', label: 'My Team' },
    { id: 'matches', label: 'Matches' },
  ];

  return (
    <Box
      w="100%"
      h="70px"
      bg="brand.500"
      color="white"
      position="fixed"
      top="0"
      left="0"
      px={10}
      boxShadow="md"
      zIndex={1000}
    >
      <Flex h="100%" align="center" justify="space-between">
        <Heading size="lg" fontWeight="800" letterSpacing="tight">
          GameClub
        </Heading>

        <Flex gap={2}>
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              color={activeTab === item.id ? 'white' : 'whiteAlpha.900'}
              bg={activeTab === item.id ? 'whiteAlpha.200' : 'transparent'}
              _hover={{
                bg: 'whiteAlpha.150',
                color: 'white',
              }}
              onClick={() => onTabChange(item.id)}
              fontWeight="500"
              fontSize="15px"
            >
              {item.label}
            </Button>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
