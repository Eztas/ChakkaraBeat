// src/components/FilterView.tsx
import { hc } from 'hono/client'
import type { AppType } from '../../worker/index'
import { useState, useEffect, useRef } from 'react'
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

// ライターの火花〜着火の各フェーズ
type FlamePhase = 'idle' | 'spark' | 'lit'

export default function FilterView() {
  const [records, setRecords] = useState<KaraokeRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<KaraokeRecord | null>(null)
  const [phase, setPhase] = useState<FlamePhase>('idle')
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    // /api/karaoke-records からデータを取得, kebabなので変数名ではなくこの形
    client.api.karaoke_records.$get()
      .then(res => res.json())
      .then(data => {
        setRecords(data as KaraokeRecord[])
      })

    return () => {
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [])

  const isSpinning = phase !== 'idle'

  const spinGacha = () => {
    if (isSpinning || records.length === 0) return

    // 事前に結果を決めておき、演出とは非同期に確定させる
    const record = records[Math.floor(Math.random() * records.length)]

    // 火花フェーズ: カチッ、カチッと2回弾く
    setPhase('spark')

    const t1 = setTimeout(() => {
      // 着火フェーズ: ボッと灯る
      setSelectedRecord(record)
      setPhase('lit')
    }, 280)

    const t2 = setTimeout(() => {
      setPhase('idle')
    }, 700)

    timeoutsRef.current.push(t1, t2)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white p-6 overflow-hidden">

      <h1 className="text-2xl font-bold mb-10 tracking-tight text-slate-200">
        chakka
      </h1>

      {/* 結果表示エリア: ロウソクの炎がゆらぐイメージ */}
      <div className="w-full max-w-sm aspect-square bg-[#141414] rounded-2xl border border-white/5 flex flex-col items-center justify-center p-8 relative">

        {/* 中心の炎アイコン。フェーズごとに状態を変える */}
        <div className="relative mb-6 flex items-center justify-center h-16">
          {phase === 'spark' && (
            <>
              <span className="spark-particle spark-1" />
              <span className="spark-particle spark-2" />
              <span className="spark-particle spark-3" />
            </>
          )}

          <Flame
            size={40}
            className={[
              'transition-all duration-200',
              phase === 'idle' && !selectedRecord ? 'text-slate-700 scale-90' : '',
              phase === 'spark' ? 'text-slate-700 scale-90 opacity-40' : '',
              phase === 'lit' ? 'text-amber-400 scale-110 flame-flicker' : '',
              phase === 'idle' && selectedRecord ? 'text-amber-500/90 flame-flicker' : '',
            ].filter(Boolean).join(' ')}
            fill={phase === 'lit' || (phase === 'idle' && selectedRecord) ? 'currentColor' : 'none'}
          />
        </div>

        {selectedRecord ? (
          <div
            className={[
              'text-center transition-all duration-300',
              phase === 'spark' ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0',
            ].join(' ')}
          >
            <p className="text-xs text-slate-500 font-medium mb-1.5 tracking-wide">
              {selectedRecord.singer_name}
            </p>
            <h2 className="text-2xl font-bold text-white">
              {selectedRecord.song_name}
            </h2>
          </div>
        ) : (
          <p className="text-slate-500 text-center text-sm leading-relaxed">
            次に歌いたい曲、<br/>まだ思い出せない?
          </p>
        )}
      </div>

      {/* 着火ボタン: ライターのホイールを弾くイメージ */}
      <div className="mt-10 w-full max-w-sm">
        <button
          onClick={spinGacha}
          disabled={isSpinning || records.length === 0}
          className="
            w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2.5
            bg-white text-black
            active:scale-[0.96] transition-transform
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          {phase === 'spark' ? '火花...' : phase === 'lit' ? '着火!' : '着火する'}
        </button>
      </div>

      <AddRecordDrawer />

      <style>{`
        @keyframes flame-flicker {
          0%, 100% { transform: scale(1.1) rotate(-2deg); }
          50% { transform: scale(1.05) rotate(2deg); }
        }
        .flame-flicker {
          animation: flame-flicker 1.4s ease-in-out infinite;
        }

        @keyframes spark-burst {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--sx), var(--sy)) scale(0.3); }
        }
        .spark-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #fbbf24;
          animation: spark-burst 0.3s ease-out infinite;
        }
        .spark-1 { --sx: -14px; --sy: -10px; animation-delay: 0s; }
        .spark-2 { --sx: 12px; --sy: -14px; animation-delay: 0.1s; }
        .spark-3 { --sx: 2px; --sy: 14px; animation-delay: 0.15s; }
      `}</style>
    </div>
  )
}
