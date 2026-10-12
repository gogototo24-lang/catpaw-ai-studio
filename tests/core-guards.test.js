const test=require('node:test');
const assert=require('node:assert/strict');
const {buildP2Payload,verifyMapping}=require('../factory/core-guards.js');
const input={first_frame_url:'https://assets.example/sang.png',prompt:'female cat performs one move',budget_max_twd:5};
test('same request keeps the same key across retries',async()=>{
  assert.equal((await buildP2Payload(input)).idempotency_key,(await buildP2Payload({...input})).idempotency_key);
  assert.equal((await buildP2Payload({...input,prompt:' '+input.prompt+' '})).idempotency_key,(await buildP2Payload(input)).idempotency_key);
});
test('changes to image, prompt, budget or explicit revision produce another identity',async()=>{
  const base=(await buildP2Payload(input)).idempotency_key;
  for(const change of [{prompt:'different'},{first_frame_url:'https://assets.example/other.png'},{budget_max_twd:6},{revision:1}])
    assert.notEqual((await buildP2Payload({...input,...change})).idempotency_key,base);
});
test('malformed inputs never create a paid-test payload',async()=>{
  for(const change of [{first_frame_url:'https://'},{first_frame_url:'http://example.com/a'},
    {first_frame_url:'https://user:secret@example.com/a'},{prompt:' '},{budget_max_twd:NaN},
    {budget_max_twd:Infinity},{budget_max_twd:0},{budget_max_twd:16},{budget_max_twd:'5'},{revision:-1}])
    await assert.rejects(buildP2Payload({...input,...change}));
});
test('generated contract remains compatible and never permits publishing',async()=>{
  const p=await buildP2Payload(input);
  assert.equal(p.publish,false);assert.equal(p.provider,'runninghub');assert.equal(p.pipeline_id,'A');
  assert.equal(p.approval,'APPROVE_SINGLE_PAID_TEST');
});
const binding={node_id:188,node_type:'ResolutionSelector',widget_index:1,expected:0.4};
test('export catches the earlier 0.4 screen / 0.3 execution mismatch',()=>{
  const graph={nodes:[{id:188,type:'ResolutionSelector',mode:0,widgets_values:['9:16',0.3]}]};
  assert.equal(verifyMapping(graph,[binding]).ok,false);
  graph.nodes[0].widgets_values[1]=0.4;assert.equal(verifyMapping(graph,[binding]).ok,true);
});
test('missing, disabled, duplicate or changed nodes cannot pass mapping checks',()=>{
  for(const nodes of [[],[{id:188,type:'Wrong',widgets_values:['9:16',0.4]}],
    [{id:188,type:'ResolutionSelector',mode:4,widgets_values:['9:16',0.4]}],
    [{id:188,type:'ResolutionSelector',widgets_values:[]}],
    [{id:188},{id:188}]]) assert.equal(verifyMapping({nodes},[binding]).ok,false);
  assert.equal(verifyMapping({nodes:[]},[]).ok,false);
  assert.equal(verifyMapping({nodes:[]},[{}]).ok,false);
});
const fs=require('node:fs');
const vm=require('node:vm');
test('page does not copy an older valid payload after inputs become invalid',async()=>{
  const elements=new Map();
  const get=id=>{if(!elements.has(id)) elements.set(id,{value:'',textContent:'',innerHTML:'',addEventListener(){}});return elements.get(id);};
  let copied=0;
  const ctx={document:{getElementById:get},CATPAW_CORE:{buildP2Payload},
    CATPAW_FACTORY:{pipelines:{},list:()=>[]},
    fetch:async()=>({ok:true,json:async()=>({checks:{},missing:[]})}),
    navigator:{clipboard:{writeText:async()=>{copied++;}}},alert(){},console};
  vm.createContext(ctx);
  const html=fs.readFileSync(require('node:path').join(__dirname,'../factory.html'),'utf8');
  const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  vm.runInContext(scripts[0][1],ctx);
  get('p2Frame').value=input.first_frame_url;get('p2Prompt').value=input.prompt;get('p2Budget').value='5';
  assert.ok(await ctx.buildP2Payload());
  get('p2Prompt').value=' ';
  await ctx.copyP2Payload();assert.equal(copied,0);
  assert.match(get('p2Payload').textContent,/無法建立/);
});
