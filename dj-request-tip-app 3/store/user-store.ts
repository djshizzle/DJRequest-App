import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/app';
import { generateId } from '@/utils/helpers';

interface UserState {
  currentUser: User | null;
  isDjMode: boolean;
  setUser: (user: User) => void;
  createAnonymousUser: (name: string) => void;
  toggleDjMode: () => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,
      isDjMode: false,
      setUser: (user) => set({ currentUser: user }),
      createAnonymousUser: (name) => set({
        currentUser: {
          id: generateId(),
          name,
          isAnonymous: true,
          isDj: false,
        }
      }),
      toggleDjMode: () => set((state) => ({ 
        isDjMode: !state.isDjMode,
        currentUser: state.currentUser 
          ? { ...state.currentUser, isDj: !state.isDjMode } 
          : null
      })),
      logout: () => set({ currentUser: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);