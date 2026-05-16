const ERROR_MESSAGES = {
  // Auth
  'INVALID_CREDENTIALS': 'Le numéro ou le mot de passe est incorrect.',
  'PHONE_ALREADY_EXISTS': 'Ce numéro de téléphone est déjà utilisé par un autre compte.',
  'ACCOUNT_DISABLED': 'Votre compte a été suspendu. Contactez le support.',
  'UNAUTHORIZED': 'Veuillez vous connecter pour accéder à cette page.',
  'SESSION_EXPIRED': 'Votre session a expiré. Veuillez vous reconnecter.',
  'OTP_INVALID': 'Le code de vérification est incorrect.',
  'OTP_EXPIRED': 'Le code de vérification a expiré. Demandez-en un nouveau.',
  
  // Wallets
  'INSUFFICIENT_FUNDS': 'Votre solde est insuffisant pour effectuer cette transaction.',
  'WALLET_ALREADY_EXISTS': 'Vous possédez déjà un wallet Polygon.',
  
  // Tontines
  'TONTINE_FULL': 'Désolé, cette tontine a déjà atteint son nombre maximum de membres.',
  'INVITATION_CODE_INVALID': 'Le code d\'invitation est incorrect ou a expiré.',
  'ALREADY_MEMBER': 'Vous faites déjà partie de cette tontine.',
  'NOT_YOUR_TURN': 'Ce n\'est pas encore votre tour de recevoir la cagnotte.',
  'CONTRIBUTION_ALREADY_PAID': 'Vous avez déjà payé votre cotisation pour ce cycle.',
  
  // Global
  'NETWORK_ERROR': 'Impossible de joindre le serveur. Vérifiez votre connexion internet.',
  'API_ERROR': 'Une erreur serveur est survenue. Nos techniciens sont prévenus.',
  'NOT_FOUND': 'La ressource demandée est introuvable.'
};

function getFriendlyMessage(error) {
  if (typeof error === 'string') return ERROR_MESSAGES[error] || error;
  const code = error.code || error.error;
  return ERROR_MESSAGES[code] || error.message || 'Une erreur inconnue est survenue.';
}
