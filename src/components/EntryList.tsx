import type { DiaryEntry } from '../types'

interface Props {
  entries: DiaryEntry[]
  loading?: boolean
  onAdd: () => void
  onView: (id: string) => void
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function EntryList({ entries, loading, onAdd, onView }: Props) {
  return (
    <div className="entry-list-page">
      <div className="page-header">
        <h2 className="page-title">ความทรงจำทั้งหมด 📖</h2>
        <button className="add-btn" onClick={onAdd}>+ เพิ่มความทรงจำ</button>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <p>กำลังโหลด...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📔</div>
          <p>ยังไม่มีความทรงจำ<br />กดปุ่ม "เพิ่มความทรงจำ" เพื่อเริ่มต้น!</p>
        </div>
      ) : (
        <div className="entry-grid">
          {entries.map(entry => (
            <button key={entry.id} className="entry-card" onClick={() => onView(entry.id)}>
              {entry.photos[0] && (
                <div className="entry-card-photo">
                  <img src={entry.photos[0]} alt="" />
                </div>
              )}
              <div className="entry-card-body">
                <div className="entry-card-top">
                  <span className="entry-mood">{entry.mood}</span>
                  <span className="entry-date">{formatDate(entry.date)}</span>
                </div>
                <h3 className="entry-card-title">{entry.title || 'ไม่มีชื่อ'}</h3>
                <p className="entry-card-preview">{entry.content}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
