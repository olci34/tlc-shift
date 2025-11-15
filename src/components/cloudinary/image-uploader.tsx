'use client';

import { Box, Button, useToast } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { ListingImage } from '@/lib/interfaces/Listing';
import { useTranslations } from 'next-intl';

interface ImageUploaderProps {
  handleFileSelect: (files: ListingImage[]) => void;
  currentImages?: ListingImage[];
}

// Validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20MB total
const MAX_FILES = 8;

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({
  handleFileSelect: onFileSelect,
  currentImages = []
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selecting, setSelecting] = useState(false);
  const toast = useToast();
  const t = useTranslations('imageUploader');

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFilesChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed max files count
    const totalFilesAfterUpload = currentImages.length + files.length;
    if (totalFilesAfterUpload > MAX_FILES) {
      toast({
        title: t('errorTooManyFiles'),
        description: t('errorMaxFiles', { max: MAX_FILES, current: currentImages.length }),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    setSelecting(true);

    try {
      const uploadFiles: ListingImage[] = [];
      const oversizedFiles: string[] = [];
      let totalNewSize = 0;

      // Calculate current total size
      const currentTotalSize = currentImages.reduce((sum, img) => {
        const size = typeof img.file_size === 'string' ? parseInt(img.file_size) : img.file_size;
        return sum + (size || 0);
      }, 0);

      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: t('errorInvalidFileType'),
            description: t('errorNotImage', { fileName: file.name }),
            status: 'error',
            duration: 5000,
            isClosable: true
          });
          setSelecting(false);
          return;
        }

        // Check individual file size
        if (file.size > MAX_FILE_SIZE) {
          oversizedFiles.push(`${file.name} (${formatFileSize(file.size)})`);
          continue;
        }

        totalNewSize += file.size;

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

      // Show oversized files error if any
      if (oversizedFiles.length > 0) {
        toast({
          title: t('errorFilesTooLarge'),
          description: `${t('errorMaxFileSize', { max: formatFileSize(MAX_FILE_SIZE) })}: ${oversizedFiles.join(', ')}`,
          status: 'error',
          duration: 7000,
          isClosable: true
        });
        setSelecting(false);
        return;
      }

      // Check total size
      const newTotalSize = currentTotalSize + totalNewSize;
      if (newTotalSize > MAX_TOTAL_SIZE) {
        toast({
          title: t('errorTotalSizeExceeded'),
          description: t('errorMaxTotalSize', {
            max: formatFileSize(MAX_TOTAL_SIZE),
            current: formatFileSize(currentTotalSize),
            attempting: formatFileSize(newTotalSize)
          }),
          status: 'error',
          duration: 7000,
          isClosable: true
        });
        setSelecting(false);
        return;
      }

      if (uploadFiles.length > 0) {
        onFileSelect(uploadFiles);
        toast({
          title: t('successTitle'),
          description: t('successDescription', { count: uploadFiles.length }),
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
        title: t('errorSelectionFailed'),
        description: error instanceof Error ? error.message : t('errorGeneric'),
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
        loadingText={t('selecting')}
        className="bg-green-400 py-2 px-3 rounded border mt-4 text-white hover:bg-green-500 transition ease-in-out delay-200"
      >
        {t('selectPhotos')}
      </Button>
    </Box>
  );
};

export default ImageUploader;
