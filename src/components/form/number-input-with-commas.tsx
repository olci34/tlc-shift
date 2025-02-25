import React, { useState, ChangeEvent } from 'react';
import { Input, InputProps } from '@chakra-ui/react';

interface NumberInputWithCommasProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: number | null;
  name?: string;
  onChange: (e: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

function NumberInputWithCommas({ value, onChange, name, ...rest }: NumberInputWithCommasProps) {
  const [inputValue, setInputValue] = useState<string>(
    value !== null && value !== undefined ? value.toLocaleString() : ''
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/,/g, '');
    const numberValue = parseInt(rawValue, 10);

    if (isNaN(numberValue)) {
      setInputValue('');
      onChange({
        currentTarget: {
          name: name || '',
          value: ''
        }
      } as React.FormEvent<HTMLInputElement>);
      return;
    }

    setInputValue(numberValue.toLocaleString());
    onChange({
      currentTarget: {
        name: name || '',
        value: numberValue.toString()
      }
    } as React.FormEvent<HTMLInputElement>);
  };

  return <Input {...rest} value={inputValue} onChange={handleInputChange} type="text" />;
}

export default NumberInputWithCommas;
