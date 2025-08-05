import { create } from "zustand";

type DialogState = {
  open: boolean;
  dialogContent: React.ReactNode;
  setDialogContent: (content: React.ReactNode) => void;
  dialogTitle: string;
  setDialogTitle: (title: string) => void;
  toggle: () => void;
};

export const useDialog = create<DialogState>((set) => ({
  open: false,
  toggle: () => set((state) => ({ open: !state.open })),
  dialogContent: null,
  setDialogContent: (content) => set({ dialogContent: content }),
  dialogTitle: "",
  setDialogTitle: (title) => set({ dialogTitle: title }),
}));
