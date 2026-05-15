// Ce script sera chargé sur chaque page dashboard.
// Il vérifie l'authentification et injecte le header + sidebar.

(function() {
  if (!isAuthenticated()) {
    window.location.href = 'connexion.html';
    return;
  }

  const role = getRole();
  const user = getUser();

  // Injection du header
  const header = document.createElement('header');
  header.className = 'flex items-center justify-between px-6 h-16 bg-[--primary] text-white fixed top-0 left-0 right-0 z-30';
  header.innerHTML = `
    <div class="flex items-center gap-2">
      <button id="menu-toggle" class="md:hidden p-2"><i data-lucide="menu" class="w-5 h-5"></i></button>
      <i data-lucide="wallet" class="w-6 h-6 text-[--accent]"></i>
      <span class="font-bold text-lg">Tontine Chain</span>
    </div>
    <div class="flex items-center gap-4">
      ${role === 'ORGANIZER' ? `<span class="flex items-center gap-1 text-xs bg-white/20 rounded-full px-3 py-1"><i data-lucide="crown" class="w-4 h-4"></i> Organisateur</span>` : ''}
      <button id="notif-btn" class="relative"><i data-lucide="bell" class="w-5 h-5"></i><span id="unread-badge" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center hidden">0</span></button>
      <a href="profil.html" class="p-1"><i data-lucide="settings" class="w-5 h-5"></i></a>
    </div>
  `;
  document.body.prepend(header);

  // Sidebar navigation
  const sidebar = document.createElement('nav');
  sidebar.id = 'sidebar';
  sidebar.className = 'hidden md:flex flex-col w-64 bg-[--sidebar-bg] border-r border-[--sidebar-border] fixed top-16 bottom-0 left-0 overflow-y-auto z-20';
  const currentPage = window.location.pathname.split('/').pop();

  const navItems = [];
  if (role === 'ORGANIZER') {
    navItems.push({ href: 'creer-tontine.html', icon: 'plus-circle', label: 'Créer une tontine' });
  }
  navItems.push(
    { href: role === 'ORGANIZER' ? 'dashboard-admin.html' : 'dashboard-membre.html', icon: 'home', label: 'Mes tontines' },
    { href: 'portefeuille.html', icon: 'wallet', label: 'Portefeuille' },
    { href: 'historique.html', icon: 'list', label: 'Historique' },
    { href: 'notifications.html', icon: 'bell', label: 'Notifications' },
    { href: 'profil.html', icon: 'user', label: 'Mon profil' }
  );

  let navHTML = '<div class="p-4 space-y-1 flex flex-col flex-1">';
  navItems.forEach(item => {
    const isActive = currentPage === item.href;
    navHTML += `<a href="${item.href}" class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-[--sidebar-active-bg] text-[--sidebar-active-color]' : 'text-gray-700 hover:bg-gray-100'}"><i data-lucide="${item.icon}" class="w-5 h-5"></i> ${item.label}</a>`;
  });
  navHTML += `</div>`;
  navHTML += `<div class="p-4 border-t border-[--sidebar-border]"><button id="logout-btn" class="flex items-center gap-2 text-[--destructive] font-medium w-full"><i data-lucide="log-out" class="w-5 h-5"></i> Déconnexion</button></div>`;
  sidebar.innerHTML = navHTML;
  document.body.appendChild(sidebar);

  // Mobile drawer
  const drawer = document.createElement('div');
  drawer.id = 'mobile-drawer';
  drawer.className = 'drawer';
  drawer.innerHTML = navHTML;
  document.body.appendChild(drawer);
  const overlay = document.createElement('div');
  overlay.id = 'menu-overlay';
  overlay.className = 'overlay';
  document.body.appendChild(overlay);

  // Event listeners
  document.getElementById('menu-toggle')?.addEventListener('click', () => {
    drawer.classList.toggle('open');
    overlay.classList.toggle('active');
  });
  overlay.addEventListener('click', () => {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
  });
  document.getElementById('logout-btn')?.addEventListener('click', logout);
  // also bind in drawer
  drawer.querySelector('#logout-btn')?.addEventListener('click', logout);

  // Mettre à jour le lucide icons après insertion
  if (window.lucide) lucide.createIcons();
  document.querySelector('meta[name="user-role"]')?.setAttribute('content', role);
})();