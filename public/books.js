let books = [];
let editId = null;

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => '&#' + c.charCodeAt(0) + ';');
}

async function load() {
  const r = await fetch('/api/books');
  if (r.status == 401) { location = '/login.html'; return; }
  books = await r.json();
  let h = '';
  books.forEach((b, i) => {
    h += `<tr>
      <td>${esc(b.title)}</td><td>${esc(b.author)}</td><td>${b.price}</td><td>${b.qty}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="edit(${i})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="del(${b.id})">Delete</button>
      </td></tr>`;
  });
  list.innerHTML = h;
}

function edit(i) {
  bt.value = books[i].title;
  ba.value = books[i].author;
  bp.value = books[i].price;
  bq.value = books[i].qty;
  editId = books[i].id;
}

async function del(id) {
  if (!confirm('Delete this book?')) return;
  const r = await fetch('/api/books/' + id, { method: 'DELETE' });
  show(r, await r.json());
  load();
}

f.onsubmit = async e => {
  e.preventDefault();
  const body = { title: bt.value.trim(), author: ba.value.trim(), price: bp.value, qty: bq.value };
  const r = await fetch(editId ? '/api/books/' + editId : '/api/books', {
    method: editId ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  show(r, await r.json());
  if (r.ok) { f.reset(); editId = null; load(); }
};

function show(r, d) {
  msg.textContent = d.message || d.error;
  msg.className = r.ok ? 'text-success' : 'text-danger';
}

load();