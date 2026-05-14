// 旺财笔记管理后台 API - Cloudflare Worker
// 绑定 D1 数据库: wangcai-notes

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const auth = request.headers.get('Authorization');
    if (!auth || auth !== 'Bearer wangcai-admin-2026') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization,Content-Type'
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

    try {
      if (path === '/api/notes' && request.method === 'GET') {
        const result = await env.DB.prepare('SELECT * FROM notes ORDER BY updated_at DESC').all();
        return new Response(JSON.stringify({ success: true, data: result.results }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (path.match(/^\/api\/notes\/([^\/]+)\/status$/) && request.method === 'POST') {
        const { status, review } = await request.json();
        const noteId = path.split('/')[3];
        const now = Math.floor(Date.now() / 1000);
        const stmt = env.DB.prepare('UPDATE notes SET status = ?, review = ?, updated_at = ? WHERE id = ?').bind(status, review, now, noteId);
        await stmt.run();
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (path === '/api/notes' && request.method === 'POST') {
        const { id, path: notePath, title, content, status = 'draft', review = 'pending' } = await request.json();
        const now = Math.floor(Date.now() / 1000);
        const stmt = env.DB.prepare('INSERT OR REPLACE INTO notes (id, path, title, content, status, review, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, notePath, title, content, status, review, now, now);
        await stmt.run();
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      return new Response('Not Found', { status: 404 });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  }
};
