import React, { useState } from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Box,
  Text,
  IconButton,
  InputRightElement,
  InputGroup,
  FormErrorMessage,
  FormHelperText,
  Divider,
  HStack,
  useColorModeValue,
  Heading,
  Container,
  Card,
  CardBody
} from '@chakra-ui/react';
import { ViewOffIcon, ViewIcon } from '@chakra-ui/icons';
import { FaGoogle } from 'react-icons/fa';
import { isValidEmail } from '@/lib/utils/email-validator';
import { isValidPassword } from '@/lib/utils/password-validator';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { signup } from '@/api/signup';
import { useTranslations } from 'next-intl';
import { GetStaticProps } from 'next';
import { getMessages } from '@/lib/utils/i18n';
import * as gtag from '@/lib/analytics/gtag';

export interface SignupData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

interface SignupErrors {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  password: string | null;
  confirmPassword: string | null;
  errorMessage: string | null;
}

interface LoginErrors {
  email: string | null;
  password: string | null;
  errorMessage: string | null;
}

const SignupLogin: React.FC = () => {
  const router = useRouter();
  const t = useTranslations();
  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });

  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  });

  const [signupErrors, setSignupErrors] = useState<SignupErrors>({
    email: null,
    firstName: null,
    lastName: null,
    password: null,
    confirmPassword: null,
    errorMessage: null
  });

  const [loginErrors, setLoginErrors] = useState<LoginErrors>({
    email: null,
    password: null,
    errorMessage: null
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Color mode values
  const bgGradient = useColorModeValue(
    'linear(to-br, green.50, teal.50, blue.50)',
    'linear(to-br, gray.900, gray.800, gray.900)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
    validateSignup(name as keyof SignupErrors, value);
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    validateLogin(name as keyof LoginErrors, value);
  };

  const handleSignupSubmit = async () => {
    // Add your signup logic here
    const res = await signup(signupData);
    if (res) {
      const creds: LoginData = { email: signupData.email, password: signupData.password };
      const res = await signIn('credentials', {
        ...creds,
        callbackUrl: `/`,
        redirect: false
      });

      if (res?.ok && res.url) {
        setLoginErrors({ ...loginErrors, errorMessage: null });
        gtag.trackEvent.signup();
        router.push(res.url);
      } else if (res?.error) {
        setLoginErrors({ ...loginErrors, errorMessage: res.error });
      }
    } else {
      setSignupErrors({ ...signupErrors, errorMessage: t('auth.signupError') });
    }
  };

  const handleLoginSubmit = async () => {
    const creds: LoginData = { email: loginData.email, password: loginData.password };
    validateLogin('email', loginData.email);
    validateLogin('password', loginData.password);

    const res = await signIn('credentials', {
      ...creds,
      callbackUrl: `/`,
      redirect: false
    });

    if (res?.ok && res.url) {
      setLoginErrors({ ...loginErrors, errorMessage: null });
      gtag.trackEvent.login();
      router.push(res.url);
    } else if (res?.error) {
      setLoginErrors({ ...loginErrors, errorMessage: res.error });
    }
  };

  const validateSignup = (name: keyof SignupErrors, value: string) => {
    let error: string | null = null;
    if (!value.trim()) {
      error = t('auth.fieldRequired');
    } else if (name === 'email' && !isValidEmail(value)) {
      error = t('auth.invalidEmail');
    } else if (name === 'password' && !isValidPassword(value)) {
      error = t('auth.passwordRequirements');
    } else if (name === 'confirmPassword' && value !== signupData.password) {
      error = t('auth.passwordsNotMatching');
    }

    setSignupErrors({ ...signupErrors, [name]: error });
  };

  const validateLogin = (name: keyof LoginErrors, value: string) => {
    let error: string | null = null;
    if (!value.trim()) {
      error = t('auth.fieldRequired');
    } else if (name === 'email' && !isValidEmail(value)) {
      error = t('auth.invalidEmail');
    }

    setLoginErrors({ ...loginErrors, [name]: error });
  };

  const isFormValid = (
    data: SignupData | LoginData,
    errors: SignupErrors | LoginErrors
  ): boolean => {
    return (
      Object.keys(errors).some(
        (errorCode) =>
          errorCode !== 'errorMessage' && errors[errorCode as keyof typeof errors] === null
      ) && Object.values(data).every((value) => value.trim() !== '')
    );
  };

  return (
    <Box minH="100vh" bgGradient={bgGradient} py={{ base: 8, md: 12 }}>
      <Container maxW="md">
        <Card
          bg={cardBg}
          shadow="2xl"
          borderRadius="2xl"
          borderWidth="1px"
          borderColor={borderColor}
          overflow="hidden"
        >
          <CardBody p={{ base: 6, md: 8 }}>
            <VStack spacing={6} mb={6}>
              <Heading size="lg" textAlign="center">
                {t('auth.welcome')}
              </Heading>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                {t('auth.welcomeSubtitle')}
              </Text>

              {/* Google Sign-In Button */}
              <Button
                width="full"
                size="lg"
                leftIcon={<FaGoogle />}
                onClick={handleGoogleSignIn}
                isLoading={isGoogleLoading}
                loadingText={t('auth.signingIn')}
                colorScheme="red"
                variant="outline"
                borderWidth="2px"
                _hover={{
                  bg: useColorModeValue('red.50', 'red.900'),
                  transform: 'translateY(-2px)',
                  shadow: 'lg'
                }}
                transition="all 0.2s"
              >
                {t('auth.continueWithGoogle')}
              </Button>

              {/* Divider with OR */}
              <HStack width="full">
                <Divider />
                <Text px={2} color="gray.500" fontSize="sm" fontWeight="medium">
                  {t('auth.or')}
                </Text>
                <Divider />
              </HStack>
            </VStack>

            <Tabs isFitted variant="enclosed" colorScheme="green">
              <TabList mb="1em">
                <Tab
                  _selected={{
                    bg: useColorModeValue('green.500', 'green.300'),
                    color: 'white'
                  }}
                >
                  {t('auth.signUp')}
                </Tab>
                <Tab
                  _selected={{
                    bg: useColorModeValue('green.500', 'green.300'),
                    color: 'white'
                  }}
                >
                  {t('auth.login')}
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0}>
                  <VStack spacing={4}>
                    <FormControl id="signup-email" isRequired isInvalid={!!signupErrors.email}>
                      <FormLabel>{t('auth.emailAddress')}</FormLabel>
                      <Input
                        type="email"
                        name="email"
                        value={signupData.email}
                        onChange={handleSignupChange}
                      />
                      {signupErrors.email && (
                        <FormErrorMessage>{signupErrors.email}</FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="signup-firstName"
                      isRequired
                      isInvalid={!!signupErrors.firstName}
                    >
                      <FormLabel>{t('auth.firstName')}</FormLabel>
                      <Input
                        type="text"
                        name="firstName"
                        value={signupData.firstName}
                        onChange={handleSignupChange}
                      />
                      {signupErrors.firstName && (
                        <FormErrorMessage>{signupErrors.firstName}</FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="signup-lastName"
                      isRequired
                      isInvalid={!!signupErrors.lastName}
                    >
                      <FormLabel>{t('auth.lastName')}</FormLabel>
                      <Input
                        type="text"
                        name="lastName"
                        value={signupData.lastName}
                        onChange={handleSignupChange}
                      />
                      {signupErrors.lastName && (
                        <FormErrorMessage>{signupErrors.lastName}</FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="signup-password"
                      isRequired
                      isInvalid={!!signupErrors.password}
                    >
                      <FormLabel>{t('auth.password')}</FormLabel>
                      <InputGroup>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={signupData.password}
                          onChange={handleSignupChange}
                        />
                        <InputRightElement width="4.5rem">
                          <IconButton
                            aria-label={
                              showPassword ? t('auth.hidePassword') : t('auth.showPassword')
                            }
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={togglePasswordVisibility}
                            variant="ghost"
                          />
                        </InputRightElement>
                      </InputGroup>
                      <FormHelperText>{t('auth.passwordLength')}</FormHelperText>
                      {signupErrors.password && (
                        <FormErrorMessage>{signupErrors.password}</FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="signup-confirmPassword"
                      isRequired
                      isInvalid={!!signupErrors.confirmPassword}
                    >
                      <FormLabel>{t('auth.confirmPassword')}</FormLabel>
                      <InputGroup>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={signupData.confirmPassword}
                          onChange={handleSignupChange}
                        />
                        <InputRightElement width="4.5rem">
                          <IconButton
                            aria-label={
                              showPassword ? t('auth.hidePassword') : t('auth.showPassword')
                            }
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={togglePasswordVisibility}
                            variant="ghost"
                          />
                        </InputRightElement>
                      </InputGroup>
                      {signupErrors.confirmPassword && (
                        <FormErrorMessage>{signupErrors.confirmPassword}</FormErrorMessage>
                      )}
                    </FormControl>
                    <Button
                      colorScheme="green"
                      width="full"
                      size="lg"
                      onClick={handleSignupSubmit}
                      disabled={!isFormValid(signupData, signupErrors)}
                      _hover={{
                        transform: 'translateY(-2px)',
                        shadow: 'lg'
                      }}
                      transition="all 0.2s"
                    >
                      {t('auth.signUp')}
                    </Button>
                  </VStack>
                </TabPanel>
                <TabPanel px={0}>
                  <VStack spacing={4}>
                    <FormControl id="login-email" isRequired isInvalid={!!loginErrors.email}>
                      <FormLabel>{t('auth.emailAddress')}</FormLabel>
                      <Input
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                      />
                      {!!loginErrors.email && (
                        <FormErrorMessage>{loginErrors.email}</FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="login-password"
                      isRequired
                      isInvalid={!loginData.password && !!loginErrors.password}
                    >
                      <FormLabel>{t('auth.password')}</FormLabel>
                      <InputGroup>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                        />
                        <InputRightElement width="4.5rem">
                          <IconButton
                            aria-label={
                              showPassword ? t('auth.hidePassword') : t('auth.showPassword')
                            }
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={togglePasswordVisibility}
                            variant="ghost"
                          />
                        </InputRightElement>
                      </InputGroup>
                      {loginErrors.password && (
                        <FormErrorMessage>{loginErrors.password}</FormErrorMessage>
                      )}
                    </FormControl>
                    <Box textAlign="right" w="full">
                      <Button
                        variant="link"
                        colorScheme="green"
                        size="sm"
                        onClick={() => router.push('/forgot-password')}
                      >
                        Forgot Password?
                      </Button>
                    </Box>
                    <Button
                      colorScheme="green"
                      width="full"
                      size="lg"
                      onClick={handleLoginSubmit}
                      _hover={{
                        transform: 'translateY(-2px)',
                        shadow: 'lg'
                      }}
                      transition="all 0.2s"
                    >
                      {t('auth.login')}
                    </Button>
                    {loginErrors.errorMessage && (
                      <Text color="red.500" fontSize="sm" fontWeight="medium">
                        {loginErrors.errorMessage}
                      </Text>
                    )}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default SignupLogin;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: await getMessages(locale ?? 'en')
    }
  };
};
