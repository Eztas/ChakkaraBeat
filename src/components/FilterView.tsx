// src/components/FilterView.tsx
import { hc } from 'hono/client'
import type { AppType } from '../../worker/index'
import { useState, useEffect } from 'react'
import { Flame } from 'lucide-react'

import AddRecordDrawer from './AddRecordDrawer'

// バックエンドの fullRecords に合わせた型定義
type KaraokeRecord = {
  karaoke_id: number;
  song_name: string;
  singer_name: string;
  next: boolean;
  // 他のフィールド（scenes等）は内部的に保持される
};

const client = hc<AppType>('/')

export default function FilterView() {
  const [records, setRecords] = useState<KaraokeRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<KaraokeRecord | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)

  useEffect(() => {
    // /api/karaoke-records からデータを取得, kebabなので変数名ではなくこの形
    client.api.karaoke_records.$get()
      .then(res => res.json())
      .then(data => {
        setRecords(data as KaraokeRecord[])
      })
  }, [])

  const spinGacha = () => {
    if (isSpinning || records.length === 0) return
    setIsSpinning(true)
    setTimeout(() => {
        const record = records[Math.floor(Math.random() * records.length)]
        setSelectedRecord(record)
        setIsSpinning(false)
    }, 1000) // スピン時間を少し長く設定
  }

  // ギザギザ（フリント刻み）のパスを生成
  const teethCount = 36
  const teeth = Array.from({ length: teethCount }).map((_, i) => {
    const angle = (360 / teethCount) * i
    return (
      <rect
        key={i}
        x="47"
        y="4"
        width="6"
        height="9"
        rx="1"
        fill="#3f3f46"
        stroke="#18181b"
        strokeWidth="0.6"
        transform={`rotate(${angle} 50 50)`}
      />
    )
  })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] text-white p-6 overflow-hidden">
      
      <h1 className="
        text-4xl font-black mb-10 tracking-tighter
        bg-gradient-to-br from-red-500 via-orange-500 to-amber-400 
        bg-clip-text text-transparent
        drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]
      ">
        ChakkaraBeat
      </h1>

      <div className="
        w-full max-w-sm aspect-square 
        bg-[#0f172a]/80 backdrop-blur-md
        rounded-[var(--radius)] border border-cyan-500/30
        flex flex-col items-center justify-center p-8 relative 
        shadow-[0_0_30px_-10px_rgba(6,182,212,0.4)]
      ">
        {selectedRecord ? (
          <div className={`text-center transition-all duration-300 ${isSpinning ? 'blur-md opacity-50' : 'opacity-100'}`}>
            <p className="text-sm text-cyan-400 font-medium mb-2 tracking-widest">
              {selectedRecord.singer_name}
            </p>
            <h2 className="text-3xl font-bold mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
              {selectedRecord.song_name}
            </h2>
          </div>
        ) : (
          <p className="text-slate-400 text-center leading-relaxed">
            次歌う曲を<br/>
            <span className="text-cyan-400 font-bold">ボタン1つで着火！</span>
          </p>
        )}
        
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.2),transparent_70%)]" />
      </div>

      {/* ライターのフリントホイール風ガチャボタン */}
      <div className="mt-12 w-full max-w-sm flex items-center justify-center gap-2">

        {/* 黒いボディ部分（真鍮リベット付き）：装飾のみ、クリック不可 */}
        <div
          className="relative w-2/5 aspect-square rounded-l-md pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #1c1c1e 0%, #0a0a0b 60%, #000 100%)',
            boxShadow: 'inset 0 0 12px rgba(0,0,0,0.8), 0 4px 10px rgba(0,0,0,0.5)',
          }}
        >
          {/* 真鍮リベット群 */}
          {[
            { top: '20%', left: '30%' },
            { top: '20%', left: '65%' },
            { top: '50%', left: '18%' },
            { top: '52%', left: '55%' },
            { top: '80%', left: '35%' },
            { top: '80%', left: '68%' },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute w-[14%] h-[14%] rounded-full"
              style={{
                top: pos.top,
                left: pos.left,
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle at 35% 30%, #fde68a, #b45309 70%, #78350f 100%)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.6)',
              }}
            />
          ))}
        </div>

        {/* フリントホイール本体：ここだけクリックで着火 */}
        <button
          onClick={spinGacha}
          disabled={isSpinning || records.length === 0}
          aria-label="ガチャを回す"
          className="
            relative w-3/5 aspect-square flex items-center justify-center
            bg-transparent border-none outline-none rounded-full
            disabled:opacity-70 disabled:cursor-not-allowed
            active:scale-95 transition-transform
          "
        >
          <svg
            className={isSpinning ? 'animate-spin' : ''}
            viewBox="0 0 100 100"
            style={{ transformOrigin: 'center center', animationDuration: '0.5s' }}
          >
            <defs>
              <radialGradient id="wheelBody" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#52525b" />
                <stop offset="55%" stopColor="#27272a" />
                <stop offset="100%" stopColor="#09090b" />
              </radialGradient>
              <radialGradient id="hubGradient" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="45%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </radialGradient>
            </defs>

            {/* ギザギザ歯 */}
            {teeth}

            {/* ホイール本体 */}
            <circle cx="50" cy="50" r="38" fill="url(#wheelBody)" stroke="#000" strokeWidth="1.5" />

            {/* ホイール表面の細かい刻み線 */}
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (360 / 24) * i
              return (
                <line
                  key={`line-${i}`}
                  x1="50"
                  y1="16"
                  x2="50"
                  y2="24"
                  stroke="#000"
                  strokeWidth="0.8"
                  opacity="0.5"
                  transform={`rotate(${angle} 50 50)`}
                />
              )
            })}

            {/* 中心の真鍮ネジ（軸） */}
            <circle cx="50" cy="50" r="13" fill="url(#hubGradient)" stroke="#451a03" strokeWidth="1" />
            <circle cx="50" cy="50" r="4" fill="#451a03" opacity="0.6" />
          </svg>

          <Flame
            size={22}
            className={`absolute transition-all ${isSpinning ? 'text-amber-200 scale-125' : 'text-amber-500/0'}`}
            style={{ top: '-14px' }}
          />
        </button>
      </div>

      <div className="fixed -bottom-20 -left-20 w-64 h-64 bg-red-600/10 blur-[100px] rounded-full" />
      <div className="fixed -top-20 -right-20 w-64 h-64 bg-cyan-600/10 blur-[100px] rounded-full" />
      <AddRecordDrawer />
    </div>
  )
}
