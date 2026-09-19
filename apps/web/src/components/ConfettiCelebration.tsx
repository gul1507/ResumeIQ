import React, { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  left: string;
  color: string;
  duration: string;
  delay: string;
  rotate: number;
  size: number;
  shape: 'square' | 'circle' | 'triangle';
}

const COLORS = [
  '#6366F1', '#818CF8', '#A5B4FC',  // indigo spectrum
  '#14B8A6', '#2DD4BF', '#5EEAD4',  // teal spectrum
  '#10B981', '#34D399', '#6EE7B7',  // emerald spectrum
  '#F59E0B', '#FCD34D',             // amber
  '#FFFFFF', '#94A3B8',             // neutral
];

function generatePieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    duration: `${1.8 + Math.random() * 1.5}s`,
    delay: `${Math.random() * 0.8}s`,
    rotate: Math.random() * 360,
    size: 5 + Math.floor(Math.random() * 7),
    shape: (['square', 'circle', 'triangle'] as const)[Math.floor(Math.random() * 3)],
  }));
}

interface ConfettiCelebrationProps {
  active: boolean;
  /** Score threshold to trigger confetti (default 75) */
  threshold?: number;
  score?: number;
  count?: number;
}

export const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({
  active,
  threshold = 75,
  score = 100,
  count = 80,
}) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active && score >= threshold) {
      const newPieces = generatePieces(count);
      setPieces(newPieces);
      setVisible(true);
      const timeout = setTimeout(() => {
        setVisible(false);
        setPieces([]);
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [active, score, threshold, count]);

  if (!visible || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {pieces.map((piece) => {
        const shapeStyle: React.CSSProperties =
          piece.shape === 'circle'
            ? { borderRadius: '50%' }
            : piece.shape === 'triangle'
            ? {
                width: 0,
                height: 0,
                borderLeft: `${piece.size / 2}px solid transparent`,
                borderRight: `${piece.size / 2}px solid transparent`,
                borderBottom: `${piece.size}px solid ${piece.color}`,
                background: 'transparent',
              }
            : { borderRadius: '2px', transform: `rotate(${piece.rotate}deg)` };

        return (
          <div
            key={piece.id}
            className="confetti-piece"
            style={{
              left: piece.left,
              top: '-10px',
              width: piece.shape === 'triangle' ? 0 : piece.size,
              height: piece.shape === 'triangle' ? 0 : piece.size,
              backgroundColor: piece.shape === 'triangle' ? 'transparent' : piece.color,
              '--fall-duration': piece.duration,
              '--fall-delay': piece.delay,
              ...shapeStyle,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
};
