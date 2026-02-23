"use client";

import React, { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";

import {
Bold as BoldIcon,
Italic as ItalicIcon,
List as ListIcon,
AlignLeft,
AlignCenter,
AlignRight,
Image as ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function RichTextEditor() {
const editor = useEditor({
immediatelyRender: false,
extensions: [
StarterKit,
BulletList,
ListItem,
Image,

      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: `<p style="text-align: center;">Welcome! Here's a <strong>highlight</strong>.</p><blockquote>A motivating quote.</blockquote>`,

});

const [html, setHtml] = useState(editor?.getHTML() || "");
const [activeMarks, setActiveMarks] = useState({
bold: false,
italic: false,
bulletList: false,
alignLeft: false,
alignCenter: false,
alignRight: false,
});

const fileInputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
if (!editor) return;

    const update = () => {
      setHtml(editor.getHTML());
      setActiveMarks({
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        bulletList: editor.isActive("bulletList"),
        alignLeft: editor.isActive({ textAlign: "left" }),
        alignCenter: editor.isActive({ textAlign: "center" }),
        alignRight: editor.isActive({ textAlign: "right" }),
      });
    };

    editor.on("update", update);
    editor.on("selectionUpdate", update);
    update();

    return () => {
      editor.off("update", update);
      editor.off("selectionUpdate", update);
    };

}, [editor]);

const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
const file = event.target.files?.[0];
if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    editor?.chain().focus().setImage({ src: imageUrl, height: 100 }).run();

    // Reset file input to allow re-uploading the same file if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

};

return (

<div className="max-w-full mx-auto p-6 flex flex-col h-full min-h-[600px]">
<div className="flex gap-2 mb-4 flex-wrap">
<Button
onClick={() => editor?.chain().focus().toggleBold().run()}
variant={activeMarks.bold ? "default" : "outline"}
className="flex items-center gap-1" >
<BoldIcon size={16} /> Bold
</Button>
<Button
onClick={() => editor?.chain().focus().toggleItalic().run()}
variant={activeMarks.italic ? "default" : "outline"}
className="flex items-center gap-1" >
<ItalicIcon size={16} /> Italic
</Button>

        <Button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          variant={activeMarks.bulletList ? "default" : "outline"}
          className="flex items-center gap-1"
        >
          <ListIcon size={16} /> Bullet List
        </Button>

        {/* Alignment */}
        <Button
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          variant={activeMarks.alignLeft ? "default" : "outline"}
          className="flex items-center gap-1"
          aria-label="Align Left"
        >
          <AlignLeft size={16} /> Left
        </Button>
        <Button
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          variant={activeMarks.alignCenter ? "default" : "outline"}
          className="flex items-center gap-1"
          aria-label="Align Center"
        >
          <AlignCenter size={16} /> Center
        </Button>
        <Button
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          variant={activeMarks.alignRight ? "default" : "outline"}
          className="flex items-center gap-1"
          aria-label="Align Right"
        >
          <AlignRight size={16} /> Right
        </Button>
      </div>

      <div className="flex gap-2 mb-4 max-w-full items-center">
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />

        {/* Label as button with icon to trigger file input */}
        <label
          htmlFor="image-upload"
          className="bg-color-palette-btn  flex items-center gap-1 px-4 py-2 rounded cursor-pointer select-none"
        >
          <ImageIcon size={20} />
          Upload Image
        </label>
      </div>

      <div
        className="border border-color-palette-accent-3 rounded p-4 bg-color-palette-bg w-full flex-grow"
        style={{ wordBreak: "break-word" }}
      >
        <EditorContent
          editor={editor}
          className="w-full h-full min-h-[200px]"
        />
      </div>

      <div className="mt-8 max-w-full">
        <h3 className="mb-2 font-semibold">Live HTML Preview</h3>
        <div
          className="border border-color-palette-accent-3 rounded p-4 bg-color-palette-bg prose max-w-full break-words"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>

);
}
