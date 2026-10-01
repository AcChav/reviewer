import { X, ArrowUp, ArrowDown } from 'lucide-react';

export default function TopicFilterBar({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  categories,
  onDeleteCategory,
  sortOrder,
  onToggleSort,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Search Input & Sort Toggle Button */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search topics..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-72 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
        />

        <button
          type="button"
          onClick={onToggleSort}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition shrink-0"
          title={`Currently showing ${sortOrder === 'desc' ? 'Newest' : 'Oldest'} first`}
        >
          {sortOrder === 'desc' ? (
            <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          const canDelete = cat !== 'All' && cat !== 'General';

          return (
            <div
              key={cat}
              className={`inline-flex items-center rounded-full text-xs font-semibold whitespace-nowrap transition ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <button
                type="button"
                onClick={() => onCategoryChange(cat)}
                className="px-3 py-1"
              >
                {cat}
              </button>

              {canDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCategory(cat);
                  }}
                  className={`pr-2 hover:text-red-400 transition ${
                    isSelected ? 'text-slate-900 hover:text-red-900' : 'text-slate-500'
                  }`}
                  title={`Delete category "${cat}"`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}