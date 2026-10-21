import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const flow=JSON.parse(readFileSync(new URL('../n8n/catpaw-p5-production-official-rss-to-threads.n8n.json', import.meta.url),'utf8'));

const rssNode=flow.nodes[0], gate=flow.nodes[1], publish=flow.nodes[2], receipt=flow.nodes[3];

test('production workflow is a four-step RSS-to-Threads original pipeline, safely inactive on import',()=>{
 assert.equal(flow.active,false);
 assert.deepEqual(flow.nodes.map(n=>n.type),[
  'n8n-nodes-base.rssFeedReadTrigger','n8n-nodes-base.code',
  'n8n-nodes-base.httpRequest','n8n-nodes-base.code']);
 assert.equal(rssNode.parameters.feedUrl,'https://www.moc.gov.tw/OpenData.aspx?SN=C4E4E3A8E687AD91');
 assert.equal(rssNode.parameters.pollTimes.item[0].value,10);
 assert.equal(publish.parameters.method,'POST');
 assert.equal(publish.parameters.url,'https://threads-scheduler.gogototo24.workers.dev/api/factory/p5/fastlane');
 assert.equal(publish.parameters.authentication,'genericCredentialType');
 assert.equal(publish.parameters.genericAuthType,'httpHeaderAuth');
 assert.equal(publish.retryOnFail,false);
 assert.equal(flow.settings.timezone,'Asia/Taipei');
});

test('no secret or credential embedded, no Metricool route or bulk publishing',()=>{
 const text=JSON.stringify(flow);
 assert.ok(!text.includes('p5s_'));
 assert.ok(!text.includes('ADMIN_KEY'));
 assert.ok(!text.includes('metricool.com'));
 assert.ok(!text.includes('threads_publish?'));
 assert.ok(flow.nodes.every(node=>!node.credentials));
 assert.ok(gate.parameters.jsCode.includes('slice(0,1)'));
});

test('fresh official cultural item creates one original low-risk candidate',()=>{
 const work=new Function('$input',gate.parameters.jsCode);
 const a={json:{title:'臺灣布袋戲特展正式開幕！',
  link:'https://www.moc.gov.tw/News_Content.aspx?n=105&s=123',
  isoDate:new Date(Date.now()-5*60*1000).toISOString()}};
 const result=work({all:()=>[a]});
 assert.equal(result.length,1);
 assert.equal(result[0].json.category,'culture');
 assert.equal(result[0].json.verification_method,'official');
 assert.equal(result[0].json.contains_unlicensed_media,false);
 assert.ok(result[0].json.text.includes(result[0].json.source_url));
 assert.ok(Array.from(result[0].json.text).length<=500);
});

test('political, sensitive, old or untrusted articles are ignored before the publish node',()=>{
 const work=new Function('$input',gate.parameters.jsCode);
 const recent=new Date(Date.now()-4*60000).toISOString();
 const old=new Date(Date.now()-4*3600000).toISOString();
 const template={link:'https://www.moc.gov.tw/News_Content.aspx?s=456',isoDate:recent};
 const inputs=[
  {...template,title:'政治選舉藝術展覽開幕'},
  {...template,title:'性別議題文化藝術特展'},
  {...template,title:'地方藝文展覽',link:'https://evil.example.com/article'},
  {...template,title:'文化工藝博物館新展',isoDate:old}
 ].map(json=>({json}));
 assert.deepEqual(work({all:()=>inputs}),[]);
});

test('result receipt does not claim publication when only queued',()=>{
 const decode=new Function('$json',receipt.parameters.jsCode);
 const wait=decode({action_id:'fake-id',status:'queued',published:false});
 assert.equal(wait.json.published,false);
 assert.equal(wait.json.thread_id,null);
 assert.equal(wait.json.requires_attention,false);
 const success=decode({action_id:'fake-id',status:'sent',published:true,thread_id:'123',permalink:'https://www.threads.com/@demo/post/123'});
 assert.equal(success.json.published,true);
 assert.equal(success.json.permalink,'https://www.threads.com/@demo/post/123');
 const unknown=decode({action_id:'fake-id',status:'publish_unknown',published:false});
 assert.equal(unknown.json.requires_attention,true);
});
