import React from "react";
import {
  Card,
  CardBody,
  HStack,
  VStack,
  Text,
  Avatar,
  Button,
  Spacer,
} from "@chakra-ui/react";
import { User } from "../../../types";

interface UserCardProps {
  user: User;
  onAddFriend: (userId: number) => void;
  isPending: boolean;
  isFriend: boolean;
}

const getAvatarUrl = (userId: number) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
};

const UserCard: React.FC<UserCardProps> = ({
  user,
  onAddFriend,
  isPending,
  isFriend,
}) => {
  const getButtonProps = () => {
    if (isFriend) {
      return {
        label: "Friends",
        colorScheme: "gray",
        variant: "outline" as const,
        isDisabled: true,
      };
    }
    if (isPending) {
      return {
        label: "Pending",
        colorScheme: "gray",
        variant: "outline" as const,
        isDisabled: true,
      };
    }
    return {
      label: "Add Friend",
      colorScheme: "brand",
      variant: "solid" as const,
      isDisabled: false,
    };
  };

  const buttonProps = getButtonProps();

  return (
    <Card
      _hover={{ transform: "translateY(-4px)", boxShadow: "md" }}
      transition="all 0.3s"
    >
      <CardBody>
        <HStack spacing={4}>
          <Avatar
            size="lg"
            name={`${user.first_name} ${user.last_name}`}
            src={getAvatarUrl(user.id)}
          />
          <VStack spacing={0} align="start" flex={1}>
            <Text fontWeight="700" fontSize="lg">
              {user.first_name} {user.last_name}
            </Text>
            <Text color="gray.500" fontSize="sm">
              {user.email}
            </Text>
          </VStack>
          <Spacer />
          <Button
            size="sm"
            colorScheme={buttonProps.colorScheme}
            variant={buttonProps.variant}
            isDisabled={buttonProps.isDisabled}
            onClick={() => onAddFriend(user.id)}
          >
            {buttonProps.label}
          </Button>
        </HStack>
      </CardBody>
    </Card>
  );
};

export default UserCard;
