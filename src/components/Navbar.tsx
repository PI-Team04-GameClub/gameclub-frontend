import React from 'react';
import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  children: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <Text
        px={4}
        py={2}
        borderRadius="md"
        fontWeight="600"
        fontSize="sm"
        bg={isActive ? 'brand.500' : 'transparent'}
        color={isActive ? 'white' : 'gray.700'}
        _hover={{
          bg: isActive ? 'brand.600' : 'gray.100',
        }}
        transition="all 0.2s"
      >
        {children}
      </Text>
    </Link>
  );
};

const Navbar: React.FC = () => {
  return (
    <Box
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Flex
        maxW="container.xl"
        mx="auto"
        px={6}
        py={4}
        justify="space-between"
        align="center"
      >
        <Text fontSize="2xl" fontWeight="900" color="brand.500">
          GameClub
        </Text>

        <HStack spacing={2}>
          <NavLink to="/news">News</NavLink>
          <NavLink to="/games">Games</NavLink>
          <NavLink to="/teams">Teams</NavLink>
          <NavLink to="/tournaments">Tournaments</NavLink>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
