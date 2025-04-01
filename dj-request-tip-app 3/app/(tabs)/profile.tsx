import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { User, DollarSign, Music, Upload, LogOut, ToggleRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/user-store';
import { useDjStore } from '@/store/dj-store';
import { usePlaylistStore } from '@/store/playlist-store';
import Input from '@/components/Input';
import Button from '@/components/Button';
import PlaylistItem from '@/components/PlaylistItem';
import { mockPlaylists } from '@/mocks/songs';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, isDjMode, toggleDjMode, createAnonymousUser, logout } = useUserStore();
  const { profile, updateProfile, toggleAcceptingRequests } = useDjStore();
  const { playlists, currentPlaylistId, addPlaylist, setCurrentPlaylist, importPlaylist } = usePlaylistStore();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [djName, setDjName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio || '');
  const [venmo, setVenmo] = useState(profile.paymentInfo?.venmo || '');
  const [cashapp, setCashapp] = useState(profile.paymentInfo?.cashapp || '');
  const [paypal, setPaypal] = useState(profile.paymentInfo?.paypal || '');
  const [minTip, setMinTip] = useState(profile.minTipAmount.toString());

  const handleLogin = () => {
    if (name.trim().length === 0) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    createAnonymousUser(name);
  };

  const handleSaveDjProfile = () => {
    updateProfile({
      name: djName,
      bio,
      paymentInfo: {
        venmo,
        cashapp,
        paypal,
      },
      minTipAmount: parseFloat(minTip) || 1,
    });
    Alert.alert('Success', 'DJ profile updated successfully');
  };

  const handleImportDemoPlaylists = () => {
    mockPlaylists.forEach(playlist => {
      importPlaylist(playlist.name, playlist.songs);
    });
    Alert.alert('Success', 'Demo playlists imported successfully');
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => logout() },
      ]
    );
  };

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <User size={60} color={colors.primary} style={styles.userIcon} />
          <Text style={styles.loginTitle}>Welcome to DJ Request</Text>
          <Text style={styles.loginSubtitle}>Enter your name to get started</Text>
          
          <Input
            label="Your Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            containerStyle={styles.nameInput}
          />
          
          <Button
            title="Continue"
            onPress={handleLogin}
            style={styles.loginButton}
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userIconContainer}>
          <User size={40} color={colors.text} />
        </View>
        <Text style={styles.userName}>{currentUser.name}</Text>
        <Text style={styles.userType}>{isDjMode ? 'DJ Mode' : 'User Mode'}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ToggleRight size={24} color={colors.primary} />
          <Text style={styles.sectionTitle}>App Mode</Text>
        </View>
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>DJ Mode</Text>
          <Switch
            value={isDjMode}
            onValueChange={toggleDjMode}
            trackColor={{ false: colors.border, true: `${colors.primary}80` }}
            thumbColor={isDjMode ? colors.primary : colors.textMuted}
          />
        </View>
      </View>

      {isDjMode && (
        <>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>DJ Profile</Text>
            </View>
            
            <Input
              label="DJ Name"
              placeholder="Your DJ name"
              value={djName}
              onChangeText={setDjName}
            />
            
            <Input
              label="Bio"
              placeholder="Tell people about yourself"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              style={styles.bioInput}
            />
            
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}>Accepting Requests</Text>
              <Switch
                value={profile.acceptingRequests}
                onValueChange={toggleAcceptingRequests}
                trackColor={{ false: colors.border, true: `${colors.primary}80` }}
                thumbColor={profile.acceptingRequests ? colors.primary : colors.textMuted}
              />
            </View>
            
            <Input
              label="Minimum Tip Amount ($)"
              placeholder="1.00"
              value={minTip}
              onChangeText={setMinTip}
              keyboardType="decimal-pad"
            />
            
            <Button
              title="Save Profile"
              onPress={handleSaveDjProfile}
              style={styles.saveButton}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <DollarSign size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Payment Information</Text>
            </View>
            
            <Input
              label="Venmo Username"
              placeholder="@your-venmo"
              value={venmo}
              onChangeText={setVenmo}
            />
            
            <Input
              label="Cash App Username"
              placeholder="$your-cashapp"
              value={cashapp}
              onChangeText={setCashapp}
            />
            
            <Input
              label="PayPal Email/Username"
              placeholder="your-paypal@email.com"
              value={paypal}
              onChangeText={setPaypal}
            />
            
            <Button
              title="Save Payment Info"
              onPress={handleSaveDjProfile}
              style={styles.saveButton}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Music size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Playlists</Text>
            </View>
            
            {playlists.length > 0 ? (
              playlists.map(playlist => (
                <PlaylistItem
                  key={playlist.id}
                  playlist={playlist}
                  isActive={playlist.id === currentPlaylistId}
                  onPress={() => setCurrentPlaylist(playlist.id)}
                />
              ))
            ) : (
              <Text style={styles.noPlaylistsText}>
                You don't have any playlists yet. Import some to get started.
              </Text>
            )}
            
            <View style={styles.playlistButtons}>
              <Button
                title="Import Demo Playlists"
                onPress={handleImportDemoPlaylists}
                variant="outline"
                icon={<Upload size={18} color={colors.primary} />}
                style={styles.importButton}
              />
              
              <Button
                title="Manage Playlists"
                onPress={() => router.push('/playlists')}
                variant="secondary"
                style={styles.manageButton}
              />
            </View>
          </View>
        </>
      )}

      <View style={styles.logoutSection}>
        <Button
          title="Log Out"
          onPress={handleLogout}
          variant="outline"
          icon={<LogOut size={18} color={colors.error} />}
          textStyle={{ color: colors.error }}
          style={styles.logoutButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loginContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIcon: {
    marginBottom: 24,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  nameInput: {
    width: '100%',
    marginBottom: 24,
  },
  loginButton: {
    width: '100%',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  userType: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 16,
    color: colors.text,
  },
  bioInput: {
    height: 80,
    paddingTop: 12,
  },
  saveButton: {
    marginTop: 8,
  },
  noPlaylistsText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: 16,
  },
  playlistButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  importButton: {
    flex: 1,
    marginRight: 8,
  },
  manageButton: {
    flex: 1,
    marginLeft: 8,
  },
  logoutSection: {
    padding: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  logoutButton: {
    borderColor: colors.error,
  },
});