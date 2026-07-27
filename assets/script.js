
// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', open);
  });
}

// Sticky nav shadow on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 20);
}, { passive: true });

// Scroll reveal
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
}

// ---------------------------------------------------------------------------
// GALLERY (only runs on gallery.html — needs GALLERY_PROJECTS/GALLERY_PHOTOS
// from gallery-data.js, and a #galleryGrid element on the page)
// ---------------------------------------------------------------------------
const galleryGrid = document.getElementById('galleryGrid');
if (galleryGrid && typeof GALLERY_PHOTOS !== 'undefined') {

  // Build filter tabs
  const tabsWrap = document.getElementById('galleryTabs');
  let activeFilter = 'all';

  function renderTabs() {
    tabsWrap.innerHTML = '';
    GALLERY_PROJECTS.forEach(proj => {
      const btn = document.createElement('button');
      btn.className = 'gallery-tab' + (proj.id === activeFilter ? ' is-active' : '');
      btn.textContent = proj.label;
      btn.type = 'button';
      btn.addEventListener('click', () => {
        activeFilter = proj.id;
        renderTabs();
        renderGrid();
      });
      tabsWrap.appendChild(btn);
    });
  }

  // Build grid items
  function renderGrid() {
    galleryGrid.innerHTML = '';
    const items = GALLERY_PHOTOS.filter(p => activeFilter === 'all' || p.project === activeFilter);

    if (items.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'gallery-empty';
      empty.textContent = 'No photos in this category yet.';
      galleryGrid.appendChild(empty);
      return;
    }

    items.forEach((photo, i) => {
      const projLabel = (GALLERY_PROJECTS.find(p => p.id === photo.project) || {}).label || '';
      const fig = document.createElement('figure');
      fig.className = 'gallery-item';
      fig.innerHTML = `
        <img src="${photo.src}" alt="${photo.caption || ''}" loading="lazy">
        <figcaption>
          ${projLabel ? `<span class="gallery-item-tag">${projLabel}</span>` : ''}
          ${photo.caption ? `<span class="gallery-item-caption">${photo.caption}</span>` : ''}
        </figcaption>
      `;
      fig.addEventListener('click', () => openLightbox(items, i));
      galleryGrid.appendChild(fig);

      const img = fig.querySelector('img');
      if (img.complete) {
        spanGridItem(fig);
      } else {
        img.addEventListener('load', () => spanGridItem(fig));
      }
    });
  }

  // Masonry via CSS Grid: compute row-span for each item based on rendered image height
  function spanGridItem(item) {
    const rowHeight = parseInt(getComputedStyle(galleryGrid).getPropertyValue('grid-auto-rows'));
    const rowGap = parseInt(getComputedStyle(galleryGrid).getPropertyValue('gap'));
    const img = item.querySelector('img');
    if (!img) return;
    const itemHeight = img.getBoundingClientRect().height + item.querySelector('figcaption').getBoundingClientRect().height;
    const rowSpan = Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = 'span ' + rowSpan;
  }

  function relayout() {
    galleryGrid.querySelectorAll('.gallery-item').forEach(spanGridItem);
  }
  window.addEventListener('resize', () => {
    clearTimeout(window._galleryResizeTimer);
    window._galleryResizeTimer = setTimeout(relayout, 150);
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  let currentItems = [];
  let currentIndex = 0;

  function openLightbox(items, index) {
    currentItems = items;
    currentIndex = index;
    showLightboxItem();
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function showLightboxItem() {
    const photo = currentItems[currentIndex];
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.caption || '';
    lightboxCaption.textContent = photo.caption || '';
  }
  function nextLightboxItem(dir) {
    currentIndex = (currentIndex + dir + currentItems.length) % currentItems.length;
    showLightboxItem();
  }

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', () => nextLightboxItem(-1));
  document.getElementById('lightboxNext').addEventListener('click', () => nextLightboxItem(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') nextLightboxItem(-1);
    if (e.key === 'ArrowRight') nextLightboxItem(1);
  });

  renderTabs();
  renderGrid();
}
