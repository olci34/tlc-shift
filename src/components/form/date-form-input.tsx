import { FormControl, FormErrorMessage, FormLabel, Input, InputProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface DateFormInputProps extends InputProps {
  label: string;
}

const DateFormInput = forwardRef<HTMLInputElement, DateFormInputProps>(
  ({ label, ...inputProps }, ref) => {
    return (
      <FormControl display="flex" my={4}>
        <FormLabel>{label}</FormLabel>
        <Input
          {...inputProps}
          onChange={inputProps.onChange}
          variant="outline"
          ref={ref}
          type="date"
          value={inputProps.value}
        />
        <FormErrorMessage>Error message</FormErrorMessage>
      </FormControl>
    );
  }
);

DateFormInput.displayName = 'DateFormInput';
export default DateFormInput;
