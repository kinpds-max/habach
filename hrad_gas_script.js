/**
 * 하늘바람교회 통합 게시판 → 구글 시트 저장
 * HRAD 실시간 / 중보기도 요청 → type 필드에 따라 별도 탭에 저장
 */

const SHEET_ID = '16L7P-3hQKwKgVMDEvewZYzejQxV5mVMp9el4lPICjYI';

// POST 요청: 게시판 데이터 저장
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss   = SpreadsheetApp.openById(SHEET_ID);

    // type 필드에 따라 시트 탭 결정
    const sheetName = (data.type === '중보기도') ? '중보기도' : 'HRAD';

    // 시트 없으면 자동 생성
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      if (sheetName === 'HRAD') {
        sheet.appendRow(['번호', '날짜', '시간', '이름', '내용', '등록일시(ISO)']);
      } else {
        sheet.appendRow(['번호', '날짜', '시간', '이름', '기도제목', '등록일시(ISO)']);
      }
      sheet.getRange(1, 1, 1, 6).setFontWeight('bold')
           .setBackground('#f3f3f3');
    }

    const lastRow = sheet.getLastRow();
    const num = lastRow <= 1 ? 1 : lastRow; // 헤더 제외

    sheet.appendRow([
      num,
      data.time ? data.time.split(' ')[0] : '',   // M/D
      data.time ? data.time.split(' ')[1] : '',   // HH:MM
      data.name || '익명',
      data.text || '',
      data.date || new Date().toISOString()
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', sheet: sheetName }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * GET 요청: 드라이브 API 연동 및 서비스 상태 확인
 * ?action=listFiles&folderId=FOLDER_ID 형태로 호출 가능
 */
function doGet(e) {
  const action = e.parameter.action;
  const folderId = e.parameter.folderId;

  // 공지/기도 티커(Ticker)를 위한 최신 메시지 조회
  if (action === 'getLatestMessages') {
    try {
      const ss     = SpreadsheetApp.openById(SHEET_ID);
      const hrad   = ss.getSheetByName('HRAD');
      const pray   = ss.getSheetByName('중보기도');
      const messages = [];

      const getRows = (sheet) => {
        if (!sheet) return;
        const lastRow = sheet.getLastRow();
        if (lastRow <= 1) return;
        const numRows = Math.min(10, lastRow - 1);
        const data = sheet.getRange(lastRow - numRows + 1, 1, numRows, 6).getValues();
        data.forEach(row => {
          messages.push({
            name: row[3],
            text: row[4],
            time: row[1], // M/D
            fullDate: row[5] // ISO
          });
        });
      };

      getRows(hrad);
      getRows(pray);

      // 최신 등록순 정렬 (ISO 기준)
      messages.sort((a, b) => (b.fullDate||'').localeCompare(a.fullDate||''));
      const finalMsg = messages.slice(0, 15); // 상위 15개만

      return ContentService
        .createTextOutput(JSON.stringify({ result: 'success', messages: finalMsg }))
        .setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
      return ContentService
        .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // 정식 Drive API 연동: 파일 목록 조회
  if (action === 'listFiles' && folderId) {
    try {
      const folder = DriveApp.getFolderById(folderId);
      const files  = folder.getFiles();
      const result = [];

      while (files.hasNext()) {
        const file = files.next();
        // 삭제된 파일이나 원치않는 파일 제외 필터링 가능
        result.push({
          id: file.getId(),
          name: file.getName(),
          created: file.getDateCreated().toISOString(),
          mimeType: file.getMimeType()
        });
      }

      // 최신순 (파일명 기준 내림차순) 정렬
      result.sort((a, b) => b.name.localeCompare(a.name));

      return ContentService
        .createTextOutput(JSON.stringify({ result: 'success', files: result }))
        .setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
      return ContentService
        .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // 네이버 카페 주보 목록 (크롤링 + 캐시)
  if (action === 'getCafeArticles') {
    const clubId  = e.parameter.clubId  || '31371644';
    const menuId  = e.parameter.menuId  || '28';
    const cacheKey = clubId + '_' + menuId;

    try {
      const ss = SpreadsheetApp.openById(SHEET_ID);
      let cacheSheet = ss.getSheetByName('CafeCache');
      if (!cacheSheet) {
        cacheSheet = ss.insertSheet('CafeCache');
        cacheSheet.appendRow(['cachedAt', 'data', 'key']);
      }

      // 캐시 확인 (15분 이내)
      const lastRow = cacheSheet.getLastRow();
      if (lastRow > 1) {
        const rows = cacheSheet.getRange(2, 1, lastRow - 1, 3).getValues();
        for (var ci = 0; ci < rows.length; ci++) {
          if (rows[ci][2] === cacheKey) {
            var cachedAt = new Date(rows[ci][0]);
            if ((new Date() - cachedAt) < 15 * 60 * 1000) {
              return ContentService.createTextOutput(rows[ci][1])
                .setMimeType(ContentService.MimeType.JSON);
            }
          }
        }
      }

      // 네이버 카페 모바일 JSON API 호출
      var apiUrl = 'https://m.cafe.naver.com/ArticleListV3dot1.json'
        + '?search.clubid=' + clubId
        + '&search.menuid=' + menuId
        + '&search.page=1&search.perPage=15&search.sortby=date';
      var res = UrlFetchApp.fetch(apiUrl, {
        muteHttpExceptions: true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Referer': 'https://m.cafe.naver.com/'
        }
      });

      var text = res.getContentText('UTF-8');
      var articles = [];

      try {
        var json = JSON.parse(text);
        var list = (json.message && json.message.result && json.message.result.articleList)
                || (json.result && json.result.articleList) || [];
        if (list.length > 0) {
          articles = list.map(function(item) {
            return {
              id:       item.articleId,
              title:    item.subject,
              date:     item.writeDateTimestamp || 0,
              dateStr:  (item.writeDate || '').replace(/\.$/, ''),
              author:   item.writerNickname || item.nickname || ''
            };
          });
        }
      } catch(pe) {}

      // 폴백: 모바일 HTML 파싱
      if (articles.length === 0) {
        var htmlUrl = 'https://cafe.naver.com/ArticleList.nhn?search.clubid=' + clubId
          + '&search.menuid=' + menuId + '&userDisplay=15&search.sortby=date&search.page=1';
        var htmlRes = UrlFetchApp.fetch(htmlUrl, { muteHttpExceptions: true });
        var html = htmlRes.getContentText('UTF-8');
        // JSON 데이터 패턴에서 추출
        var pattern = /"articleId"\s*:\s*"?(\d+)"?\s*,\s*"subject"\s*:\s*"([^"]+)"/g;
        var match;
        var idx = 0;
        while ((match = pattern.exec(html)) !== null && idx < 15) {
          articles.push({ id: match[1], title: match[2], date: 0, dateStr: '', author: '' });
          idx++;
        }
      }

      // 최신순 정렬
      articles.sort(function(a, b) { return (b.date || 0) - (a.date || 0); });

      var resultObj = { result: 'success', articles: articles, fetchedAt: new Date().toISOString() };
      var resultJson = JSON.stringify(resultObj);

      // 캐시 저장/갱신
      var updated = false;
      if (lastRow > 1) {
        var cRows = cacheSheet.getRange(2, 1, lastRow - 1, 3).getValues();
        for (var ui = 0; ui < cRows.length; ui++) {
          if (cRows[ui][2] === cacheKey) {
            cacheSheet.getRange(ui + 2, 1, 1, 3).setValues([[new Date().toISOString(), resultJson, cacheKey]]);
            updated = true; break;
          }
        }
      }
      if (!updated) cacheSheet.appendRow([new Date().toISOString(), resultJson, cacheKey]);

      return ContentService.createTextOutput(resultJson)
        .setMimeType(ContentService.MimeType.JSON);

    } catch(err) {
      return ContentService
        .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService
    .createTextOutput('하늘바람교회 GAS API 서비스가 정상 작동 중입니다! (Action: ' + (action||'none') + ')')
    .setMimeType(ContentService.MimeType.TEXT);
}
