import { Button } from "@/components/ui/button";
import { Editor } from "@tiptap/react";
import React, { useEffect, useRef, useState } from "react";
import { useEditorEvent } from "./hooks/useEditorEvent";
import { toolbarButtons } from "@/app/constants/editorToolbarConfig";
import { LoaderCircle, Save, Sparkle } from "lucide-react";
import { useParams } from "next/navigation";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { askAI } from "@/langchain/actions/askQuestionToAI";
import { useUser } from "@clerk/nextjs";

const EditorExtensions = ({ editor }: { editor: Editor }) => {
  const { fileId } = useParams();
  const searchAI = useAction(api.myAction.search);
  const saveNotes = useMutation(api.notes.addNotes);
  const { user } = useUser();
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const [isWorking, setIsWorking] = useState(false);
  const notes = useQuery(
    api.notes.getNotes,
    fileId && user?.primaryEmailAddress?.emailAddress
      ? {
          fileId: fileId.toString(),
          createdBy: user.primaryEmailAddress.emailAddress,
        }
      : "skip"
  );
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (notes && !hasRunRef.current) {
      editor.commands.setContent(notes);
      hasRunRef.current = true;
    }
  }, [notes]);

  useEditorEvent(editor, ["selectionUpdate", "transaction"], forceUpdate);

  const spinner = `<p style="text-align: center; color: #6b7280; font-style: italic;">AI is working...</p>`;
  const empty = `<p style="text-align: center; color: #6b7280; font-style: italic;">Please select something and try it out.</p>`;
  const errorp = `<p style="text-align: center; color: #f70a02; font-style: bold;">Something went wrong.</p>`;
  async function onSaveClick() {
    if (fileId && user?.primaryEmailAddress) {
      const notes = editor.getHTML();
      if (notes == "<p></p>") {
        alert("pls write something");
        return;
      }
      try {
        await saveNotes({
          notes: editor.getHTML(),
          createdBy: user?.primaryEmailAddress?.emailAddress,
          fileId: fileId.toString(),
        });
        alert("saved");
      } catch (error) {}
    }
  }
  async function onAIClick() {
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      " "
    );
    const AllText = editor.getHTML();

    if (!selectedText.trim()) {
      editor.commands.setContent(AllText + empty);
    }
    setIsWorking(true);
    editor.commands.setContent(AllText + spinner);
    try {
      if (fileId) {
        const result = await searchAI({
          fileId: fileId?.toString(),
          query: selectedText,
        });
        const unformetedResult = (JSON.parse(result) as any[])
          .map((item) => item.pageContent)
          .join(" ");
        editor.commands.setContent(AllText + spinner);
        const AIResponse = (
          (await askAI(unformetedResult, selectedText))?.aiMessage as string
        )
          .replace("```html", "")
          .replace("```", "");
        editor.commands.setContent(AllText + AIResponse);
        setIsWorking(false);
      }
    } catch (error) {
      const AllText = editor.getHTML();
      editor.commands.setContent(
        AllText.replace("AI is working...", "") + errorp
      );
      setIsWorking(false);
    }
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
        <Button
          onClick={onAIClick}
          className="hover:text-blue-400 cursor-pointer"
        >
          {isWorking ? <LoaderCircle className="animate-spin" /> : <Sparkle />}
        </Button>
        <Button
          onClick={onSaveClick}
          className="hover:text-orange-400 cursor-pointer"
        >
          <Save />
        </Button>
      </div>
    )
  );
};

export default EditorExtensions;
