function formatMontant(xof) {
  if (!xof && xof !== 0) return '—';
  return new Intl.NumberFormat('fr-FR').format(xof) + ' XOF';
}

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

function countdown(isoDeadline) {
  if (!isoDeadline) return '—';
  const deadline = new Date(isoDeadline).getTime();
  const now = Date.now();
  const diff = deadline - now;
  if (diff <= 0) return 'Expiré';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return `J-${days}`;
}

function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  const colors = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-blue-600 text-white',
    warning: 'bg-amber-500 text-white'
  };
  toast.className = `toast ${colors[type]} px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in pointer-events-auto`;
  
  const iconMap = { success: 'check-circle', error: 'alert-circle', info: 'info', warning: 'alert-triangle' };
  toast.innerHTML = `
    <i data-lucide="${iconMap[type]}" class="w-5 h-5"></i>
    <span class="font-medium">${message}</span>
  `;
  
  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.5s ease';
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

function showSpinner(buttonEl) {
  buttonEl.disabled = true;
  buttonEl.setAttribute('data-original-text', buttonEl.textContent);
  const spinner = document.createElement('span');
  spinner.className = 'spinner';
  buttonEl.prepend(spinner);
  buttonEl.textContent = ' ' + buttonEl.textContent;
}

function hideSpinner(buttonEl, text) {
  buttonEl.disabled = false;
  const spinner = buttonEl.querySelector('.spinner');
  if (spinner) spinner.remove();
  buttonEl.textContent = text || buttonEl.getAttribute('data-original-text') || 'Valider';
}

function showBanner(containerEl, message, type = 'error') {
  const old = containerEl.querySelector('.alert-banner');
  if (old) old.remove();

  const banner = document.createElement('div');
  const colors = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800'
  };
  
  banner.className = `alert-banner border-l-4 p-4 rounded-lg flex items-start gap-3 mb-6 ${colors[type] || colors.error}`;
  const iconMap = { error: 'x-circle', success: 'check-circle', warning: 'alert-triangle' };
  
  banner.innerHTML = `
    <i data-lucide="${iconMap[type] || 'info'}" class="w-5 h-5 mt-0.5"></i>
    <div class="flex-1 text-sm font-medium">${message}</div>
    <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-gray-600">×</button>
  `;
  
  containerEl.prepend(banner);
  if (window.lucide) lucide.createIcons();
}

function showConfirm(title, message, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4';
  overlay.innerHTML = `
    <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
      <h3 class="text-xl font-bold mb-2">${title}</h3>
      <p class="text-gray-600 mb-6">${message}</p>
      <div class="flex gap-3">
        <button id="confirm-cancel" class="flex-1 px-4 py-2 border rounded-xl font-medium hover:bg-gray-50">Annuler</button>
        <button id="confirm-ok" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">Confirmer</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById('confirm-cancel').onclick = () => overlay.remove();
  document.getElementById('confirm-ok').onclick = () => { overlay.remove(); onConfirm(); };
}

const ERROR_MESSAGES = {
  'INVALID_CREDENTIALS': 'Le numéro ou le mot de passe est incorrect.',
  'PHONE_ALREADY_EXISTS': 'Ce numéro de téléphone est déjà utilisé par un autre compte.',
  'ACCOUNT_DISABLED': 'Votre compte a été suspendu. Contactez le support.',
  'UNAUTHORIZED': 'Veuillez vous connecter pour accéder à cette page.',
  'SESSION_EXPIRED': 'Votre session a expiré. Veuillez vous reconnecter.',
  'OTP_INVALID': 'Le code de vérification est incorrect.',
  'OTP_EXPIRED': 'Le code de vérification a expiré. Demandez-en un nouveau.',
  'INSUFFICIENT_FUNDS': 'Votre solde est insuffisant pour cette opération.',
  'TONTINE_FULL': 'Cette tontine est complète.',
  'INVITATION_CODE_INVALID': 'Le code d\'invitation est incorrect.',
  'NETWORK_ERROR': 'Impossible de joindre le serveur. Vérifiez votre connexion.',
};

function getFriendlyMessage(error) {
  if (!error) return 'Erreur inconnue';
  const code = error.code || error.error || (typeof error === 'string' ? error : null);
  return ERROR_MESSAGES[code] || error.message || 'Une erreur est survenue.';
}