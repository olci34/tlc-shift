import React, { useState } from 'react';
import { CldImage, CldImageProps } from 'next-cloudinary';

interface CldImageWithFallbackProps extends CldImageProps {
  fallbackSrc?: string;
}

const CldImageWithFallback: React.FC<CldImageWithFallbackProps> = ({
  src,
  fallbackSrc = 'vafpfc7ej0ecauw2d8u8',
  onError,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = (error: any) => {
    if (!hasError && currentSrc !== fallbackSrc) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }

    if (onError) {
      onError(error);
    }
  };

  return <CldImage {...props} src={currentSrc} onError={handleError} />;
};

export default CldImageWithFallback;
