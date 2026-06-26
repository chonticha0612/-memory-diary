import './App.css'
import { useState } from 'react'
import { useDiary } from './useDiary'
import { useYouTubePlayer } from './useYouTubePlayer'
import Cover from './components/Cover'
import EntryList from './components/EntryList'
import EntryForm from './components/EntryForm'
import EntryDetail from './components/EntryDetail'
import MusicPlayer from './components/MusicPlayer'

type View =
  | { name: 'cover' }
  | { name: 'list' }
  | { name: 'add' }
  | { name: 'edit'; id: string }
  | { name: 'detail'; id: string }

const DEFAULT_VIDEO_ID = 'JUr5L16toTA' // ยิ้มง่าย — Fellow Fellow

export default function App() {
  const { entries, loading, addEntry, updateEntry, deleteEntry } = useDiary()
  const { playing, ready, toggle, initialize } = useYouTubePlayer()
  const [view, setView] = useState<View>({ name: 'cover' })

  const handleOpenDiary = () => {
    initialize(DEFAULT_VIDEO_ID)
    setView({ name: 'list' })
  }

  const currentEntry = (view.name === 'detail' || view.name === 'edit')
    ? entries.find(e => e.id === view.id)
    : undefined

  return (
    <div className="app">
      {view.name === 'cover' && (
        <Cover onOpen={handleOpenDiary} />
      )}

      {view.name === 'list' && (
        <EntryList
          entries={entries}
          loading={loading}
          onAdd={() => setView({ name: 'add' })}
          onView={id => setView({ name: 'detail', id })}
        />
      )}

      {view.name === 'add' && (
        <EntryForm
          onSave={data => {
            addEntry(data)
            setView({ name: 'list' })
          }}
          onCancel={() => setView({ name: 'list' })}
        />
      )}

      {view.name === 'edit' && currentEntry && (
        <EntryForm
          initial={currentEntry}
          onSave={data => {
            updateEntry(view.id, data)
            setView({ name: 'detail', id: view.id })
          }}
          onCancel={() => setView({ name: 'detail', id: view.id })}
        />
      )}

      {view.name === 'detail' && currentEntry && (
        <EntryDetail
          entry={currentEntry}
          onBack={() => setView({ name: 'list' })}
          onEdit={() => setView({ name: 'edit', id: currentEntry.id })}
          onDelete={() => {
            deleteEntry(currentEntry.id)
            setView({ name: 'list' })
          }}
        />
      )}

      {view.name !== 'cover' && (
        <MusicPlayer
          playing={playing}
          ready={ready}
          onToggle={toggle}
        />
      )}
    </div>
  )
}
