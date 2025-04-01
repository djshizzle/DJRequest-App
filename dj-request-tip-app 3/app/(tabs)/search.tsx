import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Music, AlertCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { usePlaylistStore } from '@/store/playlist-store';
import { useUserStore } from '@/store/user-store';
import { useDjStore } from '@/store/dj-store';
import Input from '@/components/Input';
import SongItem from '@/components/SongItem';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/Button';
import { Song } from '@/types/app';

export default function SearchScreen() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const { profile } = useDjStore();
  const { playlists, currentPlaylistId, searchSongs } = usePlaylistStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [searching, setSearching] = useState(false);

  // Get current playlist
  const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);

  useEffect(() => {
    if (query.trim().length > 0) {
      setSearching(true);
      // Simulate search delay
      const timer = setTimeout(() => {
        const searchResults = searchSongs(query);
        setResults(searchResults);
        setSearching(false);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query, searchSongs]);

  const handleSongPress = (song: Song) => {
    router.push({
      pathname: '/request-song',
      params: { songId: song.id }
    });
  };

  if (!currentUser) {
    return (
      <EmptyState
        icon={<AlertCircle size={40} color={colors.warning} />}
        title="Not Logged In"
        message="Please log in to search and request songs"
        actionLabel="Go to Profile"
        onAction={() => router.push('/profile')}
      />
    );
  }

  if (!profile.acceptingRequests) {
    return (
      <EmptyState
        icon={<AlertCircle size={40} color={colors.warning} />}
        title="Requests Closed"
        message="The DJ is not accepting song requests at this time"
        actionLabel="View My Requests"
        onAction={() => router.push('/')}
      />
    );
  }

  if (!currentPlaylist || currentPlaylist.songs.length === 0) {
    return (
      <EmptyState
        icon={<Music size={40} color={colors.primary} />}
        title="No Songs Available"
        message="The DJ hasn't added any songs to their playlist yet"
        actionLabel="View My Requests"
        onAction={() => router.push('/')}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search songs by title, artist or album..."
          value={query}
          onChangeText={setQuery}
          leftIcon={<Search size={20} color={colors.textSecondary} />}
          containerStyle={styles.searchInput}
        />
        {currentPlaylist && (
          <Text style={styles.playlistInfo}>
            Searching in: {currentPlaylist.name} ({currentPlaylist.songs.length} songs)
          </Text>
        )}
      </View>

      {searching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : (
        <FlatList
          data={query.trim().length > 0 ? results : currentPlaylist?.songs.slice(0, 20)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SongItem
              song={item}
              onPress={() => handleSongPress(item)}
              showAlbum={true}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            query.trim().length === 0 ? (
              <Text style={styles.popularHeader}>Popular Songs</Text>
            ) : null
          }
          ListEmptyComponent={
            query.trim().length > 0 ? (
              <EmptyState
                icon={<Search size={40} color={colors.primary} />}
                title="No Results Found"
                message={`No songs matching "${query}" were found`}
                actionLabel="Clear Search"
                onAction={() => setQuery('')}
              />
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    marginBottom: 8,
  },
  playlistInfo: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  listContent: {
    flexGrow: 1,
  },
  popularHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    padding: 16,
    paddingBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
});