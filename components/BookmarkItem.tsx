
import React, { useState, useRef, useEffect } from 'react';
import { Bookmark } from '../types';
import { ClockIcon, EditIcon, DeleteIcon, SaveIcon, CancelIcon } from './Icons';
import { updateBookmark, deleteBookmark } from '../services/bookmarkService';

interface BookmarkItemProps {
  bookmark: Bookmark;
  onSeek: (time: number) => void;
  refreshBookmarks: () => void;
  isEditing: boolean;
  setIsEditing: (id: string | null) => void;
}

const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

export const BookmarkItem: React.FC<BookmarkItemProps> = ({
  bookmark,
  onSeek,
  refreshBookmarks,
  isEditing,
  setIsEditing,
}) => {
  const [noteText, setNoteText] = useState(bookmark.note);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();
        // Auto-resize textarea
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  const handleSave = () => {
    updateBookmark({ ...bookmark, note: noteText });
    setIsEditing(null);
    refreshBookmarks();
  };

  const handleCancel = () => {
    setNoteText(bookmark.note);
    setIsEditing(null);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      deleteBookmark(bookmark.id);
      refreshBookmarks();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNoteText(e.target.value);
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <li className="p-3 bg-gray-50 dark:bg-dark-card rounded-lg transition-all duration-300 hover:shadow-md hover:bg-gray-100 dark:hover:bg-dark-border/50 animate-fade-in">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-grow">
          <button
            onClick={() => onSeek(bookmark.timestamp)}
            className="flex items-center gap-2 text-sm font-mono text-brand-red font-semibold mb-2"
          >
            <ClockIcon className="w-4 h-4" />
            <span>{formatTime(bookmark.timestamp)}</span>
          </button>
          
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={noteText}
              onChange={handleTextareaInput}
              onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSave();
                  }
                  if (e.key === 'Escape') {
                      handleCancel();
                  }
              }}
              className="w-full p-2 text-sm bg-white dark:bg-dark-surface border border-brand-red rounded-md resize-none focus:outline-none"
              rows={2}
            />
          ) : (
            <p className="text-sm text-gray-700 dark:text-dark-text-primary whitespace-pre-wrap break-words">
              {bookmark.note}
            </p>
          )}
        </div>
        
        <div className="flex-shrink-0 flex items-center gap-1">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="p-1.5 text-green-500 hover:bg-green-500/10 rounded-full" title="Save">
                <SaveIcon className="w-5 h-5" />
              </button>
              <button onClick={handleCancel} className="p-1.5 text-gray-500 hover:bg-gray-500/10 rounded-full" title="Cancel">
                <CancelIcon className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(bookmark.id)} className="p-1.5 text-gray-500 dark:text-dark-text-secondary hover:bg-gray-500/10 rounded-full" title="Edit note">
                <EditIcon className="w-5 h-5" />
              </button>
              <button onClick={handleDelete} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-full" title="Delete bookmark">
                <DeleteIcon className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
      {isEditing && (
         <div className="text-xs text-gray-400 dark:text-dark-text-secondary mt-2 text-right">
            Press Enter to save, Esc to cancel
         </div>
      )}
    </li>
  );
};
