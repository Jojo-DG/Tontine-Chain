async function apiFetch(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  try {
    let response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    if (response.status === 401) {
      // Try refresh
      try {
        await refreshAccessToken();
        headers['Authorization'] = `Bearer ${accessToken}`;
        response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
          ...options,
          headers
        });
      } catch (refreshErr) {
        logout();
        throw new Error('Session expirée');
      }
    }
    const data = await response.json();
    if (!data.success) {
      throw { code: data.error.code, message: data.error.message };
    }
    return data;
  } catch (err) {
    if (err.code) throw err; // métier
    throw { code: 'NETWORK_ERROR', message: 'Problème de connexion — réessayez' };
  }
}