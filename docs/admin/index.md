---
layout: home
---

# 旺财笔记管理后台

> 请使用授权密码登录

<details>
<summary>🔐 登录</summary>

```html
<form id="login-form" style="margin: 20px 0;">
  <input type="password" id="admin-password" placeholder="管理员密码" style="padding:8px;width:200px;" />
  <button type="submit" style="padding:8px;">登录</button>
</form>
<p id="login-status" style="color: red;"></p>

<script>
const API_BASE = 'https://wangcai-admin.zhbcher.workers.dev';
const ADMIN_PASSWORD = 'wangcai-admin-2026';

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const pwd = document.getElementById('admin-password').value;
  if (pwd === ADMIN_PASSWORD) {
    localStorage.setItem('admin-auth', 'true');
    document.getElementById('login-status').textContent = '✅ 已登录';
    await loadNotes();
  } else {
    document.getElementById('login-status').textContent = '❌ 密码错误';
  }
});

if (localStorage.getItem('admin-auth') === 'true') {
  document.getElementById('login-status').textContent = '✅ 已登录';
  loadNotes();
}

async function loadNotes() {
  const resp = await fetch(`${API_BASE}/api/notes`, {
    headers: { 'Authorization': 'Bearer wangcai-admin-2026' }
  });
  const data = await resp.json();
  if (data.success) renderTable(data.data);
  else alert('加载失败: ' + data.error);
}

function renderTable(notes) {
  const tbody = document.createElement('tbody');
  notes.forEach(note => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${note.path}</td>
      <td>${note.title}</td>
      <td>${note.status}</td>
      <td>${note.review || '-'}</td>
      <td>${new Date(note.updated_at * 1000).toLocaleString()}</td>
      <td>
        <button onclick="updateStatus('${note.id}', 'public')">发布</button>
        <button onclick="updateStatus('${note.id}', 'private')">内部</button>
        <button onclick="updateStatus('${note.id}', 'draft')">重编</button>
        <button onclick="deleteNote('${note.id}')">删除</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  document.querySelector('#notes-table tbody').replaceChildren(...tbody.children);
  document.getElementById('notes-table').style.display = 'table';
}

async function updateStatus(id, newStatus) {
  const resp = await fetch(`${API_BASE}/api/notes/${id}/status`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer wangcai-admin-2026', 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus, review: newStatus === 'draft' ? 'rejected' : 'approved' })
  });
  const data = await resp.json();
  if (data.success) { alert('状态已更新'); loadNotes(); }
  else alert('更新失败: ' + data.error);
}

async function deleteNote(id) {
  if (confirm('确定删除？')) await updateStatus(id, 'rejected');
}
</script>

<style>
#notes-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
#notes-table th, #notes-table td { border: 1px solid #ddd; padding: 8px; }
#notes-table th { background: #f5f5f5; }
</style>
</details>

<details>
<summary>📋 笔记列表（登录后显示）</summary>

<table id="notes-table" style="display:none;">
  <thead>
    <tr>
      <th>路径</th>
      <th>标题</th>
      <th>状态</th>
      <th>审核</th>
      <th>更新时间</th>
      <th>操作</th>
    </tr>
  </thead>
  <tbody></tbody>
</table>
</details>
