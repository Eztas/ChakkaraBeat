// src/components/AddRecordDrawer.tsx
import { useState, useEffect } from 'react'
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
import { getAdminToken } from '../lib/auth'

const client = hc<AppType>('/')

type Scene = {
  scene_id: number
  scene_name: string
}

export default function AddRecordDrawer() {
  const [songName, setSongName] = useState('')
  const [singerName, setSingerName] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [memo, setMemo] = useState('')
  const [next, setNext] = useState(false)
  const [scenes, setScenes] = useState<Scene[]>([])
  const [selectedSceneIds, setSelectedSceneIds] = useState<number[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [adminToken, setAdminToken] = useState<string | null>(null)
  useEffect(() => {
    const token = getAdminToken()
    if (token) {
        setAdminToken(token)
    }
  }, [])

  // シーン一覧を取得
  useEffect(() => {
    if (!isOpen) return
    client.api.scenes.$get()
      .then(res => res.json())
      .then(data => setScenes(data as Scene[]))
  }, [isOpen])

  const toggleScene = (scene_id: number) => {
    setSelectedSceneIds(prev =>
      prev.includes(scene_id)
        ? prev.filter(id => id !== scene_id)
        : [...prev, scene_id]
    )
  }

  const handleSubmit = async () => {
    if (!songName || !singerName) return
    setIsLoading(true)

    const youtubeId = youtubeUrl ? extractYoutubeId(youtubeUrl) : undefined

    try {
        const res = await client.api['karaoke_records'].$post({
        json: {
          song_name: songName,
          singer_name: singerName,
          youtube_url: youtubeId || undefined,
          user_id: 'user_001', // 認証実装後に差し替え
          scene_ids: selectedSceneIds,
          memo: memo || undefined,
          next,
        }
      }, {
        headers: {
          'X-Admin-Token': adminToken || ''
        }
      })

      if ((res.status as number) === 401) {
        alert("Cannot add record")
        return
      }

      // リセット
      setSongName('')
      setSingerName('')
      setYoutubeUrl('')
      setMemo('')
      setNext(false)
      setSelectedSceneIds([])
      setIsOpen(false)
      alert("Success")
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
          <DrawerTitle className="text-white">持ち歌を追加</DrawerTitle>
        </DrawerHeader>

        <div className="overflow-y-auto p-4 flex flex-col gap-4 pb-10">

          {/* 曲名 */}
          <div className="flex flex-col gap-1">
            <label className="text-base text-cyan-400">曲名 *</label>
            <input
              value={songName}
              onChange={e => setSongName(e.target.value)}
              placeholder="世界に一つだけの花"
              className="bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* 歌手名 */}
          <div className="flex flex-col gap-1">
            <label className="text-base text-cyan-400">歌手名 *</label>
            <input
              value={singerName}
              onChange={e => setSingerName(e.target.value)}
              placeholder="SMAP"
              className="bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* YouTube URL */}
          <div className="flex flex-col gap-1">
            <label className="text-base text-cyan-400">YouTube URL（任意）</label>
            <input
              value={youtubeUrl}
              onChange={e => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* シーン選択 */}
          {scenes.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-base text-cyan-400">シーン（複数選択可）</label>
              <div className="flex flex-wrap gap-2">
                {scenes.map(scene => {
                  const selected = selectedSceneIds.includes(scene.scene_id)
                  return (
                    <button
                      key={scene.scene_id}
                      onClick={() => toggleScene(scene.scene_id)}
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium border transition-colors
                        ${selected
                          ? 'bg-cyan-500 border-cyan-500 text-white'
                          : 'bg-transparent border-slate-600 text-slate-400'}
                      `}
                    >
                      {scene.scene_name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* メモ */}
          <div className="flex flex-col gap-1">
            <label className="text-base text-cyan-400">メモ（任意）</label>
            <textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="裏声より地声の方が安定"
              rows={3}
              className="bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Next トグル */}
          <div className="flex items-center justify-between px-1">
            <span className="text-base text-cyan-400">次に歌いたい（Next）</span>
            <button
              onClick={() => setNext(prev => !prev)}
              className={`
                relative w-12 h-6 rounded-full transition-colors duration-300
                ${next ? 'bg-cyan-500' : 'bg-slate-700'}
              `}
            >
              <span className={`
                absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300
                ${next ? 'translate-x-6' : 'translate-x-0'}
              `} />
            </button>
          </div>

          {/* 追加ボタン */}
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
