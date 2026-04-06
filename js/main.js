/**
 * 하늘바람교회 메인 스크립트
 * - 페이지 로딩, 네비게이션, AOS, 스크롤 이벤트
 * - YouTube Hero 플레이어 (드론샷)
 * - 네이버 블로그 RSS 파싱 (다윗의예배)
 * - 미디어 탭 전환
 * - 티커 복사
 */

/* =============================================
   LOADER
   ============================================= */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader?.classList.add('hidden'), 800);
});

/* =============================================
   AOS 초기화
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });
});

/* =============================================
   HEADER : 스크롤 감지
   ============================================= */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) header?.classList.add('scrolled');
  else                      header?.classList.remove('scrolled');
}, { passive: true });

/* =============================================
   HAMBURGER / MOBILE NAV
   ============================================= */
const hamburger = document.getElementById('hamburger');
const mainNav   = document.getElementById('mainNav');

function closeNav() {
  mainNav?.classList.remove('open');
  hamburger?.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', () => {
  const open = mainNav?.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// 닫기 버튼
document.getElementById('navClose')?.addEventListener('click', closeNav);

// 모바일 메뉴 링크 클릭시 닫기
mainNav?.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', closeNav);
});

/* =============================================
   YOUTUBE HERO : iframe 로드 감지 → 페이드인
   로드 실패 시 썸네일 폴백 배경 유지
   ============================================= */
(function () {
  const iframe = document.getElementById('heroBgVideo');
  if (!iframe) return;

  // 로드 성공 → 페이드인
  iframe.addEventListener('load', () => {
    // 오류 153 등으로 실제 콘텐츠 없을 수 있으므로 짧은 지연 후 표시
    setTimeout(() => iframe.classList.add('loaded'), 300);
  });

  // 3초 후에도 로드 안 되면 폴백 유지
  setTimeout(() => {
    if (!iframe.classList.contains('loaded')) {
      // 폴백 배경만으로도 충분히 아름다운 히어로 유지
      console.info('[Hero] 영상 로드 지연 - 썸네일 폴백 배경 표시');
    }
  }, 3000);
})();

/* =============================================
   MEDIA TABS
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  const tabBtns  = document.querySelectorAll('.tab-btn');
  const panels   = document.querySelectorAll('.video-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      target?.classList.add('active');
    });
  });
});

/* =============================================
   WORSHIP CARD → 탭 연동
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  const worshipMap = {
    'sunday-card':    'sunday-videos',
    'dawn-card':      'dawn-videos',
    'wednesday-card': 'wednesday-videos',
    'friday-card':    'friday-videos',
  };
  Object.entries(worshipMap).forEach(([cardId, tabId]) => {
    document.getElementById(cardId)?.addEventListener('click', () => {
      document.getElementById('media')?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.tab === tabId);
        });
        document.querySelectorAll('.video-panel').forEach(p => {
          p.classList.toggle('active', p.id === tabId);
        });
      }, 600);
    });
  });
});

/* =============================================
   NAVER BLOG RSS : 다윗의예배 (주일설교)
   ============================================= */
const BLOG_RSS = 'https://rss.blog.naver.com/habachurch.xml';
const BLOG_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy?quest=',
];

async function fetchBlogRSS(url) {
  for (const proxy of BLOG_PROXIES) {
    try {
      const res = await fetch(proxy + encodeURIComponent(url), { signal: AbortSignal.timeout(8000) });
      if (res.ok) return await res.text();
    } catch { /* 다음 프록시 */ }
  }
  throw new Error('블로그 RSS 로드 실패');
}

async function loadBlogPosts() {
  const container = document.getElementById('blogCards');
  if (!container) return;

  try {
    const text = await fetchBlogRSS(BLOG_RSS);
    const parser = new DOMParser();
    const xml  = parser.parseFromString(text, 'text/xml');
    const items = xml.querySelectorAll('item');

    if (!items.length) throw new Error('RSS 항목 없음');

    container.innerHTML = '';
    let idx = 0;

    items.forEach((item, i) => {
      if (i >= 6) return; // 최대 6개
      const title = item.querySelector('title')?.textContent?.trim() || '제목 없음';
      const link  = item.querySelector('link')?.textContent?.trim() ||
                    item.querySelector('guid')?.textContent?.trim() || '#';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      // 주일/다윗 관련만 우선 표시 (없으면 전체 표시)
      const isSunday = ['주일','다윗','설교','말씀'].some(kw => title.includes(kw));

      idx++;
      const card = document.createElement('a');
      card.className = 'blog-card';
      card.href = link;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.innerHTML = `
        <span class="blog-card-num">${String(idx).padStart(2,'0')}</span>
        <div class="blog-card-content">
          <p class="blog-card-category">${isSunday ? '주일예배 · 다윗의예배' : '말씀나눔'}</p>
          <p class="blog-card-title">${title}</p>
          <span class="blog-card-date">${formatBlogDate(pubDate)}</span>
        </div>`;
      container.appendChild(card);
    });

  } catch (err) {
    console.warn('[Blog] RSS 로드 실패:', err.message);
    document.getElementById('blogCards').innerHTML = `
      <div style="text-align:center;padding:40px 20px;color:#8899aa">
        <p style="margin-bottom:16px">블로그에서 최신 말씀을 확인하세요</p>
        <a href="https://blog.naver.com/habachurch" target="_blank"
           style="display:inline-flex;align-items:center;gap:8px;background:#03c75a;color:white;padding:12px 24px;border-radius:50px;font-weight:700;text-decoration:none">
          <i class="fas fa-blog"></i> 하늘바람 블로그 바로가기
        </a>
      </div>`;
  }
}

function formatBlogDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;
}

/* =============================================
   TICKER : 내용 복사해 무한 루프
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  const ticker = document.getElementById('tickerContent');
  if (ticker) {
    ticker.innerHTML += ticker.innerHTML; // 복사하여 이음새 없이
  }
});

/* =============================================
   SMOOTH SCROLL (내부 앵커)
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const headerH = header?.offsetHeight || 80;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* =============================================
   NAV ACTIVE 상태 업데이트 (IntersectionObserver)
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => obs.observe(s));
});

/* =============================================
   HRAD 자유 게시판 (localStorage 기반)
   ============================================= */
const HRAD_KEY = 'hrad_posts_v1';
const HRAD_MAX = 30; // 최대 30개 유지

function hradLoad() {
  try { return JSON.parse(localStorage.getItem(HRAD_KEY)) || []; }
  catch { return []; }
}
function hradSave(posts) {
  localStorage.setItem(HRAD_KEY, JSON.stringify(posts.slice(0, HRAD_MAX)));
}
function hradRender() {
  const list  = document.getElementById('hradList');
  if (!list) return;
  const posts = hradLoad();
  if (!posts.length) {
    list.innerHTML = '<p class="hrad-empty">첫 번째 소식을 남겨주세요 🙏</p>';
    return;
  }
  list.innerHTML = posts.map((p, i) => `
    <div class="hrad-post" data-idx="${i}">
      <div class="hrad-post-meta">
        <span class="hrad-post-name">${escapeHtml(p.name || '익명')}</span>
        <span class="hrad-post-time">${p.time}</span>
        <button class="hrad-del-btn" onclick="hradDelete(${i})" title="삭제">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <p class="hrad-post-text">${escapeHtml(p.text)}</p>
    </div>`).join('');
}
function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function hradPost() {
  const name = (document.getElementById('hradName')?.value || '').trim() || '익명';
  const text = (document.getElementById('hradText')?.value || '').trim();
  if (!text) { document.getElementById('hradText')?.focus(); return; }
  const posts = hradLoad();
  const now   = new Date();
  const time  = `${now.getMonth()+1}/${now.getDate()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  posts.unshift({ name, text, time });
  hradSave(posts);
  hradRender();
  if (document.getElementById('hradText')) document.getElementById('hradText').value = '';
}
function hradDelete(idx) {
  if (!confirm('이 게시글을 삭제할까요?')) return;
  const posts = hradLoad();
  posts.splice(idx, 1);
  hradSave(posts);
  hradRender();
}

/* =============================================
   교회주보 공지 (구글 드라이브 임베드 파일명 표시)
   Drive embed iframe load 후 파일명 파싱은 CORS 제한으로
   불가 → Drive 폴더 RSS/공개 API 방식 사용
   ============================================= */
async function loadBulletinNotices() {
  const el = document.getElementById('bulletinNotices');
  if (!el) return;

  // 구글 드라이브 폴더를 공개 설정 후 RSS: https://drive.google.com/feeds/list/FOLDER_ID/private/full?alt=rss
  // 공개 폴더 API (API Key 없이): 불가 → 수동 공지 목록 + 드라이브 링크로 안내
  const BULLETIN_FOLDER = '1g5J2k_jByx0O2prQH_0JEZmDZJqe-5-e';
  const BULLETIN_URL    = `https://drive.google.com/drive/folders/${BULLETIN_FOLDER}?usp=sharing`;

  // allorigins로 드라이브 폴더 HTML 파싱 시도
  try {
    const proxies = ['https://corsproxy.io/?', 'https://api.allorigins.win/raw?url='];
    let html = null;
    for (const p of proxies) {
      try {
        const r = await fetch(p + encodeURIComponent(`https://drive.google.com/embeddedfolderview?id=${BULLETIN_FOLDER}#list`),
                              { signal: AbortSignal.timeout(7000) });
        if (r.ok) { html = await r.text(); break; }
      } catch { /* 다음 */ }
    }
    if (html) {
      // 파일명 추출: <div class="flip-entry-title">주보 2026-04-06</div>
      const names = [...html.matchAll(/class="flip-entry-title"[^>]*>([^<]+)</g)]
                     .map(m => m[1].trim()).filter(Boolean).slice(0, 5);
      if (names.length) {
        el.innerHTML = names.map(n => `
          <a href="${BULLETIN_URL}" target="_blank" class="notice-item">
            <i class="fas fa-file-alt"></i>
            <span>${escapeHtml(n)}</span>
            <i class="fas fa-chevron-right notice-arrow"></i>
          </a>`).join('');
        return;
      }
    }
  } catch { /* 폴백 */ }

  // 폴백: 링크 안내
  el.innerHTML = `
    <a href="${BULLETIN_URL}" target="_blank" class="notice-item notice-fallback">
      <i class="fab fa-google-drive"></i>
      <span>주보 폴더 바로가기 (주보를 드라이브에 업로드하면 자동 표시됩니다)</span>
      <i class="fas fa-external-link-alt notice-arrow"></i>
    </a>`;
}

/* =============================================
   INIT
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  loadBlogPosts();
  hradRender();
  loadBulletinNotices();

  /* Enter키로 게시 */
  document.getElementById('hradText')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); hradPost(); }
  });

  /* ── 플로팅 바: 스크롤 300px 이후 표시 ── */
  const floatBar = document.getElementById('floatBar');
  const showFloat = () => {
    if (floatBar) floatBar.classList.toggle('visible', window.scrollY > 300);
  };
  window.addEventListener('scroll', showFloat, { passive: true });
  showFloat();
});
