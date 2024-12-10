import { create } from "zustand";

// Define the types for your store state
interface CallStore {
  incomingCall: boolean;
  callInitiator: {} | null;
  setIncomingCall: (value: boolean) => void;
  setCallInitiator: (value: [] | null) => void;
}

// Create the store with Zustand
export const useCallStore = create<CallStore>((set) => ({
  incomingCall: false,
  callInitiator: null,
  setIncomingCall: (value: boolean) => set({ incomingCall: value }),
  setCallInitiator: (value: [] | null) => set({ callInitiator: value }),
}));
