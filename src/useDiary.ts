import { useState, useEffect, useCallback } from 'react'
import { supabase } from './lib/supabase'
import type { DiaryEntry } from './types'

async function uploadPhoto(file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('photos').upload(path, file)
  if (error) throw error
  const { data } = supabase.storage.from('photos').getPublicUrl(path)
  return data.publicUrl
}

export async function uploadPhotos(files: File[]): Promise<string[]> {
  return Promise.all(files.map(uploadPhoto))
}

export function useDiary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .order('date', { ascending: false })
    if (!error && data) {
      setEntries(data.map(r => ({
        id: r.id,
        date: r.date,
        title: r.title,
        content: r.content,
        mood: r.mood,
        photos: r.photos ?? [],
        createdAt: new Date(r.created_at).getTime(),
      })))
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  const addEntry = useCallback(async (entry: Omit<DiaryEntry, 'id' | 'createdAt'>) => {
    const { data, error } = await supabase
      .from('diary_entries')
      .insert({
        date: entry.date,
        title: entry.title,
        content: entry.content,
        mood: entry.mood,
        photos: entry.photos,
      })
      .select()
      .single()
    if (error) throw error
    await fetchEntries()
    return data.id as string
  }, [fetchEntries])

  const updateEntry = useCallback(async (id: string, data: Partial<DiaryEntry>) => {
    const { error } = await supabase
      .from('diary_entries')
      .update({
        date: data.date,
        title: data.title,
        content: data.content,
        mood: data.mood,
        photos: data.photos,
      })
      .eq('id', id)
    if (error) throw error
    await fetchEntries()
  }, [fetchEntries])

  const deleteEntry = useCallback(async (id: string) => {
    const { error } = await supabase.from('diary_entries').delete().eq('id', id)
    if (error) throw error
    setEntries(prev => prev.filter(e => e.id !== id))
  }, [])

  return { entries, loading, addEntry, updateEntry, deleteEntry }
}
