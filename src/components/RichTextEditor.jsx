import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

const toolbarButtonClass = (active = false) =>
  `min-h-9 rounded-md border px-3 text-sm font-medium transition ${
    active
      ? "border-blue-500 bg-blue-50 text-blue-600"
      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-600"
  }`;

const RichTextEditor = ({ value, onChange, placeholder = "Write content..." }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Image.configure({
        allowBase64: false,
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "blogify-editor min-h-72 rounded-b-md bg-white px-4 py-3 text-sm leading-7 outline-none",
        "data-placeholder": placeholder,
      },
    },
    onUpdate: ({ editor: activeEditor }) => {
      onChange(activeEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if ((value || "") !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="min-h-72 rounded-md border border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
        Loading editor...
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("Link URL", previousUrl);
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (url?.trim()) {
      editor.chain().focus().setImage({ src: url.trim() }).run();
    }
  };

  return (
    <div className="rounded-md border border-slate-300">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 p-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={toolbarButtonClass(editor.isActive("bold"))}>
          Bold
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={toolbarButtonClass(editor.isActive("italic"))}>
          Italic
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={toolbarButtonClass(editor.isActive("heading", { level: 2 }))}>
          H2
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={toolbarButtonClass(editor.isActive("heading", { level: 3 }))}>
          H3
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={toolbarButtonClass(editor.isActive("bulletList"))}>
          Bullets
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={toolbarButtonClass(editor.isActive("orderedList"))}>
          Numbered
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={toolbarButtonClass(editor.isActive("blockquote"))}>
          Quote
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={toolbarButtonClass(editor.isActive("codeBlock"))}>
          Code
        </button>
        <button type="button" onClick={setLink} className={toolbarButtonClass(editor.isActive("link"))}>
          Link
        </button>
        <button type="button" onClick={addImage} className={toolbarButtonClass()}>
          Image
        </button>
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={toolbarButtonClass()}>
          Undo
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={toolbarButtonClass()}>
          Redo
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
