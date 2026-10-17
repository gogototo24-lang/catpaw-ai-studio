import assert from "node:assert/strict";
import {
  createImageToVideo,
  getVideoResult,
  waitForVideo,
  PIXVERSE_BASE_URL,
} from "../providers/pixverse-v2.js";

assert.equal(PIXVERSE_BASE_URL, "https://app-api.pixverse.ai/openapi/v2");

const calls=[];
let pollCount=0;
globalThis.fetch=async (url, init={})=>{
  calls.push({url:String(url),init});
  if(String(url).endsWith("/video/img/generate")){
    const body=JSON.parse(init.body);
    assert.equal(body.img_id,123);
    assert.equal(body.model,"v6");
    assert.equal(body.quality,"720p");
    assert.equal(body.duration,5);
    assert.equal(body.prompt,"test motion");
    assert.equal(init.headers["API-KEY"],"test-key");
    assert.ok(init.headers["Ai-trace-id"]);
    return new Response(JSON.stringify({ErrCode:0,ErrMsg:"success",Resp:{video_id:456}}),{status:200,headers:{"content-type":"application/json"}});
  }
  if(String(url).includes("/video/result/456")){
    pollCount++;
    const status=pollCount<2?5:1;
    return new Response(JSON.stringify({ErrCode:0,ErrMsg:"success",Resp:{id:456,status,url:status===1?"https://media.example/video.mp4":""}}),{status:200,headers:{"content-type":"application/json"}});
  }
  throw new Error("unexpected fetch "+url);
};

const submit=await createImageToVideo({apiKey:"test-key",imgId:123,prompt:"test motion"});
assert.equal(submit.video_id,456);
const result=await waitForVideo({apiKey:"test-key",videoId:456,pollMs:1,timeoutMs:1000});
assert.equal(result.status,1);
assert.equal(result.url,"https://media.example/video.mp4");

let missingKey=false;
try{ await createImageToVideo({imgId:123,prompt:"x"}); }catch(e){ missingKey=/API_KEY missing/.test(String(e.message)); }
assert.equal(missingKey,true);

console.log("PixVerse provider contract tests passed:", calls.length, "requests");
