(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.CATPAW_CORE=api;
})(typeof globalThis!=='undefined'?globalThis:this,()=>{
  'use strict';
  function validFrame(value){
    try { const u=new URL(value); return u.protocol==='https:' && !!u.hostname && !u.username && !u.password; }
    catch { return false; }
  }
  async function buildP2Payload(input){
    const frame=String(input.first_frame_url||'').trim();
    const prompt=String(input.prompt||'').trim();
    const budget=input.budget_max_twd;
    if(!validFrame(frame)) throw new Error('首幀須為有效 HTTPS 網址，且不可含登入帳密。');
    if(!prompt) throw new Error('請填入影片提示詞。');
    if(typeof budget!=='number'||!Number.isFinite(budget)||budget<=0||budget>15)
      throw new Error('單筆預算必須大於 0 且不超過 NT$15。');
    const revision=input.revision===undefined?0:input.revision;
    if(!Number.isSafeInteger(revision)||revision<0) throw new Error('任務修訂號必須為非負整數。');
    // Explicit ordered fields form a stable contract; never include time or randomness.
    const identity=JSON.stringify({version:'p2.v1',pipeline:'A',provider:'runninghub',
      first_frame_url:frame,prompt,budget_max_twd:budget,duration_seconds:5,revision});
    const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(identity));
    const hash=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
    return {pipeline_id:'A',provider:'runninghub',universe:'貓掌江湖',
      title:'CatPaw P2 單筆 5 秒測片',first_frame_url:frame,prompt,budget_max_twd:budget,
      publish:false,approval:'APPROVE_SINGLE_PAID_TEST',idempotency_key:'catpaw-p2-v1-'+hash};
  }
  // Compare against an actual exported graph, not the screen's displayed values.
  // Binding widget_index must be verified for that exact workflow/node version.
  function verifyMapping(graph,bindings){
    const errors=[];
    if(!graph||!Array.isArray(graph.nodes)||!Array.isArray(bindings)||!bindings.length)
      return {ok:false,errors:['MAPPING_OR_GRAPH_MISSING']};
    for(const b of bindings){
      if(!b||!Number.isSafeInteger(b.node_id)||!Number.isSafeInteger(b.widget_index)||
        b.widget_index<0||typeof b.node_type!=='string'||!b.node_type||!Object.hasOwn(b,'expected')){
        errors.push('INVALID_BINDING'); continue;
      }
      const matches=graph.nodes.filter(n=>n.id===b.node_id);
      if(matches.length!==1){errors.push('NODE_NOT_UNIQUE:'+b.node_id);continue;}
      const node=matches[0];
      if(node.type!==b.node_type) errors.push('NODE_TYPE_MISMATCH:'+b.node_id);
      if((node.mode??0)!==0) errors.push('NODE_DISABLED:'+b.node_id);
      if(!Array.isArray(node.widgets_values)||b.widget_index>=node.widgets_values.length)
        errors.push('WIDGET_MISSING:'+b.node_id);
      else if(JSON.stringify(node.widgets_values[b.widget_index])!==JSON.stringify(b.expected))
        errors.push('VALUE_MISMATCH:'+b.node_id+':'+b.widget_index);
    }
    return {ok:errors.length===0,errors};
  }
  return {buildP2Payload,verifyMapping};
});
