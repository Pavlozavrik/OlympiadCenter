// ===== NAVIGATION =====
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      navList.classList.toggle('open');
      toggle.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !navList.contains(e.target)) {
        navList.classList.remove('open');
        toggle.classList.remove('open');
      }
    });
  }

  // Mark active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ===== ACCORDION (FAQ) =====
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.closest('.accordion-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ===== FILTER BUTTONS =====
document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('.filter-bar, .faq-categories');
    group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    const target = btn.dataset.target;
    const items = document.querySelectorAll(target || '[data-category]');
    items.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// ===== NEWS FILTER =====
document.querySelectorAll('.filter-btn[data-news]').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('.filter-bar');
    group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.news;
    document.querySelectorAll('[data-news-category]').forEach(item => {
      if (filter === 'all' || item.dataset.newsCategory === filter) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// ===== SUBJECT PAGE =====
function initSubjectPage() {
  if (!document.querySelector('.subject-page')) return;

  const params = new URLSearchParams(window.location.search);
  const subjectId = params.get('subject');
  const subject = SUBJECTS[subjectId];

  if (!subject) {
    document.querySelector('.subject-page').innerHTML = '<div class="container section"><h2>Предмет не найден</h2><a href="olympiads.html" class="btn btn-primary mt-24">← К олимпиадам</a></div>';
    return;
  }

  document.title = subject.name + ' — Олимпиадный центр';

  // Fill hero
  document.getElementById('subject-emoji').textContent = subject.emoji;
  document.getElementById('subject-name').textContent = subject.name;
  document.getElementById('subject-name-bc').textContent = subject.name;
  document.getElementById('subject-desc').textContent = subject.description;

  // Fill olympiads
  renderOlympiads(subject.olympiads, 'all');

  // Fill materials
  const matGrid = document.getElementById('materials-grid');
  if (matGrid) {
    matGrid.innerHTML = subject.materials.map(m => `
      <div class="material-card">
        <div class="material-icon">${m.icon}</div>
        <div class="material-title">${m.title}</div>
        <div class="material-desc">${m.desc}</div>
        <div class="material-download">
          <a href="${m.file}" class="btn btn-outline btn-sm">Скачать / Открыть</a>
        </div>
      </div>
    `).join('');
  }

  // Fill tips
  const tipsGrid = document.getElementById('tips-grid');
  if (tipsGrid) {
    tipsGrid.innerHTML = subject.tips.map((t, i) => `
      <div class="tip-card">
        <div class="tip-number">${i + 1}</div>
        <div class="tip-title">${t.title}</div>
        <div class="tip-text">${t.text}</div>
      </div>
    `).join('');
  }

  // Level filter
  document.querySelectorAll('.level-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.level-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderOlympiads(subject.olympiads, btn.dataset.level);
    });
  });

  // Tabs
  document.querySelectorAll('.subject-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.subject-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.subject-tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
}

function renderOlympiads(olympiads, filter) {
  const list = document.getElementById('olympiad-list');
  if (!list) return;

  let filtered;
  if (filter === 'all') {
    filtered = olympiads;
  } else if (filter === 'vsosh') {
    filtered = olympiads.filter(o => o.type === 'vsosh');
  } else if (filter === 'perechen') {
    filtered = olympiads.filter(o => o.type === 'perechen');
  } else {
    filtered = olympiads;
  }

  if (filtered.length === 0) {
    list.innerHTML = '<p class="text-muted" style="padding:24px 0;">Олимпиады по выбранному критерию не найдены.</p>';
    return;
  }

  list.innerHTML = filtered.map(o => {
    let badgeClass, levelLabel;
    if (o.type === 'perechen') {
      const plvl = { 1: 'badge-p1', 2: 'badge-p2', 3: 'badge-p3' };
      const plbl = { 1: 'I уровень', 2: 'II уровень', 3: 'III уровень' };
      badgeClass = plvl[o.plevel] || 'badge-gray';
      levelLabel  = plbl[o.plevel] || 'Перечневая';
    } else {
      const vsoshClass = {
        school: 'badge-school', municipal: 'badge-municipal',
        regional: 'badge-regional', final: 'badge-vsosh-final'
      };
      const vsoshLabel = {
        school: 'Школьный', municipal: 'Муниципальный',
        regional: 'Региональный', final: 'Заключительный'
      };
      badgeClass = vsoshClass[o.level] || 'badge-gray';
      levelLabel  = vsoshLabel[o.level] || o.level;
    }
    return `
      <div class="olympiad-item">
        <div class="olympiad-info">
          <div class="olympiad-name">${o.name}</div>
          <div class="olympiad-dates">
            <span>📅 ${formatDate(o.start)} — ${formatDate(o.end)}</span>
          </div>
        </div>
        <div class="olympiad-actions">
          <span class="badge ${badgeClass}">${levelLabel}</span>
          <a href="${o.reg}" class="btn btn-outline btn-sm">Подробнее</a>
        </div>
      </div>
    `;
  }).join('');
}

function formatDate(str) {
  const d = new Date(str);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ===== FAQ SEARCH =====
function initFaqSearch() {
  const input = document.getElementById('faq-search');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    document.querySelectorAll('.accordion-item').forEach(item => {
      const text = item.querySelector('.accordion-question').textContent.toLowerCase();
      const body = item.querySelector('.accordion-body').textContent.toLowerCase();
      item.style.display = (text.includes(q) || body.includes(q)) ? '' : 'none';
    });
  });
}

// ===== NEWS SEARCH =====
function initNewsSearch() {
  const input = document.getElementById('news-search');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    document.querySelectorAll('[data-news-category]').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(q) ? '' : 'none';
    });
  });
}

// ===== SUBJECT SEARCH (olympiads page) =====
function initSubjectSearch() {
  const input = document.getElementById('subject-search');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    document.querySelectorAll('.subject-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(q) ? '' : 'none';
    });
    document.querySelectorAll('.subjects-category').forEach(cat => {
      const visible = [...cat.querySelectorAll('.subject-card')].some(c => c.style.display !== 'none');
      cat.style.display = visible ? '' : 'none';
    });
  });
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + suffix;
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

function observeCounters() {
  const section = document.querySelector('.stats-section');
  if (!section) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounters(); obs.disconnect(); } });
  }, { threshold: 0.3 });
  obs.observe(section);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initSubjectPage();
  initFaqSearch();
  initNewsSearch();
  initSubjectSearch();
  observeCounters();
});
