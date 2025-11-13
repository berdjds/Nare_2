"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Languages, Loader2, Sparkles, Wand2, FileText } from 'lucide-react';

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
  // AI Content Assistance Props
  enableAIAssist?: boolean;
  canGenerateFromTitle?: boolean;
  titleValue?: string;
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
  enableAIAssist = false,
  canGenerateFromTitle = false,
  titleValue = '',
}: TranslationTabsProps) {
  const [translating, setTranslating] = useState<'hy' | 'ru' | 'ar' | null>(null);
  const [aiAssisting, setAiAssisting] = useState<'rephrase' | 'generate' | null>(null);
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

  const rephraseContent = async () => {
    if (!englishValue) {
      setError('Please enter text first');
      return;
    }

    setAiAssisting('rephrase');
    setError('');

    try {
      const response = await fetch('/api/ai/content-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rephrase',
          text: englishValue,
          context: context || `Field: ${fieldName}`,
          fieldType: fieldName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Rephrasing failed');
      }

      const data = await response.json();
      onEnglishChange(data.generatedText);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAiAssisting(null);
    }
  };

  const generateContent = async () => {
    if (!titleValue) {
      setError('Please enter a title first');
      return;
    }

    setAiAssisting('generate');
    setError('');

    try {
      // Determine action based on field name
      let action: 'generate_description' | 'generate_subtitle' | 'generate_message' = 'generate_description';
      
      const fieldLower = fieldName.toLowerCase();
      if (fieldLower.includes('subtitle')) {
        action = 'generate_subtitle';
      } else if (fieldLower.includes('message')) {
        action = 'generate_message';
      }

      const response = await fetch('/api/ai/content-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          text: titleValue,
          context: context || `Generate ${fieldName} based on title`,
          fieldType: fieldName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Content generation failed');
      }

      const data = await response.json();
      onEnglishChange(data.generatedText);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAiAssisting(null);
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
          <div className="space-y-2">
            <InputComponent
              value={englishValue}
              onChange={(e) => onEnglishChange(e.target.value)}
              placeholder={`Enter ${fieldName.toLowerCase()} in English...`}
              {...(multiline ? { rows } : {})}
            />
            
            {/* AI Assistance Buttons */}
            {enableAIAssist && (
              <div className="flex gap-2">
                {/* Rephrase Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={rephraseContent}
                  disabled={!englishValue || aiAssisting === 'rephrase'}
                  className="text-xs"
                >
                  {aiAssisting === 'rephrase' ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Rephrasing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-3 w-3 mr-1" />
                      AI Rephrase
                    </>
                  )}
                </Button>

                {/* Generate from Title Button */}
                {canGenerateFromTitle && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateContent}
                    disabled={!titleValue || aiAssisting === 'generate'}
                    className="text-xs"
                  >
                    {aiAssisting === 'generate' ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="h-3 w-3 mr-1" />
                        AI Generate from Title
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
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
