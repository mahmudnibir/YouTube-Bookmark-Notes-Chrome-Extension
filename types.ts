
export interface Bookmark {
  id: string;
  videoId: string;
  timestamp: number;
  note: string;
  createdAt: number;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
}
