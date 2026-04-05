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

hamburger?.addEventListener('click', () => {
  const open = mainNav?.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// 모바일 메뉴 링크 클릭시 닫기
mainNav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mainNav.classList.remove('open');
    hamburger?.classList.remove('open');
    document.body.style.overflow = '';
  });
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
const BLOG_PROXY = `https://api.allorigins.win/raw?url=`;

async function loadBlogPosts() {
  const container = document.getElementById('blogCards');
  if (!container) return;

  try {
    const res  = await fetch(BLOG_PROXY + encodeURIComponent(BLOG_RSS));
    const text = await res.text();
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
   INIT
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  loadBlogPosts();
});
