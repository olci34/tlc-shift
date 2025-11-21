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
  AlertTitle,
  AlertDescription,
  Card,
  CardBody,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  Progress,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ViewIcon, ViewOffIcon, CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { resetPassword } from '@/api/passwordReset';

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  // Password strength validation
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    hasNumber: false,
    hasSpecialChar: false,
    match: false
  });

  useEffect(() => {
    // Check if token exists
    if (router.isReady && !token) {
      setTokenError(true);
    }
  }, [router.isReady, token]);

  useEffect(() => {
    // Update password strength indicators
    setPasswordStrength({
      length: newPassword.length >= 8,
      hasNumber: /\d/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
      match: newPassword !== '' && newPassword === confirmPassword
    });
  }, [newPassword, confirmPassword]);

  const isPasswordValid =
    passwordStrength.length && passwordStrength.hasNumber && passwordStrength.hasSpecialChar;
  const isFormValid = isPasswordValid && passwordStrength.match;

  const getPasswordStrengthColor = () => {
    const score = Object.values(passwordStrength).filter(Boolean).length;
    if (score <= 1) return 'red';
    if (score <= 2) return 'orange';
    if (score <= 3) return 'yellow';
    return 'green';
  };

  const getPasswordStrengthValue = () => {
    return (Object.values(passwordStrength).filter(Boolean).length / 4) * 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      setError('Please ensure your password meets all requirements');
      return;
    }

    if (!token || typeof token !== 'string') {
      setError('Invalid reset token');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await resetPassword(token, newPassword);

      if (response.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/signup-login');
        }, 3000);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.response?.data?.detail || 'Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (tokenError) {
    return (
      <Box maxW="md" mx="auto" py={8}>
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          minH="200px"
          borderRadius="lg"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Invalid Reset Link
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            This password reset link is invalid or missing a token. Please request a new password
            reset.
          </AlertDescription>
          <Button mt={4} colorScheme="blue" onClick={() => router.push('/forgot-password')}>
            Request New Reset
          </Button>
        </Alert>
      </Box>
    );
  }

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
          minH="200px"
          borderRadius="lg"
        >
          <CheckCircleIcon boxSize="40px" mr={0} color="green.500" />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Password Reset Successful!
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            Your password has been successfully reset. You can now log in with your new password.
            Redirecting to login...
          </AlertDescription>
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
              <Heading size="lg">Reset Your Password</Heading>
              <Text color="gray.600" mt={2}>
                Enter your new password below
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
                <FormControl isRequired isInvalid={newPassword !== '' && !isPasswordValid}>
                  <FormLabel>New Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        size="sm"
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                {newPassword && (
                  <Box w="100%">
                    <Text fontSize="sm" fontWeight="semibold" mb={2}>
                      Password Strength
                    </Text>
                    <Progress
                      value={getPasswordStrengthValue()}
                      colorScheme={getPasswordStrengthColor()}
                      size="sm"
                      borderRadius="md"
                      mb={3}
                    />
                    <List spacing={2}>
                      <ListItem fontSize="sm">
                        <ListIcon
                          as={passwordStrength.length ? CheckCircleIcon : WarningIcon}
                          color={passwordStrength.length ? 'green.500' : 'gray.400'}
                        />
                        At least 8 characters
                      </ListItem>
                      <ListItem fontSize="sm">
                        <ListIcon
                          as={passwordStrength.hasNumber ? CheckCircleIcon : WarningIcon}
                          color={passwordStrength.hasNumber ? 'green.500' : 'gray.400'}
                        />
                        Contains a number
                      </ListItem>
                      <ListItem fontSize="sm">
                        <ListIcon
                          as={passwordStrength.hasSpecialChar ? CheckCircleIcon : WarningIcon}
                          color={passwordStrength.hasSpecialChar ? 'green.500' : 'gray.400'}
                        />
                        Contains a special character
                      </ListItem>
                    </List>
                  </Box>
                )}

                <FormControl
                  isRequired
                  isInvalid={confirmPassword !== '' && !passwordStrength.match}
                >
                  <FormLabel>Confirm New Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        variant="ghost"
                        size="sm"
                      />
                    </InputRightElement>
                  </InputGroup>
                  {confirmPassword !== '' && !passwordStrength.match && (
                    <FormErrorMessage>Passwords do not match</FormErrorMessage>
                  )}
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="100%"
                  isLoading={isSubmitting}
                  isDisabled={!isFormValid || isSubmitting}
                >
                  Reset Password
                </Button>

                <Text fontSize="sm" textAlign="center" color="gray.600">
                  Remember your password?{' '}
                  <Button variant="link" colorScheme="blue" onClick={() => router.push('/signup-login')}>
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

export default ResetPasswordPage;
