import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NavigationArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
  className?: string;
}

export function NavigationArrow({ direction, onClick, className }: NavigationArrowProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={cn(
        "p-3 rounded-full bg-white/10 backdrop-blur-sm",
        "hover:bg-white/20 transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-white/20",
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className={cn(
          "w-6 h-6 text-white",
          direction === 'left' ? 'rotate-180' : ''
        )}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </motion.button>
  );
}
