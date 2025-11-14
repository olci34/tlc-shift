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
  FormHelperText
} from '@chakra-ui/react';
import { ViewOffIcon, ViewIcon } from '@chakra-ui/icons';
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

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

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
    <Box maxW="md" mx="auto" mt={8} p={6}>
      <Tabs isFitted variant="enclosed" defaultIndex={1}>
        <TabList mb="1em">
          <Tab>{t('auth.signUp')}</Tab>
          <Tab>{t('auth.login')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack spacing={4}>
              <FormControl id="signup-email" isRequired isInvalid={!!signupErrors.email}>
                <FormLabel>{t('auth.emailAddress')}</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                />
                {signupErrors.email && <FormErrorMessage>{signupErrors.email}</FormErrorMessage>}
              </FormControl>
              <FormControl id="signup-firstName" isRequired isInvalid={!!signupErrors.firstName}>
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
              <FormControl id="signup-lastName" isRequired isInvalid={!!signupErrors.lastName}>
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
              <FormControl id="signup-password" isRequired isInvalid={!!signupErrors.password}>
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
                      aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
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
                      aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
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
                colorScheme="blue"
                width="full"
                onClick={handleSignupSubmit}
                disabled={!isFormValid(signupData, signupErrors)}
              >
                {t('auth.signUp')}
              </Button>
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack spacing={4}>
              <FormControl id="login-email" isRequired isInvalid={!!loginErrors.email}>
                <FormLabel>{t('auth.emailAddress')}</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                />
                {!!loginErrors.email && <FormErrorMessage>{loginErrors.email}</FormErrorMessage>}
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
                      aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
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
              <Button colorScheme="blue" width="full" onClick={handleLoginSubmit}>
                {t('auth.login')}
              </Button>
              {loginErrors.errorMessage && (
                <Text colorScheme="red">{loginErrors.errorMessage}</Text>
              )}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
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
