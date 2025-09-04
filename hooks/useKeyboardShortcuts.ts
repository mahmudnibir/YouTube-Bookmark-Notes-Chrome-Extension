
import { useEffect } from 'react';

type ShortcutMap = {
  [key: string]: (event: KeyboardEvent) => void;
};

export const useKeyboardShortcuts = (shortcutMap: ShortcutMap) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input, textarea, etc.
      const target = event.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }
      
      const handler = shortcutMap[event.key];
      if (handler) {
        event.preventDefault();
        handler(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcutMap]);
};
