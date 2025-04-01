import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Music, DollarSign, Clock, Check, X, Play } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { SongRequest } from '@/types/app';
import { formatCurrency } from '@/utils/helpers';
import { usePlaylistStore } from '@/store/playlist-store';

interface RequestItemProps {
  request: SongRequest;
  onPress?: () => void;
}

export default function RequestItem({ request, onPress }: RequestItemProps) {
  const { playlists } = usePlaylistStore();
  
  // Find the song in playlists
  const song = playlists.flatMap(p => p.songs).find(s => s.id === request.songId);
  
  // Status icon and color
  const getStatusIcon = () => {
    switch (request.status) {
      case 'approved':
        return <Check size={18} color={colors.success} />;
      case 'rejected':
        return <X size={18} color={colors.error} />;
      case 'played':
        return <Play size={18} color={colors.secondary} />;
      default:
        return <Clock size={18} color={colors.warning} />;
    }
  };
  
  if (!song) {
    return null; // Song not found
  }
  
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
        <View style={styles.requestInfo}>
          <Text style={styles.requester}>From: {request.userName}</Text>
          {request.message && (
            <Text style={styles.message} numberOfLines={1}>"{request.message}"</Text>
          )}
        </View>
      </View>
      <View style={styles.metaContainer}>
        <View style={styles.tipContainer}>
          <DollarSign size={14} color={colors.success} />
          <Text style={styles.tipAmount}>{formatCurrency(request.tipAmount)}</Text>
        </View>
        <View style={styles.statusContainer}>
          {getStatusIcon()}
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
  requestInfo: {
    marginTop: 4,
  },
  requester: {
    fontSize: 12,
    color: colors.textMuted,
  },
  message: {
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.textMuted,
    marginTop: 2,
  },
  metaContainer: {
    alignItems: 'flex-end',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tipAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
    marginLeft: 2,
  },
  statusContainer: {
    marginTop: 4,
  },
});