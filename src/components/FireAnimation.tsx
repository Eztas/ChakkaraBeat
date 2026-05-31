// src/components/FireAnimation.tsx
import confetti from 'canvas-confetti'

// 炎色：オレンジ・赤・黄・深紅
const FIRE_COLORS = ['#ff4500', '#ff6a00', '#ffae00', '#ff2200', '#ffcc00', '#cc2200']

export function fireAnimation() {
  const duration = 1000
  const end = Date.now() + duration

  // 画面中央下から左右に炎を噴き上げる
  const frame = () => {
    // 左側の炎
    confetti({
      particleCount: 6,
      angle: 75,
      spread: 28,
      origin: { x: 0.35, y: 1 },
      colors: FIRE_COLORS,
      startVelocity: 45,
      gravity: 0.6,
      scalar: 1.1,
      ticks: 80,
      drift: 0.5,
      shapes: ['circle'],
    })

    // 右側の炎
    confetti({
      particleCount: 6,
      angle: 105,
      spread: 28,
      origin: { x: 0.65, y: 1 },
      colors: FIRE_COLORS,
      startVelocity: 45,
      gravity: 0.6,
      scalar: 1.1,
      ticks: 80,
      drift: -0.5,
      shapes: ['circle'],
    })

    // 中央の大きめの炎
    confetti({
      particleCount: 8,
      angle: 90,
      spread: 20,
      origin: { x: 0.5, y: 1 },
      colors: FIRE_COLORS,
      startVelocity: 55,
      gravity: 0.5,
      scalar: 1.3,
      ticks: 90,
      drift: 0,
      shapes: ['circle'],
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }

  frame()
}
