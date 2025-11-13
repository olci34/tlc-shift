import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { FC } from 'react';

interface EmptyListingsStateProps {
  title: string;
  description: string;
  buttonText: string;
  showButton?: boolean;
}

export const EmptyListingsState: FC<EmptyListingsStateProps> = ({
  title,
  description,
  buttonText,
  showButton = true
}) => {
  const router = useRouter();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="400px"
      width="100%"
      py={10}
    >
      <VStack spacing={4} textAlign="center" maxWidth="500px">
        <Heading size="lg" color="gray.600">
          {title}
        </Heading>
        <Text fontSize="md" color="gray.500">
          {description}
        </Text>
        {showButton && (
          <Button
            leftIcon={<AddIcon />}
            colorScheme="green"
            size="lg"
            onClick={() => router.push('/listings/create')}
            mt={4}
          >
            {buttonText}
          </Button>
        )}
      </VStack>
    </Box>
  );
};
