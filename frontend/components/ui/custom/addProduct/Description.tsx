"use client";

import React, { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageResize from "tiptap-extension-resize-image";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import { TextStyleKit } from "@tiptap/extension-text-style";
import CharacterCount from "@tiptap/extension-character-count";

import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  List as ListIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  UploadCloud,
  Type,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadCategory } from "@/actions/brand-category";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAddProductStore } from "@/zustan-hook/addProductStore";

export default function RichTextEditor({
  description,
  updateField,
}: {
  description: string;
  updateField: (field: string, value: any) => void;
}) {
  const MAX_CHARACTERS = 2000;
  const MAX_IMAGES = 2;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      BulletList,
      ListItem,
      ImageResize,
      TextStyleKit,
      TextAlign.configure({ types: ["heading", "paragraph", "image"] }),
      CharacterCount.configure({
        limit: MAX_CHARACTERS,
      }),
    ],
    content: description || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none w-full max-w-full",
      },
    },
  });
  useEffect(() => {
    if (editor && description !== undefined) {
      const currentContent = editor.getHTML();
      // Only update if the content is actually different to avoid unnecessary updates
      if (currentContent !== description) {
        editor.commands.setContent(description || "", {
          emitUpdate: false, // Prevents triggering update events
        });
      }
    }
  }, [description, editor]);

  const [html, setHtml] = useState("");
  const [textSize, setTextSize] = useState("paragraph");
  const [charCount, setCharCount] = useState(0);
  const [imageCount, setImageCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeMarks, setActiveMarks] = useState({
    bold: false,
    italic: false,
    bulletList: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
  });

  // Helper function to count images directly from the doc
  const getImageCount = (editorInstance: any) => {
    if (!editorInstance) return 0;
    let count = 0;
    editorInstance.state.doc.descendants((node: any) => {
      if (node.type.name === "image") {
        count++;
      }
    });
    return count;
  };

  useEffect(() => {
    if (!editor && description !== undefined) return;

    const update = () => {
      setHtml(editor.getHTML());
      updateField("description", editor.getHTML());
      setCharCount(editor.storage.characterCount.characters());

      // Update image count for UI
      setImageCount(getImageCount(editor));

      setActiveMarks({
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        bulletList: editor.isActive("bulletList"),
        alignLeft: editor.isActive({ textAlign: "left" }),
        alignCenter: editor.isActive({ textAlign: "center" }),
        alignRight: editor.isActive({ textAlign: "right" }),
      });

      if (editor.isActive("heading", { level: 1 })) setTextSize("h1");
      else if (editor.isActive("heading", { level: 2 })) setTextSize("h2");
      else if (editor.isActive("heading", { level: 3 })) setTextSize("h3");
      else setTextSize("paragraph");
    };

    editor.on("update", update);
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);

    // Initial run
    update();

    return () => {
      editor.off("update", update);
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  const handleTextSizeChange = (value: string) => {
    if (!editor) return;
    switch (value) {
      case "h1":
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case "h2":
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case "h3":
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case "paragraph":
        editor.chain().focus().setParagraph().run();
        break;
    }
  };

  const { mutate: uploadImage, isPending: IsImageUploadPending } = useMutation({
    mutationKey: ["upload-brand-image"],
    mutationFn: (formData: FormData) => uploadCategory(formData),
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error.message);
      } else {
        editor
          ?.chain()
          .focus()
          .setImage({ src: data?.data?.url as string })
          .run();
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    onError: (error) => {
      toast.error(error.message || "unknown error");
    },
  });
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    // 1. GET FRESH COUNT IMMEDIATELY
    const fromData = new FormData();
    fromData.append("file", file!);
    uploadImage(fromData);
  };

  if (!editor) return null;

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[600px]">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-2 items-center sticky top-0 z-10">
        <div className="min-w-[140px]">
          <Select value={textSize} onValueChange={handleTextSizeChange}>
            <SelectTrigger className="h-8 bg-white border-gray-200">
              <SelectValue placeholder="Text Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraph">Normal Text</SelectItem>
              <SelectItem value="h1">Heading 1 (Big)</SelectItem>
              <SelectItem value="h2">Heading 2 (Medium)</SelectItem>
              <SelectItem value="h3">Heading 3 (Small)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-gray-200 shadow-sm">
          <Button
            size="icon"
            onClick={() => editor.chain().focus().toggleBold().run()}
            variant={activeMarks.bold ? "default" : "ghost"}
            className="h-8 w-8"
          >
            <BoldIcon size={16} />
          </Button>
          <Button
            size="icon"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            variant={activeMarks.italic ? "default" : "ghost"}
            className="h-8 w-8"
          >
            <ItalicIcon size={16} />
          </Button>
          <Button
            size="icon"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            variant={activeMarks.bulletList ? "default" : "ghost"}
            className="h-8 w-8"
          >
            <ListIcon size={16} />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-gray-200 shadow-sm">
          <Button
            size="icon"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            variant={activeMarks.alignLeft ? "secondary" : "ghost"}
            className="h-8 w-8"
          >
            <AlignLeft size={16} />
          </Button>
          <Button
            size="icon"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            variant={activeMarks.alignCenter ? "secondary" : "ghost"}
            className="h-8 w-8"
          >
            <AlignCenter size={16} />
          </Button>
          <Button
            size="icon"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            variant={activeMarks.alignRight ? "secondary" : "ghost"}
            className="h-8 w-8"
          >
            <AlignRight size={16} />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Image Upload Button */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-gray-200 shadow-sm">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
            disabled={IsImageUploadPending} // UI Disable
          />
          <label htmlFor="image-upload">
            <Button
              size="sm"
              variant="ghost"
              className={`h-8 px-2 flex items-center gap-2 ${
                imageCount >= MAX_IMAGES
                  ? "opacity-50 cursor-not-allowed"
                  : "text-gray-700 hover:text-blue-600"
              }`}
              asChild
              disabled={imageCount >= MAX_IMAGES}
            >
              <span>
                {IsImageUploadPending ? (
                  <Loader2 size={16} className=" animate-spin" />
                ) : (
                  <UploadCloud size={16} />
                )}
              </span>
            </Button>
          </label>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow bg-white cursor-text p-4 relative">
        <EditorContent
          editor={editor}
          className="min-h-[400px] outline-none prose max-w-none w-full p-4 [&_.ProseMirror]:min-h-[400px] [&_.ProseMirror]:outline-none"
        />
        <div className="absolute bottom-2 right-4 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-md border shadow-sm flex items-center gap-2">
          <span
            className={`${
              charCount >= MAX_CHARACTERS ? "text-red-500 font-bold" : ""
            }`}
          >
            {charCount} / {MAX_CHARACTERS} chars
          </span>
        </div>
      </div>
    </div>
  );
}
