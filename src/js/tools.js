bootstrap();

function bootstrap() {
  const btn = document.getElementById('hc-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const active = document.body.classList.toggle('hc');
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  const status = document.getElementById('tools-status');
  const grid = document.getElementById('tools-grid');

  if (!grid) return;

  setStatus(status, { state: 'loading', message: 'Carregando ferramentas...' });

  fetch('/src/data/tools.json')
    .then((response) => {
      if (!response.ok) throw new Error('Erro ao carregar JSON');
      return response.json();
    })
    .then((data) => {
      const tools = Array.isArray(data?.tools) ? data.tools : [];
      if (tools.length === 0) throw new Error('Lista de ferramentas vazia');

      if (status) status.classList.add('hidden');
      grid.innerHTML = '';

      tools.forEach((tool, index) => {
        const card = renderToolCard(tool, index);
        grid.appendChild(card);
      });

      enableRevealAnimation();
    })
    .catch((err) => {
      setStatus(status, { state: 'error', message: 'Erro ao carregar ferramentas' });
      if (grid) {
        grid.innerHTML = `
          <div class="bg-white rounded-xl p-6 shadow-md border border-red-100">
            <h3 class="font-display font-bold text-xl text-piBlue mb-2">Não foi possível carregar as ferramentas</h3>
            <p class="text-gray-700">Verifique o arquivo <strong>/src/data/tools.json</strong> e tente novamente.</p>
          </div>
        `;
      }
      console.error(err);
    });
}

function setStatus(el, { state, message }) {
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden');
  el.classList.remove('valid', 'invalid');
  if (state === 'loading') el.classList.add('valid');
  if (state === 'error') el.classList.add('invalid');
}

function renderToolCard(tool, index) {
  const card = document.createElement('article');
  card.className = [
    'tool-card',
    'bg-white',
    'rounded-xl',
    'shadow-md',
    'border',
    'border-gray-100',
    'overflow-hidden',
    'flex',
    'flex-col',
    'lg:flex-row',
    'hover:border-piGreen/30',
    'transition-all',
    'duration-300',
  ].join(' ');

  card.style.opacity = '0';
  card.style.animationDelay = `${Math.min(index * 80, 400)}ms`;

  const name = String(tool?.name || 'Ferramenta');
  const description = String(tool?.description || '');
  const url = String(tool?.url || '#');
  const video = tool?.video || {};
  const videoTitle = String(video?.title || `Vídeo: ${name}`);
  const embedUrl = String(video?.embed_url || '');
  const videoUrl = String(video?.url || '');
  const platform = String(video?.platform || '');
  const duration = String(video?.duration || '');

  const faviconUrl = getFaviconUrl(url);

  const embed = embedUrl
    ? `<iframe class="tool-embed" src="${escapeHtmlAttr(embedUrl)}" title="${escapeHtmlAttr(videoTitle)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
    : `<div class="tool-embed-placeholder">
         <div class="text-center">
           <div class="text-3xl text-piBlue mb-2"><i class="fas fa-circle-play"></i></div>
           <p class="text-sm text-gray-600">Vídeo indisponível</p>
         </div>
       </div>`;

  card.innerHTML = `
    <div class="tool-media bg-gray-100">
      ${embed}
    </div>

    <div class="flex-1 p-6 md:p-7 flex flex-col">
      <div class="flex items-start gap-4">
        <div class="shrink-0 bg-piYellow/50 text-piBlue w-10 h-10 rounded-full flex items-center justify-center border border-piBlue/10 shadow-sm overflow-hidden">
          <img class="w-5 h-5 object-contain block" src="${escapeHtmlAttr(faviconUrl)}" alt="" loading="lazy">
        </div>
        <div class="min-w-0">
          <h3 class="font-display font-bold text-piBlue text-xl md:text-2xl leading-tight">${escapeHtml(name)}</h3>
          ${
            platform || duration
              ? `<p class="text-sm text-gray-500 mt-1">${escapeHtml(
                  [platform, duration].filter(Boolean).join(' • ')
                )}</p>`
              : ''
          }
          <p class="text-gray-600 mt-2 leading-relaxed">${escapeHtml(description)}</p>
        </div>
      </div>

      <div class="mt-5 flex flex-col sm:flex-row gap-3">
        <a href="${escapeHtmlAttr(url)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center px-4 py-2 bg-piBlue text-white text-sm font-bold rounded hover:bg-piGreen transition-colors">
          <i class="fas fa-arrow-up-right-from-square mr-2"></i>Acessar ferramenta
        </a>
        ${
          videoUrl
            ? `<a href="${escapeHtmlAttr(videoUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center px-4 py-2 bg-white text-piBlue text-sm font-bold rounded border border-piBlue/15 hover:border-piGreen/30 hover:text-piGreen transition-colors">
                 <i class="fab fa-youtube mr-2"></i>Ver no YouTube
               </a>`
            : ''
        }
      </div>
    </div>
  `;

  const img = card.querySelector('img');
  if (img) {
    img.addEventListener(
      'error',
      () => {
        const wrap = img.parentElement;
        if (wrap) {
          wrap.innerHTML = `<span class="font-display font-extrabold text-piBlue text-sm" aria-hidden="true">${escapeHtml(
            (name || 'F').trim().slice(0, 1).toUpperCase()
          )}</span>`;
        }
      },
      { once: true }
    );
  }

  card.classList.add('animate-fade-in-up');
  return card;
}

function enableRevealAnimation() {
  const cards = Array.from(document.querySelectorAll('.tool-card'));
  if (cards.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    cards.forEach((c) => (c.style.opacity = '1'));
    return;
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        obs.unobserve(entry.target);
      });
    },
    { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
  );

  cards.forEach((card) => obs.observe(card));
}

function getFaviconUrl(rawUrl) {
  try {
    const u = new URL(rawUrl);
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(u.hostname)}&sz=128`;
  } catch {
    return `https://www.google.com/s2/favicons?domain=example.com&sz=128`;
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeHtmlAttr(str) {
  return escapeHtml(str).replaceAll('`', '&#096;');
}

