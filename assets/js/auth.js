let accessToken = null;
let refreshToken = null;
let currentUser = null;

async function login(phone, password) {
  const res = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password })
  });
  const data = await res.json();
  if (!data.success) throw { code: data.error.code, message: data.error.message };
  accessToken = data.data.access_token;
  refreshToken = data.data.refresh_token;
  currentUser = data.data.user;
  // Mettre à jour meta user-role
  document.querySelector('meta[name="user-role"]')?.setAttribute('content', currentUser.role);
  return data.data;
}

async function verifyOtp(phone, otp) {
  const res = await fetch(`${CONFIG.API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp })
  });
  const data = await res.json();
  if (!data.success) throw { code: data.error.code, message: data.error.message };
  return data.data;
}

async function refreshAccessToken() {
  if (!refreshToken) throw new Error('No refresh token');
  const res = await fetch(`${CONFIG.API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });
  const data = await res.json();
  if (!data.success) throw { code: data.error.code, message: data.error.message };
  accessToken = data.data.access_token;
  refreshToken = data.data.refresh_token; // rotation
  return data.data;
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
  currentUser = null;
  window.location.href = 'connexion.html';
}

function isAuthenticated() { return !!accessToken; }
function getUser() { return currentUser; }
function getRole() { return currentUser?.role; }