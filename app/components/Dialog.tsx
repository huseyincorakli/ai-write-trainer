"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialog } from "@/store/useDialog";

export function ShowDialog() {
  const { open, dialogContent, toggle,dialogTitle } = useDialog();

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          {dialogContent}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
