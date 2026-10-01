import { useNavigate } from 'react-router-dom';
import { ArrowRight, Trash2, Edit3 } from 'lucide-react';
import { getCategoryBadgeStyle } from '../../utils/categoryColors';

export default function TopicCard({ topic, onEdit, onDelete }) {
  const navigate = useNavigate();
  const noteCount = topic.notes?.[0]?.count || 0;
  const badgeStyle = getCategoryBadgeStyle(topic.category);

  return (
    <div
      onClick={() => navigate(`/topic/${topic.id}`)}
      className="group cursor-pointer flex flex-col justify-between p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition relative"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}>
            {topic.category || 'General'}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(topic);
              }}
              className="text-slate-500 hover:text-emerald-400 p-1 rounded transition"
              title="Edit Topic"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(topic);
              }}
              className="text-slate-500 hover:text-red-400 p-1 rounded transition"
              title="Delete Topic"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
          {topic.title}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {noteCount} {noteCount === 1 ? 'entry' : 'entries'} recorded
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
          <span>Open Topic</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </div>
  );
}