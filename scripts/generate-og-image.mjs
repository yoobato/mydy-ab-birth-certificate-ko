import {readFile} from 'node:fs/promises';
import {chromium} from '@playwright/test';
const root = new URL('../', import.meta.url);
const font = (await readFile(new URL('public/fonts/NanumGothic-Regular.ttf', root))).toString('base64');
const logo = (await readFile(new URL('public/logo.svg', root))).toString('base64');
const browser = await chromium.launch();
try {
  const page = await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
  await page.setContent(`<!doctype html><html lang="ko"><meta charset="utf-8"><style>
  @font-face{font-family:Nanum;src:url(data:font/ttf;base64,${font})}*{box-sizing:border-box}body{margin:0;background:#f0f2e9;color:#274b43;font-family:Nanum,sans-serif}main{height:630px;padding:54px 62px;position:relative;overflow:hidden;border:16px solid #dce5db}.brand{display:flex;align-items:center;gap:16px;font-size:22px}.brand img{width:50px;height:50px}h1{font-size:52px;line-height:1.4;letter-spacing:-2px;margin:44px 0 20px}p{font-size:23px;color:#62776e;line-height:1.7;margin:0}.pill{margin-top:30px;display:inline-block;background:#2e574b;color:white;border-radius:9px;padding:14px 20px;font-size:21px}.url{position:absolute;bottom:38px;font-size:17px;letter-spacing:1px;color:#74857c}.doc{position:absolute;right:63px;top:135px;width:270px;height:350px;background:#fffef9;border:1px solid #b8c9bd;border-radius:10px;transform:rotate(7deg);box-shadow:0 15px 35px #2e574b15;padding:30px}.doc strong{font-size:24px}.rule{height:1px;background:#d8e1d8;margin:25px 0}.doc span{display:block;font-size:14px;color:#7b8d80}.doc b{display:block;font-size:35px;margin-top:25px;color:#2e574b}.doc small{display:block;margin-top:13px;font-size:15px;color:#7b8d80}
  </style><main><div class="brand"><img src="data:image/svg+xml;base64,${logo}" alt="">Translate Alberta Birth Certificate to Korean</div><h1>알버타 출생증명서<br>한글 번역문 생성</h1><p>주밴쿠버 대한민국 총영사관 앞 출생신고 시<br>제출해야하는 알버타주 출생증명서<br>한글 번역문 생성</p><div class="pill">브라우저에서 간편하게 작성하세요</div><div class="doc"><strong>출생증명서</strong><div class="rule"></div><span>한글 번역문</span><div class="rule"></div><b>PDF</b></div><div class="url">ab-birthcert-ko.mydy.kr</div></main></html>`);
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:new URL('public/og-image.png',root).pathname});
} finally {await browser.close();}
