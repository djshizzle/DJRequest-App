import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Music } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Song } from '@/types/app';
import { formatDuration } from '@/utils/helpers';

interface SongItemProps {
  song: Song;
  onPress?: () => void;
  showDuration?: boolean;
  showAlbum?: boolean;
}

export default function SongItem({ 
  song, 
  onPress, 
  showDuration = true,
  showAlbum = false
}: SongItemProps) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Music size={24} color={colors.primary} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{song.title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{song.artist}</Text>
        {showAlbum && song.album && (
          <Text style={styles.album} numberOfLines={1}>{song.album}</Text>
        )}
      </View>
      {showDuration && (
        <Text style={styles.duration}>{formatDuration(song.duration)}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: `${colors.primary}10`,
  },
  iconContainer: {
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  artist: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  album: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  duration: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
});