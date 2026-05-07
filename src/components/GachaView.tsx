// src/components/GachaView.tsx
import { useState, useEffect } from 'react'
import { Flame } from 'lucide-react'

type Song = {
  id: number;
  song_name: string;
  singer_name: string;
};

const MOCK_SONGS: Song[] = [
  { id: 1, song_name: "怪獣の花唄", singer_name: "Vaundy"},
  { id: 2, song_name: "丸の内サディスティック", singer_name: "椎名林檎"},
]

export default function GachaView() {
  const [songs, setSongs] = useState<Song[]>([])
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)

    useEffect(() => {
    fetch('/api/songs')
      .then(res => res.json())
      .then(setSongs)
  }, [])


  const spinGacha = () => {
    setIsSpinning(true)
    setTimeout(() => {
      const song = songs[Math.floor(Math.random() * songs.length)]
      setSelectedSong(song)
      setIsSpinning(false)
    }, 200)
  }

  return (
    // 背景を深い紺色、文字を白に固定
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] text-white p-6 overflow-hidden">
      
      {/* タイトル：ネオン感を強めたドロップシャドウ */}
      <h1 className="
        text-4xl font-black mb-10 tracking-tighter
        bg-gradient-to-br from-red-500 via-orange-500 to-amber-400 
        bg-clip-text text-transparent
        drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]
      ">
        ChakkaraBeat
      </h1>

      {/* カード部分：ネオン管のような青白い縁取り */}
      <div className="
        w-full max-w-sm aspect-square 
        bg-[#0f172a]/80 backdrop-blur-md
        rounded-[var(--radius)] border border-cyan-500/30
        flex flex-col items-center justify-center p-8 relative 
        shadow-[0_0_30px_-10px_rgba(6,182,212,0.4)]
      ">
        {selectedSong ? (
          <div className={`text-center transition-all duration-300 ${isSpinning ? 'blur-md opacity-50' : 'opacity-100'}`}>
            <p className="text-sm text-cyan-400 font-medium mb-2 tracking-widest">
              {selectedSong.singer_name}
            </p>
            <h2 className="text-3xl font-bold mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
              {selectedSong.song_name}
            </h2>
          </div>
        ) : (
          <p className="text-slate-400 text-center leading-relaxed">
            次歌う曲を<br/>
            <span className="text-cyan-400 font-bold">ボタン1つで着火！</span>
          </p>
        )}
        
        {/* 装飾用の光の粒（ネオンっぽさ向上） */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.2),transparent_70%)]" />
      </div>

      <div className="mt-12 w-full max-w-sm">
        {/* 着火ボタン：以前のグラデーションを維持しつつ、影を強調 */}
        <button
          onClick={spinGacha}
          disabled={isSpinning}
          className="
            w-full py-6 rounded-[var(--radius)] font-bold text-xl flex items-center justify-center gap-3 transition-all
            bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white
            hover:from-red-500 hover:orange-400 hover:to-amber-400
            active:scale-[0.96]
            disabled:opacity-70 disabled:cursor-not-allowed
            shadow-[0_0_25px_-5px_rgba(239,68,68,0.7)]
          "
        >
          <Flame 
            size={28} 
            className={`transition-transform ${isSpinning ? 'text-amber-200' : ''}`} 
          />
          {isSpinning ? "着火中" : "着火！"}
        </button>
      </div>

      {/* 背景の装飾：画面の端にぼんやりとした赤い光 */}
      <div className="fixed -bottom-20 -left-20 w-64 h-64 bg-red-600/10 blur-[100px] rounded-full" />
      <div className="fixed -top-20 -right-20 w-64 h-64 bg-cyan-600/10 blur-[100px] rounded-full" />
    </div>
  )
}
