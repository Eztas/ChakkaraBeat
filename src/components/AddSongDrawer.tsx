// src/components/AddSongDrawer.tsx
import { useState } from 'react'
import { hc } from 'hono/client'
import type { AppType } from '../../worker/index'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Plus } from 'lucide-react'
import { extractYoutubeId } from '@/lib/utils'

const client = hc<AppType>('/')

export default function AddSongDrawer() {
  const [songName, setSongName] = useState('')
  const [singerName, setSingerName] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!songName || !singerName) return
    setIsLoading(true)
    const youtubeId = youtubeUrl ? extractYoutubeId(youtubeUrl) : undefined
    try {
      await client.api.songs.$post({
        json: {
          song_name: songName,
          singer_name: singerName,
          youtube_url: youtubeId || undefined,
        }
      })
      setSongName('')
      setSingerName('')
      setYoutubeUrl('')
      setIsOpen(false)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-red-600 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
          <Plus size={28} className="text-white" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="bg-[#0f172a] text-white border-t border-cyan-500/30">
        <DrawerHeader>
          <DrawerTitle className="text-white">曲を追加</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 flex flex-col gap-4 pb-10">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-cyan-400">曲名 *</label>
            <input
              value={songName}
              onChange={e => setSongName(e.target.value)}
              placeholder="世界に一つだけの花"
              className="bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-cyan-400">歌手名 *</label>
            <input
              value={singerName}
              onChange={e => setSingerName(e.target.value)}
              placeholder="SMAP"
              className="bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-cyan-400">YouTube URL（任意）</label>
            <input
              value={youtubeUrl}
              onChange={e => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!songName || !singerName || isLoading}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-amber-500 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? '追加中...' : '追加する'}
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
