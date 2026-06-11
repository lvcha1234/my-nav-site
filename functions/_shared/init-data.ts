import type { SiteConfig, NavModule, NavLink } from './types';

const DEFAULT_CONFIG: SiteConfig = {
  title: '猫叔有段位•星航',
  fontFamily: 'Outfit',
  fontSize: '3xl',
  dateFormat: 'YYYY年M月D日',
  showSeconds: true,
  showWeekday: true,
  bgImage: '',
  defaultEngine: 'bing',
  theme: 'dark',
};

const DEFAULT_MODULES: NavModule[] = [
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

const DEFAULT_LINKS: NavLink[] = [
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

export async function ensureInitialData(kv: KVNamespace): Promise<void> {
  const existing = await kv.get('config');
  if (existing !== null) return;

  await kv.put('config', JSON.stringify(DEFAULT_CONFIG));
  await kv.put('modules', JSON.stringify(DEFAULT_MODULES));
  await kv.put('links', JSON.stringify(DEFAULT_LINKS));
}
