import { useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { useStore } from '@/store/useStore';
import ModuleCard from './ModuleCard';

export default function MainContent() {
  const {
    modules, links, searchQuery, reorderModules, isAdmin,
    activeModuleId, setActiveModuleId,
    scrollToModuleId, setScrollToModuleId,
  } = useStore();

  const scrollRef = useRef<HTMLElement>(null);
  const isProgramScrollRef = useRef(false);

  // 根据搜索词过滤链接
  const getFilteredLinks = useCallback((moduleId: string) => {
    const modLinks = links.filter((l) => l.moduleId === moduleId);
    if (!searchQuery) return modLinks;
    const q = searchQuery.toLowerCase();
    return modLinks.filter(
      (l) => l.name.toLowerCase().includes(q) || l.url.toLowerCase().includes(q)
    );
  }, [links, searchQuery]);

  // 过滤掉没有匹配链接的模块（搜索时）
  const visibleModules = searchQuery
    ? modules.filter((mod) => getFilteredLinks(mod.id).length > 0)
    : modules;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = modules.findIndex((m) => m.id === active.id);
      const newIndex = modules.findIndex((m) => m.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = [...modules];
        const [moved] = newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, moved);
        reorderModules(newOrder.map((m) => m.id));
      }
    },
    [modules, reorderModules]
  );

  // 用 IntersectionObserver 监测可见模块，更新侧边栏高亮
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgramScrollRef.current) return;
        // 找到最靠近顶部的可见模块
        let topId = '';
        let topY = Infinity;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const rect = entry.boundingClientRect;
            const containerRect = container.getBoundingClientRect();
            const y = rect.top - containerRect.top;
            if (y < topY) {
              topY = y;
              topId = entry.target.id.replace('module-', '');
            }
          }
        }
        if (topId) {
          setActiveModuleId(topId);
        }
      },
      {
        root: container,
        rootMargin: '-10% 0px -60% 0px',
        threshold: 0,
      }
    );

    // 延迟观察，等 DOM 渲染完成
    const timer = setTimeout(() => {
      for (const mod of visibleModules) {
        const el = document.getElementById(`module-${mod.id}`);
        if (el) observer.observe(el);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [visibleModules, setActiveModuleId]);

  // 侧边栏点击 → 滚动到对应模块
  useEffect(() => {
    if (!scrollToModuleId) return;

    // 立即清除，避免重复触发
    const targetId = scrollToModuleId;
    setScrollToModuleId('');

    const container = scrollRef.current;
    const modEl = document.getElementById(`module-${targetId}`);
    if (!container || !modEl) return;

    const containerRect = container.getBoundingClientRect();
    const modRect = modEl.getBoundingClientRect();
    const targetScroll = container.scrollTop + modRect.top - containerRect.top - 16;

    isProgramScrollRef.current = true;
    container.scrollTo({ top: targetScroll, behavior: 'smooth' });

    // 滚动结束后恢复 IntersectionObserver 更新
    const timer = setTimeout(() => {
      isProgramScrollRef.current = false;
    }, 700);
    return () => clearTimeout(timer);
  }, [scrollToModuleId, setScrollToModuleId]);

  return (
    <main ref={scrollRef} className="flex-1 overflow-y-auto h-full pb-20 md:pb-6">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6">
        {isAdmin ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="space-y-6">
              {visibleModules.map((mod, index) => (
                <motion.div
                  key={mod.id}
                  id={`module-${mod.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <ModuleCard module={mod} filteredLinks={getFilteredLinks(mod.id)} />
                </motion.div>
              ))}
            </div>
          </DndContext>
        ) : (
          <div className="space-y-6">
            {visibleModules.map((mod, index) => (
              <motion.div
                key={mod.id}
                id={`module-${mod.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <ModuleCard module={mod} filteredLinks={getFilteredLinks(mod.id)} />
              </motion.div>
            ))}
          </div>
        )}

        {visibleModules.length === 0 && !searchQuery && isAdmin && (
          <div className="flex justify-center">
            <button
              onClick={() => useStore.getState().setEditingModule({ id: '', name: '', icon: '📁', order: modules.length, collapsed: false })}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm transition-colors"
              style={{ color: 'var(--accent)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
            >
              + 新增模块
            </button>
          </div>
        )}

        {isAdmin && visibleModules.length > 0 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => useStore.getState().setEditingModule({ id: '', name: '', icon: '📁', order: modules.length, collapsed: false })}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm transition-colors"
              style={{ color: 'var(--text-muted)', background: 'var(--glass-bg)', border: '1px dashed var(--glass-border)' }}
            >
              + 新增模块
            </button>
          </div>
        )}

        {visibleModules.length === 0 && !isAdmin && (
          <div
            className="text-center py-20 text-lg"
            style={{ color: 'var(--text-muted)' }}
          >
            {searchQuery ? '未找到匹配的网站' : '暂无导航模块'}
          </div>
        )}
      </div>
    </main>
  );
}
