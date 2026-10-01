import { Bold, Italic, List, ListOrdered, Code } from "lucide-react";

export default function MarkdownToolbar({ textareaRef, value, onChange }) {
  // Wraps inline text (e.g. **bold**, *italic*, `code`)
  const insertInline = (prefix, suffix = "", defaultPlaceholder = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const rawSelected = value.substring(start, end) || defaultPlaceholder;

    // Detect leading and trailing whitespace
    const leadingSpace = rawSelected.match(/^\s*/)[0];
    const trailingSpace = rawSelected.match(/\s*$/)[0];
    const coreText = rawSelected.trim();

    if (!coreText) {
      const replacement = `${prefix}${defaultPlaceholder}${suffix}`;
      const nextValue =
        value.substring(0, start) + replacement + value.substring(end);
      onChange(nextValue);
      return;
    }

    // Place asterisks snugly around the core word, pushing spaces to the outside
    const replacement = `${leadingSpace}${prefix}${coreText}${suffix}${trailingSpace}`;
    const nextValue =
      value.substring(0, start) + replacement + value.substring(end);

    onChange(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const newCursorStart = start + leadingSpace.length + prefix.length;
      const newCursorEnd = newCursorStart + coreText.length;
      textarea.setSelectionRange(newCursorStart, newCursorEnd);
    });
  };

  // Formats each line into a list item across multi-line selections
  const insertList = (ordered = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let replacement = "";

    if (!selectedText) {
      // Nothing selected: insert a single list item
      replacement = ordered ? "1. Item\n" : "- Item\n";
    } else {
      // Split every line in the selection and prefix each non-empty line
      const lines = selectedText.split("\n");
      let counter = 1;
      replacement = lines
        .map((line) => {
          if (!line.trim()) return line; // preserve blank lines
          const prefix = ordered ? `${counter++}. ` : "- ";
          // If the line already starts with a bullet or number, clean it first
          const cleaned = line.replace(/^([-*+]|\d+\.)\s+/, "");
          return `${prefix}${cleaned}`;
        })
        .join("\n");
    }

    const nextValue =
      value.substring(0, start) + replacement + value.substring(end);
    onChange(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + replacement.length);
    });
  };

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-950 border border-b-0 border-slate-800 rounded-t-lg">
      <button
        type="button"
        onClick={() => insertInline("**", "**", "bold text")}
        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
        title="Bold"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => insertInline("*", "*", "italic text")}
        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
        title="Italic"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>
      <div className="h-4 w-[1px] bg-slate-800 mx-1" />
      <button
        type="button"
        onClick={() => insertList(false)}
        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
        title="Bullet List"
      >
        <List className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => insertList(true)}
        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
        title="Numbered List"
      >
        <ListOrdered className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => insertInline("`", "`", "code")}
        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
        title="Inline Code"
      >
        <Code className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
