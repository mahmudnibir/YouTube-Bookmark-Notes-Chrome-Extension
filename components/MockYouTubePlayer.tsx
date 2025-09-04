import React, { useEffect, useRef } from 'react';
import { Video } from '../types';
import { PlayIcon, PauseIcon } from './Icons';

interface MockYouTubePlayerProps {
  video: Video;
  currentTime: number;
  // FIX: Correctly type the state setter props to allow updater functions. This resolves the error on line 33.
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString();
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export const MockYouTubePlayer: React.FC<MockYouTubePlayerProps> = ({ 
  video, 
  currentTime, 
  setCurrentTime,
  isPlaying,
  setIsPlaying,
}) => {
  const intervalRef = useRef<number | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setCurrentTime(prevTime => {
          if (prevTime >= video.duration) {
            setIsPlaying(false);
            return video.duration;
          }
          return prevTime + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, setCurrentTime, video.duration, setIsPlaying]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * video.duration;
      setCurrentTime(newTime);
    }
  };

  const progressPercentage = (currentTime / video.duration) * 100;

  return (
    <div className="aspect-video w-full bg-black rounded-xl shadow-lg overflow-hidden relative group">
      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent transition-opacity opacity-0 group-hover:opacity-100 duration-300">
        <div 
          className="w-full h-1.5 bg-gray-500/50 rounded-full cursor-pointer" 
          ref={progressBarRef}
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-brand-red rounded-full relative" 
            style={{ width: `${progressPercentage}%` }}
          >
             <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 text-white">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsPlaying(!isPlaying)} className="text-white">
              {isPlaying ? <PauseIcon className="w-8 h-8"/> : <PlayIcon className="w-8 h-8"/>}
            </button>
          </div>
          <div className="text-sm font-mono">
            {formatTime(currentTime)} / {formatTime(video.duration)}
          </div>
        </div>
      </div>
    </div>
  );
};
