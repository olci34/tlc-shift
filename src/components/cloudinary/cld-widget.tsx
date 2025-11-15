'use client';

import React from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@chakra-ui/react';

export const CldWidget: React.FC = () => {
  const presetName = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

  return (
    <CldUploadWidget
      uploadPreset={presetName}
      options={{
        multiple: true,
        sources: ['local', 'camera', 'google_drive'],
        maxFiles: 8
      }}
    >
      {({ open }) => {
        return (
          <Button
            onClick={() => open()}
            className="bg-green-400 py-2 px-3 rounded border mt-4 text-white
        hover:bg-green-500 transition ease-in-out delay-200"
          >
            Upload Photo
          </Button>
        );
      }}
    </CldUploadWidget>
  );
};
