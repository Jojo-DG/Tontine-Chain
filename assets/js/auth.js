function safeJsonParse(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch (_) {
    return fallback;
  }
}

// NOTE: `var` (et non `let`) évite les erreurs TDZ si un autre script
// touche ces variables globales avant leur initialisation.
var accessToken = localStorage.getItem('tontine_access_token');
var refreshToken = localStorage.getItem('tontine_refresh_token');
var currentUser = safeJsonParse(localStorage.getItem('tontine_user') || 'null', null);

function setCurrentUser(user) {
  currentUser = user || null;
  localStorage.setItem('tontine_user', JSON.stringify(currentUser));
  document.querySelector('meta[name="user-role"]')?.setAttribute('content', currentUser?.role || 'USER');
  return currentUser;
}

function updateCurrentUser(partial) {
  if (!partial) return currentUser;
  const next = { ...(currentUser || {}), ...partial };
  return setCurrentUser(next);
}

async function fetchMe() {
  if (!accessToken) return null;
  const res = await fetch(`${CONFIG.API_BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    let msg = data.message || 'Erreur inattendue';
    if (Array.isArray(msg)) msg = msg[0];
    throw { code: data.error || 'UNAUTHORIZED', message: msg, status: res.status };
  }
  const payload = data.data || data;
  return setCurrentUser(payload);
}

async function ensureUser() {
  if (currentUser && currentUser.id) return currentUser;
  return await fetchMe();
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    let msg = data.message || 'Erreur inattendue';
    if (Array.isArray(msg)) msg = msg[0];
    throw { code: data.error || 'API_ERROR', message: msg };
  }
  return data;
}

async function login(phone, password) {
  const res = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password })
  });
  const data = await handleResponse(res);
  
  // Adapté si l'API retourne directement les tokens ou enveloppé dans data
  const payload = data.data || data;
  
  accessToken = payload.access_token;
  refreshToken = payload.refresh_token;
  setCurrentUser(payload.user);
  
  localStorage.setItem('tontine_access_token', accessToken);
  localStorage.setItem('tontine_refresh_token', refreshToken);
  
  return payload;
}

async function verifyOtp(phone, otp) {
  const res = await fetch(`${CONFIG.API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp })
  });
  const data = await handleResponse(res);
  return data.data || data;
}

async function refreshAccessToken() {
  if (!refreshToken) throw new Error('No refresh token');
  const res = await fetch(`${CONFIG.API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });
  const data = await handleResponse(res);
  const payload = data.data || data;
  
  accessToken = payload.access_token;
  refreshToken = payload.refresh_token;
  
  localStorage.setItem('tontine_access_token', accessToken);
  localStorage.setItem('tontine_refresh_token', refreshToken);
  
  return payload;
}

async function logout() {
  try {
    await fetch(`${CONFIG.API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    });
  } catch(e) {}
  
  accessToken = null;
  refreshToken = null;
  setCurrentUser(null);
  localStorage.removeItem('tontine_access_token');
  localStorage.removeItem('tontine_refresh_token');
  localStorage.removeItem('tontine_user');
  
  window.location.href = 'connexion.html';
}

function isAuthenticated() { return !!accessToken; }
function getUser() { return currentUser; }
function getRole() { return currentUser?.role; }