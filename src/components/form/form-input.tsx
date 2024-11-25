import { Input } from '@chakra-ui/react';
import { FC } from 'react';
import { Field } from '../ui/field';
interface FormInputProps {
  type: 'text' | 'date' | 'password' | 'email' | 'number';
}

const FormInput: FC<FormInputProps> = ({ type }) => {
  return (
    <Field>
      <Input type={type} variant="outline" />
    </Field>
  );
};

export default FormInput;
