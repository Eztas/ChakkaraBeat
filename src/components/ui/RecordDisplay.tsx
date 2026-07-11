// src/components/ui/RecordDisplay.tsx

export type KaraokeRecord = {
  karaoke_id: number;
  song_name: string;
  singer_name: string;
  next: boolean;
};

type RecordDisplayProps = {
  selectedRecord: KaraokeRecord | null;
  isSpinning: boolean;
};

export function RecordDisplay({ selectedRecord, isSpinning }: RecordDisplayProps) {
  // 状態に応じたスタイル選定
  let containerClasses = "";
  let glowColor = "";

  if (isSpinning) {
    // 着火操作中 (激しい燃焼)
    containerClasses = "border-amber-500 animate-flame-intense";
    glowColor = "bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.22),transparent_75%)]";
  } else if (selectedRecord) {
    // 着火成功・楽曲表示中 (穏やかな炎)
    containerClasses = "border-orange-500/50 animate-flame-flicker";
    glowColor = "bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.15),transparent_75%)]";
  } else {
    // 未着火・通常時 (静寂のシアン)
    containerClasses = "border-cyan-500/30 shadow-[0_0_20px_-12px_rgba(6,182,212,0.3)]";
    glowColor = "bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.12),transparent_70%)]";
  }
  
  // keyframesを使ったアニメーションを定義し、状態に応じてクラスを適用することで、着火中や楽曲表示中の視覚的な変化を表現
  return (
    <div className={`
      w-full max-w-[280px] sm:max-w-sm aspect-square 
      bg-[#0f172a]/80 backdrop-blur-md
      rounded-[var(--radius)] border relative
      flex flex-col items-center justify-center p-6 sm:p-8 transition-all duration-500
      ${containerClasses}
    `}>
      <style>{`
        @keyframes flame-flicker {
          0% {
            box-shadow: 0 0 14px -8px rgba(239, 68, 68, 0.28), 0 0 6px -4px rgba(249, 115, 22, 0.16);
            border-color: rgba(249, 115, 22, 0.35);
            transform: translateY(0) scale(1);
          }
          20% {
            box-shadow: 0 0 20px -6px rgba(249, 115, 22, 0.35), 0 0 10px -2px rgba(253, 224, 71, 0.22);
            border-color: rgba(251, 146, 60, 0.42);
            transform: translateY(-0.5px) scale(1.003);
          }
          40% {
            box-shadow: 0 0 12px -8px rgba(239, 68, 68, 0.22), 0 0 8px -4px rgba(249, 115, 22, 0.18);
            border-color: rgba(239, 68, 68, 0.38);
            transform: translateY(0.5px) scale(0.999);
          }
          60% {
            box-shadow: 0 0 24px -5px rgba(251, 146, 60, 0.4), 0 0 12px -2px rgba(253, 224, 71, 0.26);
            border-color: rgba(253, 224, 71, 0.45);
            transform: translateY(-0.3px) scale(1.005);
          }
          80% {
            box-shadow: 0 0 16px -7px rgba(239, 68, 68, 0.3), 0 0 8px -3px rgba(249, 115, 22, 0.2);
            border-color: rgba(249, 115, 22, 0.4);
            transform: translateY(0.3px) scale(1);
          }
          100% {
            box-shadow: 0 0 14px -8px rgba(239, 68, 68, 0.28), 0 0 6px -4px rgba(249, 115, 22, 0.16);
            border-color: rgba(249, 115, 22, 0.35);
            transform: translateY(0) scale(1);
          }
        }

        @keyframes flame-intense {
          0% {
            box-shadow: 0 0 22px -4px rgba(239, 68, 68, 0.5), 0 0 10px 0px rgba(251, 146, 60, 0.35);
            border-color: rgba(239, 68, 68, 0.55);
            transform: translateY(0) scale(1);
          }
          15% {
            box-shadow: 0 0 30px 0px rgba(253, 224, 71, 0.6), 0 0 16px 2px rgba(239, 68, 68, 0.4);
            border-color: rgba(253, 224, 71, 0.7);
            transform: translateY(-1px) scale(1.01);
          }
          30% {
            box-shadow: 0 0 18px -6px rgba(239, 68, 68, 0.42), 0 0 8px -2px rgba(251, 146, 60, 0.3);
            border-color: rgba(239, 68, 68, 0.5);
            transform: translateY(0.8px) scale(0.995);
          }
          50% {
            box-shadow: 0 0 34px 2px rgba(239, 68, 68, 0.65), 0 0 18px 3px rgba(253, 224, 71, 0.5);
            border-color: rgba(253, 224, 71, 0.75);
            transform: translateY(-0.6px) scale(1.015);
          }
          65% {
            box-shadow: 0 0 20px -5px rgba(251, 146, 60, 0.45), 0 0 10px -1px rgba(239, 68, 68, 0.32);
            border-color: rgba(251, 146, 60, 0.55);
            transform: translateY(0.5px) scale(1);
          }
          85% {
            box-shadow: 0 0 28px 0px rgba(239, 68, 68, 0.55), 0 0 14px 1px rgba(253, 224, 71, 0.4);
            border-color: rgba(239, 68, 68, 0.65);
            transform: translateY(-0.4px) scale(1.008);
          }
          100% {
            box-shadow: 0 0 22px -4px rgba(239, 68, 68, 0.5), 0 0 10px 0px rgba(251, 146, 60, 0.35);
            border-color: rgba(239, 68, 68, 0.55);
            transform: translateY(0) scale(1);
          }
        }

        .animate-flame-flicker {
          animation: flame-flicker 2.4s ease-in-out infinite;
        }

        .animate-flame-intense {
          animation: flame-intense 0.6s ease-in-out infinite;
        }
      `}</style>

      {selectedRecord ? (
        <div className={`text-center px-2 transition-all duration-300 ${isSpinning ? 'blur-md opacity-50' : 'opacity-100'}`}>
          <p className="text-xs sm:text-sm text-amber-400 font-medium mb-1 sm:mb-2 tracking-widest break-all drop-shadow-[0_0_4px_rgba(245,158,11,0.35)]">
            {selectedRecord.singer_name}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 drop-shadow-[0_0_8px_rgba(239,68,68,0.45)] break-all text-orange-100">
            {selectedRecord.song_name}
          </h2>
        </div>
      ) : (
        <p className="text-slate-400 text-center text-sm sm:text-base leading-relaxed">
          次歌う曲を<br/>
          <span className="text-cyan-400 font-bold">ボタン1つで着火！</span>
        </p>
      )}
      
      <div className={`absolute top-0 left-0 w-full h-full pointer-events-none transition-all duration-500 rounded-[var(--radius)] opacity-30 ${glowColor}`} />
    </div>
  );
}
