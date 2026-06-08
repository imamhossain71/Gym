import { create } from "zustand";

/** Global UI state: sidebar toggle (mobile) + unread notification count. */
export const useUIStore = create((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  unreadCount: 0,
  setUnreadCount: (n) => set({ unreadCount: n }),
}));
