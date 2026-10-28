# 영상 앨범 운영 (2026-10-28)

운영 브랜치: `habachnew`, 운영 Vercel 프로젝트: `habachnew`.

- 기존 Supabase `habach-youtube-sync` / pg_cron이 한국시간 06:30에 최근 영상을 등록한다.
- GitHub Actions `Habach static video albums`가 한국시간 06:50에 공개 게시글을 읽고 `index.html`의 기존 정적 앨범과 홈 영상 카드를 갱신한다. GitHub 예약 실행은 지연될 수 있다.
- 예약 워크플로는 GitHub 기본 브랜치 `main`에도 설치한다. 실제 체크아웃·수정·커밋 대상은 항상 `habachnew`이다. `main` 사이트 파일은 변경하지 않는다.
- 방문자는 저장된 HTML 앨범을 본다. 영상 목록을 위해 YouTube/RSS를 방문자 브라우저에서 요청하지 않는다.
- 읽기는 이미 홈페이지에 공개된 Supabase publishable key/RLS를 사용한다. 서비스 키, Vault 토큰, 별도 GitHub 개인 토큰은 필요 없다.
- 변경이 있을 때만 GitHub 기본 작업 토큰으로 커밋한다. Vercel Git 연동이 연결되면 production 배포까지 실행한다. 2026-10-28 점검 당시 기존 프로젝트의 Git 연결이 없어, 현재 변경본은 연결 도구로 별도 production 배포했다. Git 자동 배포 설정은 Vercel 로그인 후 연결해야 한다. 변경 없는 날에는 커밋·배포를 생략한다.
- 관리자가 동시에 index.html을 수정하면 GitHub blob SHA 검사로 덮어쓰기를 차단한다. 실패한 작업은 Actions에서 재실행할 수 있다.
- 기존 HTML에만 있는 영상은 보존하고, 게시글은 영상 ID 기준으로 중복 제거한다. 특별집회·기도집회의 별도 수동 구성은 보존한다.
- `python3 scripts/sync_video_albums.py`는 즉시 반영, `--check`는 최신 상태 검증, `python3 -m unittest discover -s tests -v`는 보존·중복·문자 이스케이프·재실행 검증이다.

## 찬양 전체 수집

`data/choir-playlist-20261028.json`은 공식 찬양 재생목록의 모든 페이지를 확인한 108개 항목이다. 각 항목의 영상 ID·제목·공식 채널 ID·게시일을 개별 영상 메타데이터로 검증했다. 기존 DB 50개를 보존하고 58개를 추가했으며, 임시 등록 시각을 실제 게시일로 정비했다. 재생목록에는 제목이 기도인 항목도 포함되어 있어 목록 구성 그대로 보존했다.

## 남은 작업

- 주보 PDF/이미지 업로드 → OCR → 검증 → 글/일정 저장 자동화.
- 최근 RSS에 나타나지 않거나 제목으로 분류할 수 없는 신규 영상 처리.
- 미공개/삭제 영상은 현재 공개 재생목록 전체 수량에 포함되지 않는다.
- Vercel 기존 프로젝트 Git 연결(브라우저 로그인 필요). 현재 정적 갱신·GitHub 커밋까지만 자동 실행이 검증되었다.
- 관리자 로그인, 실제 YouTube 재생 성공, 모바일 실기기 전체 동선은 별도 검증 대상이다.
