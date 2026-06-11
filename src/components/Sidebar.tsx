import { motion } from 'framer-motion';
import { Moon, Sun, Eye, Monitor, Settings, LogOut, Lock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { SiteConfig } from '@/types';

const themeOptions: { key: SiteConfig['theme']; icon: typeof Moon; label: string }[] = [
  { key: 'dark', icon: Moon, label: '深色' },
  { key: 'light', icon: Sun, label: '白天' },
  { key: 'eye-care', icon: Eye, label: '护眼' },
  { key: 'system', icon: Monitor, label: '跟随系统' },
];

export default function Sidebar() {
  const { config, modules, isAdmin, activeModuleId, setActiveModuleId, setScrollToModuleId, setShowSettings, setShowLogin, updateConfig, logout } = useStore();

  const handleModuleClick = (id: string) => {
    setActiveModuleId(id);
    setScrollToModuleId(id);
  };

  const handleThemeChange = (theme: SiteConfig['theme']) => {
    updateConfig({ theme });
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="hidden md:flex flex-col w-[200px] flex-shrink-0 h-full"
      style={{
        background: 'var(--bg-sidebar)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid var(--glass-border)',
      }}
    >
      {/* 模块导航 */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {modules.map((mod) => {
            const isActive = activeModuleId === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => handleModuleClick(mod.id)}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-left"
                style={{
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--glass-bg)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <span className="text-base">{mod.icon}</span>
                <span className="truncate">{mod.name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 底部控制 */}
      <div className="p-3 space-y-3" style={{ borderTop: '1px solid var(--glass-border)' }}>
        {/* 主题切换 */}
        <div className="flex items-center justify-center gap-1">
          {themeOptions.map(({ key, icon: Icon, label }) => {
            const isActive = config.theme === key;
            return (
              <button
                key={key}
                onClick={() => handleThemeChange(key)}
                className="p-1.5 rounded-lg transition-colors"
                style={{
                  background: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                }}
                title={label}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>

        {/* 管理控制 */}
        {isAdmin ? (
          <div className="flex gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Settings size={16} />
              <span>设置</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-sm transition-colors"
              style={{ color: 'var(--text-muted)' }}
              title="退出登录"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <Lock size={16} />
            <span>管理</span>
          </button>
        )}
      </div>
    </motion.aside>
  );
}
