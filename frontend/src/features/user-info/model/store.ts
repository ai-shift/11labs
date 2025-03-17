import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserInfo = {
  name: string;
  interests: string[];
  topicsToFollow: string[];
};

export type UserInfoState = {
  userData: UserInfo | null;
  setUserInfo: (data: UserInfo) => void;
  clearUserInfo: () => void;
};

export const useUserInfoStore = create<UserInfoState>()(
  persist(
    (set) => ({
      userData: null,
      setUserInfo: (data) => set({ userData: data }),
      clearUserInfo: () => set({ userData: null }),
    }),
    {
      name: "user-storage",
    },
  ),
);
