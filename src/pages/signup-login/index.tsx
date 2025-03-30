import React, { useState, FormEvent } from 'react';
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
import { login } from '@/api/login';
import { AxiosError } from 'axios';

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
}

interface LoginErrors {
  email: string | null;
  password: string | null;
  errorMessage: string | null;
}

const SignupLogin: React.FC = () => {
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
    confirmPassword: null
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

  const handleSignupSubmit = () => {
    // Add your signup logic here
    console.log('Signup Data:', signupData);
  };

  const handleLoginSubmit = async () => {
    console.log('Login Data:', loginData);
    try {
      const authData = await login(loginData);
      console.log(authData);
    } catch (e: AxiosError | any) {
      // display error message
    }
  };

  const validateSignup = (name: keyof SignupErrors, value: string) => {
    let error: string | null = null;
    if (!value.trim()) {
      error = 'This field is required.';
    } else if (name === 'email' && !isValidEmail(value)) {
      error = 'Invalid email address.';
    } else if (name === 'password' && !isValidPassword(value)) {
      error = 'Password must include at least 1 uppercase, 1 lowercase and 1 number.';
    } else if (name === 'confirmPassword' && value !== signupData.password) {
      error = 'Passwords are not matching';
    }

    setSignupErrors({ ...signupErrors, [name]: error });
  };

  const validateLogin = (name: keyof LoginErrors, value: string) => {
    let error: string | null = null;
    if (!value.trim()) {
      error = 'This field is required.';
    } else if (name === 'email' && !isValidEmail(value)) {
      error = 'Invalid email address.';
    }

    setLoginErrors({ ...loginErrors, [name]: error });
  };

  const isFormValid = (
    data: SignupData | LoginData,
    errors: SignupErrors | LoginErrors
  ): boolean => {
    return (
      !Object.values(errors).some((error) => error !== null) &&
      Object.values(data).every((value) => value.trim() !== '')
    );
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6}>
      <Tabs isFitted variant="enclosed" defaultIndex={1}>
        <TabList mb="1em">
          <Tab>Sign Up</Tab>
          <Tab>Login</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack spacing={4}>
              <FormControl id="signup-email" isRequired isInvalid={!!signupErrors.email}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                />
                {signupErrors.email && <FormErrorMessage>{signupErrors.email}</FormErrorMessage>}
              </FormControl>
              <FormControl id="signup-firstName" isRequired isInvalid={!!signupErrors.firstName}>
                <FormLabel>First Name</FormLabel>
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
                <FormLabel>Last Name</FormLabel>
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
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={togglePasswordVisibility}
                      variant="ghost"
                    />
                  </InputRightElement>
                </InputGroup>
                <FormHelperText>
                  Password length must be between 6 and 18 characters.
                </FormHelperText>
                {signupErrors.password && (
                  <FormErrorMessage>{signupErrors.password}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="signup-confirmPassword"
                isRequired
                isInvalid={!!signupErrors.confirmPassword}
              >
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                Sign Up
              </Button>
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack spacing={4}>
              <FormControl id="login-email" isRequired isInvalid={!loginData.email}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                />
                {loginErrors.email && <FormErrorMessage>{loginErrors.email}</FormErrorMessage>}
              </FormControl>
              <FormControl id="login-password" isRequired isInvalid={!loginData.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
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
              <Button
                colorScheme="blue"
                width="full"
                onClick={handleLoginSubmit}
                disabled={!isFormValid(loginData, loginErrors)}
              >
                Login
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
