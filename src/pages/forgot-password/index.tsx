import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
  Card,
  CardBody
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { requestPasswordReset } from '@/api/passwordReset';
import { CheckCircleIcon } from '@chakra-ui/icons';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await requestPasswordReset(email);

      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      console.error('Request password reset error:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Box maxW="md" mx="auto" py={8}>
        <Alert
          status="success"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          minH="250px"
          borderRadius="lg"
        >
          <CheckCircleIcon boxSize="40px" mr={0} color="green.500" />
          <Box mt={4}>
            <Heading size="md" mb={2}>
              Check Your Email
            </Heading>
            <Text color="gray.700">
              If an account exists with this email, you will receive password reset instructions
              shortly.
            </Text>
            <Text color="gray.600" fontSize="sm" mt={3}>
              The link will expire in 30 minutes.
            </Text>
          </Box>
          <VStack mt={6} spacing={2}>
            <Button colorScheme="blue" onClick={() => router.push('/signup-login')}>
              Back to Login
            </Button>
            <Text fontSize="sm" color="gray.600">
              Didn't receive an email?{' '}
              <Button
                variant="link"
                colorScheme="blue"
                size="sm"
                onClick={() => setSuccess(false)}
              >
                Try again
              </Button>
            </Text>
          </VStack>
        </Alert>
      </Box>
    );
  }

  return (
    <Box maxW="md" mx="auto" py={8}>
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <Heading size="lg">Forgot Password?</Heading>
              <Text color="gray.600" mt={2}>
                Enter your email address and we'll send you instructions to reset your password.
              </Text>
            </Box>

            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    autoComplete="email"
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="100%"
                  isLoading={isSubmitting}
                  loadingText="Sending..."
                >
                  Send Reset Link
                </Button>

                <Text fontSize="sm" textAlign="center" color="gray.600">
                  Remember your password?{' '}
                  <Button
                    variant="link"
                    colorScheme="blue"
                    onClick={() => router.push('/signup-login')}
                  >
                    Back to Login
                  </Button>
                </Text>
              </VStack>
            </form>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default ForgotPasswordPage;
