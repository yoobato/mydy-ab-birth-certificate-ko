import test from 'node:test';
import assert from 'node:assert/strict';
import {createAnalytics, MEASUREMENT_ID} from '../src/analytics.js';

test('only fixed telemetry is queued; user data and arbitrary event names are excluded',()=>{
  const scripts=[];const win={location:{href:'https://example.com/?name=PRIVATE#PRIVATE'},document:{referrer:'PRIVATE'}};
  const doc={createElement:()=>({}),head:{appendChild:s=>scripts.push(s)}};
  const analytics=createAnalytics(win,doc,true);
  analytics.track('page_view');analytics.track('translation_preview',{name:'PRIVATE'});analytics.track('pdf_download');analytics.track('PRIVATE');
  const commands=win.dataLayer.map(a=>Array.from(a));
  assert.deepEqual(commands.filter(a=>a[0]==='event').map(a=>a[1]),['page_view','translation_preview','pdf_download']);
  assert.ok(!JSON.stringify(commands).includes('PRIVATE'));
  assert.equal(commands.find(a=>a[0]==='config')[2].send_page_view,false);
  assert.equal(commands.find(a=>a[0]==='config')[2].allow_google_signals,false);
  assert.equal(scripts[0].src,`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`);
  assert.equal(scripts[0].referrerPolicy,'no-referrer');
});
test('development does not load Google or queue telemetry',()=>{
  const win={};const analytics=createAnalytics(win,{createElement(){throw Error('must not load')}},false);
  analytics.track('page_view');assert.equal(win.dataLayer,undefined);
});
