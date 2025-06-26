'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3, Pilcrow, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useEffect, useCallback } from 'react';

const TiptapToolbar = ({ editor }: { editor: Editor | null }) => {
  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return; // cancelled
    }
    if (url === '') { // empty
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const headingLevels: (1 | 2 | 3)[] = [1, 2, 3];

  return (
    <div className="border border-b-0 border-input rounded-t-md p-2 flex flex-wrap items-center gap-1 bg-muted/50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="w-32 justify-start text-left">
            {editor.isActive('heading', { level: 1 }) ? <Heading1 className="h-4 w-4 mr-2" /> :
             editor.isActive('heading', { level: 2 }) ? <Heading2 className="h-4 w-4 mr-2" /> :
             editor.isActive('heading', { level: 3 }) ? <Heading3 className="h-4 w-4 mr-2" /> :
             <Pilcrow className="h-4 w-4 mr-2" />}
            <span className="truncate">
              {editor.isActive('heading', { level: 1 }) ? 'Heading 1' :
               editor.isActive('heading', { level: 2 }) ? 'Heading 2' :
               editor.isActive('heading', { level: 3 }) ? 'Heading 3' :
               'Paragraph'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()} disabled={!editor.can().setParagraph()}>
            <Pilcrow className="h-4 w-4 mr-2" /> Paragraph
          </DropdownMenuItem>
          {headingLevels.map(level => (
            <DropdownMenuItem key={level} onClick={() => editor.chain().focus().toggleHeading({ level }).run()} disabled={!editor.can().toggleHeading({ level })}>
              {level === 1 && <Heading1 className="h-4 w-4 mr-2" />}
              {level === 2 && <Heading2 className="h-4 w-4 mr-2" />}
              {level === 3 && <Heading3 className="h-4 w-4 mr-2" />}
              Heading {level}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Toggle size="sm" pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()} aria-label="Bold">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()} aria-label="Italic">
        <Italic className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Toggle size="sm" pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()} aria-label="Bullet list">
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('orderedList')} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()} aria-label="Ordered list">
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Toggle size="sm" pressed={editor.isActive('link')} onPressedChange={setLink} aria-label="Link">
        <LinkIcon className="h-4 w-4" />
      </Toggle>
      <Button variant="ghost" size="sm" onClick={addImage} aria-label="Image" className="h-9 px-2.5">
        <ImageIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface TiptapEditorProps {
  content: any; // JSON content from Tiptap
  onChange: (richText: any) => void;
  isSubmitting: boolean;
}

const TiptapEditor = ({ content, onChange, isSubmitting }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image, // Default options
    ],
    editorProps: {
      attributes: {
        class:
          'prose max-w-none prose-sm sm:prose-base text-foreground min-h-[150px] w-full rounded-b-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  useEffect(() => {
    if (editor) {
        const isSame = JSON.stringify(editor.getJSON()) === JSON.stringify(content);
        if (!isSame) {
            editor.commands.setContent(content, false);
        }
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(!isSubmitting);
    }
  }, [isSubmitting, editor]);


  return (
    <div className="flex flex-col">
      <TiptapToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
