
import { Bookmark } from '../types';

const STORAGE_KEY = 'vidnotes-bookmarks';

const getAllBookmarks = (): Bookmark[] => {
  try {
    const bookmarksJSON = localStorage.getItem(STORAGE_KEY);
    return bookmarksJSON ? JSON.parse(bookmarksJSON) : [];
  } catch (error) {
    console.error("Error reading bookmarks from localStorage", error);
    return [];
  }
};

const saveAllBookmarks = (bookmarks: Bookmark[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error("Error saving bookmarks to localStorage", error);
  }
};

export const getBookmarksForVideo = (videoId: string): Bookmark[] => {
  const allBookmarks = getAllBookmarks();
  return allBookmarks
    .filter(b => b.videoId === videoId)
    .sort((a, b) => a.timestamp - b.timestamp);
};

export const addBookmark = (bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Bookmark => {
  const allBookmarks = getAllBookmarks();
  const newBookmark: Bookmark = {
    ...bookmark,
    id: `bm-${Date.now()}`,
    createdAt: Date.now(),
  };
  saveAllBookmarks([...allBookmarks, newBookmark]);
  return newBookmark;
};

export const updateBookmark = (updatedBookmark: Bookmark): Bookmark | undefined => {
  let allBookmarks = getAllBookmarks();
  const index = allBookmarks.findIndex(b => b.id === updatedBookmark.id);
  if (index !== -1) {
    allBookmarks[index] = updatedBookmark;
    saveAllBookmarks(allBookmarks);
    return updatedBookmark;
  }
  return undefined;
};

export const deleteBookmark = (bookmarkId: string): void => {
  let allBookmarks = getAllBookmarks();
  const filteredBookmarks = allBookmarks.filter(b => b.id !== bookmarkId);
  saveAllBookmarks(filteredBookmarks);
};

export const initializeDemoData = (): void => {
  const allBookmarks = getAllBookmarks();
  if (allBookmarks.length > 0) {
    return;
  }

  const demoBookmarks: Omit<Bookmark, 'id' | 'createdAt'>[] = [
    { videoId: 'dQw4w9WgXcQ', timestamp: 43, note: 'The iconic chorus begins here! A key part of the song.' },
    { videoId: 'dQw4w9WgXcQ', timestamp: 88, note: 'Interesting dance move. Might be useful for a project.' },
    { videoId: 'dQw4w9WgXcQ', timestamp: 153, note: 'Bridge section with different instrumentation.' },
    { videoId: 'yPYZpwSpKmA', timestamp: 350, note: 'Explanation of generic types. This is a crucial concept to review.' },
    { videoId: 'yPYZpwSpKmA', timestamp: 1215, note: 'Utility Types: Pick and Omit. Very useful for API responses.' },
    { videoId: 'yPYZpwSpKmA', timestamp: 2480, note: 'Deep dive into conditional types. Need to re-watch this section.' },
    { videoId: 'yPYZpwSpKmA', timestamp: 3600, note: 'Project setup and configuration with tsconfig.json.' },
  ];

  demoBookmarks.forEach(bm => addBookmark(bm));
};
