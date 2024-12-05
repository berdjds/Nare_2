"use client";

import { useState } from 'react';
import Image from 'next/image';
import { images } from '@/lib/images';
import { useImages } from '@/hooks/use-images';

interface ImageWithFallbackProps {
  src: string;
  fallbackKey: keyof typeof images;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}

export function ImageWithFallback({
  src,
  fallbackKey,
  alt,
  className,
  fill,
  width,
  height,
  priority = false,
  sizes,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const { getImageUrl } = useImages();

  const handleError = () => {
    setError(true);
  };

  const imageProps = {
    src: error ? getImageUrl(fallbackKey) : src,
    alt,
    className,
    onError: handleError,
    priority,
    sizes,
    ...(fill ? { fill: true } : { width, height }),
  };

  return <Image {...imageProps} />;
}