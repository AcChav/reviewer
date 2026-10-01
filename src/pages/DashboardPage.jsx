import { useState } from "react";
import { FolderPlus, BookOpen, Layers } from "lucide-react";
import { useTopics } from "../hooks/useTopics";
import { topicsApi } from "../api/topicsApi";
import TopicCard from "../components/dashboard/TopicCard";
import TopicFilterBar from "../components/dashboard/TopicFilterBar";
import TopicModal from "../components/dashboard/TopicModal";
import ConfirmModal from "../components/common/ConfirmModal";

export default function DashboardPage() {
  const { topics, loading, error, addTopic, removeTopic, reload } = useTopics();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [topicToDelete, setTopicToDelete] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");

  const categories = [
    "All",
    ...new Set(topics.map((t) => t.category).filter(Boolean)),
  ];

  const processedTopics = topics
    .filter((t) => {
      const matchesSearch = t.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  const totalNotesCount = topics.reduce(
    (acc, curr) => acc + (curr.notes?.[0]?.count || 0),
    0,
  );

  const handleOpenCreateModal = () => {
    setEditingTopic(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (topic) => {
    setEditingTopic(topic);
    setIsModalOpen(true);
  };

  const handleSaveTopic = async (topicData) => {
    if (editingTopic) {
      await topicsApi.update(editingTopic.id, topicData);
      await reload();
    } else {
      await addTopic(topicData);
    }
  };

  const confirmDeleteTopic = async () => {
    if (!topicToDelete) return;
    try {
      await removeTopic(topicToDelete.id);
    } catch (err) {
      alert(`Failed to delete topic: ${err.message}`);
    } finally {
      setTopicToDelete(null);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await topicsApi.deleteCategory(categoryToDelete);
      if (activeCategory === categoryToDelete) {
        setActiveCategory("All");
      }
      await reload();
    } catch (err) {
      alert(`Failed to delete category: ${err.message}`);
    } finally {
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Reviewer
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Organize study tracks and reference materials.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-sm transition shadow-sm w-fit"
        >
          <FolderPlus className="w-4 h-4" />
          <span>New Topic</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Total Topics</span>
          </div>
          <p className="text-3xl font-bold text-white mt-2">{topics.length}</p>
        </div>
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Total Notes</span>
          </div>
          <p className="text-3xl font-bold text-white mt-2">
            {totalNotesCount}
          </p>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <TopicFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categories={categories}
        onDeleteCategory={(cat) => setCategoryToDelete(cat)}
        sortOrder={sortOrder}
        onToggleSort={() =>
          setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
        }
      />

      {/* Topics Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm">
          Loading topics...
        </div>
      ) : error ? (
        <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 rounded-lg text-sm">
          {error}
        </div>
      ) : processedTopics.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">
            {topics.length === 0
              ? "No topics created yet."
              : "No matching topics found."}
          </p>
          {topics.length === 0 && (
            <button
              onClick={handleOpenCreateModal}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg"
            >
              Create Your First Topic
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {processedTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onEdit={handleOpenEditModal}
              onDelete={(t) => setTopicToDelete(t)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <TopicModal
        key={editingTopic ? editingTopic.id : "create-topic"}
        isOpen={isModalOpen}
        initialData={editingTopic}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTopic(null);
        }}
        onSave={handleSaveTopic}
      />

      <ConfirmModal
        isOpen={Boolean(topicToDelete)}
        onClose={() => setTopicToDelete(null)}
        onConfirm={confirmDeleteTopic}
        title="Delete Topic"
        message={`Are you sure you want to delete "${topicToDelete?.title}"? All notes under this topic will also be permanently deleted.`}
        confirmText="Delete Topic"
      />

      <ConfirmModal
        isOpen={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={confirmDeleteCategory}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${categoryToDelete}"? All topics in this category will be safely reassigned to "General".`}
        confirmText="Delete Category"
      />
    </div>
  );
}
