import { Button } from "@/components/ui/button";
import { Editor } from "@tiptap/react";
import React from "react";
import { useEditorEvent } from "./hooks/useEditorEvent";
import { toolbarButtons } from "@/app/constants/editorToolbarConfig";
import { Sparkle } from "lucide-react";

const EditorExtensions = ({ editor }: { editor: Editor }) => {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  useEditorEvent(editor, ["selectionUpdate", "transaction"], forceUpdate);

  function onAIClick() {
    alert('clicked')
  }

  return (
    editor && (
      <div className="p-5 space-x-2">
        {toolbarButtons.map((button) => {
          const IconComponent = button.icon;
          return (
            <Button
              key={button.key}
              onClick={() => {
                button.onClick(editor);
                if (button.key === "bold") forceUpdate(); 
              }}
              variant={button.isActive(editor) ? "default" : "outline"}
              aria-label={button.label}
            >
              <IconComponent 
                strokeWidth={button.strokeWidth || 3} 
                width={25} 
                height={20} 
              />
            </Button>
          );
        })}
        <Button onClick={onAIClick} className="hover:text-blue-400 cursor-pointer">
          <Sparkle/>
        </Button>
      </div>
    )
  );
};

export default EditorExtensions;