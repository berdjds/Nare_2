"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Languages, Loader2, Sparkles } from 'lucide-react';

interface TranslationTabsProps {
  englishValue: string;
  armenianValue?: string;
  russianValue?: string;
  arabicValue?: string;
  onEnglishChange: (value: string) => void;
  onArmenianChange: (value: string) => void;
  onRussianChange: (value: string) => void;
  onArabicChange: (value: string) => void;
  fieldName: string;
  multiline?: boolean;
  rows?: number;
  context?: string;
}

export function TranslationTabs({
  englishValue,
  armenianValue = '',
  russianValue = '',
  arabicValue = '',
  onEnglishChange,
  onArmenianChange,
  onRussianChange,
  onArabicChange,
  fieldName,
  multiline = false,
  rows = 3,
  context,
}: TranslationTabsProps) {
  const [translating, setTranslating] = useState<'hy' | 'ru' | 'ar' | null>(null);
  const [error, setError] = useState<string>('');

  const translateField = async (targetLang: 'hy' | 'ru' | 'ar') => {
    if (!englishValue) {
      setError('Please enter English text first');
      return;
    }

    setTranslating(targetLang);
    setError('');

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: englishValue,
          targetLanguage: targetLang,
          context: context || `Field: ${fieldName}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Translation failed');
      }

      const data = await response.json();

      if (targetLang === 'hy') {
        onArmenianChange(data.translatedText);
      } else if (targetLang === 'ru') {
        onRussianChange(data.translatedText);
      } else {
        onArabicChange(data.translatedText);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTranslating(null);
    }
  };

  const InputComponent = multiline ? Textarea : Input;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <Languages className="h-4 w-4" />
          {fieldName}
        </Label>
      </div>

      <Tabs defaultValue="en" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="en" className="gap-2">
            🇬🇧 English
            {englishValue && <span className="text-xs text-green-600">●</span>}
          </TabsTrigger>
          <TabsTrigger value="hy" className="gap-2">
            🇦🇲 Armenian
            {armenianValue && <span className="text-xs text-green-600">●</span>}
          </TabsTrigger>
          <TabsTrigger value="ru" className="gap-2">
            🇷🇺 Russian
            {russianValue && <span className="text-xs text-green-600">●</span>}
          </TabsTrigger>
          <TabsTrigger value="ar" className="gap-2">
            🇦🇪 Arabic
            {arabicValue && <span className="text-xs text-green-600">●</span>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="en" className="space-y-2">
          <InputComponent
            value={englishValue}
            onChange={(e) => onEnglishChange(e.target.value)}
            placeholder={`Enter ${fieldName.toLowerCase()} in English...`}
            {...(multiline ? { rows } : {})}
          />
          <p className="text-xs text-gray-500">
            Default language. AI will translate to other languages from this.
          </p>
        </TabsContent>

        <TabsContent value="hy" className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <InputComponent
                value={armenianValue}
                onChange={(e) => onArmenianChange(e.target.value)}
                placeholder={`${fieldName} in Armenian (Հայերեն)...`}
                {...(multiline ? { rows } : {})}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => translateField('hy')}
              disabled={!englishValue || translating === 'hy'}
              className="shrink-0"
            >
              {translating === 'hy' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Translate
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Click "AI Translate" to auto-translate from English, or edit manually.
          </p>
        </TabsContent>

        <TabsContent value="ru" className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <InputComponent
                value={russianValue}
                onChange={(e) => onRussianChange(e.target.value)}
                placeholder={`${fieldName} in Russian (Русский)...`}
                {...(multiline ? { rows } : {})}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => translateField('ru')}
              disabled={!englishValue || translating === 'ru'}
              className="shrink-0"
            >
              {translating === 'ru' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Translate
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Click "AI Translate" to auto-translate from English, or edit manually.
          </p>
        </TabsContent>

        <TabsContent value="ar" className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1" dir="rtl">
              <InputComponent
                value={arabicValue}
                onChange={(e) => onArabicChange(e.target.value)}
                placeholder={`${fieldName} in Arabic (العربية)...`}
                {...(multiline ? { rows } : {})}
                className="text-right"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => translateField('ar')}
              disabled={!englishValue || translating === 'ar'}
              className="shrink-0"
            >
              {translating === 'ar' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Translate
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Click "AI Translate" to auto-translate from English, or edit manually.
          </p>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
