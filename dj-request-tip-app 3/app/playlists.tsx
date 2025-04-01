import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, ListMusic, Plus, Trash2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { usePlaylistStore } from '@/store/playlist-store';
import PlaylistItem from '@/components/PlaylistItem';
import Button from '@/components/Button';
import Input from '@/components/Input';
import EmptyState from '@/components/EmptyState';
import { mockPlaylists } from '@/mocks/songs';

export default function PlaylistsScreen() {
  const router = useRouter();
  const { 
    playlists, 
    currentPlaylistId, 
    addPlaylist, 
    removePlaylist, 
    setCurrentPlaylist,
    importPlaylist
  } = usePlaylistStore();
  
  const [newPlaylistName, setNewPlaylistName] = useState('');
  
  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim().length === 0) {
      Alert.alert('Error', 'Please enter a playlist name');
      return;
    }
    
    addPlaylist(newPlaylistName, []);
    setNewPlaylistName('');
    Alert.alert('Success', 'Playlist created successfully');
  };
  
  const handleDeletePlaylist = (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this playlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            removePlaylist(id);
            Alert.alert('Success', 'Playlist deleted successfully');
          } 
        },
      ]
    );
  };
  
  const handleImportDemoPlaylists = () => {
    mockPlaylists.forEach(playlist => {
      importPlaylist(playlist.name, playlist.songs);
    });
    Alert.alert('Success', 'Demo playlists imported successfully');
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Manage Playlists',
          headerLeft: () => (
            <ArrowLeft 
              size={24} 
              color={colors.text} 
              style={styles.backButton}
              onPress={() => router.back()}
            />
          ),
        }}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.createSection}>
          <Text style={styles.sectionTitle}>Create New Playlist</Text>
          <View style={styles.createForm}>
            <Input
              placeholder="Playlist name"
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              containerStyle={styles.nameInput}
            />
            <Button
              title="Create"
              onPress={handleCreatePlaylist}
              icon={<Plus size={18} color={colors.text} />}
            />
          </View>
        </View>
        
        <View style={styles.playlistsSection}>
          <Text style={styles.sectionTitle}>Your Playlists</Text>
          
          {playlists.length > 0 ? (
            playlists.map(playlist => (
              <View key={playlist.id} style={styles.playlistItemContainer}>
                <PlaylistItem
                  playlist={playlist}
                  isActive={playlist.id === currentPlaylistId}
                  onPress={() => setCurrentPlaylist(playlist.id)}
                />
                <Button
                  title=""
                  variant="danger"
                  size="small"
                  onPress={() => handleDeletePlaylist(playlist.id)}
                  icon={<Trash2 size={18} color={colors.text} />}
                  style={styles.deleteButton}
                />
              </View>
            ))
          ) : (
            <EmptyState
              icon={<ListMusic size={40} color={colors.primary} />}
              title="No Playlists Yet"
              message="Create a new playlist or import demo playlists to get started"
              actionLabel="Import Demo Playlists"
              onAction={handleImportDemoPlaylists}
            />
          )}
        </View>
        
        {playlists.length > 0 && (
          <View style={styles.importSection}>
            <Button
              title="Import Demo Playlists"
              variant="outline"
              onPress={handleImportDemoPlaylists}
              style={styles.importButton}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  createSection: {
    marginBottom: 24,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  createForm: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  nameInput: {
    flex: 1,
    marginRight: 8,
    marginBottom: 0,
  },
  playlistsSection: {
    marginBottom: 24,
  },
  playlistItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 8,
    height: 40,
    width: 40,
    borderRadius: 20,
    padding: 0,
  },
  importSection: {
    marginBottom: 32,
  },
  importButton: {
    marginTop: 8,
  },
});