import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TopicDetailPage = lazy(() => import('./pages/TopicDetailPage'));
const NoteDetailPage = lazy(() => import('./pages/NoteDetailPage'));

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-lg text-emerald-400 hover:text-emerald-300 transition-colors">
              <BookOpen className="w-5 h-5" />
              <span>DevJournal</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
          <Suspense fallback={<div className="text-center py-20 text-slate-400 text-sm">Loading view...</div>}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/topic/:id" element={<TopicDetailPage />} />
              <Route path="/topic/:topicId/note/:noteId" element={<NoteDetailPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}