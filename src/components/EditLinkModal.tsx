import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { NavLink } from '@/types';

interface EditLinkModalProps {
  link: NavLink | null;
  onClose: () => void;
}

export default function EditLinkModal({ link, onClose }: EditLinkModalProps) {
  const { modules, createLink, updateLink } = useStore();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [favicon, setFavicon] = useState('');
  const [loadingFavicon, setLoadingFavicon] = useState(false);

  const isEdit = !!link?.id;

  useEffect(() => {
    if (link) {
      setName(link.name);
      setUrl(link.url);
      setModuleId(link.moduleId);
      setFavicon(link.favicon || '');
    } else {
      setName('');
      setUrl('');
      setModuleId(modules[0]?.id || '');
      setFavicon('');
    }
  }, [link, modules]);

  // 输入 URL 后自动获取 Favicon
  const handleUrlBlur = async () => {
    if (!url.trim()) return;
    try {
      setLoadingFavicon(true);
      // 先尝试后端 API
      const res = await fetch(`/api/favicon?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const data = await res.text();
        if (data) { setFavicon(data); return; }
      }
    } catch {
      // API 不可用，使用前端 fallback
    }
    // 前端 fallback：使用图标服务
    try {
      const hostname = new URL(url).hostname;
      setFavicon(`https://favicon.im/${hostname}`);
    } catch {
      // URL 格式无效
    } finally {
      setLoadingFavicon(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !url.trim() || !moduleId) return;
    const linkData = { name: name.trim(), url: url.trim(), moduleId, favicon };
    if (isEdit && link) {
      await updateLink(link.id, linkData);
    } else {
      await createLink(linkData);
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-[400px] max-w-[90vw] rounded-2xl p-6"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
            {isEdit ? '编辑链接' : '新建链接'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:opacity-80">
            <X size={20} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        <div className="space-y-4">
          {/* URL 输入 */}
          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              网站地址 (URL)
            </label>
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setFavicon(''); }}
                onBlur={handleUrlBlur}
                placeholder="https://example.com"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none pr-10"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--glass-border)',
                }}
              />
              {loadingFavicon && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 size={16} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
                </div>
              )}
            </div>
          </div>

          {/* 网站名称 */}
          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              网站名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入网站名称"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{
                background: 'var(--input-bg)',
                color: 'var(--text-primary)',
                border: '1px solid var(--glass-border)',
              }}
            />
          </div>

          {/* Favicon 预览 */}
          {favicon && (
            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>图标预览：</span>
              <img
                src={favicon.startsWith('data:') ? favicon : favicon}
                alt="favicon"
                className="w-8 h-8 rounded"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          )}

          {/* 所属模块 */}
          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              所属模块
            </label>
            <select
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none cursor-pointer"
              style={{
                background: 'var(--input-bg)',
                color: 'var(--text-primary)',
                border: '1px solid var(--glass-border)',
              }}
            >
              {modules.map((mod) => (
                <option key={mod.id} value={mod.id} style={{ background: 'var(--bg-secondary)' }}>
                  {mod.icon} {mod.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm"
              style={{
                background: 'var(--glass-bg)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--glass-border)',
              }}
            >
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || !url.trim() || !moduleId}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50"
              style={{ background: 'var(--accent)' }}
            >
              保存
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
