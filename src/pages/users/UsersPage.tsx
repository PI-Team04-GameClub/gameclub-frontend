import React from "react";
import { Box, Container, SimpleGrid, Text, Spinner, Center } from "@chakra-ui/react";
import { useUsers } from "../../hooks";
import { UserCard } from "../../components/cards";
import { SearchInput } from "../../components/inputs";

const UsersPage: React.FC = () => {
  const {
    filteredUsers,
    searchQuery,
    setSearchQuery,
    handleAddFriend,
    pendingRequests,
    existingFriends,
    isLoading,
  } = useUsers();

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={6}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Users
        </Text>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search users by name or email..."
        />
      </Box>

      {isLoading ? (
        <Center py={12}>
          <Spinner size="xl" color="brand.500" />
        </Center>
      ) : filteredUsers.length === 0 ? (
        <Center py={12}>
          <Text color="gray.500">
            {searchQuery
              ? "No users found matching your search."
              : "No users found."}
          </Text>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onAddFriend={handleAddFriend}
              isPending={pendingRequests.has(user.id)}
              isFriend={existingFriends.has(user.id)}
            />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
};

export default UsersPage;
