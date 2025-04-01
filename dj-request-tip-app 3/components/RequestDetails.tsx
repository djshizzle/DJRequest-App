import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Music, User, DollarSign, MessageSquare, Clock } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { SongRequest } from '@/types/app';
import { formatCurrency, formatDuration } from '@/utils/helpers';
import Button from './Button';
import { usePlaylistStore } from '@/store/playlist-store';

interface RequestDetailsProps {
  request: SongRequest;
  onApprove?: () => void;
  onReject?: () => void;
  onMarkAsPlayed?: () => void;
  isDj?: boolean;
}

export default function RequestDetails({ 
  request, 
  onApprove, 
  onReject, 
  onMarkAsPlayed,
  isDj = false
}: RequestDetailsProps) {
  const { playlists } = usePlaylistStore();
  
  // Find the song in playlists
  const song = playlists.flatMap(p => p.songs).find(s => s.id === request.songId);
  
  if (!song) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Song not found</Text>
      </View>
    );
  }
  
  const getStatusColor = () => {
    switch (request.status) {
      case 'approved': return colors.success;
      case 'rejected': return colors.error;
      case 'played': return colors.secondary;
      default: return colors.warning;
    }
  };
  
  const getStatusText = () => {
    switch (request.status) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'played': return 'Played';
      default: return 'Pending';
    }
  };
  
  const renderDate = () => {
    const date = new Date(request.requestedAt);
    return date.toLocaleString();
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>
      
      <View style={styles.songSection}>
        <View style={styles.iconContainer}>
          <Music size={32} color={colors.primary} />
        </View>
        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>{song.title}</Text>
          <Text style={styles.songArtist}>{song.artist}</Text>
          {song.album && <Text style={styles.songAlbum}>{song.album}</Text>}
          <Text style={styles.songDuration}>{formatDuration(song.duration)}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.detailSection}>
        <View style={styles.detailRow}>
          <User size={20} color={colors.textSecondary} />
          <Text style={styles.detailLabel}>Requested by:</Text>
          <Text style={styles.detailValue}>{request.userName}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <DollarSign size={20} color={colors.success} />
          <Text style={styles.detailLabel}>Tip amount:</Text>
          <Text style={[styles.detailValue, { color: colors.success }]}>
            {formatCurrency(request.tipAmount)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Clock size={20} color={colors.textSecondary} />
          <Text style={styles.detailLabel}>Requested at:</Text>
          <Text style={styles.detailValue}>{renderDate()}</Text>
        </View>
        
        {request.message && (
          <View style={styles.messageContainer}>
            <View style={styles.messageRow}>
              <MessageSquare size={20} color={colors.textSecondary} />
              <Text style={styles.messageLabel}>Message:</Text>
            </View>
            <Text style={styles.message}>"{request.message}"</Text>
          </View>
        )}
      </View>
      
      {isDj && request.status === 'pending' && (
        <View style={styles.actionButtons}>
          <Button 
            title="Reject" 
            variant="danger" 
            onPress={onReject}
            style={styles.rejectButton}
          />
          <Button 
            title="Approve" 
            variant="primary" 
            onPress={onApprove}
            style={styles.approveButton}
          />
        </View>
      )}
      
      {isDj && request.status === 'approved' && (
        <Button 
          title="Mark as Played" 
          variant="secondary" 
          onPress={onMarkAsPlayed}
          style={styles.playedButton}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  songSection: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: 'center',
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  songAlbum: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 4,
  },
  songDuration: {
    fontSize: 14,
    color: colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
    marginHorizontal: 16,
  },
  detailSection: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 8,
    width: 120,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  messageContainer: {
    marginTop: 8,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  message: {
    fontSize: 16,
    color: colors.text,
    fontStyle: 'italic',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    marginLeft: 28,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  approveButton: {
    flex: 1,
    marginLeft: 8,
  },
  rejectButton: {
    flex: 1,
    marginRight: 8,
  },
  playedButton: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 24,
  },
});