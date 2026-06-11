import type { Env, NavModule, NavLink } from '../../_shared/types';
import { jsonResponse, errorResponse, requireAuth, stripHtml } from '../../_shared/utils';

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'PUT, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
  }

  const { env, params } = context;
  const id = params.id as string;

  if (context.request.method === 'PUT') {
    const auth = await requireAuth(context.request, env);
    if (!auth.authorized) {
      return errorResponse('未授权', 401);
    }

    try {
      const body = await context.request.json() as { name?: string; icon?: string; order?: number; collapsed?: boolean };
      const raw = await env.NAVI_DATA.get('modules');
      const modules: NavModule[] = raw ? JSON.parse(raw) : [];

      const index = modules.findIndex(m => m.id === id);
      if (index === -1) {
        return errorResponse('模块不存在', 404);
      }

      if (body.name !== undefined) modules[index].name = stripHtml(String(body.name));
      if (body.icon !== undefined) modules[index].icon = stripHtml(String(body.icon));
      if (body.order !== undefined) modules[index].order = Number(body.order);
      if (body.collapsed !== undefined) modules[index].collapsed = Boolean(body.collapsed);

      await env.NAVI_DATA.put('modules', JSON.stringify(modules));
      return jsonResponse(modules[index]);
    } catch {
      return errorResponse('无效的请求数据', 400);
    }
  }

  if (context.request.method === 'DELETE') {
    const auth = await requireAuth(context.request, env);
    if (!auth.authorized) {
      return errorResponse('未授权', 401);
    }

    const rawModules = await env.NAVI_DATA.get('modules');
    const modules: NavModule[] = rawModules ? JSON.parse(rawModules) : [];

    const moduleIndex = modules.findIndex(m => m.id === id);
    if (moduleIndex === -1) {
      return errorResponse('模块不存在', 404);
    }

    modules.splice(moduleIndex, 1);
    await env.NAVI_DATA.put('modules', JSON.stringify(modules));

    // 同时删除该模块下所有链接
    const rawLinks = await env.NAVI_DATA.get('links');
    const links: NavLink[] = rawLinks ? JSON.parse(rawLinks) : [];
    const remainingLinks = links.filter(l => l.moduleId !== id);
    await env.NAVI_DATA.put('links', JSON.stringify(remainingLinks));

    return jsonResponse({ success: true });
  }

  return errorResponse('方法不允许', 405);
};
