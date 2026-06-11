import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { NavModule } from '@/types';

interface EditModuleModalProps {
  module: NavModule | null;
  onClose: () => void;
}

export default function EditModuleModal({ module, onClose }: EditModuleModalProps) {
  const { createModule, updateModule } = useStore();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');

  const isEdit = !!module?.id;

  useEffect(() => {
    if (module) {
      setName(module.name);
      setIcon(module.icon);
    } else {
      setName('');
      setIcon('📁');
    }
  }, [module]);

  const handleSave = async () => {
    if (!name.trim()) return;
    if (isEdit && module) {
      await updateModule(module.id, { name, icon });
    } else {
      await createModule({ name, icon, collapsed: false });
    }
    onClose();
  };

  return (
    <AnimatePresence>
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
          className="w-[360px] max-w-[90vw] rounded-2xl p-6"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
              {isEdit ? '编辑模块' : '新建模块'}
            </h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:opacity-80">
              <X size={20} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                模块名称
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="输入模块名称"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--glass-border)',
                }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                图标 (Emoji)
              </label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="输入 emoji 图标"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--glass-border)',
                }}
              />
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
                disabled={!name.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                style={{ background: 'var(--accent)' }}
              >
                保存
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
