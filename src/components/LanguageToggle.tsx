
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="h-9 px-3 transition-colors hover:bg-accent hover:text-accent-foreground"
      aria-label={`Switch to ${language === 'en' ? 'Arabic' : 'English'}`}
    >
      <Languages className="h-4 w-4 mr-2" />
      {language === 'en' ? 'ع' : 'EN'}
    </Button>
  );
};
