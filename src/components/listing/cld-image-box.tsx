import { Box, IconButton } from '@chakra-ui/react';
import { CldImage, CldImageProps } from 'next-cloudinary';
import { DeleteIcon } from '@chakra-ui/icons';
import React from 'react';

interface CldImageBoxProps extends CldImageProps {
  onDelete?: () => void;
}

export const CldImageBox: React.FC<CldImageBoxProps> = ({ onDelete, ...props }) => {
  return (
    <Box position="relative">
      <CldImage {...props} />
      {onDelete && (
        <IconButton
          aria-label="Delete image"
          icon={<DeleteIcon />}
          position="absolute"
          top={2}
          right={2}
          size="sm"
          colorScheme="red"
          onClick={onDelete}
        />
      )}
    </Box>
  );
};
