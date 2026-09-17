# 개발·운영 안내

## 검증과 배포

수정 후 관련 검증을 수행하고 `main`에 커밋한 뒤 `origin/main`으로 푸시합니다. GitHub Actions가 단위 테스트와 빌드를 실행하고 `dist/`를 GitHub Pages에 배포합니다. 브라우저 검증은 로컬에서 별도 실행합니다.

```sh
npm test
npm run build
# 개발 서버 실행 후
npm run test:browser
```

브라우저 검증에는 가상 데이터만 사용합니다. 결과는 Git에서 제외되는 `tmp/`에 저장되며 Google 태그는 가짜 응답으로 대체해 실제 통계 전송을 막습니다. 배포본 확인에는 `TEST_URL=https://ab-birthcert-ko.mydy.kr/ npm run test:browser`를 사용할 수 있습니다.

배포 커밋은 내비게이션 GitHub 버튼에 `#`와 짧은 SHA로 표시합니다. Actions의 `GITHUB_SHA`를 우선 사용하고 로컬에서는 Git HEAD를 읽습니다. 개발 서버의 SHA를 갱신하려면 서버를 재시작합니다.

## 도메인과 HTTPS

- 서비스: `https://ab-birthcert-ko.mydy.kr/`
- DNS: `ab-birthcert-ko`의 CNAME을 `yoobato.github.io`로 설정
- GitHub 저장소 Settings → Pages: Source는 GitHub Actions, Custom domain은 `ab-birthcert-ko.mydy.kr`, Enforce HTTPS 활성화
- 인증서는 GitHub Pages가 관리합니다. 도메인을 변경한 뒤에는 DNS·인증서·HTTP → HTTPS 리디렉션을 확인합니다.

도메인을 바꾸면 `index.html`, `public/robots.txt`, `public/sitemap.xml`, `src/analytics.js`의 고정 URL과 공유 이미지·문서도 함께 갱신합니다. Actions 배포에서는 저장소의 CNAME 파일이 필요하지 않습니다.

## Google Analytics

측정 ID는 `G-2TXN5Z7X2G`입니다. 프로덕션 빌드에서만 실행하며 로컬 개발 서버에서는 비활성화됩니다. 프로덕션 빌드를 로컬에서 미리 보는 경우에는 GA가 실행되므로 자동 확인 시 태그를 차단해야 합니다.

| 이벤트 | 발생 시점 |
| --- | --- |
| `page_view` | 페이지 방문 |
| `translation_preview` | PDF 생성에 성공하고 미리보기를 연 경우 |
| `pdf_download` | PDF 다운로드 시작, 미리보기의 저장 링크 포함 |

다운로드 이벤트는 운영체제의 파일 저장 완료를 보장하지 않습니다. GA 관리의 웹 데이터 스트림에서 **향상된 측정은 꺼둡니다**. 자동 폼·클릭 이벤트 대신 명시된 이벤트만 사용합니다.

이벤트 함수는 허용된 이름만 받습니다. 양식값·PDF·파일명·URL 쿼리와 해시·원본 리퍼러를 전달하지 않고 고정 페이지 정보만 사용합니다. Google signals와 광고 개인화는 비활성화합니다. 기본 접속 정보와 분석 쿠키는 사용될 수 있습니다.

실제 수집 확인은 배포 사이트 방문 후 GA 실시간 보고서에서 진행합니다. 광고 차단기나 브라우저 설정에 따라 수집이 차단될 수 있습니다. 서버의 전송 성공 응답과 GA 보고서 반영 여부는 구분해서 확인합니다.

## Google AdSense

게시자 ID는 `ca-pub-4015788090404207`입니다. `index.html`에 계정 확인 메타 태그를 포함하고, `vite.config.js`가 프로덕션 빌드의 `<head>`에 공식 비동기 스크립트를 삽입합니다. 개발 서버에서는 광고 스크립트를 로드하지 않습니다. 브라우저 테스트는 광고 스크립트를 차단하여 실제 노출을 발생시키지 않습니다. 프로덕션 빌드를 수동으로 미리 볼 때도 광고 스크립트를 차단해야 합니다.

코드 설치와 사이트 승인은 별개입니다. AdSense에서 사이트 소유권 확인·검토 요청을 진행해야 합니다. 일반 서브도메인은 루트 도메인 `mydy.kr` 아래에서 관리하므로, 이 저장소의 서브도메인 배포만으로 루트 도메인 인증까지 완료되었다고 볼 수 없습니다. 루트 사이트 연결과 ads.txt 설정은 해당 도메인의 호스팅에서도 확인해야 합니다.

현재는 사이트 연결 코드만 포함하며 수동 배너 광고 단위와 버튼 연동 전면 광고는 구현하지 않았습니다. 자동 광고는 AdSense 계정 설정과 승인 상태에 따라 표시될 수 있습니다. 광고 배치·지역별 동의 설정은 실제 광고 운영 전에 계정에서 확인합니다. 입력값·PDF를 광고 매개변수로 전달하지 않습니다.

## 검색과 링크 공유

`index.html`에 title·description·canonical·robots·Open Graph·X 카드 정보와 WebApplication JSON-LD가 있습니다. 메타데이터는 JavaScript 실행 전 HTML에서 읽을 수 있습니다. 초기 안내는 앱 실행 후 입력 화면으로 교체되고, JavaScript가 꺼져 있으면 사용 안내가 남습니다.

- 대표 URL: `https://ab-birthcert-ko.mydy.kr/`
- 사이트맵: `https://ab-birthcert-ko.mydy.kr/sitemap.xml`
- 공유 이미지: `https://ab-birthcert-ko.mydy.kr/og-image.png` (1200 × 630 PNG)

공유 이미지는 개인정보와 공식 관인 없이 구성합니다. 문구나 디자인 수정 후 다음 명령으로 다시 생성하고 PNG도 함께 커밋합니다.

```sh
node scripts/generate-og-image.mjs
```

Google Search Console에 사이트 소유권을 인증하고 사이트맵을 제출하면 색인 상태를 확인할 수 있습니다. 현재 저장소 설정만으로 Search Console 인증·제출이 완료되는 것은 아닙니다. 검색 노출과 공유 카드 표시는 각 플랫폼이 결정하며, 기존 공유 URL은 플랫폼 캐시 때문에 갱신이 늦을 수 있습니다.

## 참고 문서

- [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Open Graph 규격](https://ogp.me/)
- [GitHub Pages 도메인 문제 해결](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages)

## 라이선스 고지 갱신

의존성 변경 후 `npm ci`로 설치하고 `node scripts/generate-notices.mjs`를 실행합니다. `THIRD_PARTY_NOTICES.md`와 배포용 `public/THIRD_PARTY_NOTICES.txt`를 함께 커밋합니다. 현재 플랫폼에 설치된 패키지의 원문을 수집하므로 선택적 네이티브 패키지는 플랫폼에 따라 달라질 수 있습니다. npm 패키지에 내장된 코드의 추가 고지는 별도로 검토합니다. fontkit은 독립 LICENSE 파일이 없어 배포 번들의 라이선스 주석과 MIT 선언을 기록합니다.

프로젝트 자체에 오픈소스 라이선스를 부여하는 결정은 저작권자가 별도로 내립니다. 정부 로고·외부 서비스·글꼴의 조건을 프로젝트 라이선스로 대체하지 않습니다.
