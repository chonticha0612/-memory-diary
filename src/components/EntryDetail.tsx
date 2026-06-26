import { useState } from 'react'
import type { DiaryEntry } from '../types'

interface Props {
  entry: DiaryEntry
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

export default function EntryDetail({ entry, onBack, onEdit, onDelete }: Props) {
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="detail-page">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>← กลับ</button>
        <div className="detail-actions">
          <button className="icon-btn" onClick={onEdit} title="แก้ไข">✏️</button>
          <button className="icon-btn icon-btn--danger" onClick={() => setConfirmDelete(true)} title="ลบ">🗑️</button>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-meta">
          <span className="detail-mood">{entry.mood}</span>
          <span className="detail-date">{formatDate(entry.date)}</span>
        </div>

        <h1 className="detail-title">{entry.title}</h1>

        {entry.photos.length > 0 && (
          <div className={`detail-photos detail-photos--${Math.min(entry.photos.length, 3)}`}>
            {entry.photos.map((p, i) => (
              <button key={i} className="detail-photo-btn" onClick={() => setLightbox(p)}>
                <img src={p} alt="" />
              </button>
            ))}
          </div>
        )}

        <p className="detail-body">{entry.content}</p>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" />
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <p>ต้องการลบความทรงจำนี้ใช่ไหม?</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setConfirmDelete(false)}>ยกเลิก</button>
              <button className="btn-danger" onClick={onDelete}>ลบเลย</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
