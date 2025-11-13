import { cosineSimilarity, getEmbedding } from "./aiSearch";

const MOCK_DATA = [
  { id: 1, title: "Hanami", description: "Festivalul florilor de cireș.", country: "JP", image: "https://example.com/hanami.jpg" },
  { id: 2, author: "User", description: "Eveniment cultural.", country: "PL", image: "https://picsum.photos/seed/pol2/400/300" },
];

let dataEmbeddings = [];

const preloadEmbeddings = async () => {
  console.log("Încarc AI embeddings...");
  dataEmbeddings = [];
  for (const item of MOCK_DATA) {
    const text = `${item.title || ""} ${item.description || ""} ${item.location || ""} ${item.author || ""} ${item.country || ""}`.trim();
    const emb = await getEmbedding(text);
    if (emb) {
      dataEmbeddings.push({ item, emb });
    }
  }
  console.log("AI Search gata! (" + dataEmbeddings.length + " embeddings)");
};

preloadEmbeddings();

export const searchEventsByKeyword = async (keyword) => {
  if (!keyword?.trim()) return [];

  const kw = keyword.trim().toLowerCase();

  // 1. @autor
  if (kw.startsWith("@")) {
    const author = kw.slice(1);
    return MOCK_DATA.filter(item => item.author?.toLowerCase().includes(author));
  }

  // 2. AI Search
  const queryEmb = await getEmbedding(kw);
  if (queryEmb && dataEmbeddings.length > 0) {
    console.log("AI: Căutare semantică...");
    const results = dataEmbeddings
      .map(({ item, emb }) => ({
        item,
        score: cosineSimilarity(queryEmb, emb)
      }))
      .filter(r => r.score > 0.25)
      .sort((a, b) => b.score - a.score)
      .map(r => r.item);

    if (results.length > 0) {
        console.log("AI: Găsite", results.length, "rezultate");
        return results;
      }
  }

  // 3. FALLBACK: căutare text cu diacritice
  console.log("Fallback: căutare text...");
  const norm = (s) => s?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
  return MOCK_DATA.filter(item => {
    const full = `${item.title} ${item.description} ${item.location} ${item.author} ${item.country}`;
    return norm(full).includes(norm(kw));
  });
};

export const getEventsByCountry = async (code) => {
  await new Promise(r => setTimeout(r, 600));
  return MOCK_DATA.filter(item => item.country === code);
};