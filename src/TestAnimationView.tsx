// TestAnimationView.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSpring, animated, config } from '@react-spring/web';

export default function TestAnimationView() {
  return (
    <div className="flex flex-col gap-16 w-full max-w-2xl">
      
      {/* 1. Aceternity UI風 (Framer Motion + Tailwind) */}
      <section className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">1. Aceternity UI Style (Framer Motion)</h2>
        <p className="text-sm text-slate-400">ホバーすると光のグラデーションが追従するようなモダンなカード</p>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative group w-80 h-48 rounded-2xl bg-slate-900 border border-slate-800 p-6 overflow-hidden cursor-pointer flex flex-col justify-end"
        >
          {/* Aceternity特有のホバー時に現れる背景グロウ */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white tracking-tight">Aceternity Card</h3>
            <p className="text-slate-400 mt-2 text-sm">
              Framer Motionによるシームレスなトランジションと、Tailwindによる光の表現。
            </p>
          </div>
          
          {/* 装飾の動く光のライン */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-full"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'linear',
            }}
          />
        </motion.div>
      </section>

      <hr className="border-slate-800" />

      {/* 2. react-spring風 */}
      <section className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold text-amber-400 mb-2">2. React Spring Style</h2>
        <p className="text-sm text-slate-400">クリックすると物理演算（バネ）でプルンッ！と弾むボタン</p>
        
        <SpringButton />
      </section>

    </div>
  );
}

// React Spring用のコンポーネント
function SpringButton() {
  const [clicked, setClicked] = useState(false);

  // useSpringでバネの物理演算を設定
  const springs = useSpring({
    transform: clicked ? 'scale(0.8) rotate(-5deg)' : 'scale(1) rotate(0deg)',
    backgroundColor: clicked ? '#f59e0b' : '#334155', // アンバーからスレートへ
    config: config.wobbly, // react-spring特有の「プルプル」設定
  });

  return (
    <animated.button
      style={springs}
      onMouseDown={() => setClicked(true)}
      onMouseUp={() => setClicked(false)}
      onMouseLeave={() => setClicked(false)} // ドラッグして離れた時のケア
      className="px-8 py-4 rounded-xl text-white font-bold shadow-lg cursor-pointer"
    >
      Click Me! (Wobbly)
    </animated.button>
  );
}

