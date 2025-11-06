"use client";

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { languages } from '@/lib/translations';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useLanguage();

  if (!languages) return null;

  // Get current language display name
  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="min-w-[120px] justify-between gap-2 px-3 py-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="flag">
              {getFlagEmoji(currentLanguage)}
            </span>
            <span className="font-medium">{currentLang?.name}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              "min-w-[160px] px-3 py-2",
              currentLanguage === lang.code ? 'bg-accent' : ''
            )}
          >
            <div className="flex items-center justify-between w-full gap-2">
              <span className="font-medium">{lang.name}</span>
              <span className="text-2xl" role="img" aria-label="flag">
                {getFlagEmoji(lang.code)}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getFlagEmoji(langCode: string): string {
  const flags: Record<string, string> = {
    'en': '🇬🇧',
    'hy': '🇦🇲',
    'ru': '🇷🇺',
    'ar': '🇦🇪',
  };
  
  // Return flag emoji with fallback to country code badge if emoji not supported
  const flag = flags[langCode];
  if (flag) {
    return flag;
  }
  
  // Fallback to uppercase code if flag emoji not available
  return langCode.toUpperCase();
}