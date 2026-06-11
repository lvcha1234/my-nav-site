import type { Env, SiteConfig } from '../_shared/types';
import { ensureInitialData } from '../_shared/init-data';
import { jsonResponse, errorResponse, requireAuth, stripHtml } from '../_shared/utils';

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
  }

  const { env } = context;

  if (context.request.method === 'GET') {
    await ensureInitialData(env.NAVI_DATA);
    const raw = await env.NAVI_DATA.get('config');
    const config = raw ? JSON.parse(raw) : {};
    return jsonResponse(config);
  }

  if (context.request.method === 'PUT') {
    const auth = await requireAuth(context.request, env);
    if (!auth.authorized) {
      return errorResponse('未授权', 401);
    }

    try {
      const body = await context.request.json() as Partial<SiteConfig>;
      const raw = await env.NAVI_DATA.get('config');
      const current: SiteConfig = raw ? JSON.parse(raw) : {};

      if (body.title !== undefined) current.title = stripHtml(String(body.title));
      if (body.fontFamily !== undefined) current.fontFamily = stripHtml(String(body.fontFamily));
      if (body.fontSize !== undefined) current.fontSize = stripHtml(String(body.fontSize));
      if (body.dateFormat !== undefined) current.dateFormat = stripHtml(String(body.dateFormat));
      if (body.showSeconds !== undefined) current.showSeconds = Boolean(body.showSeconds);
      if (body.showWeekday !== undefined) current.showWeekday = Boolean(body.showWeekday);
      if (body.bgImage !== undefined) current.bgImage = stripHtml(String(body.bgImage));
      if (body.defaultEngine !== undefined && ['bing', 'baidu'].includes(body.defaultEngine)) current.defaultEngine = body.defaultEngine;
      if (body.theme !== undefined && ['dark', 'light', 'eye-care', 'system'].includes(body.theme)) current.theme = body.theme;

      await env.NAVI_DATA.put('config', JSON.stringify(current));
      return jsonResponse(current);
    } catch {
      return errorResponse('无效的请求数据', 400);
    }
  }

  return errorResponse('方法不允许', 405);
};
