import type { Env, NavLink } from '../../_shared/types';
import { jsonResponse, errorResponse, requireAuth, stripHtml, validateUrl } from '../../_shared/utils';

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
      const body = await context.request.json() as { moduleId?: string; name?: string; url?: string; favicon?: string; order?: number };
      const raw = await env.NAVI_DATA.get('links');
      const links: NavLink[] = raw ? JSON.parse(raw) : [];

      const index = links.findIndex(l => l.id === id);
      if (index === -1) {
        return errorResponse('链接不存在', 404);
      }

      if (body.name !== undefined) links[index].name = stripHtml(String(body.name));
      if (body.url !== undefined) {
        if (!validateUrl(body.url)) {
          return errorResponse('URL格式无效', 400);
        }
        links[index].url = stripHtml(String(body.url));
      }
      if (body.moduleId !== undefined) links[index].moduleId = stripHtml(String(body.moduleId));
      if (body.favicon !== undefined) links[index].favicon = stripHtml(String(body.favicon));
      if (body.order !== undefined) links[index].order = Number(body.order);

      await env.NAVI_DATA.put('links', JSON.stringify(links));
      return jsonResponse(links[index]);
    } catch {
      return errorResponse('无效的请求数据', 400);
    }
  }

  if (context.request.method === 'DELETE') {
    const auth = await requireAuth(context.request, env);
    if (!auth.authorized) {
      return errorResponse('未授权', 401);
    }

    const raw = await env.NAVI_DATA.get('links');
    const links: NavLink[] = raw ? JSON.parse(raw) : [];

    const index = links.findIndex(l => l.id === id);
    if (index === -1) {
      return errorResponse('链接不存在', 404);
    }

    links.splice(index, 1);
    await env.NAVI_DATA.put('links', JSON.stringify(links));
    return jsonResponse({ success: true });
  }

  return errorResponse('方法不允许', 405);
};
