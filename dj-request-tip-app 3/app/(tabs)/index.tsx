import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Music, AlertCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/user-store';
import { useRequestStore } from '@/store/request-store';
import RequestItem from '@/components/RequestItem';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/Button';

export default function RequestsScreen() {
  const router = useRouter();
  const { currentUser, isDjMode } = useUserStore();
  const { 
    requests, 
    getPendingRequests, 
    getApprovedRequests, 
    getRejectedRequests, 
    getPlayedRequests 
  } = useRequestStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'played'>(
    isDjMode ? 'pending' : 'approved'
  );

  // Filter requests based on user role and active tab
  const getFilteredRequests = () => {
    if (isDjMode) {
      switch (activeTab) {
        case 'pending': return getPendingRequests();
        case 'approved': return getApprovedRequests();
        case 'rejected': return getRejectedRequests();
        case 'played': return getPlayedRequests();
        default: return [];
      }
    } else {
      // For regular users, show only their requests
      return requests.filter(req => req.userId === currentUser?.id);
    }
  };

  const filteredRequests = getFilteredRequests();

  const handleRefresh = () => {
    setRefreshing(true);
    // In a real app, we would fetch new data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleRequestPress = (requestId: string) => {
    router.push(`/request/${requestId}`);
  };

  if (!currentUser) {
    return (
      <EmptyState
        icon={<AlertCircle size={40} color={colors.warning} />}
        title="Not Logged In"
        message="Please log in to view your requests"
        actionLabel="Go to Profile"
        onAction={() => router.push('/profile')}
      />
    );
  }

  return (
    <View style={styles.container}>
      {isDjMode && (
        <View style={styles.tabsContainer}>
          <Button
            title={`Pending (${getPendingRequests().length})`}
            variant={activeTab === 'pending' ? 'primary' : 'outline'}
            size="small"
            onPress={() => setActiveTab('pending')}
            style={styles.tabButton}
          />
          <Button
            title={`Approved (${getApprovedRequests().length})`}
            variant={activeTab === 'approved' ? 'primary' : 'outline'}
            size="small"
            onPress={() => setActiveTab('approved')}
            style={styles.tabButton}
          />
          <Button
            title={`Played (${getPlayedRequests().length})`}
            variant={activeTab === 'played' ? 'primary' : 'outline'}
            size="small"
            onPress={() => setActiveTab('played')}
            style={styles.tabButton}
          />
          <Button
            title={`Rejected (${getRejectedRequests().length})`}
            variant={activeTab === 'rejected' ? 'primary' : 'outline'}
            size="small"
            onPress={() => setActiveTab('rejected')}
            style={styles.tabButton}
          />
        </View>
      )}

      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RequestItem
            request={item}
            onPress={() => handleRequestPress(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon={<Music size={40} color={colors.primary} />}
            title={isDjMode ? "No Requests Yet" : "You Haven't Made Any Requests"}
            message={isDjMode 
              ? "When people request songs, they'll appear here" 
              : "Search for a song and make a request to get started"
            }
            actionLabel={isDjMode ? undefined : "Search Songs"}
            onAction={isDjMode ? undefined : () => router.push('/search')}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  listContent: {
    flexGrow: 1,
  },
});