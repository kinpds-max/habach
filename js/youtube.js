/**
 * 하늘바람교회 YouTube 크롤링 모듈
 * ─ RSS (최신 15개): 16:9 예배 영상 분류
 * ─ /shorts 페이지 크롤링: 9:16 숏폼만 별도 수집
 * ─ 프록시: corsproxy.io → allorigins.win → codetabs 순 폴백
 */

const YT = (() => {
  const CHANNEL_ID   = 'UCzQ6kPUzNNbU3EtJI5X1mhQ';
  const RSS_URL      = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
  const SHORTS_PAGE  = `https://www.youtube.com/@Gimpo_HBC/shorts`;

  const PROXIES = [
    'https://corsproxy.io/?',
    'https://api.allorigins.win/raw?url=',
    'https://api.codetabs.com/v1/proxy?quest=',
  ];

  /* ─── 예배 분류 키워드 ─── */
  const CATEGORIES = {
    sermon3:   { label: '3분설교',    keywords: ['3분설교','[3분설교]'] },
    sunday:    { label: '주일예배',   keywords: ['주일','다윗의 예배','다윗의예배','시편의 예배','스몰 예배','주일설교'] },
    dawn:      { label: '새벽예배',   keywords: ['새벽','새벽예배','촛불새벽','새벽기도'] },
    wednesday: { label: '수요예배',   keywords: ['수요','수요예배','성경예배','수요 예배'] },
    friday:    { label: '금요예배',   keywords: ['금요','금요예배','강청기도','금요기도','금요 예배'] },
    bridge:    { label: '브릿지 찬양대', keywords: ['브릿지찬양대','브릿지 찬양대','브릿지'] },
  };

  /* ─── 프록시 폴백 fetch ─── */
  async function proxyFetch(url) {
    for (const proxy of PROXIES) {
      try {
        const res = await fetch(proxy + encodeURIComponent(url), {
          signal: AbortSignal.timeout(12000),
        });
        if (res.ok) return await res.text();
      } catch { /* 다음 프록시 */ }
    }
    throw new Error('모든 프록시 실패: ' + url);
  }

  /* ─── 날짜 포맷 ─── */
  function fmt(str) {
    const d = new Date(str);
    return isNaN(d) ? '' : `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;
  }

  /* ─── 예배 분류 ─── */
  function classify(title) {
    for (const [key, cat] of Object.entries(CATEGORIES)) {
      if (cat.keywords.some(kw => title.includes(kw))) return key;
    }
    return 'all';
  }

  /* ══════════════════════════════════════════
     1. RSS 파싱 → 16:9 예배 영상 (isShorts=false만)
     ══════════════════════════════════════════ */
  function parseRSS(xml) {
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    return Array.from(doc.querySelectorAll('entry')).map(e => {
      const videoId  = e.querySelector('videoId')?.textContent ||
                       (e.querySelector('id')?.textContent || '').replace('yt:video:', '');
      const title    = e.querySelector('title')?.textContent || '';
      const pubDate  = e.querySelector('published')?.textContent || '';
      const href     = e.querySelector('link')?.getAttribute('href') || '';
      const isShorts = href.includes('/shorts/');
      return { videoId, title, pubDate, isShorts, category: isShorts ? 'shorts' : classify(title) };
    });
  }

  /* ══════════════════════════════════════════
     2-3. 플레이리스트 페이지 크롤링 (금요강청 등 특정 순서 유지용)
     ══════════════════════════════════════════ */
  async function fetchPlaylistPage(playlistId, category, limit = 30) {
    try {
      const url = `https://www.youtube.com/playlist?list=${playlistId}`;
      const html = await proxyFetch(url);
      const m = html.match(/var ytInitialData\s*=\s*(\{.+?\});/s);
      if (!m) return [];

      const data = JSON.parse(m[1]);
      const items = [];
      JSON.stringify(data, (k, v) => {
        if (k === 'playlistVideoRenderer' && v?.videoId) {
          const title = v.title?.runs?.[0]?.text || '';
          items.push({
            videoId: v.videoId,
            title: title,
            pubDate: '', // UI 스크래핑 시 날짜 보완은 fetchTitles에서 처리
            isShorts: false,
            category: category || classify(title)
          });
        }
        return v;
      });
      return items.slice(0, limit);
    } catch { return []; }
  }

  /* ══════════════════════════════════════════
     2-4. 비디오/쇼츠 전체 페이지 크롤링
     ══════════════════════════════════════════ */
  async function fetchVideosPage(limit = 30) {
    try {
      const url = `https://www.youtube.com/channel/${CHANNEL_ID}/videos`;
      const html = await proxyFetch(url);
      const m = html.match(/var ytInitialData\s*=\s*(\{.+?\});/s);
      if (!m) return [];
      const data = JSON.parse(m[1]);
      const items = [];
      JSON.stringify(data, (k, v) => {
        if (k === 'videoRenderer' && v?.videoId) {
          const title = v.title?.runs?.[0]?.text || '';
          items.push({ videoId: v.videoId, title, pubDate: v.publishedTimeText?.simpleText || '', isShorts: false, category: classify(title) });
        }
        return v;
      });
      return items.slice(0, limit);
    } catch { return []; }
  }

  async function fetchShortsPage(limit = 10) {
    try {
      const html = await proxyFetch(SHORTS_PAGE);
      const m = html.match(/var ytInitialData\s*=\s*(\{.+?\});/s);
      if (!m) return [];
      const data = JSON.parse(m[1]);
      const items = [];
      JSON.stringify(data, (k, v) => {
        if (k === 'reelItemRenderer' && v?.videoId) {
          items.push({ videoId: v.videoId, title: v.headline?.simpleText || '', pubDate: '', isShorts: true, category: 'shorts' });
        }
        return v;
      });
      return items.slice(0, limit);
    } catch { return []; }
  }

  /* ══════════════════════════════════════════
     3. oEmbed로 제목/날짜 일괄 보완 (병렬)
     ══════════════════════════════════════════ */
  async function fetchTitles(videos) {
    await Promise.allSettled(videos.map(async v => {
      if (v.title && v.pubDate) return;
      try {
        const url  = `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${v.videoId}`;
        const res  = await fetch(PROXIES[0] + encodeURIComponent(url), { signal: AbortSignal.timeout(5000) });
        if (res.ok) {
          const j = await res.json();
          if (!v.title) v.title = j.title || '';
          // oEmbed에는 pubDate가 없으므로 fetchVideosPage나 RSS에서 가져온 정보를 우선함
          v.category = classify(v.title);
        }
      } catch { /* 실패 시 유지 */ }
    }));
    return videos;
  }

  /* ══════════════════════════════════════════
     4. 채널 검색으로 예배 카테고리 보완
     ══════════════════════════════════════════ */
  async function fillCategory(arr, keyword, need = 3) {
    if (arr.length >= need) return arr;
    try {
      const searchUrl = `https://www.youtube.com/channel/${CHANNEL_ID}/search?query=${encodeURIComponent(keyword)}`;
      const html      = await proxyFetch(searchUrl);
      const matches   = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)];
      const existing  = new Set(arr.map(v => v.videoId));
      const extra = [...new Set(matches.map(m => m[1]))]
        .filter(id => !existing.has(id))
        .slice(0, need - arr.length)
        .map(videoId => ({ videoId, title: keyword, pubDate: '', isShorts: false, category: classify(keyword) }));
      return [...arr, ...extra];
    } catch {
      return arr;
    }
  }

  /* ─── 일반 영상 카드 (16:9) ─── */
  function createCard(v) {
    const catInfo = CATEGORIES[v.category] || { label: '영상' };
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
      <div class="video-thumb">
        <img src="https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg" alt="${v.title}" loading="lazy"
             onerror="this.src='https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg'">
        <div class="video-play-overlay"><div class="video-play-btn"><i class="fas fa-play"></i></div></div>
      </div>
      <div class="video-info">
        <span class="video-category">${catInfo.label}</span>
        <p class="video-title">${v.title || catInfo.label}</p>
        <span class="video-date">${v.pubDate || ''}</span>
      </div>`;
    card.addEventListener('click', () => openModal(v.videoId));
    return card;
  }

  /* ─── 숏폼 카드 (9:16 세로형) ─── */
  function createShortsCard(v) {
    const card = document.createElement('div');
    card.className = 'shorts-card';
    card.innerHTML = `
      <div class="shorts-thumb">
        <img src="https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg" alt="${v.title}" loading="lazy"
             onerror="this.src='https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg'">
        <div class="shorts-play-overlay"><div class="shorts-play-btn"><i class="fab fa-youtube"></i></div></div>
        <span class="shorts-badge"><i class="fas fa-mobile-alt"></i> Shorts</span>
      </div>
      <div class="shorts-info">
        <p class="shorts-title">${v.title || 'Shorts'}</p>
        <span class="shorts-date">${v.pubDate || ''}</span>
      </div>`;
    card.addEventListener('click', () => openModal(v.videoId));
    return card;
  }

  /* ─── 그리드 렌더링 ─── */
  function renderGrid(id, videos, limit) {
    const grid = document.getElementById(id);
    if (!grid) return;
    grid.innerHTML = '';
    const list = limit ? videos.slice(0, limit) : videos;
    if (!list.length) {
      grid.innerHTML = `<div class="video-empty">
        <i class="fas fa-film" style="font-size:2rem;opacity:.3;display:block;margin-bottom:12px"></i>
        해당 영상이 준비 중입니다</div>`;
      return;
    }
    list.forEach(v => grid.appendChild(createCard(v)));
  }

  function renderShorts(videos, limit = 5) {
    const grid = document.getElementById('grid-shorts');
    if (!grid) return;
    grid.innerHTML = '';
    const list = videos.slice(0, limit);
    if (!list.length) {
      grid.innerHTML = `<div class="video-empty" style="grid-column:1/-1">
        <i class="fas fa-mobile-alt" style="font-size:2rem;opacity:.3;display:block;margin-bottom:12px"></i>
        숏폼 영상이 준비 중입니다</div>`;
      return;
    }
    list.forEach(v => grid.appendChild(createShortsCard(v)));
  }

  /* ─── 모달 열기 ─── */
  function openModal(videoId) {
    const modal  = document.getElementById('videoModal');
    const iframe = document.getElementById('modalIframe');
    if (!modal || !iframe) return;
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /* ══════════════════════════════════════════
     INIT
     ══════════════════════════════════════════ */
  async function init() {
    try {
      /* ① RSS + Shorts 페이지 + Videos 페이지 + 금요강청 + 미션브릿지 병렬 fetch */
      const [rssText, shortsFromPage, videosFromPage, fridayPlaylist, bridgePlaylist] = await Promise.allSettled([
        proxyFetch(RSS_URL),
        fetchShortsPage(10),
        fetchVideosPage(30),
        fetchPlaylistPage('PLmD7ZicLdWIqJLAkUiT--mvQ3fy361Pcx', 'friday', 30),
        fetchPlaylistPage('PLmD7ZicLdWIppiQiS7qVEm002srY7W9lf', 'bridge', 30),
      ]);

      const rssVideos = rssText.status === 'fulfilled' ? parseRSS(rssText.value) : [];
      const sPage     = shortsFromPage.status === 'fulfilled' ? shortsFromPage.value : [];
      const vPage     = videosFromPage.status === 'fulfilled' ? videosFromPage.value : [];
      const fPage     = fridayPlaylist.status === 'fulfilled' ? fridayPlaylist.value : [];
      const bPage     = bridgePlaylist.status === 'fulfilled' ? bridgePlaylist.value : [];

      /* ② 전체 합산 및 중복 제거 (최신순 유지 위해 vPage를 앞에) */
      const allNormals = [...vPage, ...rssVideos.filter(v => !v.isShorts)];
      const uniqueNormals = [];
      const normalIds = new Set();
      
      // 중복 제거 및 플레이리스트 병합
      const mergedNormals = [...fPage, ...bPage, ...allNormals];
      mergedNormals.forEach(v => {
        if (!normalIds.has(v.videoId)) {
          normalIds.add(v.videoId);
          uniqueNormals.push(v);
        }
      });

      /* ③ 카테고리별 분류 */
      const sermon3   = uniqueNormals.filter(v => v.category === 'sermon3');
      const sunday    = uniqueNormals.filter(v => v.category === 'sunday');
      const dawn      = uniqueNormals.filter(v => v.category === 'dawn');
      const wednesday = uniqueNormals.filter(v => v.category === 'wednesday');
      const friday    = uniqueNormals.filter(v => v.category === 'friday');
      const bridge    = uniqueNormals.filter(v => v.category === 'bridge');

      /* ④ 9:16 숏폼 합산 */
      const rssShorts  = rssVideos.filter(v => v.isShorts);
      const rssIds      = new Set(rssShorts.map(v => v.videoId));
      const allShorts   = [...rssShorts, ...sPage.filter(v => !rssIds.has(v.videoId))];

      /* ⑤ 즉시 렌더 */
      renderGrid('grid-sermon3',   sermon3,    3);
      renderGrid('grid-sunday',    sunday,     3);
      renderGrid('grid-dawn',      dawn,       3);
      renderGrid('grid-wednesday', wednesday,  3);
      renderGrid('grid-friday',    friday,     3);
      renderGrid('grid-bridge',    bridge,     3);
      renderShorts(allShorts,                  5); 

      /* ⑥ 제목 없는 영상(쇼츠 등) 보완 */
      if (sPage.length) {
        fetchTitles(allShorts).then(() => renderShorts(allShorts, 5));
      }

      /* ⑦ 부족한 카테고리 검색으로 보완 */
      [
        { arr: sermon3,   key: '3분설교',  id: 'grid-sermon3' },
        { arr: sunday,    key: '주일예배',  id: 'grid-sunday' },
        { arr: dawn,      key: '새벽예배',  id: 'grid-dawn' },
        { arr: wednesday, key: '수요예배',  id: 'grid-wednesday' },
        { arr: friday,    key: '금요예배',  id: 'grid-friday' },
        { arr: bridge,    key: '미션브릿지', id: 'grid-bridge' },
      ].forEach(async ({ arr, key, id }) => {
        if (arr.length < 3) {
          const filled = await fillCategory(arr, key, 3);
          if (filled.length > arr.length) renderGrid(id, filled, 3);
        }
      });

    } catch (err) {
      console.warn('[YT] 초기화 실패:', err.message);
      ['grid-sunday','grid-dawn','grid-wednesday','grid-friday','grid-shorts'].forEach(id => {
        const g = document.getElementById(id);
        if (g) g.innerHTML = `
          <div class="video-empty" style="grid-column:1/-1;padding:60px 20px;text-align:center">
            <i class="fab fa-youtube" style="font-size:3rem;color:#ff0000;margin-bottom:16px;display:block"></i>
            <p style="margin-bottom:20px">유튜브 채널에서 영상을 확인하세요</p>
            <a href="https://www.youtube.com/@Gimpo_HBC" target="_blank"
               style="background:#ff0000;color:white;padding:12px 28px;border-radius:50px;font-weight:700;text-decoration:none">
              <i class="fab fa-youtube"></i> 유튜브 채널 바로가기
            </a>
          </div>`;
      });
    }
  }

  return { init, openModal };
})();

/* ─── 모달 닫기 ─── */
document.addEventListener('DOMContentLoaded', () => {
  const modal    = document.getElementById('videoModal');
  const closeBtn = document.getElementById('modalClose');
  const iframe   = document.getElementById('modalIframe');

  function closeModal() {
    modal?.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { if (iframe) iframe.src = ''; }, 300);
  }

  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  YT.init();
});
