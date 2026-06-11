import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useDateTime } from '@/hooks/useDateTime';
import SearchBar from './SearchBar';

export default function TopHeader() {
  const { config } = useStore();
  const dateTime = useDateTime(
    config?.dateFormat || 'YYYY年M月D日',
    config?.showSeconds ?? true,
    config?.showWeekday ?? true
  );

  const fontSizeMap: Record<string, string> = {
    'text-2xl': 'text-2xl',
    'text-3xl': 'text-3xl',
    'text-4xl': 'text-4xl',
  };
  const fontSizeClass = fontSizeMap[config?.fontSize || ''] || 'text-3xl';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full py-12 flex flex-col items-center gap-4"
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
      }}
    >
      <h1
        className={`${fontSizeClass} font-semibold tracking-wide`}
        style={{
          fontFamily: config?.fontFamily || 'Outfit',
          color: 'var(--text-primary)',
        }}
      >
        {config?.title || '星航'}
      </h1>

      <div
        className="text-sm tracking-widest"
        style={{ color: 'var(--text-secondary)' }}
      >
        {dateTime}
      </div>

      <SearchBar />
    </motion.header>
  );
}
