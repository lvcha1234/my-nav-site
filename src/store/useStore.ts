import { create } from 'zustand';
import type { SiteConfig, NavModule, NavLink } from '@/types';

const API_BASE = '/api';
const isDev = !window.location.hostname.includes('pages.dev') && window.location.port !== '';

const defaultConfig: SiteConfig = {
  title: '猫叔有段位•星航',
  fontFamily: 'Outfit',
  fontSize: 'text-3xl',
  dateFormat: 'YYYY年M月D日',
  showSeconds: true,
  showWeekday: true,
  bgImage: '',
  defaultEngine: 'bing',
  theme: 'dark',
};

const defaultModules: NavModule[] = [
  { id: 'mod_001', name: '办公工具', icon: '💼', order: 1, collapsed: false },
  { id: 'mod_002', name: '学习资源', icon: '📚', order: 2, collapsed: false },
  { id: 'mod_003', name: '设计开发', icon: '🎨', order: 3, collapsed: false },
  { id: 'mod_004', name: '影音娱乐', icon: '🎬', order: 4, collapsed: false },
  { id: 'mod_005', name: 'AI大模型', icon: '🤖', order: 5, collapsed: false },
  { id: 'mod_006', name: 'AI工具', icon: '⚡', order: 6, collapsed: false },
  { id: 'mod_007', name: '自媒体', icon: '📱', order: 7, collapsed: false },
  { id: 'mod_008', name: '其它', icon: '📦', order: 8, collapsed: false },
  { id: 'mod_009', name: '临时', icon: '📌', order: 9, collapsed: false },
];

const defaultLinks: NavLink[] = [
  { id: 'link_001', moduleId: 'mod_001', name: 'Google Docs', url: 'https://docs.google.com', order: 1 },
  { id: 'link_002', moduleId: 'mod_001', name: 'Notion', url: 'https://www.notion.so', order: 2 },
  { id: 'link_003', moduleId: 'mod_001', name: '腾讯文档', url: 'https://docs.qq.com', order: 3 },
  { id: 'link_004', moduleId: 'mod_002', name: 'MDN', url: 'https://developer.mozilla.org', order: 1 },
  { id: 'link_005', moduleId: 'mod_002', name: '菜鸟教程', url: 'https://www.runoob.com', order: 2 },
  { id: 'link_006', moduleId: 'mod_002', name: 'Coursera', url: 'https://www.coursera.org', order: 3 },
  { id: 'link_007', moduleId: 'mod_003', name: 'Figma', url: 'https://www.figma.com', order: 1 },
  { id: 'link_008', moduleId: 'mod_003', name: 'GitHub', url: 'https://github.com', order: 2 },
  { id: 'link_009', moduleId: 'mod_003', name: 'CodePen', url: 'https://codepen.io', order: 3 },
  { id: 'link_010', moduleId: 'mod_004', name: 'YouTube', url: 'https://www.youtube.com', order: 1 },
  { id: 'link_011', moduleId: 'mod_004', name: 'Bilibili', url: 'https://www.bilibili.com', order: 2 },
  { id: 'link_012', moduleId: 'mod_004', name: 'Spotify', url: 'https://www.spotify.com', order: 3 },
  { id: 'link_013', moduleId: 'mod_005', name: 'ChatGPT', url: 'https://chat.openai.com', order: 1 },
  { id: 'link_014', moduleId: 'mod_005', name: 'Claude', url: 'https://claude.ai', order: 2 },
  { id: 'link_015', moduleId: 'mod_005', name: 'Gemini', url: 'https://gemini.google.com', order: 3 },
  { id: 'link_016', moduleId: 'mod_006', name: 'Midjourney', url: 'https://www.midjourney.com', order: 1 },
  { id: 'link_017', moduleId: 'mod_006', name: 'Stable Diffusion', url: 'https://stability.ai', order: 2 },
  { id: 'link_018', moduleId: 'mod_006', name: 'Runway', url: 'https://runwayml.com', order: 3 },
  { id: 'link_019', moduleId: 'mod_007', name: '微信公众号', url: 'https://mp.weixin.qq.com', order: 1 },
  { id: 'link_020', moduleId: 'mod_007', name: '小红书', url: 'https://www.xiaohongshu.com', order: 2 },
  { id: 'link_021', moduleId: 'mod_007', name: '抖音创作者', url: 'https://creator.douyin.com', order: 3 },
];

interface AppState {
  config: SiteConfig;
  modules: NavModule[];
  links: NavLink[];
  isAdmin: boolean;
  token: string;
  searchQuery: string;
  activeModuleId: string;
  scrollToModuleId: string;
  showSettings: boolean;
  showLogin: boolean;
  needsSetup: boolean;
  editingModule: NavModule | null;
  editingLink: NavLink | null;

  setConfig: (config: Partial<SiteConfig>) => void;
  setModules: (modules: NavModule[]) => void;
  setLinks: (links: NavLink[]) => void;
  setIsAdmin: (v: boolean) => void;
  setToken: (v: string) => void;
  setSearchQuery: (v: string) => void;
  setActiveModuleId: (v: string) => void;
  setScrollToModuleId: (v: string) => void;
  setShowSettings: (v: boolean) => void;
  setShowLogin: (v: boolean) => void;
  setNeedsSetup: (v: boolean) => void;
  setEditingModule: (v: NavModule | null) => void;
  setEditingLink: (v: NavLink | null) => void;

  fetchConfig: () => Promise<void>;
  fetchModules: () => Promise<void>;
  fetchLinks: () => Promise<void>;
  checkSetup: () => Promise<void>;
  login: (password: string) => Promise<boolean>;
  updateConfig: (data: Partial<SiteConfig>) => Promise<void>;
  createModule: (data: Omit<NavModule, 'id' | 'order'>) => Promise<void>;
  updateModule: (id: string, data: Partial<NavModule>) => Promise<void>;
  deleteModule: (id: string) => Promise<void>;
  createLink: (data: Omit<NavLink, 'id' | 'order'>) => Promise<void>;
  updateLink: (id: string, data: Partial<NavLink>) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  reorderModules: (ids: string[]) => Promise<void>;
  reorderLinks: (ids: string[]) => Promise<void>;
  exportData: () => Promise<void>;
  importData: (data: string) => Promise<void>;
  logout: () => void;
}

const authHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const useStore = create<AppState>((set, get) => ({
  config: defaultConfig,
  modules: defaultModules,
  links: defaultLinks,
  isAdmin: false,
  token: localStorage.getItem('navi_token') || '',
  searchQuery: '',
  activeModuleId: defaultModules[0]?.id || '',
  scrollToModuleId: '',
  showSettings: false,
  showLogin: false,
  needsSetup: false,
  editingModule: null,
  editingLink: null,

  setConfig: (config) => set((s) => ({ config: { ...s.config, ...config } })),
  setModules: (modules) => set({ modules }),
  setLinks: (links) => set({ links }),
  setIsAdmin: (v) => set({ isAdmin: v }),
  setToken: (v) => {
    localStorage.setItem('navi_token', v);
    set({ token: v });
  },
  setSearchQuery: (v) => set({ searchQuery: v }),
  setActiveModuleId: (v) => set({ activeModuleId: v }),
  setScrollToModuleId: (v) => set({ scrollToModuleId: v }),
  setShowSettings: (v) => set({ showSettings: v }),
  setShowLogin: (v) => set({ showLogin: v }),
  setNeedsSetup: (v) => set({ needsSetup: v }),
  setEditingModule: (v) => set({ editingModule: v }),
  setEditingLink: (v) => set({ editingLink: v }),

  fetchConfig: async () => {
    try {
      const res = await fetch(`${API_BASE}/config`);
      const data = await res.json();
      set({ config: { ...defaultConfig, ...data } });
    } catch {
      set({ config: defaultConfig });
    }
  },

  fetchModules: async () => {
    try {
      const res = await fetch(`${API_BASE}/modules`);
      const data = await res.json();
      set({ modules: data.sort((a: NavModule, b: NavModule) => a.order - b.order) });
    } catch {
      set({ modules: defaultModules });
    }
  },

  fetchLinks: async () => {
    try {
      const res = await fetch(`${API_BASE}/links`);
      const data = await res.json();
      set({ links: data.sort((a: NavLink, b: NavLink) => a.order - b.order) });
    } catch {
      set({ links: defaultLinks });
    }
  },

  checkSetup: async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/setup`);
      const data = await res.json();
      set({ needsSetup: data.needsSetup === true });
    } catch {
      // 如果 API 不可用（本地开发），默认不需要设置
      set({ needsSetup: false });
    }
  },

  login: async (password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        get().setToken(data.token);
        set({ isAdmin: true, showLogin: false, needsSetup: false });
        return true;
      }
      return false;
    } catch {
      // 开发模式：API 不可用时，任意密码可登录
      if (isDev && password.length >= 6) {
        get().setToken('dev-token');
        set({ isAdmin: true, showLogin: false, needsSetup: false });
        return true;
      }
      return false;
    }
  },

  updateConfig: async (data) => {
    const { token } = get();
    try {
      await fetch(`${API_BASE}/config`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify(data),
      });
      set((s) => ({ config: { ...s.config, ...data } }));
    } catch { /* ignore */ }
  },

  createModule: async (data) => {
    const { token, modules } = get();
    try {
      const res = await fetch(`${API_BASE}/modules`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ ...data, order: modules.length }),
      });
      const newModule = await res.json();
      set((s) => ({ modules: [...s.modules, newModule].sort((a, b) => a.order - b.order) }));
    } catch { /* ignore */ }
  },

  updateModule: async (id, data) => {
    const { token } = get();
    try {
      await fetch(`${API_BASE}/modules/${id}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify(data),
      });
      set((s) => ({
        modules: s.modules.map((m) => (m.id === id ? { ...m, ...data } : m)),
      }));
    } catch { /* ignore */ }
  },

  deleteModule: async (id) => {
    const { token } = get();
    try {
      await fetch(`${API_BASE}/modules/${id}`, {
        method: 'DELETE',
        headers: authHeaders(token),
      });
      set((s) => ({
        modules: s.modules.filter((m) => m.id !== id),
        links: s.links.filter((l) => l.moduleId !== id),
      }));
    } catch { /* ignore */ }
  },

  createLink: async (data) => {
    const { token, links } = get();
    try {
      const moduleLinks = links.filter((l) => l.moduleId === data.moduleId);
      const res = await fetch(`${API_BASE}/links`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ ...data, order: moduleLinks.length }),
      });
      const newLink = await res.json();
      set((s) => ({ links: [...s.links, newLink].sort((a, b) => a.order - b.order) }));
    } catch { /* ignore */ }
  },

  updateLink: async (id, data) => {
    const { token } = get();
    try {
      await fetch(`${API_BASE}/links/${id}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify(data),
      });
      set((s) => ({
        links: s.links.map((l) => (l.id === id ? { ...l, ...data } : l)),
      }));
    } catch { /* ignore */ }
  },

  deleteLink: async (id) => {
    const { token } = get();
    try {
      await fetch(`${API_BASE}/links/${id}`, {
        method: 'DELETE',
        headers: authHeaders(token),
      });
      set((s) => ({ links: s.links.filter((l) => l.id !== id) }));
    } catch { /* ignore */ }
  },

  reorderModules: async (ids) => {
    const { token, modules } = get();
    // 乐观更新
    const map = new Map(modules.map((m) => [m.id, m]));
    const reordered = ids.map((id, i) => ({ ...map.get(id)!, order: i }));
    set({ modules: reordered });
    // 逐个更新到后端
    try {
      for (const mod of reordered) {
        await fetch(`${API_BASE}/modules/${mod.id}`, {
          method: 'PUT',
          headers: authHeaders(token),
          body: JSON.stringify({ order: mod.order }),
        });
      }
    } catch { /* ignore */ }
  },

  reorderLinks: async (ids) => {
    const { token, links } = get();
    const map = new Map(links.map((l) => [l.id, l]));
    const reordered = ids.map((id, i) => ({ ...map.get(id)!, order: i }));
    set({ links: reordered });
    try {
      for (const link of reordered) {
        await fetch(`${API_BASE}/links/${link.id}`, {
          method: 'PUT',
          headers: authHeaders(token),
          body: JSON.stringify({ order: link.order }),
        });
      }
    } catch { /* ignore */ }
  },

  exportData: async () => {
    const { config, modules, links } = get();
    const data = JSON.stringify({ config, modules, links }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nav-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importData: async (data) => {
    try {
      const parsed = JSON.parse(data);
      const { token } = get();
      // 更新配置
      if (parsed.config) {
        await fetch(`${API_BASE}/config`, {
          method: 'PUT',
          headers: authHeaders(token),
          body: JSON.stringify(parsed.config),
        });
        get().setConfig(parsed.config);
      }
      // 更新模块 - 逐个更新
      if (parsed.modules) {
        for (const mod of parsed.modules) {
          await fetch(`${API_BASE}/modules/${mod.id}`, {
            method: 'PUT',
            headers: authHeaders(token),
            body: JSON.stringify(mod),
          });
        }
        set({ modules: parsed.modules });
      }
      // 更新链接
      if (parsed.links) {
        for (const link of parsed.links) {
          await fetch(`${API_BASE}/links/${link.id}`, {
            method: 'PUT',
            headers: authHeaders(token),
            body: JSON.stringify(link),
          });
        }
        set({ links: parsed.links });
      }
    } catch { /* ignore */ }
  },

  logout: () => {
    localStorage.removeItem('navi_token');
    set({ isAdmin: false, token: '', showSettings: false });
  },
}));
