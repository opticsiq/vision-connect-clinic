
import React from 'react';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center space-x-2 rtl:space-x-reverse"
    >
      <Languages className="w-4 h-4" />
      <span className="text-xs font-medium">
        {language === 'en' ? 'العربية' : 'English'}
      </span>
    </Button>
  );
};
