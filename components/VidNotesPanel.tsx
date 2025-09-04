
import React, { useState, useMemo, useEffect } from 'react';
import { Bookmark, Video } from '../types';
import { addBookmark } from '../services/bookmarkService';
import { PanelHeader } from './PanelHeader';
import { BookmarkItem } from './BookmarkItem';
import { AddIcon, SearchIcon, PremiumIcon } from './Icons';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface VidNotesPanelProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentVideo: Video;
  currentTime: number;
  onSeek: (time: number) => void;
  bookmarks: Bookmark[];
  refreshBookmarks: () => void;
}

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export const VidNotesPanel: React.FC<VidNotesPanelProps> = ({
  theme,
  toggleTheme,
  currentVideo,
  currentTime,
  onSeek,
  bookmarks,
  refreshBookmarks,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const handleAddBookmark = () => {
    addBookmark({
      videoId: currentVideo.id,
      timestamp: Math.floor(currentTime),
      note: 'New bookmark...',
    });
    refreshBookmarks();
    // Scroll to bottom after adding, slight delay to allow render
    setTimeout(() => {
        const list = document.getElementById('bookmark-list');
        if (list) list.scrollTop = list.scrollHeight;
    }, 100);
  };
  
  useKeyboardShortcuts({
    'p': handleAddBookmark,
    'P': handleAddBookmark,
  });

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter(bm =>
      bm.note.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bookmarks, searchTerm]);

  useEffect(() => {
    setIsEditing(null); // Close any open editors when video changes
  }, [currentVideo.id]);
  
  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl shadow-2xl flex flex-col h-[80vh] max-h-[800px] animate-slide-in overflow-hidden border border-gray-200 dark:border-dark-border">
      <PanelHeader theme={theme} toggleTheme={toggleTheme} />
      
      <div className="p-4 border-b border-gray-200 dark:border-dark-border">
        <h2 className="text-lg font-bold truncate" title={currentVideo.title}>{currentVideo.title}</h2>
        <div className="relative mt-3">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="w-5 h-5 text-gray-400 dark:text-dark-text-secondary" />
          </span>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-dark-card border border-gray-300 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red transition"
          />
        </div>
      </div>

      <div id="bookmark-list" className="flex-grow overflow-y-auto p-2">
        {filteredBookmarks.length > 0 ? (
          <ul className="space-y-2">
            {filteredBookmarks.map(bookmark => (
              <BookmarkItem
                key={bookmark.id}
                bookmark={bookmark}
                onSeek={onSeek}
                refreshBookmarks={refreshBookmarks}
                isEditing={isEditing === bookmark.id}
                setIsEditing={setIsEditing}
              />
            ))}
          </ul>
        ) : (
          <div className="text-center py-16 px-4">
            <p className="text-gray-500 dark:text-dark-text-secondary">No bookmarks yet.</p>
            <p className="text-sm text-gray-400 dark:text-dark-text-secondary mt-2">Click the button below or press 'P' to add one.</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-dark-border mt-auto bg-gray-50 dark:bg-dark-card">
        <div className="flex justify-between items-center mb-4">
            <button
                disabled
                className="flex items-center gap-2 text-sm text-gray-400 dark:text-dark-text-secondary cursor-not-allowed"
                title="Premium Feature"
            >
                <PremiumIcon className="w-5 h-5 text-yellow-500" />
                Export to CSV/JSON
            </button>
        </div>
        <button
          onClick={handleAddBookmark}
          className="w-full flex items-center justify-center gap-2 bg-brand-red text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-transform transform hover:scale-105"
        >
          <AddIcon className="w-6 h-6" />
          <span>Add Bookmark at {formatTime(currentTime)}</span>
        </button>
      </div>
    </div>
  );
};
