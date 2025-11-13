import { cosineSimilarity, getEmbedding } from "./aiSearch";

const MOCK_DATA = [
  { id: 1, title: "Hanami", description: "Festivalul florilor de cireș.", country: "JP", author: "sakura_lover", image: "https://picsum.photos/seed/hanami/400/300" },
  { id: 2, title: "Carnaval", description: "Parada din Rio.", country: "BR", author: "rio_dancer", image: "https://picsum.photos/seed/carnaval/400/300" },
  { id: 3, title: "Oktoberfest", description: "Bere și dansuri bavareze.", country: "DE", author: "bier_master", image: "https://picsum.photos/seed/oktober/400/300" },
  { id: 4, title: "Día de Muertos", description: "Ofrande și paradă.", country: "MX", author: "calavera_art", image: "https://picsum.photos/seed/muertos/400/300" },
  { id: 5, title: "Polonez Folk", description: "Dansuri tradiționale poloneze.", country: "PL", author: "folk_polska", image: "https://picsum.photos/seed/polska/400/300" },
  { id: 6, author: "maria_ionescu", description: "Sărbătoare la munte!", country: "RO", image: "https://picsum.photos/seed/romania1/400/300" },
  { id: 7, author: "ana_popescu", description: "Mărțișor și primăvară!", country: "RO", image: "https://picsum.photos/seed/martisor/400/300" },
  { id: 8, author: "taro_jp", description: "Ceai și kimono în Kyoto.", country: "JP", image: "https://picsum.photos/seed/kyoto/400/300" },
  { id: 9, author: "pedro_rio", description: "Samba la plajă!", country: "BR", image: "https://picsum.photos/seed/samba/400/300" },
  { id: 10, author: "hans_bier", description: "Pretzel și muzică live!", country: "DE", image: "https://picsum.photos/seed/pretzel/400/300" },
];

let dataEmbeddings = [];

const preloadEmbeddings = async () => {
  console.log("Încarc AI embeddings...");
  dataEmbeddings = [];
  for (const item of MOCK_DATA) {
    const text = `${item.title || ""} ${item.description || ""} ${item.author || ""} ${item.country || ""}`.trim();
    const emb = await getEmbedding(text);
    if (emb) dataEmbeddings.push({ item, emb });
  }
  console.log("AI gata! (" + dataEmbeddings.length + " embeddings)");
};

preloadEmbeddings();

export const searchEventsByKeyword = async (keyword) => {
  if (!keyword?.trim()) return [];
  const kw = keyword.trim().toLowerCase();

  if (kw.startsWith("@")) {
    const author = kw.slice(1);
    return MOCK_DATA.filter(i => i.author?.toLowerCase().includes(author));
  }

  const queryEmb = await getEmbedding(kw);
  if (queryEmb && dataEmbeddings.length > 0) {
    const results = dataEmbeddings
      .map(({ item, emb }) => ({ item, score: cosineSimilarity(queryEmb, emb) }))
      .filter(r => r.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .map(r => r.item);
    if (results.length > 0) return results;
  }

  const norm = (s) => s?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
  return MOCK_DATA.filter(item => {
    const full = `${item.title} ${item.description} ${item.author} ${item.country}`;
    return norm(full).includes(norm(kw));
  });
};

export const getEventsByCountry = async (code) => {
  await new Promise(r => setTimeout(r, 600));
  return MOCK_DATA.filter(item => item.country === code);
};