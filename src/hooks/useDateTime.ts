import { useState, useEffect } from 'react';

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

function formatDate(date: Date, dateFormat: string): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const pad = (n: number) => String(n).padStart(2, '0');

  switch (dateFormat) {
    case 'YYYY年M月D日':
      return `${year}年${month}月${day}日`;
    case 'YYYY/MM/DD':
      return `${year}/${pad(month)}/${pad(day)}`;
    case 'MM/DD/YYYY':
      return `${pad(month)}/${pad(day)}/${year}`;
    case 'DD/MM/YYYY':
      return `${pad(day)}/${pad(month)}/${year}`;
    default:
      return `${year}年${month}月${day}日`;
  }
}

function formatTime(date: Date, showSeconds: boolean): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  if (showSeconds) {
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}`;
}

export function useDateTime(
  dateFormat: string = 'YYYY年M月D日',
  showSeconds: boolean = true,
  showWeekday: boolean = true
): string {
  const [dateTime, setDateTime] = useState(() => {
    const now = new Date();
    return buildDateTimeString(now, dateFormat, showSeconds, showWeekday);
  });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDateTime(buildDateTimeString(now, dateFormat, showSeconds, showWeekday));
    };

    update();

    // 如果显示秒，每秒更新；否则每分钟更新
    const interval = setInterval(update, showSeconds ? 1000 : 60000);

    return () => clearInterval(interval);
  }, [dateFormat, showSeconds, showWeekday]);

  return dateTime;
}

function buildDateTimeString(
  date: Date,
  dateFormat: string,
  showSeconds: boolean,
  showWeekday: boolean
): string {
  const dateStr = formatDate(date, dateFormat);
  const timeStr = formatTime(date, showSeconds);
  const weekday = showWeekday ? ` ${WEEKDAYS[date.getDay()]}` : '';
  return `${dateStr}${weekday} ${timeStr}`;
}
