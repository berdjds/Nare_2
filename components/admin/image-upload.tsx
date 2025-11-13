"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  recommendedSize?: { width: number; height: number };
}

interface UploadedImageInfo {
  url: string;
  width: number;
  height: number;
  size: number;
  originalSize: number;
  savings: number;
}

export function ImageUpload({ value, onChange, label, recommendedSize }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [imageInfo, setImageInfo] = useState<UploadedImageInfo | null>(null);
  const [preview, setPreview] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data: UploadedImageInfo = await response.json();
      
      setImageInfo(data);
      setPreview(data.url);
      onChange(data.url);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    setImageInfo(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleManualUrl = (url: string) => {
    setPreview(url);
    onChange(url);
    setImageInfo(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {recommendedSize && (
          <span className="text-xs text-gray-500">
            Recommended: {recommendedSize.width}×{recommendedSize.height}px
          </span>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <div className="relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
          <div className="relative aspect-video w-full">
            <Image
              key={preview}
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
              onError={(e) => {
                console.error('Image load error:', preview);
                setError('Failed to load image preview');
              }}
            />
          </div>
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Image Info */}
      {imageInfo && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">Image Uploaded Successfully</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>
              <span className="font-medium">Dimensions:</span> {imageInfo.width}×{imageInfo.height}px
            </div>
            <div>
              <span className="font-medium">WebP Size:</span> {formatFileSize(imageInfo.size)}
            </div>
            <div>
              <span className="font-medium">Original Size:</span> {formatFileSize(imageInfo.originalSize)}
            </div>
            <div className="text-green-600 font-medium">
              Saved {imageInfo.savings}%
            </div>
          </div>
          {recommendedSize && (imageInfo.width !== recommendedSize.width || imageInfo.height !== recommendedSize.height) && (
            <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 p-2 rounded">
              <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <span>
                Image size ({imageInfo.width}×{imageInfo.height}px) differs from recommended 
                ({recommendedSize.width}×{recommendedSize.height}px). It will be resized to fit.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Upload Button */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex-1"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600 mr-2" />
              Converting to WebP...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </>
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Manual URL Input */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Or paste image URL:</label>
        <Input
          value={value}
          onChange={(e) => handleManualUrl(e.target.value)}
          placeholder="/images/hero/..."
          className="text-sm"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Upload Tips */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Accepts: JPG, PNG, GIF, SVG (max 10MB)</p>
        <p>• Auto-converts to WebP for optimal performance</p>
        <p>• Shows compression savings and dimensions</p>
      </div>
    </div>
  );
}
