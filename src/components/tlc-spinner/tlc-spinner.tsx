import { Spinner, Text, VStack } from '@chakra-ui/react';
import { FC } from 'react';

interface TlcSpinnerProps {
  show: boolean;
  text?: string;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

const TlcSpinner: FC<TlcSpinnerProps> = ({ show, text, size, color }) => {
  return (
    <VStack>
      <Spinner hidden={!show} size={size} color={color} />
      <Text>{text}</Text>
    </VStack>
  );
};

export default TlcSpinner;
