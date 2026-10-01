import fs from 'fs';
import path from 'path';
import process from 'process'; // <-- Add this line
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Read variables from .env.local or .env
dotenv.config({ path: '.env.local' });
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.resolve('backups');

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log('Fetching topics, notes, and supplementary materials...');

  const [topicsRes, notesRes, materialsRes] = await Promise.all([
    supabase.from('topics').select('*'),
    supabase.from('notes').select('*'),
    supabase.from('supplementary_materials').select('*'),
  ]);

  if (topicsRes.error || notesRes.error || materialsRes.error) {
    console.error('Backup query failed:', {
      topicsError: topicsRes.error,
      notesError: notesRes.error,
      materialsError: materialsRes.error,
    });
    process.exit(1);
  }

  const payload = {
    metadata: {
      generated_at: new Date().toISOString(),
      topics_count: topicsRes.data.length,
      notes_count: notesRes.data.length,
      materials_count: materialsRes.data.length,
    },
    topics: topicsRes.data,
    notes: notesRes.data,
    supplementary_materials: materialsRes.data,
  };

  const fileName = `backup_${timestamp}.json`;
  const filePath = path.join(backupDir, fileName);

  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf-8');
  console.log(`Success! Backup written to: backups/${fileName}`);
}

runBackup();