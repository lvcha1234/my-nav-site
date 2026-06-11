import type { Env } from '../_shared/types';
import { jsonResponse, errorResponse, checkRateLimit } from '../_shared/utils';

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
  }

  if (context.request.method !== 'GET') {
    return errorResponse('方法不允许', 405);
  }

  const { env } = context;
  const ip = context.request.headers.get('CF-Connecting-IP') || 'unknown';

  const allowed = await checkRateLimit(env.NAVI_DATA, ip, 20);
  if (!allowed) {
    return errorResponse('请求过于频繁，请稍后再试', 429);
  }

  const url = new URL(context.request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return errorResponse('缺少 url 参数', 400);
  }

  let domain: string;
  try {
    domain = new URL(targetUrl).hostname;
  } catch {
    return errorResponse('URL格式无效', 400);
  }

  // 查 KV 缓存
  const cacheKey = `favicon:${domain}`;
  const cached = await env.NAVI_DATA.get(cacheKey);
  if (cached) {
    return jsonResponse({ favicon: cached, cached: true });
  }

  // 缓存未命中，尝试多个图标服务
  const faviconServices = [
    `https://favicon.im/${domain}`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
  ];

  for (const faviconUrl of faviconServices) {
    try {
      const response = await fetch(faviconUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });

      if (!response.ok) continue;

      const arrayBuffer = await response.arrayBuffer();
      if (arrayBuffer.byteLength < 10) continue;

      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';
      for (const byte of bytes) {
        binary += String.fromCharCode(byte);
      }
      const base64 = btoa(binary);

      const contentType = response.headers.get('Content-Type') || 'image/png';
      const dataUri = `data:${contentType};base64,${base64}`;

      // 存入 KV 缓存，TTL 30天
      await env.NAVI_DATA.put(cacheKey, dataUri, { expirationTtl: 30 * 24 * 3600 });

      return jsonResponse({ favicon: dataUri, cached: false });
    } catch {
      continue;
    }
  }

  return errorResponse('获取图标失败', 502);
};
