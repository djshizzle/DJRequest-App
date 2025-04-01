import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { ArrowLeft, Music, DollarSign, MessageSquare } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { usePlaylistStore } from '@/store/playlist-store';
import { useUserStore } from '@/store/user-store';
import { useRequestStore } from '@/store/request-store';
import { useDjStore } from '@/store/dj-store';
import SongItem from '@/components/SongItem';
import Input from '@/components/Input';
import Button from '@/components/Button';
import TipAmountSelector from '@/components/TipAmountSelector';
import PaymentMethodSelector from '@/components/PaymentMethodSelector';

type PaymentMethod = 'venmo' | 'cashapp' | 'paypal';

export default function RequestSongScreen() {
  const { songId } = useLocalSearchParams<{ songId: string }>();
  const router = useRouter();
  const { playlists } = usePlaylistStore();
  const { currentUser } = useUserStore();
  const { addRequest } = useRequestStore();
  const { profile } = useDjStore();
  
  const [tipAmount, setTipAmount] = useState(profile.minTipAmount);
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('venmo');
  
  // Find the song in playlists
  const song = playlists.flatMap(p => p.songs).find(s => s.id === songId);
  
  if (!song || !currentUser) {
    return null; // Handle not found case
  }
  
  const handleSubmitRequest = () => {
    if (tipAmount < profile.minTipAmount) {
      Alert.alert('Error', `Minimum tip amount is $${profile.minTipAmount.toFixed(2)}`);
      return;
    }
    
    // In a real app, we would process the payment here
    
    // Add the request
    addRequest({
      songId: song.id,
      userId: currentUser.id,
      userName: currentUser.name,
      tipAmount,
      message,
    });
    
    Alert.alert(
      'Request Submitted',
      'Your song request has been submitted successfully!',
      [
        { text: 'OK', onPress: () => router.push('/') }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Request Song',
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
        <View style={styles.songContainer}>
          <Text style={styles.sectionTitle}>Selected Song</Text>
          <SongItem song={song} showAlbum={true} />
        </View>
        
        <View style={styles.tipContainer}>
          <TipAmountSelector
            value={tipAmount}
            onChange={setTipAmount}
            minAmount={profile.minTipAmount}
          />
        </View>
        
        <View style={styles.messageContainer}>
          <Text style={styles.sectionTitle}>Add a Message (Optional)</Text>
          <Input
            placeholder="Add a message to the DJ..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={styles.messageInput}
            leftIcon={<MessageSquare size={20} color={colors.textSecondary} />}
          />
        </View>
        
        <View style={styles.paymentContainer}>
          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onSelect={setPaymentMethod}
            availableMethods={profile.paymentInfo || {}}
          />
        </View>
        
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Request Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Song:</Text>
            <Text style={styles.summaryValue}>{song.title}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Artist:</Text>
            <Text style={styles.summaryValue}>{song.artist}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tip Amount:</Text>
            <Text style={[styles.summaryValue, styles.tipValue]}>
              ${tipAmount.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment Method:</Text>
            <Text style={styles.summaryValue}>{paymentMethod}</Text>
          </View>
        </View>
        
        <Button
          title="Submit Request"
          onPress={handleSubmitRequest}
          icon={<DollarSign size={20} color={colors.text} />}
          style={styles.submitButton}
        />
        
        <Text style={styles.disclaimer}>
          By submitting this request, you agree to pay the DJ directly using the selected payment method.
          This app does not process payments.
        </Text>
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
  songContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  tipContainer: {
    marginBottom: 24,
  },
  messageContainer: {
    marginBottom: 24,
  },
  messageInput: {
    height: 80,
    paddingTop: 12,
  },
  paymentContainer: {
    marginBottom: 24,
  },
  summaryContainer: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  tipValue: {
    color: colors.success,
    fontWeight: 'bold',
  },
  submitButton: {
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 32,
  },
});