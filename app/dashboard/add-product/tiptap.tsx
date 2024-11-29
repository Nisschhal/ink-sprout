"use client";

import { Toggle } from "@/components/ui/toggle";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

import { Bold, Italic, List, ListOrdered, Strikethrough } from "lucide-react";
import { useFormContext } from "react-hook-form";

const Tiptap = ({ val }: { val: string }) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Placeholder.configure({
        placeholder: "Write something about your product…",
        // don't forget to add placholder css at
      }),
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-4",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-4",
          },
        },
      }),
    ],

    content: val,

    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      // set value if form is dirty || changed, validate
      setValue("description", content, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    editorProps: {
      attributes: {
        class:
          "h-[200px] rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      },
    },
  });

  // get the useFormContext to pass the value to the form 'description field'
  const { setValue } = useFormContext();

  return (
    <div className="space-y-1">
      {/* Editor Menu */}

      <div className="flex  flex-col gap-2">
        {editor && (
          <div className="border-input border rounded-md">
            {/* Bold */}
            <Toggle
              pressed={editor.isActive("bold")}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
              size={"sm"}
            >
              <Bold size={18} />
            </Toggle>
            {/* ITALIC */}
            <Toggle
              pressed={editor.isActive("italic")}
              onPressedChange={() =>
                editor.chain().focus().toggleItalic().run()
              }
              size={"sm"}
            >
              <Italic size={18} />
            </Toggle>
            {/* STRICK THROUGH */}
            <Toggle
              pressed={editor.isActive("strike")}
              onPressedChange={() =>
                editor.chain().focus().toggleStrike().run()
              }
              size={"sm"}
            >
              <Strikethrough size={18} />
            </Toggle>
            {/* Number ordered list */}
            <Toggle
              pressed={editor.isActive("orderedList")}
              onPressedChange={() =>
                editor.chain().focus().toggleOrderedList().run()
              }
              size={"sm"}
            >
              <ListOrdered size={18} />
            </Toggle>
            {/* bullet list */}
            <Toggle
              pressed={editor.isActive("bulletList")}
              onPressedChange={() =>
                editor.chain().focus().toggleBulletList().run()
              }
              size={"sm"}
            >
              <List size={18} />
            </Toggle>
          </div>
        )}
      </div>
      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
