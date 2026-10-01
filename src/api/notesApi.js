import { supabase } from "../config/supabaseClient";

export const notesApi = {
  // 1. Fetch notes belonging to a specific topic
  async getByTopic(topicId) {
    const { data, error } = await supabase
      .from("notes")
      .select(
        `
        *,
        supplementary_materials (*)
      `
      )
      .eq("topic_id", topicId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // 2. Fetch single note
  async getById(noteId) {
    const { data, error } = await supabase
      .from("notes")
      .select(
        `
        *,
        topics (id, title),
        supplementary_materials (*)
      `
      )
      .eq("id", noteId)
      .single();

    if (error) throw error;
    return data;
  },

  // 3. Create a note under a topic with optional reference materials
  async create({
    topicId,
    title,
    primaryLink,
    description,
    myInterpretation,
    keyTakeaways = [],
    materials = [],
  }) {
    const { data: note, error: noteError } = await supabase
      .from("notes")
      .insert([
        {
          topic_id: topicId,
          title,
          primary_link: primaryLink || null,
          description: description || null,
          my_interpretation: myInterpretation || null,
          key_takeaways: keyTakeaways,
        },
      ])
      .select()
      .single();

    if (noteError) throw noteError;

    if (materials.length > 0) {
      const formattedMaterials = materials.map((item) => ({
        note_id: note.id,
        title: item.title,
        url: item.url,
        material_type: item.material_type || "link",
      }));

      const { error: matError } = await supabase
        .from("supplementary_materials")
        .insert(formattedMaterials);

      if (matError) throw matError;
    }

    return note;
  },

  // 4. Update note fields
  async update(id, updates) {
    const { data, error } = await supabase
      .from("notes")
      .update({
        title: updates.title,
        primary_link: updates.primaryLink || null,
        description: updates.description || null,
        my_interpretation: updates.myInterpretation || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 5. Update supplementary materials (delete old & insert updated)
  async updateMaterials(noteId, materials = []) {
    const { error: delError } = await supabase
      .from("supplementary_materials")
      .delete()
      .eq("note_id", noteId);

    if (delError) throw delError;

    if (materials.length > 0) {
      const formatted = materials.map((m) => ({
        note_id: noteId,
        title: m.title,
        url: m.url,
        material_type: m.material_type || "link",
      }));

      const { error: insError } = await supabase
        .from("supplementary_materials")
        .insert(formatted);

      if (insError) throw insError;
    }
  },

  // 6. Delete note
  async delete(id) {
    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) throw error;
    return true;
  },
};