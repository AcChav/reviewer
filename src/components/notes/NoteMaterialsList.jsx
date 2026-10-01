import { Plus, X } from 'lucide-react';

export default function NoteMaterialsList({ materials, onChange }) {
  const handleAdd = () => {
    onChange([...materials, { title: '', url: '' }]);
  };

  const handleUpdate = (index, field, value) => {
    const updated = [...materials];
    updated[index][field] = value;
    onChange(updated);
  };

  const handleRemove = (index) => {
    onChange(materials.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300">
          Supplementary Materials
        </label>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Link</span>
        </button>
      </div>

      {materials.map((mat, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Label"
            value={mat.title}
            onChange={(e) => handleUpdate(idx, 'title', e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
          <input
            type="url"
            placeholder="URL"
            value={mat.url}
            onChange={(e) => handleUpdate(idx, 'url', e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={() => handleRemove(idx)}
            className="p-2 text-slate-500 hover:text-red-400 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}