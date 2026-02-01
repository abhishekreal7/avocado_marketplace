import { Palette } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'premium' ? 'original' : 'premium');
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="sm"
      className="fixed bottom-6 right-6 z-50 shadow-2xl border-2 hover:scale-105 transition-transform"
      title={`Switch to ${theme === 'premium' ? 'Original' : 'Premium'} Theme`}
    >
      <Palette className="w-4 h-4 mr-2" />
      {theme === 'premium' ? 'Original' : 'Premium'}
    </Button>
  );
};
