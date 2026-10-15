import confetti from 'canvas-confetti';

export function fireConfetti(options?: confetti.Options) {
  const defaults: confetti.Options = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#BB86FC', '#FF2D95', '#00FFFF', '#FFEB3B', '#00FF88', '#FFFFFF'],
    ...options,
  };
  
  confetti(defaults);
}

export function fireMassiveConfetti() {
  const duration = 5000;
  const animationEnd = Date.now() + duration;
  const colors = ['#BB86FC', '#FF2D95', '#00FFFF', '#FFEB3B', '#00FF88', '#FFFFFF', '#FF6B6B', '#4ECDC4'];
  
  function frame() {
    if (Date.now() > animationEnd) return;
    
    const particleCount = 50 * (Math.random() + 0.5);
    const spread = 90 * (Math.random() + 0.5);
    const origin = {
      x: Math.random(),
      y: Math.random() - 0.2,
    };
    
    confetti({
      particleCount,
      spread,
      origin,
      colors,
      scalar: 1.2,
      ticks: 200,
      gravity: 0.8,
      drift: (Math.random() - 0.5) * 0.5,
    });
    
    requestAnimationFrame(frame);
  }
  
  frame();
}

export function fireSideConfetti(side: 'left' | 'right') {
  const origin = side === 'left' ? { x: 0, y: 0.5 } : { x: 1, y: 0.5 };
  const angle = side === 'left' ? 45 : 135;
  
  confetti({
    particleCount: 150,
    angle,
    spread: 60,
    origin,
    colors: ['#BB86FC', '#FF2D95', '#00FFFF', '#FFEB3B', '#00FF88'],
    scalar: 1.5,
    ticks: 300,
  });
}

export function fireConfettiBurst(x: number, y: number, color?: string) {
  confetti({
    particleCount: 80,
    spread: 80,
    origin: { x, y },
    colors: color ? [color] : ['#BB86FC', '#FF2D95', '#00FFFF', '#FFEB3B'],
    scalar: 1.2,
    ticks: 150,
  });
}

export function fireCakeExplosion() {
  const duration = 3000;
  const end = Date.now() + duration;
  
  function frame() {
    if (Date.now() > end) return;
    
    confetti({
      particleCount: 30,
      spread: 90,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#FF2D95', '#FFEB3B', '#FFFFFF', '#BB86FC', '#FFB6C1'],
      scalar: 1.5,
      ticks: 100,
      gravity: 1,
      drift: (Math.random() - 0.5) * 0.8,
    });
    
    requestAnimationFrame(frame);
  }
  
  frame();
}

export function fireHeartConfetti() {
  confetti({
    particleCount: 100,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#FF2D95', '#FF6B6B', '#FF1493', '#FFFFFF', '#BB86FC'],
    shapes: ['circle'],
    scalar: 1.2,
    ticks: 200,
  });
}