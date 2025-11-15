import { Box, IconButton } from '@chakra-ui/react';
import { CldImageProps } from 'next-cloudinary';
import { DeleteIcon } from '@chakra-ui/icons';
import React from 'react';
import CldImageWithFallback from '../cloudinary/cld-image-with-fallback';

interface CldImageBoxProps extends CldImageProps {
  onDelete?: () => void;
}

export const CldImageBox: React.FC<CldImageBoxProps> = ({ onDelete, ...props }) => {
  return (
    <Box position="relative">
      <CldImageWithFallback {...props} />
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
