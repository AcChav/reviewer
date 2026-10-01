import { supabase } from '../config/supabaseClient';

export const topicsApi = {
  // 1. Fetch all topics with their related notes count
  async getAll() {
    const { data, error } = await supabase
      .from('topics')
      .select('*, notes(count)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // 2. Fetch a single topic by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // 3. Create a new topic
  async create({ title, category = 'General', status = 'in_progress' }) {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-');

    const { data, error } = await supabase
      .from('topics')
      .insert([
        {
          title,
          slug,
          category,
          status,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 4. Update an existing topic
  async update(id, updates) {
    const { data, error } = await supabase
      .from('topics')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 5. Delete a topic
  async delete(id) {
    const { error } = await supabase
      .from('topics')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Add inside topicsApi in src/api/topicsApi.js:
async deleteCategory(categoryName) {
  if (categoryName === 'General') return;

  // Reset topics in this category to 'General'
  const { data, error } = await supabase
    .from('topics')
    .update({ category: 'General', updated_at: new Date().toISOString() })
    .eq('category', categoryName)
    .select();

  if (error) throw error;
  return data;
},
};