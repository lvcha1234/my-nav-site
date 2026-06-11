import type { Env, NavModule } from '../../_shared/types';
import { ensureInitialData } from '../../_shared/init-data';
import { jsonResponse, errorResponse, requireAuth, generateId, stripHtml } from '../../_shared/utils';

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
  }

  const { env } = context;

  if (context.request.method === 'GET') {
    await ensureInitialData(env.NAVI_DATA);
    const raw = await env.NAVI_DATA.get('modules');
    const modules: NavModule[] = raw ? JSON.parse(raw) : [];
    return jsonResponse(modules);
  }

  if (context.request.method === 'POST') {
    const auth = await requireAuth(context.request, env);
    if (!auth.authorized) {
      return errorResponse('未授权', 401);
    }

    try {
      const body = await context.request.json() as { name?: string; icon?: string; collapsed?: boolean };
      const { name, icon, collapsed } = body;

      if (!name || typeof name !== 'string') {
        return errorResponse('模块名称不能为空', 400);
      }

      const raw = await env.NAVI_DATA.get('modules');
      const modules: NavModule[] = raw ? JSON.parse(raw) : [];

      const newModule: NavModule = {
        id: generateId(),
        name: stripHtml(name),
        icon: icon ? stripHtml(String(icon)) : '📁',
        order: modules.length + 1,
        collapsed: collapsed ?? false,
      };

      modules.push(newModule);
      await env.NAVI_DATA.put('modules', JSON.stringify(modules));
      return jsonResponse(newModule, 201);
    } catch {
      return errorResponse('无效的请求数据', 400);
    }
  }

  return errorResponse('方法不允许', 405);
};
