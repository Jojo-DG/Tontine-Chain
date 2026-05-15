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
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
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
  const banner = document.createElement('div');
  const colors = {
    error: 'bg-red-50 border-red-400 text-red-700',
    success: 'bg-green-50 border-green-400 text-green-700',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-700'
  };
  banner.className = `border px-4 py-3 rounded relative mb-4 ${colors[type] || colors.error}`;
  banner.innerHTML = `<span class="block sm:inline">${message}</span><span class="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onclick="this.parentElement.remove()">×</span>`;
  containerEl.prepend(banner);
}