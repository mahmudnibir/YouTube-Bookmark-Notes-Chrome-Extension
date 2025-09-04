
import React from 'react';
import { MoonIcon, SunIcon, LogoIcon, PremiumIcon } from './Icons';

interface PanelHeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-card border-b border-gray-200 dark:border-dark-border flex-shrink-0">
      <div className="flex items-center gap-2">
        <LogoIcon className="w-7 h-7 text-brand-red" />
        <h1 className="text-xl font-bold text-gray-800 dark:text-dark-text-primary">VidNotes</h1>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => alert('Premium features like cloud sync and unlimited bookmarks are coming soon!')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 rounded-md hover:bg-yellow-400/30 transition-colors"
          title="Upgrade to Premium"
        >
            <PremiumIcon className="w-4 h-4" />
            <span>Upgrade</span>
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 dark:text-dark-text-secondary hover:bg-gray-200 dark:hover:bg-dark-border transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};
