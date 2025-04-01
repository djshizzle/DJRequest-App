import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Playlist, Song } from '@/types/app';
import { generateId } from '@/utils/helpers';

interface PlaylistState {
  playlists: Playlist[];
  currentPlaylistId: string | null;
  addPlaylist: (name: string, songs: Song[]) => void;
  removePlaylist: (id: string) => void;
  setCurrentPlaylist: (id: string | null) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  importPlaylist: (name: string, songs: Song[]) => void;
  searchSongs: (query: string) => Song[];
}

export const usePlaylistStore = create<PlaylistState>()(
  persist(
    (set, get) => ({
      playlists: [],
      currentPlaylistId: null,
      
      addPlaylist: (name, songs) => set((state) => {
        const newPlaylist: Playlist = {
          id: generateId(),
          name,
          songs,
        };
        return { 
          playlists: [...state.playlists, newPlaylist],
          currentPlaylistId: state.currentPlaylistId || newPlaylist.id
        };
      }),
      
      removePlaylist: (id) => set((state) => {
        const newPlaylists = state.playlists.filter(p => p.id !== id);
        const newCurrentId = state.currentPlaylistId === id 
          ? (newPlaylists.length > 0 ? newPlaylists[0].id : null) 
          : state.currentPlaylistId;
        
        return { 
          playlists: newPlaylists,
          currentPlaylistId: newCurrentId
        };
      }),
      
      setCurrentPlaylist: (id) => set({ currentPlaylistId: id }),
      
      addSongToPlaylist: (playlistId, song) => set((state) => ({
        playlists: state.playlists.map(playlist => 
          playlist.id === playlistId 
            ? { ...playlist, songs: [...playlist.songs, song] }
            : playlist
        )
      })),
      
      removeSongFromPlaylist: (playlistId, songId) => set((state) => ({
        playlists: state.playlists.map(playlist => 
          playlist.id === playlistId 
            ? { ...playlist, songs: playlist.songs.filter(song => song.id !== songId) }
            : playlist
        )
      })),
      
      importPlaylist: (name, songs) => {
        const { addPlaylist } = get();
        addPlaylist(name, songs);
      },
      
      searchSongs: (query) => {
        const { playlists, currentPlaylistId } = get();
        const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
        
        if (!currentPlaylist) return [];
        
        const lowerQuery = query.toLowerCase();
        return currentPlaylist.songs.filter(song => 
          song.title.toLowerCase().includes(lowerQuery) || 
          song.artist.toLowerCase().includes(lowerQuery) ||
          (song.album && song.album.toLowerCase().includes(lowerQuery))
        );
      },
    }),
    {
      name: 'playlist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);