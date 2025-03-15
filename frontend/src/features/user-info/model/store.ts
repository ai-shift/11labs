import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserInfo {
  name: string;
  interests: string[];
  topicsToFollow: string[];
}

interface UserState {
  userData: UserInfo | null;
  setUserInfo: (data: UserInfo) => void;
  clearUserInfo: () => void;
}

export const useUserInfoStore = create<UserInfoState>()(
  persist(
    (set) => ({
      userData: null,
      setUserInfo: (data) => set({ userData: data }),
      clearUserInfo: () => set({ userData: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);
