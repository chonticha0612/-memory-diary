interface Props {
  onOpen: () => void
}

export default function Cover({ onOpen }: Props) {
  return (
    <div className="cover">
      <div className="cover-inner">
        <div className="cover-decoration top-left">✿</div>
        <div className="cover-decoration top-right">✿</div>
        <div className="cover-decoration bottom-left">✿</div>
        <div className="cover-decoration bottom-right">✿</div>
        <p className="cover-subtitle">our little</p>
        <h1 className="cover-title">Memory Diary</h1>
        <p className="cover-subtitle-th">ไดอารี่ความทรงจำของเรา</p>
        <div className="cover-divider">— 💕 —</div>
        <p className="cover-desc">เก็บทุกช่วงเวลาดีๆ ไว้ที่นี่</p>
        <button className="cover-btn" onClick={onOpen}>
          เปิดไดอารี่
        </button>
      </div>
    </div>
  )
}
