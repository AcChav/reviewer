import { Bold, Italic, List, ListOrdered, Code } from 'lucide-react';

export default function MarkdownToolbar({ textareaRef, value, onChange }) {
  const insertFormatting = (prefix, suffix = '', defaultPlaceholder = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultPlaceholder;

    // Build replacement text
    const replacement = `${prefix}${selectedText}${suffix}`;
    const nextValue = value.substring(0, start) + replacement + value.substring(end);

    onChange(nextValue);

    // Re-focus and set selection
    requestAnimationFrame(() => {
      textarea.focus();
      const newCursorStart = start + prefix.length;
      const newCursorEnd = newCursorStart + selectedText.length;
      textarea.setSelectionRange(newCursorStart, newCursorEnd);
    });
  };

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-950 border border-b-0 border-slate-800 rounded-t-lg">
      <button
        type="button"
        onClick={() => insertFormatting('**', '**', 'bold text')}
        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
        title="Bold"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => insertFormatting('*', '*', 'italic text')}
        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
        title="Italic"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>
      <div className="h-4 w-[1px] bg-slate-800 mx-1" />
      <button
        type="button"
        onClick={() => insertFormatting('\n- ', '', 'List item')}
        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
        title="Bullet List"
      >
        <List className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => insertFormatting('\n1. ', '', 'First item')}
        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
        title="Numbered List"
      >
        <ListOrdered className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => insertFormatting('`', '`', 'code')}
        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
        title="Inline Code"
      >
        <Code className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}