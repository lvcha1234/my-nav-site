import { Moon, Sun, Eye, Monitor, Settings, Lock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { SiteConfig } from '@/types';

const themeIcons: { key: SiteConfig['theme']; icon: typeof Moon }[] = [
  { key: 'dark', icon: Moon },
  { key: 'light', icon: Sun },
  { key: 'eye-care', icon: Eye },
  { key: 'system', icon: Monitor },
];

export default function MobileNav() {
  const { modules, config, isAdmin, setActiveModuleId, setScrollToModuleId, setShowSettings, setShowLogin, updateConfig } = useStore();

  const handleModuleClick = (id: string) => {
    setActiveModuleId(id);
    setScrollToModuleId(id);
  };

  const handleThemeChange = (theme: SiteConfig['theme']) => {
    updateConfig({ theme });
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-2 py-2"
      style={{
        background: 'var(--bg-sidebar)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid var(--glass-border)',
      }}
    >
      {/* Module icons - horizontal scroll */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide px-1">
        {modules.map((mod) => (
          <button
            key={mod.id}
            onClick={() => handleModuleClick(mod.id)}
            className="flex-shrink-0 flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span className="text-base">{mod.icon}</span>
            <span className="truncate max-w-[48px]">{mod.name}</span>
          </button>
        ))}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1 pl-2" style={{ borderLeft: '1px solid var(--glass-border)' }}>
        {themeIcons.map(({ key, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleThemeChange(key)}
            className="p-1.5 rounded-lg"
            style={{
              color: config.theme === key ? 'var(--accent)' : 'var(--text-muted)',
            }}
          >
            <Icon size={16} />
          </button>
        ))}

        {isAdmin ? (
          <button
            onClick={() => setShowSettings(true)}
            className="p-1.5 rounded-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Settings size={16} />
          </button>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="p-1.5 rounded-lg"
            style={{ color: 'var(--text-muted)' }}
          >
            <Lock size={16} />
          </button>
        )}
      </div>
    </nav>
  );
}
