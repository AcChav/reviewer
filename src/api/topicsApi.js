import { supabase } from '../config/supabaseClient';

export const topicsApi = {
  // 1. Fetch active topics with active notes count
  async getAll() {
    const { data, error } = await supabase
      .from('topics')
      .select('*, notes(count)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // 2. Fetch a single active topic by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
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

  // 5. Soft Delete a topic
  async delete(id) {
    const { data, error } = await supabase
      .from('topics')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 6. Restore a topic
  async restore(id) {
    const { data, error } = await supabase
      .from('topics')
      .update({ deleted_at: null })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 7. Permanent delete (if needed)
  async hardDelete(id) {
    const { error } = await supabase
      .from('topics')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // 8. Delete / reset category
  async deleteCategory(categoryName) {
    if (categoryName === 'General') return;

    const { data, error } = await supabase
      .from('topics')
      .update({ category: 'General', updated_at: new Date().toISOString() })
      .eq('category', categoryName)
      .select();

    if (error) throw error;
    return data;
  },
};