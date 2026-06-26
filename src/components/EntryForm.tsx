import { useState, useRef } from 'react'
import { uploadPhotos } from '../useDiary'
import type { DiaryEntry } from '../types'

const MOODS = ['💕', '😊', '🥰', '😢', '🌟', '☀️', '🌙', '🎉', '🥺', '💭']

interface Props {
  initial?: Partial<DiaryEntry>
  onSave: (data: Omit<DiaryEntry, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

export default function EntryForm({ initial, onSave, onCancel }: Props) {
  const today = new Date().toISOString().slice(0, 10)
  const [title, setTitle] = useState(initial?.title ?? '')
  const [date, setDate] = useState(initial?.date ?? today)
  const [content, setContent] = useState(initial?.content ?? '')
  const [mood, setMood] = useState(initial?.mood ?? '💕')
  // photos stores either existing URLs (string) or new File objects
  const [photos, setPhotos] = useState<(string | File)[]>(initial?.photos ?? [])
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setPhotos(prev => [...prev, ...files])
    e.target.value = ''
  }

  const removePhoto = (i: number) => setPhotos(prev => prev.filter((_, idx) => idx !== i))

  const getPreview = (p: string | File) =>
    typeof p === 'string' ? p : URL.createObjectURL(p)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Separate existing URLs from new File uploads
      const newFiles = photos.filter((p): p is File => p instanceof File)
      const uploadedUrls = newFiles.length > 0 ? await uploadPhotos(newFiles) : []

      // Preserve original order
      const allUrls: string[] = photos.map(p =>
        typeof p === 'string' ? p : uploadedUrls[newFiles.indexOf(p)]
      )

      onSave({ title, date, content, mood, photos: allUrls })
    } catch (err) {
      console.error(err)
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="form-page">
      <div className="form-header">
        <button className="back-btn" onClick={onCancel} disabled={saving}>← กลับ</button>
        <h2 className="page-title">{initial?.id ? 'แก้ไขความทรงจำ' : 'ความทรงจำใหม่ ✨'}</h2>
      </div>

      <form className="diary-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">อารมณ์วันนี้</label>
          <div className="mood-picker">
            {MOODS.map(m => (
              <button key={m} type="button"
                className={`mood-option ${mood === m ? 'mood-option--active' : ''}`}
                onClick={() => setMood(m)}>{m}</button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">วันที่</label>
          <input className="form-input" type="date" value={date}
            onChange={e => setDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label className="form-label">ชื่อความทรงจำ</label>
          <input className="form-input" type="text" placeholder="วันนั้นที่เราไป..."
            value={title} onChange={e => setTitle(e.target.value)} required />
        </div>

        <div className="form-group">
          <label className="form-label">เล่าเรื่องราว</label>
          <textarea className="form-textarea" placeholder="วันนี้เราได้..."
            value={content} onChange={e => setContent(e.target.value)} rows={6} />
        </div>

        <div className="form-group">
          <label className="form-label">รูปภาพ</label>
          <div className="photo-grid">
            {photos.map((p, i) => (
              <div key={i} className="photo-thumb">
                <img src={getPreview(p)} alt="" />
                <button type="button" className="photo-remove" onClick={() => removePhoto(i)}>×</button>
              </div>
            ))}
            <button type="button" className="photo-add-btn" onClick={() => fileRef.current?.click()}>
              <span>+</span>
              <span className="photo-add-label">เพิ่มรูป</span>
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={handlePhotos} />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={saving}>ยกเลิก</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'กำลังบันทึก...' : 'บันทึก 💕'}
          </button>
        </div>
      </form>
    </div>
  )
}
