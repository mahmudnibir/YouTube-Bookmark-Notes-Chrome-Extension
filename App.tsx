
import React, { useState, useEffect, useCallback } from 'react';
import { VidNotesPanel } from './components/VidNotesPanel';
import { MockYouTubePlayer } from './components/MockYouTubePlayer';
import { Bookmark, Video } from './types';
import { getBookmarksForVideo, initializeDemoData } from './services/bookmarkService';

const MOCK_VIDEOS: Video[] = [
  { id: 'dQw4w9WgXcQ', title: 'React Tutorial for Beginners', thumbnail: 'https://picsum.photos/seed/react/1280/720', duration: 7200 },
  { id: 'yPYZpwSpKmA', title: 'Advanced TypeScript Course', thumbnail: 'https://picsum.photos/seed/typescript/1280/720', duration: 5400 },
];

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('vidnotes-theme') as 'light' | 'dark') || 'dark';
  });

  const [currentVideo, setCurrentVideo] = useState<Video>(MOCK_VIDEOS[0]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    initializeDemoData();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('vidnotes-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const refreshBookmarks = useCallback(() => {
    setBookmarks(getBookmarksForVideo(currentVideo.id));
  }, [currentVideo.id]);
  
  useEffect(() => {
    refreshBookmarks();
  }, [currentVideo, refreshBookmarks]);

  const handleVideoChange = (videoId: string) => {
    const video = MOCK_VIDEOS.find(v => v.id === videoId);
    if (video) {
      setCurrentVideo(video);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-gray-100 dark:bg-dark-bg dark:text-dark-text-primary transition-colors duration-300">
      <main className="container mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">VidNotes Showcase</h1>
          <div className="mb-4 flex gap-2">
            {MOCK_VIDEOS.map(video => (
              <button 
                key={video.id}
                onClick={() => handleVideoChange(video.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${currentVideo.id === video.id ? 'bg-brand-red text-white' : 'bg-gray-200 dark:bg-dark-surface dark:text-dark-text-secondary hover:bg-gray-300 dark:hover:bg-dark-card'}`}
              >
                {video.title}
              </button>
            ))}
          </div>
          <MockYouTubePlayer 
            video={currentVideo}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
        </div>
        <div className="lg:w-[400px] lg:mt-16 xl:w-[450px] flex-shrink-0">
          <VidNotesPanel 
            theme={theme}
            toggleTheme={toggleTheme}
            currentVideo={currentVideo}
            currentTime={currentTime}
            onSeek={handleSeek}
            bookmarks={bookmarks}
            refreshBookmarks={refreshBookmarks}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
