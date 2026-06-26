import { useRef, useState, useCallback } from 'react'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
    _ytApiCallbacks: (() => void)[]
  }
}

let apiLoaded = false

function loadYTApi(cb: () => void) {
  if (window.YT?.Player) { cb(); return }
  window._ytApiCallbacks = window._ytApiCallbacks ?? []
  window._ytApiCallbacks.push(cb)
  if (apiLoaded) return
  apiLoaded = true
  window.onYouTubeIframeAPIReady = () => {
    window._ytApiCallbacks.forEach(fn => fn())
    window._ytApiCallbacks = []
  }
  const s = document.createElement('script')
  s.src = 'https://www.youtube.com/iframe_api'
  document.head.appendChild(s)
}

export function useYouTubePlayer() {
  const playerRef = useRef<any>(null)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)

  // Call this inside a user-gesture handler (button click) to initialize & autoplay
  const initialize = useCallback((videoId: string) => {
    // If already initialized, just play
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      try { playerRef.current.playVideo() } catch {}
      return
    }

    // Create hidden container if not exists
    let el = document.getElementById('yt-hidden-player')
    if (!el) {
      el = document.createElement('div')
      el.id = 'yt-hidden-player'
      el.style.cssText = 'position:fixed;width:1px;height:1px;bottom:0;left:0;opacity:0;pointer-events:none;'
      document.body.appendChild(el)
    }

    loadYTApi(() => {
      // Destroy existing player if any
      try { playerRef.current?.destroy() } catch {}

      playerRef.current = new window.YT.Player('yt-hidden-player', {
        height: '1',
        width: '1',
        videoId,
        playerVars: {
          autoplay: 1,   // autoplay works since this is called within user gesture
          controls: 0,
          loop: 1,
          playlist: videoId,
          mute: 0,
        },
        events: {
          onReady: (e: any) => {
            setReady(true)
            try { e.target.setVolume(70); e.target.playVideo() } catch {}
          },
          onStateChange: (e: any) => {
            setPlaying(e.data === window.YT?.PlayerState?.PLAYING)
          },
          onError: () => setPlaying(false),
        },
      })
    })
  }, [])

  const toggle = useCallback(() => {
    if (!playerRef.current) return
    try {
      if (playing) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
      }
    } catch {}
  }, [playing])

  return { playing, ready, initialize, toggle }
}
