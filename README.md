# Alberta Birth KO

알버타 출생증명서를 보며 한글 항목을 입력하고, 자필 서명란이 있는 Letter 한글 번역문 PDF를 만드는 정적 웹 도구입니다. GitHub 저장소: [mydy-ab-birth-certificate-ko](https://github.com/yoobato/mydy-ab-birth-certificate-ko).

## 실행

```sh
npm ci
npm run dev
npm test
npm run build
```

Node.js 20.19 이상 또는 22 이상을 사용합니다. 빌드 결과는 `dist/`이며 GitHub Pages 하위 경로를 지원합니다.

## GitHub Pages

수정할 때마다 검증 후 `main` 브랜치에 커밋하고 `origin/main`에 푸시합니다. GitHub 저장소 **Settings → Pages → Source → GitHub Actions**를 선택하면 포함된 워크플로가 테스트·빌드 후 배포합니다.

## 동작과 표기

- 아이의 성·이름, 출생지, 부모 이름·출생지, 번역자: 한글 입력.
- 날짜 세 항목: 날짜 선택기. 윤년 및 생년월일 ≤ 등록일 ≤ 발급일 검사.
- 상단 부모 항목은 모 성명, 하단은 부 성명으로 표시합니다.
- 등록번호, 바코드 아래 일련번호, 서식 번호 입력. 일련번호·서식 번호는 선택 항목입니다.
- 등록관 영문 이름은 확장된 로컬 이름 사전으로 한글 표기를 제안합니다. 화면에서는 영어 인명 기준으로 자동 제안하며 별도 모드 선택은 제공하지 않습니다. Chris → 크리스, Daeyeol → 대열을 지원합니다. **범용 자동 음역 엔진 또는 국립국어원 검증 서비스가 아닙니다.** 알 수 없는 이름은 추정 표기를 생성하지 않고 직접 한글 입력을 요청합니다. 자동 제안도 실제 발음 확인 후 수정·확인이 필요합니다.
- 외국 인명의 한글 표기는 '국어의 로마자 표기법'이 아니라 발음을 기준으로 하는 '외래어 표기법'을 참고합니다. https://www.korean.go.kr/kornorms/main/main.do
- 등록관 서명, 관인, 보안 무늬, 바코드를 복제하지 않습니다. PDF는 명확히 한글 번역문으로 표시합니다.
- PDF에 Nanum Gothic 글꼴을 포함하며, 텍스트 선택/검색이 가능합니다. 라이선스: `public/fonts/OFL.txt`.

## 개인정보

사용자 원본·번역 PDF와 실제 가족 정보는 프로젝트에 포함하지 않습니다. 입력값은 현재 탭의 메모리에만 유지하며 localStorage, 쿠키, 분석 도구, 외부 번역 API를 사용하지 않습니다. PDF는 브라우저에서 생성하며 글꼴과 라이브러리는 사이트와 함께 제공합니다. 새로고침하면 입력 정보가 사라집니다. 입력 정보는 서버에 전송하지 않습니다. 브라우저에서 저장한 PDF는 사용자가 관리합니다.

## 확인

단위 테스트와 데스크톱/모바일 브라우저 확인, 가상 데이터 PDF 생성 및 시각 검사를 수행합니다. 정부나 영사관 공식 서비스가 아니며 제출 전 원본과 번역문을 대조해야 합니다.

## 로고와 안내 출처

- 내비게이션 로고: 이 프로젝트용으로 제작한 SVG.
- Alberta Canada: 알버타 정부가 공개한 Visual Identity Manual (2018), §2.2.3.1의 세로형 로고. 공식 공개 자료의 로고 영역을 그대로 렌더링했습니다. 출처: https://open.alberta.ca/dataset/ed5f57ac-9484-4f8c-94ed-99a808fa2248/resource/d81424b8-d293-4032-acb8-6334429159b8/download/visual-identity-manual.pdf
- 등록관 원형 장식은 요청한 문구를 배치한 자체 SVG이며 공식 관인을 복제한 것이 아닙니다.
- 제출 안내: https://www.mofa.go.kr/ca-vancouver-ko/brd/m_4576/view.do?seq=611226 (2026-09-14 확인).
- PDF: Letter 612 × 792 pt. 모/부 성명, 자간을 넓힌 일련번호, 번역자 표와 연한 (인) 표시.
