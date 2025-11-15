'use client';

import { background, Box, useColorModeValue } from '@chakra-ui/react';
import { CldUploadButton } from 'next-cloudinary';
import React from 'react';

interface CloudinaryUploaderProps {
  handleCldUploadSuccess: any;
}

const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({ handleCldUploadSuccess }) => {
  const presetName = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;
  return (
    <Box className="flex items-center justify-center">
      <CldUploadButton
        options={{
          multiple: true,
          sources: ['local', 'camera', 'google_drive'],
          maxFiles: 8
        }}
        uploadPreset={presetName}
        onSuccessAction={handleCldUploadSuccess}
        className="bg-green-400 py-2 px-3 rounded border mt-4 text-white
        hover:bg-green-500 transition ease-in-out delay-200"
      >
        Upload Photo
      </CldUploadButton>
    </Box>
  );
};

export default CloudinaryUploader;
