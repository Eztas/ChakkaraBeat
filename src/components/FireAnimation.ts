// src/components/fireAnimation.ts

export const fireAnimation = () => {
  const style = document.createElement('style')
  style.textContent = `
    /* 背景を少し暗くして炎を際立たせる */
    @keyframes backdrop-dim {
      0%   { background-color: rgba(0,0,0,0); }
      15%  { background-color: rgba(0,0,0,0.5); }
      75%  { background-color: rgba(0,0,0,0.5); }
      100% { background-color: rgba(0,0,0,0); }
    }
    @keyframes log-existing-in {
      0%   { opacity: 0; transform: translateY(20px) rotate(var(--rot-start)); }
      100% { opacity: 1; transform: translateY(0) rotate(var(--rot-start)); }
    }
    @keyframes new-log-drop {
      0%   { transform: translateY(-300px) rotate(var(--rot-start)) scale(1.2); opacity: 0; }
      15%  { opacity: 1; }
      75%  { transform: translateY(0px) rotate(var(--rot-end)) scale(1); opacity: 1; }
      83%  { transform: translateY(12px) rotate(var(--rot-end)); }
      90%  { transform: translateY(-4px) rotate(var(--rot-end)); }
      100% { transform: translateY(0px) rotate(var(--rot-end)); opacity: 1; }
    }
    @keyframes log-impact-spark {
      0%   { opacity: 1; transform: translate(0,0) scale(1); }
      100% { opacity: 0; transform: translate(var(--sx), var(--sy)) scale(0.1); }
    }
    @keyframes log-ember-rise {
      0%   { opacity: 1; transform: translate(0, 0) scale(1); }
      100% { opacity: 0; transform: translate(var(--ex), -150px) scale(0.3); }
    }
    @keyframes log-glow-settle {
      0%   { opacity: 0; transform: translateX(-50%) scale(0.5); }
      75%  { opacity: 0.8; transform: translateX(-50%) scale(1.2); }
      100% { opacity: 0; transform: translateX(-50%) scale(1); }
    }
    @keyframes log-label {
      0%   { opacity: 0; transform: translateY(10px) scale(0.8); }
      30%  { opacity: 1; transform: translateY(0) scale(1); }
      75%  { opacity: 1; }
      100% { opacity: 0; transform: translateY(-5px); }
    }
  `
  document.head.appendChild(style)

  // 画面全体を覆うオーバーレイ（ここで背景を暗くする）
  const overlay = document.createElement('div')
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '9999',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',       // 垂直方向に中央揃え
    justifyContent: 'center',   // 水平方向に中央揃え
    animation: 'backdrop-dim 2.2s ease-out forwards',
  })

  // 薪やエフェクトを配置するための300x300の相対コンテナ（画面中央に浮かぶ）
  const container = document.createElement('div')
  Object.assign(container.style, {
    position: 'relative',
    width: '300px',
    height: '300px',
    // ドロワーが開いていることを考慮して、ど真ん中より少し上にズラす
    transform: 'translateY(-15%)', 
  })
  overlay.appendChild(container)

  // ── 薪の描画ヘルパー ──
  const makeLog = (opts: {
    width: number
    height: number
    rotate: number
    translateX: number
    translateY: number
    lightness: number
    animation?: string
  }) => {
    const wrap = document.createElement('div')
    Object.assign(wrap.style, {
      position: 'absolute',
      // container(300x300)の下部基準に配置
      bottom: '60px', 
      left: '50%',
      width: `${opts.width}px`,
      height: `${opts.height}px`,
      marginLeft: `${-opts.width / 2 + opts.translateX}px`,
      marginBottom: `${opts.translateY}px`,
      borderRadius: `${opts.height / 2}px`,
      background: `linear-gradient(160deg,
        hsl(28, ${40 + opts.lightness * 20}%, ${28 + opts.lightness * 18}%),
        hsl(22, ${35 + opts.lightness * 15}%, ${18 + opts.lightness * 10}%)
      )`,
      boxShadow: 'inset 0 4px 6px rgba(255,255,255,0.08), inset 0 -4px 6px rgba(0,0,0,0.4), 0 5px 10px rgba(0,0,0,0.3)',
      transformOrigin: 'center',
    })
    wrap.style.setProperty('--rot-start', `${opts.rotate}deg`)
    if (opts.animation) wrap.style.animation = opts.animation
    return wrap
  }

  // 既存の3本（全体的に約2倍のサイズ）
  const existingLogs = [
    { width: 152, height: 26, rotate: -14, translateX: -36, translateY: 0,  lightness: 0.2 },
    { width: 160, height: 26, rotate: 12,  translateX: 28,  translateY: 4,  lightness: 0.0 },
    { width: 140, height: 24, rotate: -3,  translateX: -8,  translateY: 24, lightness: 0.4 },
  ]
  existingLogs.forEach((cfg, i) => {
    const log = makeLog({ ...cfg, animation: `log-existing-in 0.4s ease-out ${i * 0.05}s forwards` })
    log.style.opacity = '0'
    container.appendChild(log)
  })

  // 新しい薪（上から落ちてくる）
  const newLog = makeLog({
    width: 148,
    height: 26,
    rotate: 0,
    translateX: 12,
    translateY: 48,
    lightness: 0.7, 
    animation: 'new-log-drop 0.7s cubic-bezier(0.34,1.1,0.64,1) 0.3s forwards',
  })
  newLog.style.opacity = '0'
  newLog.style.setProperty('--rot-start', '25deg')
  newLog.style.setProperty('--rot-end', '8deg')
  container.appendChild(newLog)

  // 着地後の火花（飛距離とサイズをアップ）
  const sparkColors = ['#fbbf24', '#f97316', '#ef4444', '#fff', '#fde68a']
  for (let i = 0; i < 18; i++) {
    const spark = document.createElement('div')
    const angle = (Math.random() * 160 - 80) * (Math.PI / 180)
    const dist = 30 + Math.random() * 60
    const sx = `${Math.round(Math.cos(angle) * dist)}px`
    const sy = `${Math.round(-Math.abs(Math.sin(angle)) * dist)}px`
    const color = sparkColors[Math.floor(Math.random() * sparkColors.length)]
    const size = 4 + Math.random() * 4 // サイズ倍増
    Object.assign(spark.style, {
      position: 'absolute',
      bottom: `${100 + Math.random() * 20}px`,
      left: `calc(50% + ${Math.round(Math.random() * 100 - 50)}px)`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: color,
      boxShadow: `0 0 6px ${color}`,
      animation: `log-impact-spark 0.5s ease-out ${0.95 + Math.random() * 0.15}s forwards`,
      opacity: '0',
    })
    spark.style.setProperty('--sx', sx)
    spark.style.setProperty('--sy', sy)
    container.appendChild(spark)
  }

  // 浮遊するエンバー（余熱）
  for (let i = 0; i < 10; i++) {
    const ember = document.createElement('div')
    const ex = `${Math.round(Math.random() * 120 - 60)}px`
    const color = ['#fbbf24', '#f97316', '#fde68a'][Math.floor(Math.random() * 3)]
    Object.assign(ember.style, {
      position: 'absolute',
      bottom: `${90 + Math.random() * 30}px`,
      left: `calc(50% + ${Math.round(Math.random() * 100 - 50)}px)`,
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      background: color,
      boxShadow: `0 0 6px ${color}`,
      animation: `log-ember-rise ${1.0 + Math.random() * 0.6}s ease-out ${0.98 + i * 0.1}s forwards`,
      opacity: '0',
    })
    ember.style.setProperty('--ex', ex)
    container.appendChild(ember)
  }

  // 積み上がった後のグロウ（薪全体が赤熱する、サイズ倍増）
  const glow = document.createElement('div')
  Object.assign(glow.style, {
    position: 'absolute',
    bottom: '40px',
    left: '50%',
    width: '240px',
    height: '60px',
    borderRadius: '50%',
    background: 'radial-gradient(ellipse, rgba(239,68,68,0.5), rgba(251,146,60,0.2) 60%, transparent)',
    animation: 'log-glow-settle 1.8s ease-out 0.8s forwards',
    opacity: '0',
  })
  container.appendChild(glow)

  // ラベル（大きく、目立つように）
  const label = document.createElement('div')
  Object.assign(label.style, {
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '18px',
    fontFamily: 'monospace',
    fontWeight: '800',
    letterSpacing: '0.3em',
    color: '#fbbf24',
    textShadow: '0 0 12px rgba(251,146,60,1), 0 0 24px rgba(239,68,68,0.8)',
    whiteSpace: 'nowrap',
    animation: 'log-label 1.8s ease-out 0.8s forwards',
    opacity: '0',
  })
  label.textContent = 'SUCCESS'
  container.appendChild(label)

  document.body.appendChild(overlay)
  
  // アニメーション終了後にクリーンアップ
  setTimeout(() => { overlay.remove(); style.remove() }, 2400)
}
