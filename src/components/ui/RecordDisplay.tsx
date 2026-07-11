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
  return (
    <div className="
      w-full max-w-[280px] sm:max-w-sm aspect-square 
      bg-[#0f172a]/80 backdrop-blur-md
      rounded-[var(--radius)] border border-cyan-500/30
      flex flex-col items-center justify-center p-6 sm:p-8 relative 
      shadow-[0_0_30px_-10px_rgba(6,182,212,0.4)]
    ">
      {selectedRecord ? (
        <div className={`text-center px-2 transition-all duration-300 ${isSpinning ? 'blur-md opacity-50' : 'opacity-100'}`}>
          <p className="text-xs sm:text-sm text-cyan-400 font-medium mb-1 sm:mb-2 tracking-widest break-all">
            {selectedRecord.singer_name}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] break-all">
            {selectedRecord.song_name}
          </h2>
        </div>
      ) : (
        <p className="text-slate-400 text-center text-sm sm:text-base leading-relaxed">
          次歌う曲を<br/>
          <span className="text-cyan-400 font-bold">ボタン1つで着火！</span>
        </p>
      )}
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.2),transparent_70%)]" />
    </div>
  );
}
