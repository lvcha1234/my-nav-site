import type { Env, NavLink } from '../../_shared/types';
import { ensureInitialData } from '../../_shared/init-data';
import { jsonResponse, errorResponse, requireAuth, generateId, stripHtml, validateUrl } from '../../_shared/utils';

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
  }

  const { env } = context;

  if (context.request.method === 'GET') {
    await ensureInitialData(env.NAVI_DATA);
    const raw = await env.NAVI_DATA.get('links');
    const links: NavLink[] = raw ? JSON.parse(raw) : [];
    return jsonResponse(links);
  }

  if (context.request.method === 'POST') {
    const auth = await requireAuth(context.request, env);
    if (!auth.authorized) {
      return errorResponse('未授权', 401);
    }

    try {
      const body = await context.request.json() as { moduleId?: string; name?: string; url?: string; favicon?: string };
      const { moduleId, name, url, favicon } = body;

      if (!moduleId || typeof moduleId !== 'string') {
        return errorResponse('模块ID不能为空', 400);
      }
      if (!name || typeof name !== 'string') {
        return errorResponse('链接名称不能为空', 400);
      }
      if (!url || typeof url !== 'string' || !validateUrl(url)) {
        return errorResponse('URL格式无效', 400);
      }

      // 验证模块存在
      const rawModules = await env.NAVI_DATA.get('modules');
      const modules = rawModules ? JSON.parse(rawModules) : [];
      if (!modules.some((m: { id: string }) => m.id === moduleId)) {
        return errorResponse('模块不存在', 400);
      }

      const raw = await env.NAVI_DATA.get('links');
      const links: NavLink[] = raw ? JSON.parse(raw) : [];

      const moduleLinks = links.filter(l => l.moduleId === moduleId);
      const newLink: NavLink = {
        id: generateId(),
        moduleId: stripHtml(moduleId),
        name: stripHtml(name),
        url: stripHtml(url),
        favicon: favicon ? stripHtml(String(favicon)) : undefined,
        order: moduleLinks.length + 1,
      };

      links.push(newLink);
      await env.NAVI_DATA.put('links', JSON.stringify(links));
      return jsonResponse(newLink, 201);
    } catch {
      return errorResponse('无效的请求数据', 400);
    }
  }

  return errorResponse('方法不允许', 405);
};
