export interface DiaryEntry {
  id: string
  date: string
  title: string
  content: string
  photos: string[] // base64
  mood: string
  createdAt: number
}
