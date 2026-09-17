export const formatPrix = (n) => `${Number(n).toLocaleString("fr-FR")} GNF`;

export const tempsRelatif = (date) => {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return "à l'instant";
  const m = Math.floor(s / 60);
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h} h`;
  const j = Math.floor(h / 24);
  if (j < 30) return `il y a ${j} j`;
  return new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

export const SECTEUR_EMOJI = { PECHE: "🐟", ELEVAGE: "🐄", AGRICULTURE: "🌾" };
