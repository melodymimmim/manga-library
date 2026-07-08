const STORAGE_KEY = 'manganotes_app_data';
const THEME_KEY = 'manganotes_theme';
const NOTIFICATION_PROMPT_KEY = 'manganotes_notifications_prompted';
const ACCOUNT_KEY = 'manganotes_account';
const TOKEN_KEY = 'manganotes_token';

const state = {
  mangas: [],
  activeView: 'home',
  selectedMangaId: null,
  activeStatusFilter: null,
  searchTerm: '',
  editingVolumeId: null,
  detailEditing: false,
  history: [],
  notifications: [],
  sessionUser: null
};

const dom = {
  homeView: document.getElementById('homeView'),
  profileView: document.getElementById('profileView'),
  addView: document.getElementById('addView'),
  detailView: document.getElementById('detailView'),
  homeGrid: document.getElementById('homeGrid'),
  profileList: document.getElementById('profileList'),
  profileSummary: document.getElementById('profileSummary'),
  searchInput: document.getElementById('searchInput'),
  addMangaBtn: document.getElementById('addMangaBtn'),
  cancelAddBtn: document.getElementById('cancelAddBtn'),
  deleteBtn: document.getElementById('deleteBtn'),
  backToHomeBtn: document.getElementById('backToHomeBtn'),
  toast: document.getElementById('toast'),
  homeBtn: document.getElementById('homeBtn'),
  notificationsBtn: document.getElementById('notificationsBtn'),
  notificationsPanel: document.getElementById('notificationsPanel'),
  notificationsList: document.getElementById('notificationsList'),
  closeNotificationsBtn: document.getElementById('closeNotificationsBtn'),
  profileBtn: document.getElementById('profileBtn'),
  settingsBtn: document.getElementById('settingsBtn'),
  settingsView: document.getElementById('settingsView'),
  settingsUsername: document.getElementById('settingsUsername'),
  settingsPassword: document.getElementById('settingsPassword'),
  settingsSaveLogin: document.getElementById('settingsSaveLogin'),
  settingsLoginBtn: document.getElementById('settingsLoginBtn'),
  settingsLogoutBtn: document.getElementById('settingsLogoutBtn'),
  settingsStatus: document.getElementById('settingsStatus'),
  toggleThemeBtn: document.getElementById('toggleThemeBtn'),
  profileStatusButtons: Array.from(document.querySelectorAll('#profileView .status-btn')),
  statusButtons: Array.from(document.querySelectorAll('#detailView .status-btn')),
  addForm: document.getElementById('addForm'),
  clearFormBtn: document.getElementById('clearFormBtn'),
  formTitle: document.getElementById('formTitle'),
  formAuthor: document.getElementById('formAuthor'),
  formStatus: document.getElementById('formStatus'),
  formGenres: document.getElementById('formGenres'),
  formChapter: document.getElementById('formChapter'),
  formLastRead: document.getElementById('formLastRead'),
  formNextRelease: document.getElementById('formNextRelease'),
  formComments: document.getElementById('formComments'),
  formCoverFile: document.getElementById('formCoverFile'),
  formCoverPreview: document.getElementById('formCoverPreview'),
  formRatingInput: document.getElementById('formRatingInput'),
  detailCover: document.getElementById('detailCover'),
  detailCoverFile: document.getElementById('detailCoverFile'),
  detailTitle: document.getElementById('detailTitle'),
  detailAuthor: document.getElementById('detailAuthor'),
  detailStatus: document.getElementById('detailStatus'),
  detailGenres: document.getElementById('detailGenres'),
  detailChapter: document.getElementById('detailChapter'),
  detailNextRelease: document.getElementById('detailNextRelease'),
  detailLastRead: document.getElementById('detailLastRead'),
  detailCommentsInput: document.getElementById('detailCommentsInput'),
  detailTitleInput: document.getElementById('detailTitleInput'),
  detailAuthorInput: document.getElementById('detailAuthorInput'),
  detailGenresInput: document.getElementById('detailGenresInput'),
  detailChapterInput: document.getElementById('detailChapterInput'),
  detailNextReleaseInput: document.getElementById('detailNextReleaseInput'),
  detailLastReadInput: document.getElementById('detailLastReadInput'),
  detailStarDisplay: document.getElementById('detailStarDisplay'),
  detailRatingValue: document.getElementById('detailRatingValue'),
  detailRatingRange: document.getElementById('detailRatingRange'),
  openEditBtn: document.getElementById('openEditBtn'),
  finishEditBtn: document.getElementById('finishEditBtn'),
  finishEditPanel: document.getElementById('finishEditPanel'),
  addVolumeBtn: document.getElementById('addVolumeBtn'),
  volumeGrid: document.getElementById('volumeGrid'),
  sameAuthorGrid: document.getElementById('sameAuthorGrid'),
  volumeDetailPanel: document.getElementById('volumeDetailPanel'),
  volumeDetailTitle: document.getElementById('volumeDetailTitle'),
  volumeNumberInput: document.getElementById('volumeNumberInput'),
  volumeNameInput: document.getElementById('volumeNameInput'),
  addVolumeBtnBottom: document.getElementById('addVolumeBtnBottom'),
  formSeriesSuggestion: document.getElementById('formSeriesSuggestion'),
  closeVolumeDetail: document.getElementById('closeVolumeDetail'),
  volumeCoverFile: document.getElementById('volumeCoverFile'),
  volumeCoverPreview: document.getElementById('volumeCoverPreview'),
  volumeNotes: document.getElementById('volumeNotes'),
  volumeComments: document.getElementById('volumeComments'),
  saveVolumeBtn: document.getElementById('saveVolumeBtn')
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getInitialMangas() {
  return [
    {
      id: createId(),
      title: 'Beyond the ocean door',
      author: 'Amisha Sathi',
      status: 'ongoing',
      genres: 'fantasy, adventure',
      chapter: '4',
      lastRead: '2026-06-13',
      nextRelease: '2026-07-02',
      rating: 4,
      comments: 'I think.. yeah..',
      notes: 'A dreamy manga with mysterious doors and secrets.',
      cover: '',
      volumes: [
        {
          id: createId(),
          title: 'Volume 1',
          cover: '',
          notes: 'Started the first volume and loved the atmosphere.',
          comments: 'Already hooked by the first chapter.'
        }
      ],
      createdAt: Date.now()
    }
  ];
}

function migrateNestedVolumes() {
  const existingIds = new Set(state.mangas.map(item => item.id));
  const newEntries = [];

  state.mangas.forEach((manga) => {
    if (Array.isArray(manga.volumes)) {
      manga.volumes.forEach((volume) => {
        if (!volume || existingIds.has(volume.id)) return;
        const child = {
          id: volume.id || createId(),
          title: volume.title || '',
          author: manga.author || '',
          status: manga.status || 'ongoing',
          genres: manga.genres || '',
          chapter: volume.number || '',
          lastRead: manga.lastRead || '',
          nextRelease: manga.nextRelease || '',
          rating: 0,
          comments: volume.comments || '',
          notes: volume.notes || '',
          cover: volume.cover || '',
          parentId: manga.id,
          createdAt: Date.now()
        };
        existingIds.add(child.id);
        newEntries.push(child);
      });
      delete manga.volumes;
    }
  });

  if (newEntries.length) {
    state.mangas = [...state.mangas, ...newEntries];
  }
}

async function requestJson(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    headers['x-session-token'] = token;
  }
  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

async function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed.mangas)) {
        state.mangas = parsed.mangas;
      }
      if (Array.isArray(parsed.notifications)) {
        state.notifications = parsed.notifications;
      }
    } catch (error) {
      console.warn('Failed to parse saved data:', error);
    }
  }

  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    try {
      const data = await requestJson('/api/me');
      state.sessionUser = data.user?.username || null;
      if (Array.isArray(data.data?.mangas)) {
        state.mangas = data.data.mangas;
      }
      if (Array.isArray(data.data?.notifications)) {
        state.notifications = data.data.notifications;
      }
    } catch (error) {
      console.warn('Unable to sync with server:', error);
    }
  }

  if (state.mangas.length === 0) {
    state.mangas = [];
  }
  migrateNestedVolumes();
  const theme = localStorage.getItem(THEME_KEY);
  if (theme === 'light') {
    document.body.classList.add('light-mode');
  }
}

async function saveState() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    try {
      await requestJson('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mangas: state.mangas, notifications: state.notifications })
      });
      return;
    } catch (error) {
      console.warn('Failed to sync to server:', error);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ mangas: state.mangas, notifications: state.notifications }));
}

function saveAccountInfo(username, password, saveLogin) {
  const account = { username, password, saveLogin };
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
}

function loadAccountInfo() {
  const stored = localStorage.getItem(ACCOUNT_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (error) {
    return null;
  }
}

function updateAccountUI() {
  const account = loadAccountInfo();
  const username = localStorage.getItem('manganotes_current_user') || account?.username || '';
  if (username) {
    dom.settingsUsername.value = username;
    dom.settingsPassword.value = account?.password || '';
    dom.settingsSaveLogin.checked = account?.saveLogin !== false;
    dom.settingsStatus.textContent = `Signed in as ${username}`;
  } else {
    dom.settingsUsername.value = '';
    dom.settingsPassword.value = '';
    dom.settingsSaveLogin.checked = false;
    dom.settingsStatus.textContent = 'Not signed in';
  }
}

function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.style.opacity = '1';
  setTimeout(() => {
    dom.toast.style.opacity = '0';
  }, 1600);
}

function updateNotificationsBadge() {
  const unreadCount = state.notifications.filter(item => !item.read).length;
  dom.notificationsBtn.classList.toggle('has-notifications', unreadCount > 0);
  dom.notificationsBtn.dataset.count = unreadCount > 0 ? unreadCount : '';
}

function getReleaseReminder(manga) {
  if (!manga?.nextRelease) return null;
  const releaseDate = new Date(`${manga.nextRelease}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((releaseDate - today) / 86400000);
  if (diffDays === 7) {
    return {
      kind: 'week',
      message: `${manga.title} is coming soon in 1 week.`
    };
  }
  if (diffDays === 0) {
    return {
      kind: 'today',
      message: `${manga.title} is releasing today.`
    };
  }
  return null;
}

function syncReleaseNotifications() {
  const existingKeys = new Set(state.notifications.map(item => `${item.mangaId}:${item.releaseDate}:${item.kind}`));
  let created = 0;

  state.mangas.forEach((manga) => {
    const reminder = getReleaseReminder(manga);
    if (!reminder) return;
    const key = `${manga.id}:${manga.nextRelease}:${reminder.kind}`;
    if (existingKeys.has(key)) return;

    state.notifications.unshift({
      id: createId(),
      mangaId: manga.id,
      title: manga.title,
      message: reminder.message,
      kind: reminder.kind,
      releaseDate: manga.nextRelease,
      createdAt: Date.now(),
      read: false
    });
    existingKeys.add(key);
    created += 1;
  });

  if (created) {
    saveState();
  }
  renderNotifications();
  updateNotificationsBadge();
}

function renderNotifications() {
  if (!state.notifications.length) {
    dom.notificationsList.innerHTML = '<div class="notifications-empty">No release reminders yet.</div>';
    return;
  }

  dom.notificationsList.innerHTML = state.notifications.map((item) => `
    <div class="notification-item ${item.read ? '' : 'unread'}">
      <div>
        <div class="notification-title">${escapeHtml(item.title)}</div>
        <div class="notification-message">${escapeHtml(item.message)}</div>
        <div class="notification-meta">${item.kind === 'week' ? 'Reminder: 1 week before release' : 'Reminder: release day'}</div>
      </div>
      <button class="notification-dismiss" type="button" data-id="${item.id}" aria-label="Dismiss notification">×</button>
    </div>
  `).join('');

  dom.notificationsList.querySelectorAll('.notification-dismiss').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const id = button.dataset.id;
      state.notifications = state.notifications.filter((item) => item.id !== id);
      saveState();
      renderNotifications();
      updateNotificationsBadge();
    });
  });
}

function toggleNotificationsPanel() {
  const isHidden = dom.notificationsPanel.classList.contains('hidden');
  dom.notificationsPanel.classList.toggle('hidden', !isHidden);
  if (isHidden) {
    renderNotifications();
  }
}

function goHome() {
  setView('home', false);
}

function pushHistory() {
  state.history.push({
    view: state.activeView,
    selectedMangaId: state.selectedMangaId
  });
}

function popHistory() {
  return state.history.pop();
}

function pushViewHistory() {
  pushHistory();
}

function popViewHistory() {
  return popHistory();
}

function setView(view, pushPrevious = true) {
  if (pushPrevious && state.activeView !== view) {
    pushHistory();
  }
  state.activeView = view;
  document.querySelectorAll('.view').forEach(section => {
    section.classList.toggle('active', section.id === `${view}View`);
  });
  dom.homeBtn.classList.toggle('active', view === 'home');
  dom.profileBtn.classList.toggle('active', view === 'profile');
  if (view === 'home') {
    renderHome();
  }
  if (view === 'profile') {
    renderProfile();
  }
  if (view === 'detail' && state.selectedMangaId) {
    renderDetail(state.selectedMangaId);
  }
}

function renderHome() {
  const term = state.searchTerm.trim().toLowerCase();
  const filtered = state.mangas.filter(manga => {
    if (!term) return true;
    return manga.title.toLowerCase().includes(term) || manga.author.toLowerCase().includes(term) || manga.genres?.toLowerCase().includes(term);
  });
  dom.homeGrid.innerHTML = filtered.map(manga => {
    return `
      <article class="card" data-id="${manga.id}">
        <div class="cover-card">
          ${manga.cover ? `<img src="${manga.cover}" alt="${manga.title} cover" />` : `<div class="placeholder">Upload cover in details</div>`}
        </div>
        <div class="card-body">
          <h3 class="card-title">${manga.title}</h3>
          <div class="card-meta">${manga.author ? manga.author : 'Unknown author'}</div>
          <div class="status-tag">${manga.status || 'not tagged'}</div>
        </div>
      </article>
    `;
  }).join('');

  dom.homeGrid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      openDetail(card.dataset.id);
    });
  });
}

function renderProfile() {
  const totals = state.mangas.reduce((acc, manga) => {
    const key = manga.status || 'not tagged';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  dom.profileSummary.innerHTML = `
    ongoing: ${totals['ongoing'] || 0} · completed: ${totals['completed'] || 0} · dropped: ${totals['dropped'] || 0} · plan to read: ${totals['plan to read'] || 0} · not tagged: ${totals['not tagged'] || 0}
  `;
  const list = state.activeStatusFilter ? state.mangas.filter(m => (m.status || 'not tagged') === state.activeStatusFilter) : state.mangas;
  dom.profileList.innerHTML = list.length ? list.map(manga => {
    return `
      <article class="card mini-card" data-id="${manga.id}">
        <div class="cover-card">
          ${manga.cover ? `<img src="${manga.cover}" alt="${manga.title} cover" />` : `<div class="placeholder">No cover yet</div>`}
        </div>
        <div class="card-body">
          <h3 class="card-title">${manga.title}</h3>
          <div class="card-meta">${manga.status || 'not tagged'}</div>
        </div>
      </article>
    `;
  }).join('') : `<div class="empty-state">No books in this status yet.</div>`;

  dom.profileList.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => openDetail(card.dataset.id));
  });
}

function renderFormRating(value = 0) {
  dom.formRatingInput.innerHTML = Array.from({ length: 5 }, (_, idx) => {
    const filled = idx < value ? 'active' : '';
    return `<button type="button" class="${filled}" data-value="${idx + 1}" aria-label="Rate ${idx + 1}">★</button>`;
  }).join('');
  dom.formRatingInput.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      renderFormRating(Number(button.dataset.value));
      dom.formRatingInput.dataset.value = button.dataset.value;
    });
  });
}

function renderSeriesSuggestion(author) {
  delete dom.addForm.dataset.seriesParentId;
  if (!author) {
    dom.formSeriesSuggestion.innerHTML = '';
    return;
  }
  const matches = state.mangas.filter(item => item.author?.toLowerCase() === author.toLowerCase());
  if (!matches.length) {
    dom.formSeriesSuggestion.innerHTML = '';
    return;
  }
  dom.formSeriesSuggestion.innerHTML = `
    <div class="series-suggestion-card">
      <div class="series-suggestion-heading">Matches existing author</div>
      <div class="series-suggestion-list">
        ${matches.map(item => `
          <button type="button" class="series-suggestion-item" data-id="${item.id}">
            <div class="cover-card small-cover">
              ${item.cover ? `<img src="${item.cover}" alt="${item.title} cover" />` : `<div class="placeholder">No cover</div>`}
            </div>
            <div>
              <div class="card-title">${item.title}</div>
              <div class="card-meta">${item.status || 'not tagged'}</div>
            </div>
          </button>
        `).join('')}
      </div>
    </div>
  `;
  dom.formSeriesSuggestion.querySelectorAll('.series-suggestion-item').forEach(button => {
    button.addEventListener('click', () => {
      dom.addForm.dataset.seriesParentId = button.dataset.id;
      dom.formSeriesSuggestion.querySelectorAll('.series-suggestion-item').forEach(item => item.classList.remove('selected'));
      button.classList.add('selected');
      showToast('This entry will be linked to the selected series');
    });
  });
}

function renderRatingStars(container, value, editable = false) {
  const rounded = Number(value) || 0;
  const stars = Array.from({ length: 5 }, (_, idx) => {
    const starValue = idx + 1;
    const halfActive = rounded >= starValue - 0.5 && rounded < starValue;
    if (rounded >= starValue) return `<span class="active" data-value="${starValue}">★</span>`;
    if (halfActive) return `<span class="active" data-value="${starValue}">☆</span>`;
    return `<span data-value="${starValue}">★</span>`;
  });
  container.innerHTML = stars.join('');
  if (editable) {
    container.querySelectorAll('span').forEach(star => {
      star.addEventListener('click', () => {
        const value = Number(star.dataset.value);
        dom.detailRatingRange.value = value.toFixed(1);
        dom.detailRatingValue.textContent = `${value.toFixed(1)}!`;
        renderRatingStars(dom.detailStarDisplay, value, true);
        const manga = state.mangas.find(item => item.id === state.selectedMangaId);
        if (!manga) return;
        manga.rating = value;
        saveState();
      });
    });
  }
}

function autoResizeTextarea(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
}

function setDetailMode(isEditing) {
  state.detailEditing = isEditing;
  document.querySelectorAll('.detail-view-mode').forEach(el => el.classList.toggle('hidden', isEditing));
  document.querySelectorAll('.detail-edit-mode').forEach(el => el.classList.toggle('hidden', !isEditing));
  dom.finishEditPanel.classList.toggle('hidden', !isEditing);
  dom.openEditBtn.classList.toggle('hidden', isEditing);
  dom.detailRatingRange.classList.toggle('hidden', !isEditing);
  if (isEditing) {
    dom.finishEditBtn.textContent = 'Finish edit?';
  } else {
    dom.openEditBtn.textContent = 'Edit?';
  }
}

function renderDetail(mangaId) {
  const manga = state.mangas.find(item => item.id === mangaId);
  if (!manga) return;
  dom.detailCover.innerHTML = manga.cover ? `<img src="${manga.cover}" alt="${manga.title} Cover" />` : `<div class="placeholder">No cover uploaded</div>`;
  dom.detailStatus.innerHTML = `<span class="status-tag">${manga.status || ''}</span>`;
  dom.detailTitle.textContent = manga.title;
  dom.detailAuthor.textContent = manga.author || 'Unknown author';
  dom.detailGenres.textContent = manga.genres || 'No genres added';
  dom.detailChapter.textContent = manga.chapter || 'Not set';
  dom.detailNextRelease.textContent = manga.nextRelease || 'None';
  dom.detailLastRead.textContent = manga.lastRead || 'None';
  dom.detailTitleInput.value = manga.title;
  dom.detailAuthorInput.value = manga.author || '';
  dom.detailGenresInput.value = manga.genres || '';
  dom.detailChapterInput.value = manga.chapter || '';
  dom.detailNextReleaseInput.value = manga.nextRelease || '';
  dom.detailLastReadInput.value = manga.lastRead || '';
  dom.detailCommentsInput.value = manga.comments || '';
  autoResizeTextarea(dom.detailCommentsInput);
  dom.detailRatingRange.value = Number(manga.rating || 0).toFixed(1);
  dom.detailRatingValue.textContent = `${Number(manga.rating || 0).toFixed(1)}!`;
  renderRatingStars(dom.detailStarDisplay, manga.rating || 0, state.detailEditing);
  setDetailMode(false);
  renderVolumeGrid(manga);
  renderSameAuthorGrid(manga);
  syncReleaseNotifications();
}

function renderSameAuthorGrid(manga) {
  if (!manga.author) {
    dom.sameAuthorGrid.innerHTML = `<div class="empty-state">No series author set yet.</div>`;
    return;
  }
  const sameAuthor = state.mangas.filter(item => item.author && item.author.toLowerCase() === manga.author.toLowerCase() && item.id !== manga.id);
  if (sameAuthor.length === 0) {
    dom.sameAuthorGrid.innerHTML = `<div class="empty-state">No other books from this author.</div>`;
    return;
  }
  dom.sameAuthorGrid.innerHTML = `
    <div class="section-head">
      <h3>Same author series</h3>
    </div>
    <div class="same-author-list">
      ${sameAuthor.map(item => `
        <article class="same-author-card" data-id="${item.id}">
          <div class="cover-card small-cover">
            ${item.cover ? `<img src="${item.cover}" alt="${item.title} cover" />` : `<div class="placeholder">No cover</div>`}
          </div>
          <div class="card-body">
            <h3 class="card-title">${item.title}</h3>
            <div class="card-meta">${item.status || 'not tagged'}</div>
          </div>
        </article>
      `).join('')}
    </div>
  `;
  dom.sameAuthorGrid.querySelectorAll('.same-author-card').forEach(card => {
    card.addEventListener('click', () => openDetail(card.dataset.id));
  });
}

function renderVolumeGrid(manga) {
  const volumes = state.mangas.filter(item => item.parentId === manga.id);
  if (!volumes.length) {
    dom.volumeGrid.innerHTML = `<div class="empty-state">No volumes added yet. Use add volume to create another book in this series.</div>`;
    return;
  }
  dom.volumeGrid.innerHTML = volumes.map(volume => {
    return `
      <article class="volume-row" data-id="${volume.id}">
        <div class="volume-cover-wrap" data-id="${volume.id}">
          ${volume.cover ? `<img src="${volume.cover}" alt="${volume.title || 'Volume cover'}" />` : `<div class="placeholder">Tap cover</div>`}
        </div>
        <div class="volume-row-content">
          <input class="volume-number-input" data-id="${volume.id}" value="${volume.chapter || ''}" placeholder="Vol #" />
          <input class="volume-name-input" data-id="${volume.id}" value="${volume.title || ''}" placeholder="Volume title" />
        </div>
      </article>
    `;
  }).join('');

  dom.volumeGrid.querySelectorAll('.volume-row').forEach(row => {
    const volumeId = row.dataset.id;
    const numberInput = row.querySelector('.volume-number-input');
    const nameInput = row.querySelector('.volume-name-input');

    row.addEventListener('click', (event) => {
      if (event.target.closest('.volume-number-input') || event.target.closest('.volume-name-input')) {
        return;
      }
      openDetail(volumeId);
    });

    numberInput.addEventListener('input', () => {
      const volume = state.mangas.find(item => item.id === volumeId);
      if (!volume) return;
      volume.chapter = numberInput.value;
      saveState();
    });

    nameInput.addEventListener('input', () => {
      const volume = state.mangas.find(item => item.id === volumeId);
      if (!volume) return;
      volume.title = nameInput.value;
      saveState();
    });
  });
}

function openDetail(mangaId) {
  if (state.activeView !== 'detail' || state.selectedMangaId !== mangaId) {
    pushViewHistory();
  }
  state.selectedMangaId = mangaId;
  setView('detail', false);
  renderDetail(mangaId);
}

function goBack() {
  const previous = popViewHistory();
  if (previous) {
    state.selectedMangaId = previous.selectedMangaId;
    setView(previous.view, false);
    return;
  }
  setView('home', false);
}

function openVolumeDetail(volumeId) {
  const manga = state.mangas.find(item => item.id === state.selectedMangaId);
  if (!manga) return;
  const volume = manga.volumes.find(v => v.id === volumeId);
  if (!volume) return;
  state.editingVolumeId = volumeId;
  dom.volumeDetailTitle.textContent = `Volume details`;
  dom.volumeNumberInput.value = volume.number || '';
  dom.volumeNameInput.value = volume.name || '';
  dom.volumeNotes.value = volume.notes || '';
  dom.volumeComments.value = volume.comments || '';
  dom.volumeCoverPreview.innerHTML = volume.cover ? `<img src="${volume.cover}" alt="${volume.name || 'Volume cover'}" />` : `<div class="placeholder">No volume cover</div>`;
  dom.volumeDetailPanel.classList.add('active');
}

function closeVolumePanel() {
  state.editingVolumeId = null;
  dom.volumeDetailPanel.classList.remove('active');
}

function setStatusForSelected(status) {
  const manga = state.mangas.find(item => item.id === state.selectedMangaId);
  if (!manga) return;
  manga.status = status;
  saveState();
  renderDetail(manga.id);
  showToast(`Status set to ${status}`);
}

function clearAddFormPreview() {
  dom.formCoverFile.value = '';
  dom.formCoverPreview.innerHTML = '';
}

function fillAddForm(prefill = {}) {
  const defaultStatus = 'ongoing';
  delete dom.addForm.dataset.editingId;
  delete dom.addForm.dataset.seriesParentId;
  dom.formTitle.value = prefill.title || '';
  dom.formAuthor.value = prefill.author || '';
  dom.formStatus.value = prefill.status || defaultStatus;
  dom.formGenres.value = prefill.genres || '';
  dom.formChapter.value = prefill.chapter || '';
  dom.formLastRead.value = prefill.lastRead || '';
  dom.formNextRelease.value = prefill.nextRelease || '';
  dom.formComments.value = prefill.comments || '';
  dom.formCoverFile.value = '';
  clearAddFormPreview();
  dom.formRatingInput.dataset.value = prefill.rating || '0';
  dom.formSeriesSuggestion.innerHTML = '';
  renderFormRating(Number(dom.formRatingInput.dataset.value));
  if (dom.formAuthor.value) {
    renderSeriesSuggestion(dom.formAuthor.value.trim());
  }
  if (prefill.parentId) {
    dom.addForm.dataset.seriesParentId = prefill.parentId;
    dom.formSeriesSuggestion.innerHTML = `<div class="series-suggestion-card"><div class="series-suggestion-heading">Adding to series</div><div>${prefill.seriesTitle || 'Existing series'}</div></div>`;
  }
}

function handleCoverUpload(file, callback) {
  if (!file) return callback(null);
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

function handleVolumeCoverUpload(file, callback) {
  if (!file) return callback(null);
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

function bindEvents() {
  dom.searchInput.addEventListener('input', (event) => {
    state.searchTerm = event.target.value;
    renderHome();
  });

  dom.addMangaBtn.addEventListener('click', () => {
    setView('add');
    fillAddForm();
  });

  dom.cancelAddBtn.addEventListener('click', () => {
    setView('home', false);
  });

  dom.homeBtn.addEventListener('click', () => setView('home', false));
  dom.settingsBtn.addEventListener('click', () => setView('settings'));
  dom.toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, theme);
  });
  dom.settingsLoginBtn.addEventListener('click', async () => {
    const username = dom.settingsUsername.value.trim();
    const password = dom.settingsPassword.value;
    const saveLogin = dom.settingsSaveLogin.checked;
    if (!username || !password) {
      showToast('Add a username and password');
      return;
    }
    try {
      let data;
      try {
        data = await requestJson('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
      } catch (error) {
        data = await requestJson('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
      }
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem('manganotes_current_user', username);
      if (saveLogin) {
        saveAccountInfo(username, password, true);
      } else {
        localStorage.removeItem(ACCOUNT_KEY);
      }
      state.sessionUser = username;
      if (Array.isArray(data.data?.mangas)) {
        state.mangas = data.data.mangas;
      }
      if (Array.isArray(data.data?.notifications)) {
        state.notifications = data.data.notifications;
      }
      updateAccountUI();
      renderHome();
      renderProfile();
      await saveState();
      showToast('Signed in');
    } catch (error) {
      showToast(error.message || 'Login failed');
    }
  });
  dom.settingsLogoutBtn.addEventListener('click', async () => {
    try {
      await requestJson('/api/logout', { method: 'POST' });
    } catch (error) {
      console.warn('Logout request failed:', error);
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('manganotes_current_user');
    localStorage.removeItem(ACCOUNT_KEY);
    state.sessionUser = null;
    updateAccountUI();
    showToast('Signed out');
  });
  dom.notificationsBtn.addEventListener('click', async () => {
    const hasPrompted = localStorage.getItem(NOTIFICATION_PROMPT_KEY) === 'true';
    const permission = typeof Notification !== 'undefined' ? Notification.permission : 'denied';

    if (permission === 'default' && !hasPrompted) {
      localStorage.setItem(NOTIFICATION_PROMPT_KEY, 'true');
      try {
        await Notification.requestPermission();
      } catch (error) {
        console.warn('Notification permission request failed:', error);
      }
    }

    if (permission === 'granted' || (typeof Notification !== 'undefined' && Notification.permission === 'granted')) {
      showToast('Notifications enabled');
    } else if (typeof Notification !== 'undefined' && Notification.permission === 'denied') {
      showToast('Notifications blocked by browser');
    }

    toggleNotificationsPanel();
  });
  dom.closeNotificationsBtn.addEventListener('click', () => {
    dom.notificationsPanel.classList.add('hidden');
  });
  document.addEventListener('click', (event) => {
    if (!dom.notificationsPanel.contains(event.target) && !dom.notificationsBtn.contains(event.target)) {
      dom.notificationsPanel.classList.add('hidden');
    }
  });
  dom.profileBtn.addEventListener('click', () => setView('profile'));
  dom.settingsBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, theme);
    showToast(theme === 'light' ? 'Light mode on' : 'Dark mode on');
  });

  dom.profileStatusButtons.forEach(button => {
    button.addEventListener('click', () => {
      state.activeStatusFilter = button.dataset.status;
      dom.profileStatusButtons.forEach(btn => btn.classList.toggle('active', btn === button));
      renderProfile();
    });
  });

  dom.formCoverFile.addEventListener('change', () => {
    const file = dom.formCoverFile.files[0];
    if (file) handleCoverUpload(file, (base64) => {
      dom.formCoverPreview.innerHTML = base64 ? `<img src="${base64}" alt="Cover preview" />` : '';
    });
  });

  dom.clearFormBtn.addEventListener('click', () => {
    fillAddForm();
  });

  dom.formAuthor.addEventListener('input', () => {
    renderSeriesSuggestion(dom.formAuthor.value.trim());
  });

  dom.detailCoverFile.addEventListener('change', () => {
    const file = dom.detailCoverFile.files[0];
    const manga = state.mangas.find(item => item.id === state.selectedMangaId);
    if (!manga || !file) return;
    handleCoverUpload(file, (base64) => {
      if (base64) {
        manga.cover = base64;
        saveState();
        renderDetail(manga.id);
        showToast('Cover saved');
      }
    });
  });

  dom.backToHomeBtn.addEventListener('click', (event) => {
    event.preventDefault();
    goBack();
  });

  dom.openEditBtn.addEventListener('click', () => {
    setDetailMode(true);
    renderRatingStars(dom.detailStarDisplay, Number(dom.detailRatingRange.value), true);
  });
  dom.finishEditBtn.addEventListener('click', () => {
    const manga = state.mangas.find(item => item.id === state.selectedMangaId);
    if (manga) {
      setDetailMode(false);
      dom.openEditBtn.textContent = 'Edit?';
      renderDetail(manga.id);
      showToast('Finished editing');
    }
  });

  dom.detailTitleInput.addEventListener('input', () => {
    const manga = state.mangas.find(item => item.id === state.selectedMangaId);
    if (!manga) return;
    manga.title = dom.detailTitleInput.value;
    saveState();
    renderHome();
  });

  dom.detailAuthorInput.addEventListener('input', () => {
    const manga = state.mangas.find(item => item.id === state.selectedMangaId);
    if (!manga) return;
    manga.author = dom.detailAuthorInput.value;
    saveState();
    renderHome();
  });

  dom.detailGenresInput.addEventListener('input', () => {
    const manga = state.mangas.find(item => item.id === state.selectedMangaId);
    if (!manga) return;
    manga.genres = dom.detailGenresInput.value;
    saveState();
  });

  dom.detailChapterInput.addEventListener('input', () => {
    const manga = state.mangas.find(item => item.id === state.selectedMangaId);
    if (!manga) return;
    manga.chapter = dom.detailChapterInput.value;
    saveState();
  });

  dom.detailNextReleaseInput.addEventListener('input', () => {
    const manga = state.mangas.find(item => item.id === state.selectedMangaId);
    if (!manga) return;
    manga.nextRelease = dom.detailNextReleaseInput.value;
    saveState();
    syncReleaseNotifications();
  });

  dom.detailLastReadInput.addEventListener('input', () => {
    const manga = state.mangas.find(item => item.id === state.selectedMangaId);
    if (!manga) return;
    manga.lastRead = dom.detailLastReadInput.value;
    saveState();
  });

  dom.detailRatingRange.addEventListener('input', () => {
    const value = Number(dom.detailRatingRange.value);
    dom.detailRatingValue.textContent = `${value.toFixed(1)}!`;
    renderRatingStars(dom.detailStarDisplay, value);
    const manga = state.mangas.find(item => item.id === state.selectedMangaId);
    if (!manga) return;
    manga.rating = value;
    saveState();
  });

  dom.detailCommentsInput.addEventListener('input', () => {
    autoResizeTextarea(dom.detailCommentsInput);
    const manga = state.mangas.find(item => item.id === state.selectedMangaId);
    if (!manga) return;
    manga.comments = dom.detailCommentsInput.value;
    saveState();
  });

  dom.deleteBtn.addEventListener('click', () => {
    if (!confirm('Delete this manga permanently?')) return;
    const deletedId = state.selectedMangaId;
    state.mangas = state.mangas.filter(item => item.id !== deletedId && item.parentId !== deletedId);
    state.mangas.forEach(item => {
      if (item.volumes) {
        item.volumes = item.volumes.filter(volume => volume.id !== deletedId);
      }
    });
    state.selectedMangaId = null;
    saveState();
    setView('home', false);
    renderHome();
    showToast('Manga deleted');
  });

  dom.addVolumeBtnBottom.addEventListener('click', () => {
    const manga = state.mangas.find(item => item.id === state.selectedMangaId);
    if (!manga) return;
    setView('add');
    fillAddForm({
      author: manga.author || '',
      status: manga.status || 'ongoing',
      parentId: manga.id,
      seriesTitle: manga.title
    });
  });
  dom.closeVolumeDetail.addEventListener('click', () => closeVolumePanel());
  dom.volumeCoverFile.addEventListener('change', () => {
    const file = dom.volumeCoverFile.files[0];
    if (!file) return;
    handleVolumeCoverUpload(file, (base64) => {
      if (!state.editingVolumeId) return;
      const manga = state.mangas.find(item => item.id === state.selectedMangaId);
      if (!manga) return;
      const volume = manga.volumes.find(v => v.id === state.editingVolumeId);
      if (!volume) return;
      volume.cover = base64;
      saveState();
      dom.volumeCoverPreview.innerHTML = `<img src="${base64}" alt="${volume.name || 'Volume cover'}" />`;
      renderVolumeGrid(manga);
      showToast('Volume cover saved');
    });
  });

  dom.saveVolumeBtn.addEventListener('click', () => {
    if (!state.editingVolumeId) return;
    const manga = state.mangas.find(item => item.id === state.selectedMangaId);
    if (!manga) return;
    const volume = manga.volumes.find(v => v.id === state.editingVolumeId);
    if (!volume) return;
    volume.number = dom.volumeNumberInput.value.trim() || volume.number;
    volume.name = dom.volumeNameInput.value.trim() || volume.name;
    volume.notes = dom.volumeNotes.value.trim();
    volume.comments = dom.volumeComments.value.trim();
    saveState();
    renderVolumeGrid(manga);
    showToast('Volume saved');
  });

  dom.statusButtons.forEach(button => {
    button.addEventListener('click', () => {
      setStatusForSelected(button.dataset.status);
    });
  });

  dom.addForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const editingId = dom.addForm.dataset.editingId;
    const title = dom.formTitle.value.trim();
    if (!title) {
      showToast('Please add a title.');
      return;
    }
    const isEditing = Boolean(editingId);
    const manga = isEditing ? state.mangas.find(item => item.id === editingId) : null;
    const saveForm = (coverBase64) => {
      if (isEditing && manga) {
        manga.title = title;
        manga.author = dom.formAuthor.value.trim();
        manga.status = dom.formStatus.value;
        manga.genres = dom.formGenres.value.trim();
        manga.chapter = dom.formChapter.value.trim();
        manga.lastRead = dom.formLastRead.value;
        manga.nextRelease = dom.formNextRelease.value;
        manga.rating = Number(dom.formRatingInput.dataset.value) || 0;
        manga.comments = dom.formComments.value.trim();
        if (coverBase64) manga.cover = coverBase64;
        state.selectedMangaId = manga.id;
        saveState();
        syncReleaseNotifications();
        setView('detail');
        renderDetail(manga.id);
        showToast('Manga updated');
      } else {
        const parentSeriesId = dom.addForm.dataset.seriesParentId;
        const newManga = {
          id: createId(),
          title,
          author: dom.formAuthor.value.trim(),
          status: dom.formStatus.value,
          genres: dom.formGenres.value.trim(),
          chapter: dom.formChapter.value.trim(),
          lastRead: dom.formLastRead.value,
          nextRelease: dom.formNextRelease.value,
          rating: Number(dom.formRatingInput.dataset.value) || 0,
          comments: dom.formComments.value.trim(),
          notes: '',
          cover: coverBase64 || '',
          parentId: parentSeriesId || null
        };
        state.mangas.unshift(newManga);
        delete dom.addForm.dataset.seriesParentId;
        state.selectedMangaId = newManga.id;
        saveState();
        syncReleaseNotifications();
        setView('detail', false);
        renderDetail(newManga.id);
        showToast(parentSeriesId ? 'Added to series' : 'Manga added');
      }
      delete dom.addForm.dataset.editingId;
      fillAddForm();
    };
    const file = dom.formCoverFile.files[0];
    if (file) {
      handleCoverUpload(file, saveForm);
    } else {
      saveForm();
    }
  });
}

async function init() {
  await loadState();
  renderFormRating(0);
  bindEvents();
  updateAccountUI();
  syncReleaseNotifications();
  renderHome();
  setView('home');
}

init();
