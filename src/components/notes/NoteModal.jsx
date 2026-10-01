import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import NoteMaterialsList from './NoteMaterialsList';
import MarkdownToolbar from '../common/MarkdownToolbar';

export default function NoteModal({ isOpen, onClose, onSave, initialData = null }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [primaryLink, setPrimaryLink] = useState(initialData?.primary_link || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [myInterpretation, setMyInterpretation] = useState(initialData?.my_interpretation || '');
  const [materials, setMaterials] = useState(
    initialData?.supplementary_materials?.map((m) => ({ title: m.title, url: m.url })) || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const descRef = useRef(null);
  const interpRef = useRef(null);

  // Tab key indent handler (2 spaces)
  const handleTabKey = (e, val, setVal) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const updated = val.substring(0, start) + '  ' + val.substring(end);
      setVal(updated);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      });
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await onSave({
        title: title.trim(),
        primaryLink: primaryLink.trim(),
        description: description.trim(),
        myInterpretation: myInterpretation.trim(),
        materials: materials.filter((m) => m.title && m.url),
      });
      onClose();
    } catch (err) {
      alert(`Failed to save note: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Edit Note' : 'Add Note to Topic'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Note Title</label>
            <input
              type="text"
              placeholder="e.g. B-Tree Indexes vs Hash Indexes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Reference Link
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={primaryLink}
              onChange={(e) => setPrimaryLink(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description / Summary
            </label>
            <MarkdownToolbar textareaRef={descRef} value={description} onChange={setDescription} />
            <textarea
              ref={descRef}
              rows={4}
              placeholder="Summary of learning material (supports Markdown, tabs, and spaces)..."
              value={description}
              onKeyDown={(e) => handleTabKey(e, description, setDescription)}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-b-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono text-xs leading-relaxed"
            />
          </div>

          {/* Interpretation */}
          <div>
            <label className="block text-xs font-semibold text-emerald-400 mb-1.5">
              My Interpretation
            </label>
            <MarkdownToolbar textareaRef={interpRef} value={myInterpretation} onChange={setMyInterpretation} />
            <textarea
              ref={interpRef}
              rows={4}
              placeholder="Key takeaways, thoughts, or conclusions..."
              value={myInterpretation}
              onKeyDown={(e) => handleTabKey(e, myInterpretation, setMyInterpretation)}
              onChange={(e) => setMyInterpretation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-b-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono text-xs leading-relaxed"
            />
          </div>

          <NoteMaterialsList materials={materials} onChange={setMaterials} />

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}