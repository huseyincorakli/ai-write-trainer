import { Button } from "@/components/ui/button";
import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  EarIcon,
  Heading1,
  Heading2,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Underline,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useEditorEvent } from "./hooks/useEditorEvent";

const EditorExtensions = ({ editor }: { editor: Editor }) => {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  useEditorEvent(editor, ["selectionUpdate", "transaction"], forceUpdate);

  return (
    editor && (
      <div className="p-5 space-x-2 ">
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          variant={editor.isActive({ level: 1 }) ? "default" : "outline"}
        >
          <Heading1 strokeWidth={3} width={25} height={20} />
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          variant={editor.isActive({ level: 2 }) ? "default" : "outline"}
        >
          <Heading2 strokeWidth={3} width={25} height={20} />
        </Button>
        <Button
          onClick={() => {
            editor.chain().focus().toggleBold().run();
            forceUpdate();
          }}
          variant={editor.isActive("bold") ? "default" : "outline"}
        >
          <Bold strokeWidth={3} width={25} height={20} />
        </Button>

        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          variant={editor.isActive("italic") ? "default" : "outline"}
        >
          <Italic strokeWidth={3} width={25} height={20} />
        </Button>

        <Button
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#f3ff89" }).run()
          }
          variant={editor.isActive("highlight") ? "default" : "outline"}
        >
          <Highlighter strokeWidth={3} width={25} height={20} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          variant={editor.isActive("underline") ? "default" : "outline"}
        >
          <Underline strokeWidth={3} width={25} height={20} />
        </Button>

        <Button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          variant={
            editor.isActive({ textAlign: "left" }) ? "default" : "outline"
          }
        >
          <AlignLeft strokeWidth={3} width={25} height={20} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          variant={
            editor.isActive({ textAlign: "center" }) ? "default" : "outline"
          }
        >
          <AlignCenter strokeWidth={3} width={25} height={20} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          variant={
            editor.isActive({ textAlign: "right" }) ? "default" : "outline"
          }
        >
          <AlignRight strokeWidth={3} width={25} height={20} />
        </Button>
        <Button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          variant={
            editor.isActive({ textAlign: "justify" }) ? "default" : "outline"
          }
        >
          <AlignJustify strokeWidth={3} width={25} height={20} />
        </Button>
         <Button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
             variant={
            editor.isActive('bulletList') ? "default" : "outline"
          }
          >
           <List  strokeWidth={3} width={25} height={20}/>
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
             variant={
            editor.isActive('orderedList') ? "default" : "outline"
          }
          >
            <ListOrdered  strokeWidth={2} width={25} height={20}/>
          </Button>
      </div>
    )
  );
};

export default EditorExtensions;
