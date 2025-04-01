import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SongRequest } from '@/types/app';
import { generateId } from '@/utils/helpers';

interface RequestState {
  requests: SongRequest[];
  addRequest: (request: Omit<SongRequest, 'id' | 'requestedAt' | 'status'>) => void;
  updateRequestStatus: (id: string, status: SongRequest['status']) => void;
  removeRequest: (id: string) => void;
  getRequestById: (id: string) => SongRequest | undefined;
  getPendingRequests: () => SongRequest[];
  getApprovedRequests: () => SongRequest[];
  getRejectedRequests: () => SongRequest[];
  getPlayedRequests: () => SongRequest[];
}

export const useRequestStore = create<RequestState>()(
  persist(
    (set, get) => ({
      requests: [],
      
      addRequest: (request) => set((state) => ({
        requests: [
          ...state.requests,
          {
            ...request,
            id: generateId(),
            requestedAt: Date.now(),
            status: 'pending',
          }
        ]
      })),
      
      updateRequestStatus: (id, status) => set((state) => ({
        requests: state.requests.map(request => 
          request.id === id ? { ...request, status } : request
        )
      })),
      
      removeRequest: (id) => set((state) => ({
        requests: state.requests.filter(request => request.id !== id)
      })),
      
      getRequestById: (id) => {
        return get().requests.find(request => request.id === id);
      },
      
      getPendingRequests: () => {
        return get().requests.filter(request => request.status === 'pending');
      },
      
      getApprovedRequests: () => {
        return get().requests.filter(request => request.status === 'approved');
      },
      
      getRejectedRequests: () => {
        return get().requests.filter(request => request.status === 'rejected');
      },
      
      getPlayedRequests: () => {
        return get().requests.filter(request => request.status === 'played');
      },
    }),
    {
      name: 'request-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);