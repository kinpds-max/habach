/**
 * 하늘바람교회 통합 게시판 → 구글 시트 저장
 * HRAD 실시간 / 중보기도 요청 → type 필드에 따라 별도 탭에 저장
 */

const SHEET_ID = '16L7P-3hQKwKgVMDEvewZYzejQxV5mVMp9el4lPICjYI';

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

// GET 테스트용
function doGet(e) {
  return ContentService
    .createTextOutput('하늘바람교회 GAS running! HRAD + 중보기도 통합 버전')
    .setMimeType(ContentService.MimeType.TEXT);
}
