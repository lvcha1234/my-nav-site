import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function LoginPanel() {
  const { setShowLogin, needsSetup, login } = useStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    if (needsSetup && password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    setError('');

    const success = await login(password);

    setLoading(false);
    if (!success) {
      setError(needsSetup ? '设置失败，请重试' : '密码错误');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={() => setShowLogin(false)}
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
        {/* 标题 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
            {needsSetup ? '设置管理员密码' : '管理员登录'}
          </h2>
          <button onClick={() => setShowLogin(false)} className="p-1 rounded-lg hover:opacity-80">
            <X size={20} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={needsSetup ? '请设置密码' : '请输入密码'}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{
                background: 'var(--input-bg)',
                color: 'var(--text-primary)',
                border: '1px solid var(--glass-border)',
              }}
              autoFocus
            />
          </div>

          {needsSetup && (
            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="确认密码"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--glass-border)',
                }}
              />
            </div>
          )}

          {error && (
            <div className="text-sm text-red-400 text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim() || (needsSetup && password !== confirmPassword)}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-opacity disabled:opacity-50"
            style={{ background: 'var(--accent)' }}
          >
            {loading ? '处理中...' : needsSetup ? '设置密码' : '登录'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
