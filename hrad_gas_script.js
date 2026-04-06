/**
 * 하늘바람교회 HRAD 실시간 게시판 → 구글 시트 저장
 * 
 * [배포 방법]
 * 1. https://script.google.com 접속
 * 2. 새 프로젝트 생성
 * 3. 이 코드 전체를 붙여넣기
 * 4. SHEET_ID 값을 실제 시트 ID로 교체 (아래 주석 참고)
 * 5. [배포] → [새 배포] → 종류: 웹앱
 *    - 실행 대상: 나 (본인)
 *    - 액세스 권한: 모든 사용자 (익명)
 * 6. 배포 후 나오는 URL을 복사
 * 7. index.html 의 HRAD_GAS_URL 변수에 붙여넣기
 */

// 구글 시트 ID (URL에서 /d/ 다음부터 /edit 전까지)
const SHEET_ID = '16L7P-3hQKwKgVMDEvewZYzejQxV5mVMp9el4lPICjYI';
const SHEET_NAME = 'HRAD'; // 시트 탭 이름 (없으면 자동 생성)

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss    = SpreadsheetApp.openById(SHEET_ID);
    
    // 시트가 없으면 생성
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // 헤더 행 추가
      sheet.appendRow(['번호', '날짜', '시간', '이름', '내용', '등록일시(ISO)']);
      sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
    }
    
    const lastRow = sheet.getLastRow();
    const num = lastRow <= 1 ? 1 : lastRow; // 헤더 제외 번호
    
    sheet.appendRow([
      num,
      data.time ? data.time.split(' ')[0] : '',  // 날짜 (M/D)
      data.time ? data.time.split(' ')[1] : '',  // 시간 (HH:MM)
      data.name || '익명',
      data.text || '',
      data.date || new Date().toISOString()
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// CORS 허용 (GET 요청 테스트용)
function doGet(e) {
  return ContentService
    .createTextOutput('HRAD GAS is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}
