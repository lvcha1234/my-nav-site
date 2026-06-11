export interface SiteConfig {
  title: string;
  fontFamily: string;
  fontSize: string;
  dateFormat: string;
  showSeconds: boolean;
  showWeekday: boolean;
  bgImage: string;
  defaultEngine: 'bing' | 'baidu';
  theme: 'dark' | 'light' | 'eye-care' | 'system';
}

export interface NavModule {
  id: string;
  name: string;
  icon: string;
  order: number;
  collapsed: boolean;
}

export interface NavLink {
  id: string;
  moduleId: string;
  name: string;
  url: string;
  favicon?: string;
  order: number;
}

export interface Env {
  NAVI_DATA: KVNamespace;
  JWT_SECRET: string;
  ADMIN_PASSWORD_HASH: string;
}
