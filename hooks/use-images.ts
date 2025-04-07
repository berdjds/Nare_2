"use client";

import { images } from '@/lib/images';

export function useImages() {
  const getImageUrl = (key: keyof typeof images) => {
    return images[key] || '';
  };

  return {
    getImageUrl,
    images
  };
}