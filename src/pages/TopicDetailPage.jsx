import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { topicsApi } from "../api/topicsApi";
import { notesApi } from "../api/notesApi";
import { useNotes } from "../hooks/useNotes";
import NoteSummaryCard from "../components/notes/NoteSummaryCard";
import NoteModal from "../components/notes/NoteModal";
import { getCategoryBadgeStyle } from "../utils/categoryColors";

export default function TopicDetailPage() {
  const { id: topicId } = useParams();
  const [topic, setTopic] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { notes, loading, error, reload } = useNotes(topicId);

  useEffect(() => {
    topicsApi.getById(topicId).then(setTopic).catch(console.error);
  }, [topicId]);

  const handleCreateNote = async (data) => {
    await notesApi.create({ ...data, topicId });
    await reload();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${getCategoryBadgeStyle(topic?.category)}`}
            >
              {topic?.category || "General"}
            </span>
            <h1 className="text-2xl font-bold text-white mt-1">
              {topic?.title || "Loading topic..."}
            </h1>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Note</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm">
          Loading notes...
        </div>
      ) : error ? (
        <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 rounded-lg text-sm">
          {error}
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <p className="text-slate-300 font-medium">
            No notes under this topic yet.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg"
          >
            Add Your First Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => (
            <NoteSummaryCard key={note.id} note={note} topicId={topicId} />
          ))}
        </div>
      )}

      <NoteModal
        key={isModalOpen ? "create-note-open" : "create-note-closed"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateNote}
      />
    </div>
  );
}
