import React, { useEffect, useRef } from 'react';

interface SoundWaveProps {
  isActive: boolean;
  isUser?: boolean;
}

export function SoundWave({ isActive, isUser = true }: SoundWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bars = 40;
    const barWidth = canvas.width / bars;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (isActive) {
        for (let i = 0; i < bars; i++) {
          const barHeight = Math.sin(time * 0.02 + i * 0.3) * 30 + 30;
          const x = i * barWidth;
          const y = (canvas.height - barHeight) / 2;
          
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          if (isUser) {
            gradient.addColorStop(0, '#8b5cf6');
            gradient.addColorStop(0.5, '#06b6d4');
            gradient.addColorStop(1, '#10b981');
          } else {
            gradient.addColorStop(0, '#06b6d4');
            gradient.addColorStop(0.5, '#f59e0b');
            gradient.addColorStop(1, '#ef4444');
          }
          
          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, barWidth - 3, barHeight);
        }
        time += 1;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, isUser]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={100}
      className="rounded-2xl shadow-lg border border-white/20"
    />
  );
}