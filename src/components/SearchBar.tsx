import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function SearchBar() {
  const { config, searchQuery, setSearchQuery } = useStore();
  const [engine, setEngine] = useState<'bing' | 'baidu'>(config.defaultEngine);
  const [input, setInput] = useState(searchQuery);

  const handleSearch = useCallback(() => {
    const q = input.trim();
    if (!q) return;
    const url = engine === 'bing'
      ? `https://www.bing.com/search?q=${encodeURIComponent(q)}`
      : `https://www.baidu.com/s?wd=${encodeURIComponent(q)}`;
    window.open(url, '_blank');
  }, [input, engine]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleChange = (v: string) => {
    setInput(v);
    setSearchQuery(v);
  };

  const handleClear = () => {
    setInput('');
    setSearchQuery('');
  };

  const toggleEngine = () => {
    setEngine((prev) => (prev === 'bing' ? 'baidu' : 'bing'));
  };

  return (
    <div className="relative w-[500px] max-w-[90vw] h-[44px]">
      <div
        className="flex items-center h-full rounded-[22px] px-4 gap-2"
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
        }}
      >
        <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />

        <input
          type="text"
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="搜索网站或输入关键词..."
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: 'var(--text-primary)' }}
        />

        {input && (
          <button onClick={handleClear} className="flex-shrink-0 hover:opacity-80">
            <X size={16} style={{ color: 'var(--text-muted)' }} />
          </button>
        )}

        <button
          onClick={toggleEngine}
          className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium transition-colors"
          style={{
            background: 'var(--accent)',
            color: '#fff',
          }}
          title={engine === 'bing' ? '必应' : '百度'}
        >
          {engine === 'bing' ? '必应' : '百度'}
        </button>
      </div>
    </div>
  );
}
