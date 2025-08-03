
import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Underline,
} from "lucide-react";

export interface ToolbarButton {
  icon: any;
  onClick: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
  key: string;
  strokeWidth?: number;
  label?: string; 
}

export const toolbarButtons: ToolbarButton[] = [
  {
    icon: Heading1,
    onClick: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 1 }),
    key: "h1",
    label: "Heading 1"
  },
  {
    icon: Heading2,
    onClick: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 2 }),
    key: "h2",
    label: "Heading 2"
  },
  {
    icon: Bold,
    onClick: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor) => editor.isActive("bold"),
    key: "bold",
    label: "Bold"
  },
  {
    icon: Italic,
    onClick: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor.isActive("italic"),
    key: "italic",
    label: "Italic"
  },
  {
    icon: Highlighter,
    onClick: (editor) => editor.chain().focus().toggleHighlight({ color: "#f3ff89" }).run(),
    isActive: (editor) => editor.isActive("highlight"),
    key: "highlight",
    label: "Highlight"
  },
  {
    icon: Underline,
    onClick: (editor) => editor.chain().focus().toggleUnderline().run(),
    isActive: (editor) => editor.isActive("underline"),
    key: "underline",
    label: "Underline"
  },
  {
    icon: AlignLeft,
    onClick: (editor) => editor.chain().focus().setTextAlign("left").run(),
    isActive: (editor) => editor.isActive({ textAlign: "left" }),
    key: "align-left",
    label: "Align Left"
  },
  {
    icon: AlignCenter,
    onClick: (editor) => editor.chain().focus().setTextAlign("center").run(),
    isActive: (editor) => editor.isActive({ textAlign: "center" }),
    key: "align-center",
    label: "Align Center"
  },
  {
    icon: AlignRight,
    onClick: (editor) => editor.chain().focus().setTextAlign("right").run(),
    isActive: (editor) => editor.isActive({ textAlign: "right" }),
    key: "align-right",
    label: "Align Right"
  },
  {
    icon: AlignJustify,
    onClick: (editor) => editor.chain().focus().setTextAlign("justify").run(),
    isActive: (editor) => editor.isActive({ textAlign: "justify" }),
    key: "align-justify",
    label: "Justify"
  },
  {
    icon: List,
    onClick: (editor) => editor.chain().focus().toggleBulletList().run(),
    isActive: (editor) => editor.isActive('bulletList'),
    key: "bullet-list",
    label: "Bullet List"
  },
  {
    icon: ListOrdered,
    onClick: (editor) => editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive('orderedList'),
    key: "ordered-list",
    strokeWidth: 2,
    label: "Ordered List"
  }
];