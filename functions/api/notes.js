export async function onRequestGet(context) {
  const { env } = context;
  const auth = context.request.headers.get('Authorization');
  if (!auth || auth !== 'Bearer wangcai-admin-2026') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  try {
    const result = await env.DB.prepare('SELECT * FROM notes ORDER BY updated_at DESC').all();
    return new Response(JSON.stringify({ success: true, data: result.results }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  const { env } = context;
  const auth = context.request.headers.get('Authorization');
  if (!auth || auth !== 'Bearer wangcai-admin-2026') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  try {
    const { status, review, id, path: notePath, title, content } = await context.request.json();
    const now = Math.floor(Date.now() / 1000);
    if (status && review && id) {
      const stmt = env.DB.prepare('UPDATE notes SET status = ?, review = ?, updated_at = ? WHERE id = ?').bind(status, review, now, id);
      await stmt.run();
      return new Response(JSON.stringify({ success: true }));
    }
    if (id && title && content) {
      const stmt = env.DB.prepare('INSERT OR REPLACE INTO notes (id, path, title, content, status, review, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, notePath || '', title, content, status || 'draft', review || 'pending', now, now);
      await stmt.run();
      return new Response(JSON.stringify({ success: true }));
    }
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
