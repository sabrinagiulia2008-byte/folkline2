const HF_API_KEY = "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";
const MODEL_URL = "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2";

let cache = {};

export const getEmbedding = async (text) => {
  if (!text?.trim()) return null;
  const key = text.trim();
  if (cache[key]) return cache[key];

  try {
    const res = await fetch(MODEL_URL, {
      method: "POST",
      headers: { "Authorization": `Bearer ${HF_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: key })
    });
    const data = await res.json();
    const emb = data?.[0];
    if (emb) cache[key] = emb;
    return emb;
  } catch { return null; }
};

export const cosineSimilarity = (a, b) => {
  if (!a || !b) return 0;
  let dot = 0, n1 = 0, n2 = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    n1 += a[i] ** 2;
    n2 += b[i] ** 2;
  }
  return dot / (Math.sqrt(n1) * Math.sqrt(n2)) || 0;
};