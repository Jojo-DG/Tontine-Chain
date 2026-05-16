async function apiFetch(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (typeof accessToken !== 'undefined' && accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    // 401 : Session expirée ou non autorisée
    if (response.status === 401) {
      const canRefresh = typeof refreshAccessToken === 'function'
        && typeof refreshToken !== 'undefined'
        && !!refreshToken;

      if (canRefresh && !options._isRetry) {
        try {
          await refreshAccessToken();
          return apiFetch(endpoint, { ...options, _isRetry: true });
        } catch (e) {
          throw { code: 'SESSION_EXPIRED', message: 'Votre session a expiré. Veuillez vous reconnecter.', status: 401 };
        }
      } else {
        throw { code: canRefresh ? 'SESSION_EXPIRED' : 'UNAUTHORIZED', message: 'Veuillez vous connecter pour accéder à cette page.', status: 401 };
      }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      let msg = data.message || 'Une erreur inattendue est survenue.';
      if (Array.isArray(msg)) msg = msg[0]; // Prend la première erreur de validation
      throw { code: data.error || 'API_ERROR', message: msg, status: response.status };
    }
    
    // Normalise le retour pour toujours avoir .data
    return data && data.data !== undefined ? data : { data };
    
  } catch (err) {
    if (err.code) throw err;
    
    console.error("Erreur réseau ou serveur :", err);
    throw { 
      code: 'NETWORK_ERROR', 
      message: 'Impossible de joindre le serveur. Vérifiez votre connexion ou réessayez dans quelques instants.' 
    };
  }
}