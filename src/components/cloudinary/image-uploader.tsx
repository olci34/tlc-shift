'use client';

import { Box, Button, useToast } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { ListingImage } from '@/lib/interfaces/Listing';

interface ImageUploaderProps {
  handleFileSelect: (files: ListingImage[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ handleFileSelect: onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selecting, setSelecting] = useState(false);
  const toast = useToast();

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFilesChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (files.length > 8) {
      toast({
        title: 'Too many files',
        description: 'Please select maximum 8 files',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    setSelecting(true);

    try {
      const uploadFiles: ListingImage[] = [];

      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: 'Invalid file type',
            description: `${file.name} is not an image file`,
            status: 'error',
            duration: 3000,
            isClosable: true
          });
          return;
        }

        // Create preview URL for new images
        const preview = URL.createObjectURL(file);

        uploadFiles.push({
          file,
          name: file.name,
          src: preview,
          file_type: file.type.split('/')[1],
          file_size: file.size.toString()
        });
      }

      if (uploadFiles.length > 0) {
        onFileSelect(uploadFiles);
        toast({
          title: 'Files selected',
          description: `${uploadFiles.length} file(s) selected for upload`,
          status: 'success',
          duration: 3000,
          isClosable: true
        });
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('File selection error:', error);
      toast({
        title: 'Selection failed',
        description: error instanceof Error ? error.message : 'Failed to select files',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setSelecting(false);
    }
  };

  return (
    <Box className="flex items-center justify-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFilesChange}
        multiple
        accept="image/*"
        style={{ display: 'none' }}
      />
      <Button
        onClick={handleUploadButtonClick}
        isLoading={selecting}
        loadingText="Selecting..."
        className="bg-green-400 py-2 px-3 rounded border mt-4 text-white hover:bg-green-500 transition ease-in-out delay-200"
      >
        Select Photos
      </Button>
    </Box>
  );
};

export default ImageUploader;
