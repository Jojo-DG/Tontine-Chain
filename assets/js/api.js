async function apiFetch(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (typeof accessToken !== 'undefined' && accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    let response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (response.status === 401 && typeof refreshAccessToken === 'function') {
      try {
        await refreshAccessToken();
        headers['Authorization'] = `Bearer ${accessToken}`;
        response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, { ...options, headers });
      } catch (e) {
        logout();
        throw new Error('Session expirée');
      }
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      let msg = data.message || 'Erreur inattendue';
      if (Array.isArray(msg)) msg = msg[0];
      throw { code: data.error || 'API_ERROR', message: msg };
    }
    
    // Si l'API renvoie { data: ... }, on retourne ça, sinon on enveloppe dans { data: data } pour rester compatible avec le code existant qui fait res.data
    if (data && data.data !== undefined) return data;
    return { data };
    
  } catch (err) {
    if (err.code) throw err; // métier
    throw { code: 'NETWORK_ERROR', message: 'Problème de connexion au serveur' };
  }
}