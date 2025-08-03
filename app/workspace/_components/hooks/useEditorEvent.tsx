import { Editor } from "@tiptap/react";
import { useEffect } from "react";

export const useEditorEvent = (
  editor: Editor,
  events: ("selectionUpdate" | "transaction")[],
  callback: () => void
) => {
  useEffect(() => {
    if (!editor) return;

    for (const event of events) {
      editor.on(event, callback);
    }

    return () => {
      for (const event of events) {
        editor.off(event, callback);
      }
    };
  }, [editor, callback]);
};
