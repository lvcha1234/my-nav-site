import type { Env } from '../../_shared/types';
import { jsonResponse } from '../../_shared/utils';

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
  }

  if (context.request.method !== 'GET') {
    return jsonResponse({ error: '方法不允许' }, 405);
  }

  const { env } = context;
  const existingHash = await env.NAVI_DATA.get('admin_password_hash');

  return jsonResponse({ needsSetup: !existingHash });
};
