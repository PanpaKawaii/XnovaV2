import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 dark:from-gray-200 dark:to-gray-300 hover:from-gray-700 hover:to-gray-600 dark:hover:from-gray-300 dark:hover:to-gray-400 transition-all duration-300 hover:scale-110 hover:shadow-lg"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <div className="relative w-5 h-5">
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-yellow-400 animate-pulse" />
        ) : (
          <Moon className="w-5 h-5 text-blue-600 animate-pulse" />
        )}
      </div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 dark:from-blue-400/20 dark:to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};

export default ThemeToggle; 