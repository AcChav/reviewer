import { useNavigate } from "react-router-dom";
import { ArrowRight, Video, Link2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function NoteSummaryCard({ note, topicId }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/topic/${topicId}/note/${note.id}`)}
      className="group cursor-pointer flex flex-col justify-between p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-slate-500 text-xs">
          {note.primary_link ? (
            note.primary_link.includes("youtu") ? (
              <span className="flex items-center gap-1 text-red-400 font-medium">
                <Video className="w-3.5 h-3.5" /> Video Entry
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Link2 className="w-3.5 h-3.5" /> Reference Article
              </span>
            )
          ) : (
            <span>Note Entry</span>
          )}
          <span>•</span>
          <span>{new Date(note.created_at).toLocaleDateString()}</span>
        </div>

        <h2 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
          {note.title}
        </h2>

        {note.description ? (
          <div className="text-sm text-slate-400 line-clamp-2 leading-relaxed prose prose-invert prose-sm max-w-none [&_p]:inline [&_p]:m-0">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {note.description}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">
            No description provided.
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-xs font-semibold text-emerald-400 inline-flex items-center gap-1">
          <span>Read full note</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </span>
        {note.supplementary_materials?.length > 0 && (
          <span className="text-xs text-slate-500">
            {note.supplementary_materials.length} extra link
            {note.supplementary_materials.length > 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
}
