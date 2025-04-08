"use client";

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { images } from '@/lib/images';
import { useImages } from '@/hooks/use-images';

export interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackKey: keyof typeof images;
}

export function ImageWithFallback({
  src,
  fallbackKey,
  alt,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const { getImageUrl } = useImages();

  const handleError = () => {
    setError(true);
  };

  return (
    <Image
      src={error ? getImageUrl(fallbackKey) : src}
      alt={alt}
      onError={handleError}
      {...props}
    />
  );
}