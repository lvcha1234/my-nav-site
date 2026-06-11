import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { ChevronDown, ChevronUp, Pencil, Trash2, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import SiteItem from './SiteItem';
import type { NavModule, NavLink } from '@/types';

interface ModuleCardProps {
  module: NavModule;
  filteredLinks?: NavLink[];
}

export default function ModuleCard({ module, filteredLinks }: ModuleCardProps) {
  const { links, isAdmin, updateModule, deleteModule, setEditingLink } = useStore();
  const [collapsed, setCollapsed] = useState(module.collapsed);

  const moduleLinks = (filteredLinks || links)
    .filter((l) => l.moduleId === module.id)
    .sort((a, b) => a.order - b.order);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    updateModule(module.id, { collapsed: next });
  };

  const handleEditModule = (e: React.MouseEvent) => {
    e.stopPropagation();
    useStore.getState().setEditingModule(module);
  };

  const handleDeleteModule = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`确定删除模块「${module.name}」及其所有链接？`)) {
      deleteModule(module.id);
    }
  };

  const handleAddLink = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingLink({ id: '', moduleId: module.id, name: '', url: '', order: 0 });
  };

  return (
    <div
      className="rounded-2xl p-4 group"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
    >
      {/* 标题行 */}
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={toggleCollapse}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{module.icon}</span>
          <h2
            className="text-base font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            {module.name}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          {isAdmin && (
            <div className="flex items-center gap-1 mr-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleAddLink}
                className="p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors"
                style={{ color: 'var(--accent)', background: 'var(--glass-bg)' }}
                title="添加链接"
              >
                <Plus size={14} />
                <span className="hidden sm:inline">添加</span>
              </button>
              <button
                onClick={handleEditModule}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)' }}
                title="编辑模块"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={handleDeleteModule}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)' }}
                title="删除模块"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
          {collapsed ? (
            <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />
          ) : (
            <ChevronUp size={18} style={{ color: 'var(--text-muted)' }} />
          )}
        </div>
      </div>

      {/* 内容区 */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <SortableContext
              items={moduleLinks.map((l) => l.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                {moduleLinks.map((link) => (
                  <SiteItem key={link.id} link={link} />
                ))}
              </div>
            </SortableContext>

            {moduleLinks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  暂无链接
                </span>
                {isAdmin && (
                  <button
                    onClick={handleAddLink}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm transition-colors"
                    style={{ color: 'var(--accent)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
                  >
                    <Plus size={14} />
                    添加链接
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
