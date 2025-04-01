import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DjProfile } from '@/types/app';

interface DjState {
  profile: DjProfile;
  updateProfile: (profile: Partial<DjProfile>) => void;
  toggleAcceptingRequests: () => void;
}

const DEFAULT_PROFILE: DjProfile = {
  name: 'DJ',
  bio: 'Ready to take your requests!',
  paymentInfo: {
    venmo: '',
    cashapp: '',
    paypal: '',
  },
  acceptingRequests: true,
  minTipAmount: 1,
};

export const useDjStore = create<DjState>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,
      updateProfile: (profile) => set((state) => ({
        profile: { ...state.profile, ...profile }
      })),
      toggleAcceptingRequests: () => set((state) => ({
        profile: { 
          ...state.profile, 
          acceptingRequests: !state.profile.acceptingRequests 
        }
      })),
    }),
    {
      name: 'dj-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);