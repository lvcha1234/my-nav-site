import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light' | 'eye-care' | 'system';

function getSystemTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme(theme: Theme = 'system') {
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light' | 'eye-care'>(() => {
    if (theme === 'system') return getSystemTheme();
    return theme;
  });

  useEffect(() => {
    let actual: 'dark' | 'light' | 'eye-care';

    if (theme === 'system') {
      actual = getSystemTheme();
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? 'dark' : 'light';
        setResolvedTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      };
      mediaQuery.addEventListener('change', handler);
      setResolvedTheme(actual);
      document.documentElement.setAttribute('data-theme', actual);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      actual = theme;
      setResolvedTheme(actual);
      document.documentElement.setAttribute('data-theme', actual);
    }
  }, [theme]);

  return {
    theme,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    isEyeCare: resolvedTheme === 'eye-care',
  };
}
