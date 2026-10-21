import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const path=new URL('../n8n/catpaw-p5-scout-auth-check.n8n.json',import.meta.url);
const raw=readFileSync(path,'utf8');
const flow=JSON.parse(raw);
test('workflow is inactive and contains only a manual read-only authorization check',()=>{
 assert.equal(flow.active,false);
 assert.equal(flow.nodes.length,3);
 assert.deepEqual(flow.nodes.map(x=>x.type),[
  'n8n-nodes-base.manualTrigger',
  'n8n-nodes-base.httpRequest',
  'n8n-nodes-base.code'
 ]);
 const http=flow.nodes[1].parameters;
 assert.equal(http.method,'GET');
 assert.equal(http.authentication,'genericCredentialType');
 assert.equal(http.genericAuthType,'httpHeaderAuth');
 assert.equal(http.url,'https://threads-scheduler.gogototo24.workers.dev/api/factory/p5/fastlane/health');
});
test('workflow contains no embedded token or plaintext credentials',()=>{
 assert.equal(raw.includes('x-p5-scout-key'),false);
 assert.equal(raw.includes('p5s_'),false);
 assert.equal(raw.includes('ADMIN_KEY'),false);
 assert.equal(flow.nodes[1].parameters.url.includes('/threads_publish'),false);
 assert.equal(flow.nodes.some(n=>n.credentials),false);
});
test('n8n connections reach final safe result and never call posting endpoint',()=>{
 assert.equal(flow.connections['手動開始｜安全測試'].main[0][0].node,'P5 授權健康檢查（GET）');
 assert.equal(flow.connections['P5 授權健康檢查（GET）'].main[0][0].node,'解讀測試結果（不含密鑰）');
 assert.ok(flow.nodes[2].parameters.jsCode.includes('P5_SCOUT_KEY_VALID_HTTP_200'));
});
