export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // in seconds
  genre?: string;
}

export interface SongRequest {
  id: string;
  songId: string;
  userId: string;
  userName: string;
  requestedAt: number; // timestamp
  status: 'pending' | 'approved' | 'rejected' | 'played';
  tipAmount: number;
  message?: string;
}

export interface User {
  id: string;
  name: string;
  isAnonymous: boolean;
  isDj: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

export interface DjProfile {
  name: string;
  bio?: string;
  paymentInfo?: {
    venmo?: string;
    cashapp?: string;
    paypal?: string;
  };
  acceptingRequests: boolean;
  minTipAmount: number;
}