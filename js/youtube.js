/**
 * 하늘바람교회 YouTube RSS 자동 크롤링 모듈
 * 채널: @Gimpo_HBC  |  Channel ID: UCzQ6kPUzNNbU3EtJI5X1mhQ
 *
 * - YouTube RSS 피드 자동 파싱 (API Key 불필요)
 * - 영상 제목 키워드로 예배 종류 자동 분류
 * - 썸네일 자동 추출 (maxresdefault → hqdefault 폴백)
 * - CORS 우회: allorigins.win 프록시 사용
 */

const YT = (() => {
  const CHANNEL_ID  = 'UCzQ6kPUzNNbU3EtJI5X1mhQ';
  const RSS_URL     = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
  const PROXY       = `https://api.allorigins.win/raw?url=`;
  const FETCH_URL   = PROXY + encodeURIComponent(RSS_URL);

  /* ─── 예배 분류 키워드 ─── */
  const CATEGORIES = {
    sunday:    { label: '주일예배',  keywords: ['주일', '주일예배', '주일 예배', '주일설교', '주일 설교', '다윗', '주일 찬양'] },
    dawn:      { label: '새벽예배',  keywords: ['새벽', '새벽예배', '새벽 예배', '새벽기도', '새벽 기도'] },
    wednesday: { label: '수요예배',  keywords: ['수요', '수요예배', '수요 예배', '수요설교', '수요 설교'] },
    friday:    { label: '금요예배',  keywords: ['금요', '금요예배', '금요 예배', '금요기도', '금요 기도', '금요기도회', '금요 기도회'] },
  };

  let allVideos = [];
  let categorized = { sunday: [], dawn: [], wednesday: [], friday: [], all: [], shorts: [] };

  /* ─── 숏폼 판별: 제목에 #Shorts / 영상 길이(RSS엔 없으므로 제목 기반) ─── */
  function isShorts(title) {
    return /#short|shorts|숏츠|숏폼/i.test(title);
  }

  /* ─── 영상 분류 함수 ─── */
  function classifyVideo(title) {
    for (const [key, cat] of Object.entries(CATEGORIES)) {
      if (cat.keywords.some(kw => title.includes(kw))) return key;
    }
    return 'all'; // 미분류
  }

  /* ─── 날짜 포맷 ─── */
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;
  }

  /* ─── 썸네일 URL ─── */
  function thumbUrl(videoId) {
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  }

  /* ─── RSS 파싱 ─── */
  function parseRSS(xmlText) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'text/xml');
    const entries = xml.querySelectorAll('entry');
    const videos = [];
    entries.forEach(entry => {
      const idRaw   = entry.querySelector('id')?.textContent || '';
      const videoId = idRaw.replace('yt:video:', '');
      const title   = entry.querySelector('title')?.textContent || '제목 없음';
      const pubDate = entry.querySelector('published')?.textContent || '';
      const link    = `https://www.youtube.com/watch?v=${videoId}`;
      const shorts  = isShorts(title);
      const category = shorts ? 'shorts' : classifyVideo(title);
      videos.push({ videoId, title, pubDate, link, category, shorts });
    });
    return videos;
  }

  /* ─── 비디오 카드 HTML 생성 ─── */
  function createCard(video) {
    const catInfo = CATEGORIES[video.category] || { label: '기타영상' };
    const date    = formatDate(video.pubDate);
    const thumb   = thumbUrl(video.videoId);
    const card    = document.createElement('div');
    card.className = 'video-card';
    card.dataset.videoId = video.videoId;
    card.innerHTML = `
      <div class="video-thumb">
        <img src="${thumb}" alt="${video.title}" loading="lazy"
             onerror="this.src='https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg'">
        <div class="video-play-overlay">
          <div class="video-play-btn"><i class="fas fa-play"></i></div>
        </div>
      </div>
      <div class="video-info">
        <span class="video-category">${catInfo.label}</span>
        <p class="video-title">${video.title}</p>
        <span class="video-date">${date}</span>
      </div>`;
    card.addEventListener('click', () => openVideoModal(video.videoId, video.title));
    return card;
  }

  /* ─── 일반 그리드 렌더링 ─── */
  function renderGrid(gridId, videos, limit = 6) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';
    if (!videos.length) {
      grid.innerHTML = '<div class="video-empty"><i class="fas fa-film" style="font-size:2rem;opacity:.3;margin-bottom:12px;display:block"></i>해당 예배 영상이 준비 중입니다</div>';
      return;
    }
    videos.slice(0, limit).forEach(v => grid.appendChild(createCard(v)));
  }

  /* ─── 숏폼 그리드 렌더링 ─── */
  function renderShorts(gridId, videos, limit = 8) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';
    if (!videos.length) {
      grid.innerHTML = '<div class="video-empty" style="grid-column:1/-1"><i class="fas fa-mobile-alt" style="font-size:2rem;opacity:.3;margin-bottom:12px;display:block"></i>숏폼 영상이 준비 중입니다</div>';
      return;
    }
    videos.slice(0, limit).forEach(v => grid.appendChild(createShortsCard(v)));
  }

  /* ─── 숏폼 카드 생성 (세로형 9:16) ─── */
  function createShortsCard(video) {
    const date = formatDate(video.pubDate);
    const card = document.createElement('div');
    card.className = 'shorts-card';
    card.dataset.videoId = video.videoId;
    card.innerHTML = `
      <div class="shorts-thumb">
        <img src="https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg"
             alt="${video.title}" loading="lazy"
             onerror="this.src='https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg'">
        <div class="shorts-play-overlay">
          <div class="shorts-play-btn"><i class="fab fa-youtube"></i></div>
        </div>
        <span class="shorts-badge"><i class="fas fa-mobile-alt"></i> Shorts</span>
      </div>
      <div class="shorts-info">
        <p class="shorts-title">${video.title}</p>
        <span class="shorts-date">${date}</span>
      </div>`;
    card.addEventListener('click', () => openVideoModal(video.videoId));
    return card;
  }

  /* ─── 모달 열기 ─── */
  function openVideoModal(videoId) {
    const modal  = document.getElementById('videoModal');
    const iframe = document.getElementById('modalIframe');
    if (!modal || !iframe) return;
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /* ─── 메인 초기화 ─── */
  async function init() {
    try {
      const res  = await fetch(FETCH_URL);
      const text = await res.text();
      allVideos  = parseRSS(text);

      /* 분류 */
      categorized.all = allVideos;
      categorized.sunday    = allVideos.filter(v => v.category === 'sunday');
      categorized.dawn      = allVideos.filter(v => v.category === 'dawn');
      categorized.wednesday = allVideos.filter(v => v.category === 'wednesday');
      categorized.friday    = allVideos.filter(v => v.category === 'friday');

      /* 렌더링 */
      renderGrid('grid-sunday',    categorized.sunday);
      renderGrid('grid-dawn',      categorized.dawn);
      renderGrid('grid-wednesday', categorized.wednesday);
      renderGrid('grid-friday',    categorized.friday);
      renderGrid('grid-all',       categorized.all, 9);

    } catch (err) {
      console.warn('[YT] RSS 로드 실패, 폴백으로 전환:', err.message);
      fallbackToOEmbed();
    }
  }

  /* ─── 폴백: 채널 링크로 안내 ─── */
  function fallbackToOEmbed() {
    ['grid-sunday','grid-dawn','grid-wednesday','grid-friday','grid-all'].forEach(id => {
      const g = document.getElementById(id);
      if (!g) return;
      g.innerHTML = `
        <div class="video-empty" style="grid-column:1/-1;padding:60px 20px;text-align:center">
          <i class="fab fa-youtube" style="font-size:3rem;color:#ff0000;margin-bottom:16px;display:block"></i>
          <p style="margin-bottom:20px;color:#6677aa">유튜브 채널에서 영상을 확인하세요</p>
          <a href="https://www.youtube.com/@Gimpo_HBC" target="_blank"
             style="display:inline-block;background:#ff0000;color:white;padding:12px 28px;border-radius:50px;font-weight:700;text-decoration:none">
            <i class="fab fa-youtube"></i> 유튜브 채널 바로가기
          </a>
        </div>`;
    });
  }

  return { init, openVideoModal };
})();

/* ─── 모달 닫기 이벤트 ─── */
document.addEventListener('DOMContentLoaded', () => {
  const modal     = document.getElementById('videoModal');
  const closeBtn  = document.getElementById('modalClose');
  const iframe    = document.getElementById('modalIframe');

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { iframe.src = ''; }, 300);
  }

  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* YouTube RSS 로드 */
  YT.init();
});
