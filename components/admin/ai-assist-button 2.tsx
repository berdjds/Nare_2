"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wand2, FileText, Loader2 } from 'lucide-react';

interface AIAssistButtonProps {
  type: 'rephrase' | 'generate';
  currentValue: string;
  titleValue?: string;
  fieldType: string;
  context?: string;
  onGenerated: (text: string) => void;
  disabled?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function AIAssistButton({
  type,
  currentValue,
  titleValue,
  fieldType,
  context,
  onGenerated,
  disabled = false,
  size = 'sm',
}: AIAssistButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClick = async () => {
    // Validation
    if (type === 'rephrase' && !currentValue) {
      setError('Please enter text first');
      return;
    }
    if (type === 'generate' && !titleValue) {
      setError('Please enter a title first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Determine action based on field type
      let action: 'rephrase' | 'generate_description' | 'generate_subtitle' | 'generate_message' = 'rephrase';
      
      if (type === 'generate') {
        const fieldLower = fieldType.toLowerCase();
        if (fieldLower.includes('subtitle')) {
          action = 'generate_subtitle';
        } else if (fieldLower.includes('message')) {
          action = 'generate_message';
        } else {
          action = 'generate_description';
        }
      }

      const response = await fetch('/api/ai/content-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          text: type === 'rephrase' ? currentValue : titleValue,
          context: context || `Field: ${fieldType}`,
          fieldType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'AI assistance failed');
      }

      const data = await response.json();
      onGenerated(data.generatedText);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size={size}
        onClick={handleClick}
        disabled={disabled || loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            {type === 'rephrase' ? 'Rephrasing...' : 'Generating...'}
          </>
        ) : (
          <>
            {type === 'rephrase' ? (
              <>
                <Wand2 className="h-3 w-3 mr-1" />
                AI Rephrase
              </>
            ) : (
              <>
                <FileText className="h-3 w-3 mr-1" />
                AI Generate
              </>
            )}
          </>
        )}
      </Button>
      {error && (
        <span className="text-xs text-red-600">{error}</span>
      )}
    </>
  );
}
