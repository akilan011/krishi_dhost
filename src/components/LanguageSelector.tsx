import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const { theme } = useTheme();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' }
  ];

  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-600' : 'bg-blue-100 text-blue-800 border-blue-300'}`}>
      <Languages className="h-4 w-4" />
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className={`h-8 w-24 text-xs border-0 bg-transparent ${theme === 'dark' ? 'text-white' : 'text-blue-800'}`}>
          <SelectValue>
            <span className="flex items-center space-x-1">
              <span>{currentLang.flag}</span>
              <span className="hidden sm:inline">{currentLang.name}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map(lang => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className="flex items-center space-x-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}