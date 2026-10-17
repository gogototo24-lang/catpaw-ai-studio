// PixVerse Platform API v2 provider
// Server-side only. Never expose PIXVERSE_API_KEY in browser code.
export const PIXVERSE_BASE_URL = "https://app-api.pixverse.ai/openapi/v2";

function traceId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function headers(apiKey, json=true) {
  const h = {
    "API-KEY": apiKey,
    "Ai-trace-id": traceId(),
  };
  if (json) h["Content-Type"] = "application/json";
  return h;
}

async function parsePixverse(res) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`PixVerse HTTP ${res.status}: ${JSON.stringify(body)}`);
  if (body.ErrCode !== 0) throw new Error(`PixVerse ${body.ErrCode}: ${body.ErrMsg || "unknown error"}`);
  return body.Resp;
}

export async function uploadImage({ apiKey, file, fileName="reference.png", mimeType="image/png" }) {
  if (!apiKey) throw new Error("PIXVERSE_API_KEY missing");
  const form = new FormData();
  const blob = file instanceof Blob ? file : new Blob([file], { type: mimeType });
  form.append("image", blob, fileName);
  const res = await fetch(`${PIXVERSE_BASE_URL}/image/upload`, {
    method: "POST",
    headers: headers(apiKey, false),
    body: form,
  });
  return parsePixverse(res);
}

export async function createImageToVideo({
  apiKey,
  imgId,
  prompt,
  negativePrompt="",
  model="v6",
  quality="720p",
  duration=5,
  motionMode="normal",
  cameraMovement,
  templateId,
  seed=0,
  soundEffectSwitch=false,
  soundEffectContent="",
}) {
  if (!apiKey) throw new Error("PIXVERSE_API_KEY missing");
  if (!imgId) throw new Error("imgId required");
  if (!prompt) throw new Error("prompt required");

  const body = {
    duration,
    img_id: Number(imgId),
    model,
    motion_mode: motionMode,
    prompt,
    quality,
    seed,
  };
  if (negativePrompt) body.negative_prompt = negativePrompt;
  if (cameraMovement) body.camera_movement = cameraMovement;
  if (templateId) body.template_id = Number(templateId);
  if (soundEffectSwitch) {
    body.sound_effect_switch = true;
    if (soundEffectContent) body.sound_effect_content = soundEffectContent;
  }

  const res = await fetch(`${PIXVERSE_BASE_URL}/video/img/generate`, {
    method: "POST",
    headers: headers(apiKey, true),
    body: JSON.stringify(body),
  });
  return parsePixverse(res);
}

export async function createTextToVideo({
  apiKey,
  prompt,
  negativePrompt="",
  aspectRatio="9:16",
  model="v6",
  quality="720p",
  duration=5,
  motionMode="normal",
  cameraMovement,
  templateId,
  seed=0,
}) {
  if (!apiKey) throw new Error("PIXVERSE_API_KEY missing");
  if (!prompt) throw new Error("prompt required");
  const body = {
    aspect_ratio: aspectRatio,
    duration,
    model,
    motion_mode: motionMode,
    prompt,
    quality,
    seed,
  };
  if (negativePrompt) body.negative_prompt = negativePrompt;
  if (cameraMovement) body.camera_movement = cameraMovement;
  if (templateId) body.template_id = Number(templateId);

  const res = await fetch(`${PIXVERSE_BASE_URL}/video/text/generate`, {
    method: "POST",
    headers: headers(apiKey, true),
    body: JSON.stringify(body),
  });
  return parsePixverse(res);
}

export async function getVideoResult({ apiKey, videoId }) {
  if (!apiKey) throw new Error("PIXVERSE_API_KEY missing");
  if (!videoId) throw new Error("videoId required");
  const res = await fetch(`${PIXVERSE_BASE_URL}/video/result/${videoId}`, {
    headers: headers(apiKey, false),
  });
  return parsePixverse(res);
}

export async function waitForVideo({ apiKey, videoId, pollMs=5000, timeoutMs=240000 }) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const result = await getVideoResult({ apiKey, videoId });
    if (result.status === 1 && result.url) return result;
    if (result.status === 7) throw new Error("PixVerse moderation failed");
    if (result.status === 8) throw new Error("PixVerse generation failed");
    await new Promise(r => setTimeout(r, pollMs));
  }
  throw new Error("PixVerse generation timeout");
}
