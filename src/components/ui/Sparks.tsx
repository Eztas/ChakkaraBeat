// src/components/ui/Sparks.tsx

export type Spark = {
  id: number;
  mx: string; 
  my: string; 
  color: string;
  size: number;
  delay: number;
};

type SparksProps = {
  isSpinning: boolean;
  sparks: Spark[];
};

export function Sparks({ isSpinning, sparks }: SparksProps) {
  return (
    <>
      {/* 💥 瞬間的な大閃光（位置を左上の境界へ変更） */}
      {isSpinning && (
        <div 
          className="absolute animate-flash rounded-full bg-gradient-to-r from-amber-400 to-orange-500 pointer-events-none z-40"
          style={{ top: '25%', left: '8%', width: '100px', height: '100px' }}
        />
      )}

      {/* ✴️ 大量の火花パーティクル（位置を左上の境界へ変更） */}
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="absolute animate-spark pointer-events-none rounded-full z-50"
          style={{
            top: '25%', // 火花が散る着火点（ホイールと左の火打石の間）
            left: '8%',
            width: `${spark.size}px`,
            height: `${spark.size}px`,
            backgroundColor: spark.color,
            boxShadow: `0 0 ${spark.size * 1.5}px ${spark.color}, 0 0 ${spark.size * 3}px ${spark.color}`,
            animationDelay: `${spark.delay}s`,
            ['--mx' as any]: spark.mx,
            ['--my' as any]: spark.my,
          }}
        />
      ))}
    </>
  );
}
