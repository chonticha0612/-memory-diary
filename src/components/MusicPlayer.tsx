interface Props {
  playing: boolean
  ready: boolean
  onToggle: () => void
}

export default function MusicPlayer({ playing, ready, onToggle }: Props) {
  return (
    <div className="music-player">
      <button
        className="music-toggle"
        onClick={onToggle}
        disabled={!ready}
        title={playing ? 'หยุดเพลง' : 'เล่นเพลง'}
      >
        {!ready ? '⏳' : playing ? '⏸' : '▶'}
      </button>
      <div className="music-info">
        <span className={`music-name ${!playing ? 'music-name--off' : ''}`}>
          {playing && <span className="music-wave">♪ </span>}
          {ready ? 'ยิ้มง่าย — Fellow Fellow' : 'กำลังโหลดเพลง...'}
        </span>
      </div>
    </div>
  )
}
