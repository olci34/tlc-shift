import { Box, IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import React from 'react';
import Image from 'next/image';
import { ListingImage } from '@/lib/interfaces/Listing';
import CldImageWithFallback from './cld-image-with-fallback';

interface ImagePreviewProps {
  image: ListingImage;
  width: number;
  height: number;
  onDelete?: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ image, width, height, onDelete }) => {
  const isExistingImage = !!image.cld_public_id;

  return (
    <Box position="relative">
      {isExistingImage ? (
        <CldImageWithFallback
          src={image.cld_public_id!}
          alt={image.name}
          width={width}
          height={height}
          crop="fill"
          sizes="100vw"
          style={{ borderRadius: '8px' }}
        />
      ) : (
        <Image
          src={image.src}
          alt={image.name}
          width={width}
          height={height}
          style={{ objectFit: 'cover', borderRadius: '8px' }}
        />
      )}
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
