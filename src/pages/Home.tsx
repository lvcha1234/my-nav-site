import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import TopHeader from '@/components/TopHeader';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import MobileNav from '@/components/MobileNav';
import SettingsPanel from '@/components/SettingsPanel';
import LoginPanel from '@/components/LoginPanel';
import EditModuleModal from '@/components/EditModuleModal';
import EditLinkModal from '@/components/EditLinkModal';

function resolveTheme(theme: string): string {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

export default function Home() {
  const {
    config,
    fetchConfig,
    fetchModules,
    fetchLinks,
    checkSetup,
    needsSetup,
    showLogin,
    showSettings,
    editingModule,
    editingLink,
    setEditingModule,
    setEditingLink,
    setShowLogin,
  } = useStore();

  // 初始化数据
  useEffect(() => {
    const init = async () => {
      await fetchConfig();
      await fetchModules();
      await fetchLinks();
      await checkSetup();
    };
    init();
  }, [fetchConfig, fetchModules, fetchLinks, checkSetup]);

  // 首次需要设置密码
  useEffect(() => {
    if (needsSetup) {
      setShowLogin(true);
    }
  }, [needsSetup, setShowLogin]);

  // 应用主题
  useEffect(() => {
    const resolved = resolveTheme(config.theme);
    document.documentElement.className = `theme-${resolved}`;
  }, [config.theme]);

  // 监听系统主题变化（当设置为 system 时）
  useEffect(() => {
    if (config.theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const resolved = mq.matches ? 'dark' : 'light';
      document.documentElement.className = `theme-${resolved}`;
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [config.theme]);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ color: 'var(--text-primary)' }}>
      {/* 背景图 */}
      {config.bgImage && (
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${config.bgImage})` }}
        >
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
        </div>
      )}

      {/* 内容 */}
      <div className="relative z-10 flex flex-col h-full">
        {/* 顶部区域 */}
        <TopHeader />

        {/* 主体：侧边栏 + 内容 */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>

        {/* 移动端导航 */}
        <MobileNav />
      </div>

      {/* 模态框和面板 */}
      <AnimatePresence>
        {showSettings && <SettingsPanel />}
      </AnimatePresence>

      {showLogin && <LoginPanel />}

      {editingModule !== null && (
        <EditModuleModal
          module={editingModule}
          onClose={() => setEditingModule(null)}
        />
      )}

      {editingLink !== null && (
        <EditLinkModal
          link={editingLink}
          onClose={() => setEditingLink(null)}
        />
      )}
    </div>
  );
}
