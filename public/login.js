async function send(url) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: u.value.trim(), password: p.value })
  });
  const d = await r.json();
  if (r.ok && url == '/api/login') {
    location = '/books';
  } else {
    msg.textContent = d.message || d.error;
    msg.className = r.ok ? 'mt-3 text-center text-success' : 'mt-3 text-center text-danger';
  }
}