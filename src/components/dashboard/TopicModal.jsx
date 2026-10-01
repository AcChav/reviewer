import { useState } from 'react';

export default function TopicModal({ isOpen, onClose, onSave, initialData = null }) {
  const isPreset = initialData?.category && ['Frontend', 'General'].includes(initialData.category);

  const [title, setTitle] = useState(initialData?.title || '');
  const [categoryType, setCategoryType] = useState(
    initialData ? (isPreset ? initialData.category : 'custom') : 'Frontend'
  );
  const [customCategory, setCustomCategory] = useState(
    initialData && !isPreset ? initialData.category : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalCategory =
      categoryType === 'custom' ? customCategory.trim() || 'General' : categoryType;

    try {
      setIsSubmitting(true);
      await onSave({ title: title.trim(), category: finalCategory });
      onClose();
    } catch (err) {
      alert(`Failed to save topic: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-4">
          {initialData ? 'Edit Topic' : 'Create New Topic'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Topic Title</label>
            <input
              type="text"
              placeholder="e.g. Supabase Row Level Security"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
            <select
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Frontend">Frontend</option>
              <option value="General">General</option>
              <option value="custom">+ Add Custom Category...</option>
            </select>
          </div>

          {categoryType === 'custom' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Custom Category Name</label>
              <input
                type="text"
                placeholder="e.g. Cloud Security, Rust, UI/UX"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}