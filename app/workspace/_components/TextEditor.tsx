import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import EditorExtensions from "./EditorExtensions";
import { ListItem } from '@tiptap/extension-list'

const TextEditor = () => {
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start taking notes here...",
      }),
      Highlight.configure({
        multicolor:true
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      ListItem.configure({
        HTMLAttributes: {
        class: 'custom-li',
    },
      })
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "focus:outline-none h-[90vh] p-5",
      },
    },
  });
  return (
    <div className="w-full">
      {editor && <EditorExtensions editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TextEditor;
