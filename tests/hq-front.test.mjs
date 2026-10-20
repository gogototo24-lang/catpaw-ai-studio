import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';

const html=readFileSync(new URL('../hq.html',import.meta.url),'utf8');
const docs=readFileSync(new URL('../docs/UNIVERSE_HQ.md',import.meta.url),'utf8');

test('mobile HQ contains director, four pipeline floors and Muse worker area',()=>{
  for(const token of ['喵掌台灣','總指揮塔','貓掌江湖＋喵台灣','合法時尚視覺','全自動音樂 MV','長影片漫劇','Muse 工人工作區']){
    assert.ok(html.includes(token),token);
  }
  assert.ok(html.includes('viewport'));
  assert.ok(html.includes('max-width:570px'));
});

test('HQ uses existing protected D1-backed Worker API not direct social publishing',()=>{
  assert.ok(html.includes('threads-scheduler.gogototo24.workers.dev/api/factory/hq'));
  for(const endpoint of ['/public','/state','/mock-run','/roles/','/jobs'])
    assert.ok(html.includes(endpoint),endpoint);
  assert.equal(html.includes('threads_publish?'),false);
  assert.equal(html.includes('metricool.com'),false);
});

test('admin secret remains only in page memory, no persistence or public code',()=>{
  assert.ok(html.includes("let adminKey=''"));
  assert.ok(html.includes("credentials:'omit'"));
  assert.equal(html.includes('localStorage.setItem'),false);
  assert.equal(html.includes('sessionStorage.setItem'),false);
  assert.ok(html.includes("adminKey=''"));
});

test('recruitment and production status are clearly separated',()=>{
  assert.ok(html.includes('任命 ≠ API 已接通'));
  assert.ok(html.includes('尚未連線'));
  assert.ok(html.includes('API 未驗證'));
  assert.ok(docs.includes('未接'));
  assert.ok(docs.includes('不會扣 RunningHub 幣'));
});

test('inline browser controller is JavaScript-syntax valid',()=>{
 const match=html.match(/<script>([\s\S]*?)<\/script>/);
 assert.ok(match,'Controller script exists');
 assert.doesNotThrow(()=>new Script(match[1]));
});
