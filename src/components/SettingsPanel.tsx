import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Upload } from 'lucide-react';
import { useStore } from '@/store/useStore';

const fontOptions = ['Outfit', 'Noto Sans SC', 'system-ui'];
const fontSizeOptions = [
  { value: 'text-2xl', label: '小' },
  { value: 'text-3xl', label: '中' },
  { value: 'text-4xl', label: '大' },
];
const dateFormatOptions = [
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
];

export default function SettingsPanel() {
  const { config, showSettings, setShowSettings, updateConfig, exportData, importData } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!showSettings) return null;

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      importData(text);
    };
    reader.readAsText(file);
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-[380px] max-w-[90vw] z-50 overflow-y-auto"
      style={{
        background: 'var(--bg-sidebar)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderLeft: '1px solid var(--glass-border)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--glass-border)' }}>
        <h2 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>设置</h2>
        <button onClick={() => setShowSettings(false)} className="p-1 rounded-lg hover:opacity-80">
          <X size={20} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* 站点设置 */}
        <Section title="站点设置">
          <Field label="标题">
            <Input value={config.title} onChange={(v) => updateConfig({ title: v })} />
          </Field>
          <Field label="字体">
            <Select
              value={config.fontFamily}
              options={fontOptions}
              onChange={(v) => updateConfig({ fontFamily: v })}
            />
          </Field>
          <Field label="字号">
            <Select
              value={config.fontSize}
              options={fontSizeOptions.map((o) => o.value)}
              labels={fontSizeOptions.map((o) => o.label)}
              onChange={(v) => updateConfig({ fontSize: v })}
            />
          </Field>
        </Section>

        {/* 日期时间 */}
        <Section title="日期时间">
          <Field label="日期格式">
            <Select
              value={config.dateFormat}
              options={dateFormatOptions.map((o) => o.value)}
              labels={dateFormatOptions.map((o) => o.label)}
              onChange={(v) => updateConfig({ dateFormat: v })}
            />
          </Field>
          <Field label="显示秒">
            <Toggle checked={config.showSeconds} onChange={(v) => updateConfig({ showSeconds: v })} />
          </Field>
          <Field label="显示星期">
            <Toggle checked={config.showWeekday} onChange={(v) => updateConfig({ showWeekday: v })} />
          </Field>
        </Section>

        {/* 外观 */}
        <Section title="外观">
          <Field label="背景图 URL">
            <div className="flex gap-2">
              <Input value={config.bgImage} onChange={(v) => updateConfig({ bgImage: v })} />
              {config.bgImage && (
                <button
                  onClick={() => updateConfig({ bgImage: '' })}
                  className="px-2 rounded-lg text-xs"
                  style={{ background: 'var(--glass-bg)', color: 'var(--text-muted)' }}
                >
                  删除
                </button>
              )}
            </div>
          </Field>
          <Field label="默认搜索引擎">
            <Select
              value={config.defaultEngine}
              options={['bing', 'baidu']}
              labels={['必应', '百度']}
              onChange={(v) => updateConfig({ defaultEngine: v as 'bing' | 'baidu' })}
            />
          </Field>
          <Field label="主题">
            <Select
              value={config.theme}
              options={['dark', 'light', 'eye-care', 'system']}
              labels={['深色', '白天', '护眼', '跟随系统']}
              onChange={(v) => updateConfig({ theme: v as SiteConfigTheme })}
            />
          </Field>
        </Section>

        {/* 数据 */}
        <Section title="数据">
          <div className="flex gap-3">
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
              style={{ background: 'var(--glass-bg)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}
            >
              <Download size={14} /> 导出
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
              style={{ background: 'var(--glass-bg)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}
            >
              <Upload size={14} /> 导入
            </button>
            <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          </div>
        </Section>
      </div>
    </motion.div>
  );
}

type SiteConfigTheme = 'dark' | 'light' | 'eye-care' | 'system';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <div className="flex-1 max-w-[200px]">{children}</div>
    </div>
  );
}

function Input({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-1.5 rounded-lg text-sm outline-none"
      style={{
        background: 'var(--input-bg)',
        color: 'var(--text-primary)',
        border: '1px solid var(--glass-border)',
      }}
    />
  );
}

function Select({ value, options, labels, onChange }: {
  value: string; options: string[]; labels?: string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-1.5 rounded-lg text-sm outline-none cursor-pointer"
      style={{
        background: 'var(--input-bg)',
        color: 'var(--text-primary)',
        border: '1px solid var(--glass-border)',
      }}
    >
      {options.map((opt, i) => (
        <option key={opt} value={opt} style={{ background: 'var(--bg-secondary)' }}>
          {labels ? labels[i] : opt}
        </option>
      ))}
    </select>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-10 h-5 rounded-full transition-colors"
      style={{ background: checked ? 'var(--accent)' : 'var(--glass-border)' }}
    >
      <div
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
        style={{ left: checked ? '22px' : '2px' }}
      />
    </button>
  );
}
