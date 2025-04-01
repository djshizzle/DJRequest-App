import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { ArrowLeft, Check, X, Play } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useRequestStore } from '@/store/request-store';
import { useUserStore } from '@/store/user-store';
import RequestDetails from '@/components/RequestDetails';

export default function RequestDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getRequestById, updateRequestStatus } = useRequestStore();
  const { isDjMode } = useUserStore();
  
  const request = getRequestById(id);
  
  if (!request) {
    return null; // Handle not found case
  }
  
  const handleApprove = () => {
    updateRequestStatus(id, 'approved');
  };
  
  const handleReject = () => {
    updateRequestStatus(id, 'rejected');
  };
  
  const handleMarkAsPlayed = () => {
    updateRequestStatus(id, 'played');
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Request Details',
          headerLeft: () => (
            <ArrowLeft 
              size={24} 
              color={colors.text} 
              style={styles.backButton}
              onPress={() => router.back()}
            />
          ),
          headerRight: () => isDjMode && request.status === 'pending' ? (
            <View style={styles.headerActions}>
              <X 
                size={24} 
                color={colors.error} 
                style={styles.actionButton}
                onPress={handleReject}
              />
              <Check 
                size={24} 
                color={colors.success} 
                style={styles.actionButton}
                onPress={handleApprove}
              />
            </View>
          ) : isDjMode && request.status === 'approved' ? (
            <Play 
              size={24} 
              color={colors.secondary} 
              style={styles.actionButton}
              onPress={handleMarkAsPlayed}
            />
          ) : null,
        }}
      />
      
      <RequestDetails 
        request={request}
        onApprove={handleApprove}
        onReject={handleReject}
        onMarkAsPlayed={handleMarkAsPlayed}
        isDj={isDjMode}
      />
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
  headerActions: {
    flexDirection: 'row',
    marginRight: 16,
  },
  actionButton: {
    marginLeft: 20,
  },
});