import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Trash2, Edit3 } from "lucide-react";
import { notesApi } from "../api/notesApi";
import { getYouTubeEmbedUrl } from "../utils/videoParser";
import ReactMarkdown from "react-markdown";
import NoteModal from "../components/notes/NoteModal";
import ConfirmModal from "../components/common/ConfirmModal";
import remarkGfm from "remark-gfm";

export default function NoteDetailPage() {
  const { topicId, noteId } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    async function loadNote() {
      try {
        setLoading(true);
        const data = await notesApi.getById(noteId);
        setNote(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadNote();
  }, [noteId]);

  const handleDelete = async () => {
    try {
      await notesApi.delete(noteId);
      navigate(`/topic/${topicId}`);
    } catch (err) {
      alert(`Failed to delete note: ${err.message}`);
    }
  };

  const handleUpdate = async (updatedData) => {
    const updated = await notesApi.update(noteId, updatedData);
    await notesApi.updateMaterials(noteId, updatedData.materials);
    setNote((prev) => ({
      ...prev,
      ...updated,
      supplementary_materials: updatedData.materials.map((m, i) => ({
        id: `temp-${i}`,
        ...m,
      })),
    }));
  };

  if (loading)
    return (
      <div className="text-center py-20 text-slate-400 text-sm">
        Loading note details...
      </div>
    );
  if (error || !note)
    return (
      <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 rounded-lg text-sm">
        {error || "Note not found."}
      </div>
    );

  const embedUrl = getYouTubeEmbedUrl(note.primary_link);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <Link
          to={`/topic/${topicId}`}
          className="inline-flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Topic</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/80 text-red-300 text-xs font-semibold transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs text-slate-500">
          Created on {new Date(note.created_at).toLocaleDateString()}
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          {note.title}
        </h1>
        {note.primary_link && (
          <a
            href={note.primary_link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline pt-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{note.primary_link}</span>
          </a>
        )}
      </div>

      {embedUrl && (
        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-lg">
          <iframe
            src={embedUrl}
            title={note.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Description */}
      {/* Description */}
      {note.description && (
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Description / Summary
          </h2>
          <div className="text-sm text-slate-300 rounded-xl bg-slate-900/60 p-5 border border-slate-800">
            <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {note.description}
              </ReactMarkdown>
            </div>
          </div>
        </section>
      )}

      {/* My Interpretation */}
      {note.my_interpretation && (
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            My Interpretation
          </h2>
          <div className="text-sm text-slate-300 rounded-xl bg-slate-900/90 border border-emerald-900/40 p-5">
            <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {note.my_interpretation}
              </ReactMarkdown>
            </div>
          </div>
        </section>
      )}
      
      {note.supplementary_materials?.length > 0 && (
        <section className="space-y-3 pt-4 border-t border-slate-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Other Supplementary Materials
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {note.supplementary_materials.map((mat) => (
              <a
                key={mat.id}
                href={mat.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/60 text-slate-300 hover:text-white transition text-xs font-medium"
              >
                <ExternalLink className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{mat.title}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Edit Form Modal */}
      <NoteModal
        key={note?.id || "edit-note"}
        isOpen={isEditModalOpen}
        initialData={note}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdate}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Learning Note"
        message={`Are you sure you want to permanently delete "${note.title}"?`}
        confirmText="Delete Note"
      />
    </div>
  );
}
