import { motion } from 'motion/react';

export default function GradientBars({ bars = 20, colors = ['#e60a64', 'transparent'], level = 0 }) {
  const gradientStyle = `linear-gradient(to top, ${colors.join(', ')})`;
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="flex h-full w-full">
        {Array.from({ length: bars }).map((_, index) => {
          const position = index / (bars - 1);
          const center = 0.5;
          const distanceFromCenter = Math.abs(position - center);
          const base = 0.2 + 0.5 * Math.pow(distanceFromCenter * 2, 1.2);
          const weight = 1 - Math.abs(position - center) * 2;
          const dynamic = 1.1 * level * Math.max(0.3, weight);
          const scaleY = base + dynamic;

          return (
            <motion.div
              key={`bg-bar-${index}`}
              className="flex-1 origin-bottom"
              style={{ background: gradientStyle }}
              animate={{ scaleY, opacity: 1 }}
              transition={{ duration: 0.08, ease: 'easeOut' }}
            />
          );
        })}
      </div>
    </div>
  );
}


