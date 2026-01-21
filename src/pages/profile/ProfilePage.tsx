import React from "react";
import {
  Container,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Avatar,
  VStack,
  Text,
  Card,
  CardBody,
  Flex,
  Button,
  useDisclosure,
  Spacer,
} from "@chakra-ui/react";
import { useAuth } from "../../context";
import FriendsTab from "./FriendsTab";
import SentRequestsTab from "./SentRequestsTab";
import ReceivedRequestsTab from "./ReceivedRequestsTab";
import { EditProfileModal } from "../../components/modals/profile/EditProfileModal";
import { mockProfileStats } from "../../mocks/profile";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getAvatarUrl = (userId: number | undefined) => {
    if (!userId) return undefined;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Card mb={8}>
        <CardBody>
          <Flex align="center" gap={6}>
            <Avatar
              size="2xl"
              name={user ? `${user.first_name} ${user.last_name}` : "User"}
              src={getAvatarUrl(user?.id)}
            />
            <VStack align="start" spacing={1}>
              <Heading size="lg">
                {user ? `${user.first_name} ${user.last_name}` : "User"}
              </Heading>
              <Text color="gray.500">{user?.email}</Text>
              <Button
                size="sm"
                colorScheme="brand"
                variant="outline"
                mt={2}
                onClick={onOpen}
              >
                Edit Profile
              </Button>
            </VStack>
            <Spacer />
            <VStack align="center" spacing={1}>
              <Text fontSize="3xl" fontWeight="bold" color="purple.500">
                {mockProfileStats.totalWins}
              </Text>
              <Text fontSize="sm" color="gray.500" fontWeight="600">
                Total Wins
              </Text>
            </VStack>
          </Flex>
        </CardBody>
      </Card>

      <Box>
        <Tabs colorScheme="brand" variant="enclosed">
          <TabList>
            <Tab fontWeight="600">Friends</Tab>
            <Tab fontWeight="600">Sent Requests</Tab>
            <Tab fontWeight="600">Received Requests</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0} pt={6}>
              <FriendsTab />
            </TabPanel>
            <TabPanel px={0} pt={6}>
              <SentRequestsTab />
            </TabPanel>
            <TabPanel px={0} pt={6}>
              <ReceivedRequestsTab />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <EditProfileModal isOpen={isOpen} onClose={onClose} />
    </Container>
  );
};

export default ProfilePage;
