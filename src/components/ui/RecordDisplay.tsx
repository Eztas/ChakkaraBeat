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
    glowColor = "bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.45),transparent_75%)]";
  } else if (selectedRecord) {
    // 着火成功・楽曲表示中 (穏やかな炎)
    containerClasses = "border-orange-500/50 animate-flame-flicker";
    glowColor = "bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.3),transparent_75%)]";
  } else {
    // 未着火・通常時 (静寂のシアン)
    containerClasses = "border-cyan-500/30 shadow-[0_0_30px_-10px_rgba(6,182,212,0.4)]";
    glowColor = "bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.2),transparent_70%)]";
  }

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
          0%, 100% {
            box-shadow: 0 0 25px -8px rgba(239, 68, 68, 0.45), 0 0 12px -4px rgba(249, 115, 22, 0.25);
            border-color: rgba(249, 115, 22, 0.4);
          }
          50% {
            box-shadow: 0 0 40px -4px rgba(239, 68, 68, 0.65), 0 0 22px 0px rgba(251, 146, 60, 0.45);
            border-color: rgba(239, 68, 68, 0.6);
          }
          25%, 75% {
            box-shadow: 0 0 32px -6px rgba(249, 115, 22, 0.55), 0 0 16px -2px rgba(253, 224, 71, 0.35);
            border-color: rgba(251, 146, 60, 0.5);
          }
        }

        @keyframes flame-intense {
          0%, 100% {
            box-shadow: 0 0 35px -4px rgba(239, 68, 68, 0.75), 0 0 18px 0px rgba(251, 146, 60, 0.55);
            border-color: rgba(239, 68, 68, 0.75);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 50px 4px rgba(239, 68, 68, 0.95), 0 0 30px 8px rgba(253, 224, 71, 0.75);
            border-color: rgba(253, 224, 71, 0.95);
            transform: scale(1.015);
          }
        }

        .animate-flame-flicker {
          animation: flame-flicker 2s ease-in-out infinite;
        }

        .animate-flame-intense {
          animation: flame-intense 0.15s ease-in-out infinite;
        }
      `}</style>

      {selectedRecord ? (
        <div className={`text-center px-2 transition-all duration-300 ${isSpinning ? 'blur-md opacity-50' : 'opacity-100'}`}>
          <p className="text-xs sm:text-sm text-amber-400 font-medium mb-1 sm:mb-2 tracking-widest break-all drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]">
            {selectedRecord.singer_name}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 drop-shadow-[0_0_12px_rgba(239,68,68,0.7)] break-all text-orange-100">
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
