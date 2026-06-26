import { useRef, useState, useCallback, useEffect } from 'react'

const MELODY: [number, number][] = [
  [523.25, 0.5], [659.25, 0.5], [783.99, 0.5], [880.00, 0.5],
  [783.99, 0.5], [659.25, 0.5], [523.25, 1.0],
  [392.00, 0.5], [523.25, 0.5], [659.25, 0.5], [587.33, 0.5],
  [523.25, 0.5], [440.00, 1.0],
  [392.00, 0.5], [440.00, 0.5], [523.25, 0.5], [659.25, 0.5],
  [783.99, 1.5],
]

export function useRomanticMusic() {
  const ctxRef = useRef<AudioContext | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [customMusicName, setCustomMusicName] = useState<string | null>(null)
  const stopRef = useRef(false)
  const useCustomRef = useRef(false)

  const playMelody = useCallback((ctx: AudioContext) => {
    if (stopRef.current || useCustomRef.current) return
    let time = ctx.currentTime
    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0.18, time)
    masterGain.connect(ctx.destination)
    const totalDuration = MELODY.reduce((sum, [, dur]) => sum + dur * 0.45, 0)
    MELODY.forEach(([freq, dur]) => {
      const osc = ctx.createOscillator()
      const envGain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, time)
      const noteDur = dur * 0.45
      envGain.gain.setValueAtTime(0, time)
      envGain.gain.linearRampToValueAtTime(1, time + 0.04)
      envGain.gain.exponentialRampToValueAtTime(0.001, time + noteDur)
      osc.connect(envGain)
      envGain.connect(masterGain)
      osc.start(time)
      osc.stop(time + noteDur)
      time += noteDur
    })
    timeoutRef.current = setTimeout(() => {
      if (!stopRef.current && !useCustomRef.current) playMelody(ctx)
    }, totalDuration * 1000 + 300)
  }, [])

  const stop = useCallback(() => {
    stopRef.current = true
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    ctxRef.current?.close()
    ctxRef.current = null
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setPlaying(false)
  }, [])

  const startBuiltin = useCallback(() => {
    stopRef.current = false
    useCustomRef.current = false
    const ctx = new AudioContext()
    ctxRef.current = ctx
    setPlaying(true)
    playMelody(ctx)
  }, [playMelody])

  const startCustom = useCallback((file: File) => {
    stop()
    stopRef.current = false
    useCustomRef.current = true
    const url = URL.createObjectURL(file)
    const audio = new Audio(url)
    audio.loop = true
    audio.volume = 0.5
    audio.play()
    audioRef.current = audio
    setCustomMusicName(file.name)
    setPlaying(true)
  }, [stop])

  const toggle = useCallback(() => {
    if (playing) {
      stop()
    } else {
      if (useCustomRef.current && audioRef.current) {
        audioRef.current.play()
        setPlaying(true)
      } else {
        startBuiltin()
      }
    }
  }, [playing, stop, startBuiltin])

  useEffect(() => () => { stop() }, [stop])

  return { playing, toggle, startBuiltin, startCustom, customMusicName }
}
