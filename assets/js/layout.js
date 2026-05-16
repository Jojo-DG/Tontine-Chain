// Ce script gère l'injection du layout premium (Header + Sidebar)
(function() {
  if (!isAuthenticated()) {
    window.location.href = 'connexion.html';
    return;
  }

  const role = getRole();
  const user = getUser();
  const currentPage = window.location.pathname.split('/').pop();

  document.body.classList.add('has-app-shell');

  // Overlay mobile
  const overlay = document.createElement('div');
  overlay.className = 'app-overlay';
  overlay.id = 'app-overlay';
  document.body.appendChild(overlay);

  // --- Header Injection ---
  const header = document.createElement('header');
  header.className = 'app-header';
  header.innerHTML = `
    <div class="app-header__left">
      <button id="menu-toggle" class="icon-btn" type="button" aria-label="Ouvrir le menu">
        <i data-lucide="menu" class="w-6 h-6"></i>
      </button>
      <a href="${role === 'ORGANIZER' ? 'dashboard-admin.html' : 'dashboard-membre.html'}" class="app-brand">
        <span class="app-brand__mark"><i data-lucide="layers" class="w-6 h-6"></i></span>
        <span class="text-primary" style="font-size:18px;">Tontine <span class="text-accent">Chain</span></span>
      </a>
    </div>

    <div class="app-header__right">
      <span class="app-chip" aria-label="Réseau actif">
        <span style="width:10px;height:10px;border-radius:999px;background:var(--accent);display:inline-block;box-shadow:0 0 0 6px rgba(16,185,129,0.12);"></span>
        Polygon
      </span>

      <a href="notifications.html" class="icon-btn" aria-label="Notifications">
        <i data-lucide="bell" class="w-6 h-6"></i>
        <span class="notif-dot" aria-hidden="true"></span>
      </a>

      <span class="app-divider" aria-hidden="true"></span>

      <a href="profil.html" class="profile-link" aria-label="Accéder au profil">
        <span class="profile-meta">
          <span class="profile-name">${user?.full_name || 'Utilisateur'}</span>
          <span class="profile-role">${role === 'ORGANIZER' ? 'Organisateur' : 'Membre'}</span>
        </span>
        <span class="app-avatar">${user?.full_name?.charAt(0) || 'U'}</span>
      </a>
    </div>
  `;
  document.body.prepend(header);

  // --- Sidebar Injection ---
  const sidebar = document.createElement('aside');
  sidebar.id = 'sidebar';
  sidebar.className = 'app-sidebar';
  
  const navItems = [
    { href: role === 'ORGANIZER' ? 'dashboard-admin.html' : 'dashboard-membre.html', icon: 'grid', label: 'Dashboard' },
    { href: 'profil.html', icon: 'user', label: 'Profil' },
    { href: 'portefeuille.html', icon: 'wallet', label: 'Portefeuille' },
    { href: 'paiement.html', icon: 'credit-card', label: 'Paiement' },
    { href: 'historique.html', icon: 'activity', label: 'Historique' },
    { href: 'notifications.html', icon: 'bell', label: 'Alertes' },
  ];

  if (role === 'ORGANIZER') {
    navItems.splice(1, 0, { href: 'creer-tontine.html', icon: 'plus-circle', label: 'Créer une tontine' });
  } else {
    navItems.splice(1, 0, { href: 'rejoindre.html', icon: 'users', label: 'Rejoindre' });
  }

  let navHTML = `
    <div class="app-sidebar__nav">
      <p class="app-sidebar__title">Menu principal</p>
  `;

  navItems.forEach(item => {
    const isActive = currentPage === item.href;
    navHTML += `
      <a href="${item.href}" class="nav-link ${isActive ? 'active' : ''}" ${isActive ? 'aria-current="page"' : ''}>
        <i data-lucide="${item.icon}" class="w-5 h-5"></i>
        <span>${item.label}</span>
      </a>
    `;
  });

  navHTML += `
    </div>
    <div class="app-sidebar__footer">
      <div class="sidebar-help">
        <p class="sidebar-help__kicker">Besoin d'aide ?</p>
        <p class="sidebar-help__text">Comprendre les cycles, les échéances et la preuve on-chain.</p>
        <a href="presentation.html" class="sidebar-help__link">Voir le guide</a>
      </div>
      <button id="logout-btn" class="logout-btn" type="button">
        <i data-lucide="log-out" class="w-5 h-5"></i>
        Déconnexion
      </button>
    </div>
  `;

  sidebar.innerHTML = navHTML;
  document.body.appendChild(sidebar);

  // Initialisation des icônes
  if (window.lucide) lucide.createIcons();

  // Event Listeners
  document.getElementById('logout-btn')?.addEventListener('click', logout);

  function closeMobileNav() {
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-open');
  }

  function openMobileNav() {
    sidebar.classList.add('is-open');
    overlay.classList.add('is-open');
  }

  document.getElementById('menu-toggle')?.addEventListener('click', () => {
    const isOpen = sidebar.classList.contains('is-open');
    if (isOpen) closeMobileNav();
    else openMobileNav();
  });

  overlay.addEventListener('click', closeMobileNav);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });
})();