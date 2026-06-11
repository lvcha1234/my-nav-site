import type { Env } from '../../_shared/types';
import { jsonResponse, errorResponse, checkRateLimit, hashPassword, verifyPassword, signJWT } from '../../_shared/utils';

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
  }

  if (context.request.method !== 'POST') {
    return errorResponse('方法不允许', 405);
  }

  const { env } = context;
  const ip = context.request.headers.get('CF-Connecting-IP') || 'unknown';

  const allowed = await checkRateLimit(env.NAVI_DATA, ip, 5);
  if (!allowed) {
    return errorResponse('请求过于频繁，请稍后再试', 429);
  }

  try {
    const body = await context.request.json() as { password?: string };
    const { password } = body;

    if (!password || typeof password !== 'string' || password.length < 6) {
      return errorResponse('密码至少6位', 400);
    }

    const existingHash = await env.NAVI_DATA.get('admin_password_hash');

    if (!existingHash) {
      // 首次设置密码
      const hashed = await hashPassword(password);
      await env.NAVI_DATA.put('admin_password_hash', hashed);
      const token = await signJWT({ role: 'admin' }, env.JWT_SECRET, 7);
      return jsonResponse({ token, isFirstSetup: true });
    }

    // 验证密码
    const valid = await verifyPassword(password, existingHash);
    if (!valid) {
      return errorResponse('密码错误', 401);
    }

    const token = await signJWT({ role: 'admin' }, env.JWT_SECRET, 7);
    return jsonResponse({ token, isFirstSetup: false });
  } catch {
    return errorResponse('无效的请求数据', 400);
  }
};
