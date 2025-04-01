import { Platform } from 'react-native';

// Generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Format duration from seconds to MM:SS
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

// Parse M3U file content
export const parseM3U = (content: string) => {
  const lines = content.split('\n');
  const songs = [];
  let currentSong = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('#EXTINF:')) {
      // Extract duration and title/artist
      const infoLine = line.substring(8);
      const durationEnd = infoLine.indexOf(',');
      const duration = parseFloat(infoLine.substring(0, durationEnd));
      const titleArtist = infoLine.substring(durationEnd + 1).trim();
      
      // Try to split title and artist
      let title = titleArtist;
      let artist = 'Unknown Artist';
      
      if (titleArtist.includes(' - ')) {
        const parts = titleArtist.split(' - ');
        artist = parts[0].trim();
        title = parts[1].trim();
      }
      
      currentSong = {
        duration,
        title,
        artist
      };
    } else if (line && !line.startsWith('#') && currentSong) {
      // This is the file path line after an EXTINF line
      songs.push({
        id: generateId(),
        title: currentSong.title,
        artist: currentSong.artist,
        duration: currentSong.duration,
      });
      currentSong = null;
    }
  }
  
  return songs;
};

// Parse CSV file content
export const parseCSV = (content: string) => {
  const lines = content.split('\n');
  const songs = [];
  
  // Assume first line is header
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  const titleIndex = headers.indexOf('title');
  const artistIndex = headers.indexOf('artist');
  const albumIndex = headers.indexOf('album');
  const durationIndex = headers.indexOf('duration');
  const genreIndex = headers.indexOf('genre');
  
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',').map(v => v.trim());
    
    const song = {
      id: generateId(),
      title: titleIndex >= 0 ? values[titleIndex] : 'Unknown Title',
      artist: artistIndex >= 0 ? values[artistIndex] : 'Unknown Artist',
      duration: durationIndex >= 0 ? parseFloat(values[durationIndex]) : 180,
    };
    
    if (albumIndex >= 0) {
      song['album'] = values[albumIndex];
    }
    
    if (genreIndex >= 0) {
      song['genre'] = values[genreIndex];
    }
    
    songs.push(song);
  }
  
  return songs;
};

// Check if platform is web
export const isWeb = Platform.OS === 'web';