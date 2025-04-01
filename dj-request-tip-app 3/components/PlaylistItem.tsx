import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ListMusic, Music } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Playlist } from '@/types/app';

interface PlaylistItemProps {
  playlist: Playlist;
  isActive?: boolean;
  onPress?: () => void;
}

export default function PlaylistItem({ 
  playlist, 
  isActive = false,
  onPress 
}: PlaylistItemProps) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        isActive && styles.activeContainer,
        pressed && styles.pressed
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <ListMusic size={24} color={isActive ? colors.secondary : colors.primary} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.name, isActive && styles.activeName]}>{playlist.name}</Text>
        <View style={styles.statsContainer}>
          <Music size={14} color={colors.textMuted} />
          <Text style={styles.songCount}>{playlist.songs.length} songs</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.card,
  },
  activeContainer: {
    backgroundColor: `${colors.secondary}20`,
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  activeName: {
    color: colors.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  songCount: {
    fontSize: 14,
    color: colors.textMuted,
    marginLeft: 4,
  },
});