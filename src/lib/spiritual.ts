// LOGIQUE ÉSOTÉRIQUE KHATIMMASTER PRO MAX PLUS
// Centralisation de l'Abjad et de la Science des Éléments

export const ARABIC_WEIGHTS: Record<string, number> = {
  "ا": 1, "أ": 1, "إ": 1, "آ": 1, "ء": 1,
  "ب": 2, "ت": 400, "ث": 500, "ج": 3, "ح": 8,
  "خ": 600, "د": 4, "ذ": 700, "r": 200, "ز": 7,
  "س": 60, "ش": 300, "ص": 90, "ض": 800, "ط": 9,
  "ظ": 900, "ع": 70, "غ": 1000, "ف": 80, "ق": 100,
  "ك": 20, "ل": 30, "م": 40, "ن": 50, "ه": 5,
  "و": 6, "ي": 10, "ى": 10, "ة": 5, "ر": 200
};

export const ELEMENT_MAP: Record<string, 'Fire' | 'Air' | 'Water' | 'Earth'> = {
  "ا": 'Fire', "ه": 'Fire', "ط": 'Fire', "م": 'Fire', "ف": 'Fire', "ش": 'Fire', "ذ": 'Fire',
  "ب": 'Air', "و": 'Air', "ي": 'Air', "ن": 'Air', "ص": 'Air', "ت": 'Air', "ض": 'Air',
  "ج": 'Water', "ز": 'Water', "ك": 'Water', "س": 'Water', "ق": 'Water', "ث": 'Water', "ظ": 'Water',
  "د": 'Earth', "ح": 'Earth', "ل": 'Earth', "ع": 'Earth', "ر": 'Earth', "خ": 'Earth', "غ": 'Earth',
  "أ": 'Fire', "إ": 'Fire', "آ": 'Fire', "ء": 'Fire', "ى": 'Air', "ة": 'Fire'
};

export const NATURES = {
  Fire: { name: 'Feu', arabic: 'نار', color: '#ef4444', gradient: 'from-orange-600 to-red-600', desc: 'Action, courage, force motrice et transformation.' },
  Air: { name: 'Air', arabic: 'هواء', color: '#06b6d4', gradient: 'from-cyan-500 to-blue-500', desc: 'Intuition, communication, expansion et souffle.' },
  Water: { name: 'Eau', arabic: 'ماء', color: '#3b82f6', gradient: 'from-blue-600 to-indigo-600', desc: 'Sagesse, calme, purification et profondeur.' },
  Earth: { name: 'Terre', arabic: 'أرض', color: '#10b981', gradient: 'from-emerald-600 to-teal-600', desc: 'Stabilité, patience, enracinement et croissance.' },
};

export const DIVINE_NAMES = [
  { name: "Ar-Rahman", arabic: "الرحمن", pm: 298, meaning: "Le Très-Miséricordieux" },
  { name: "Ar-Rahim", arabic: "الرحيم", pm: 258, meaning: "Le Tout-Miséricordieux" },
  { name: "Al-Malik", arabic: "الملك", pm: 90, meaning: "Le Souverain" },
  { name: "Al-Quddus", arabic: "القدوس", pm: 170, meaning: "Le Saint" },
  { name: "As-Salam", arabic: "السلام", pm: 131, meaning: "La Paix" },
  { name: "Al-Mu'min", arabic: "المؤمن", pm: 136, meaning: "La Sauvegarde" },
  { name: "Al-Muhaymin", arabic: "المهيمن", pm: 145, meaning: "Le Préservateur" },
  { name: "Al-Aziz", arabic: "العزيز", pm: 94, meaning: "Le Tout-Puissant" },
  { name: "Al-Jabbar", arabic: "الجبار", pm: 206, meaning: "Le Contraignant" },
  { name: "Al-Mutakabbir", arabic: "المتكبر", pm: 662, meaning: "Le Superbe" },
  { name: "Al-Khaliq", arabic: "الخالق", pm: 731, meaning: "Le Créateur" },
  { name: "Al-Bari", arabic: "البارئ", pm: 213, meaning: "Le Producteur" },
  { name: "Al-Musawwir", arabic: "المصور", pm: 336, meaning: "Le Formateur" },
  { name: "Al-Ghaffar", arabic: "الغفار", pm: 1281, meaning: "Le Pardonneur" },
  { name: "Al-Qahhar", arabic: "القهار", pm: 306, meaning: "Le Dominateur" },
  { name: "Al-Wahhab", arabic: "الوهاب", pm: 14, meaning: "Le Donateur" },
  { name: "Ar-Razzaq", arabic: "الرزاق", pm: 308, meaning: "Le Pourvoyeur" },
  { name: "Al-Fattah", arabic: "الفتاح", pm: 489, meaning: "Celui qui ouvre" },
  { name: "Al-Alim", arabic: "العليم", pm: 150, meaning: "L'Omniscient" },
  { name: "Al-Latif", arabic: "اللطif", pm: 129, meaning: "Le Subtil" },
  { name: "Al-Khabir", arabic: "الخبير", pm: 812, meaning: "Le Bien-Informé" },
  { name: "Al-Halim", arabic: "الحليم", pm: 88, meaning: "Le Clément" },
  { name: "Al-Azim", arabic: "العظيم", pm: 1020, meaning: "L'Immense" },
  { name: "Al-Ghafur", arabic: "الغفور", pm: 1286, meaning: "Le Tout-Pardonneur" },
  { name: "Ash-Shakur", arabic: "الشكور", pm: 526, meaning: "Le Reconnaissant" },
  { name: "Al-Ali", arabic: "العلي", pm: 110, meaning: "Le Très-Haut" },
  { name: "Al-Kabir", arabic: "الكبير", pm: 232, meaning: "Le Grand" },
  { name: "Al-Hafiz", arabic: "الحفيظ", pm: 998, meaning: "Le Gardien" },
  { name: "Al-Wadud", arabic: "الودود", pm: 20, meaning: "L'Aimant" },
  { name: "Al-Matin", arabic: "المتين", pm: 500, meaning: "Le Robuste" },
  { name: "Al-Wali", arabic: "الولي", pm: 46, meaning: "Le Protecteur" },
  { name: "Al-Hamid", arabic: "الحميد", pm: 62, meaning: "Le Louable" },
  { name: "Al-Hayy", arabic: "الحي", pm: 18, meaning: "Le Vivant" },
  { name: "Al-Qayyum", arabic: "القيوم", pm: 156, meaning: "L'Immuable" },
  { name: "Al-Ahad", arabic: "الاحد", pm: 13, meaning: "L'Unique" },
  { name: "As-Samad", arabic: "الصمد", pm: 134, meaning: "L'Absolu" },
  { name: "Al-Ghani", arabic: "الغني", pm: 1060, meaning: "Le Riche" },
  { name: "An-Nur", arabic: "النور", pm: 256, meaning: "La Lumière" },
  { name: "Al-Hadi", arabic: "الهادي", pm: 20, meaning: "Le Guide" },
  { name: "Allah", arabic: "الله", pm: 66, meaning: "Dieu" }
];

export const BOURDJ = [
  "Bélier (Al-Hamal)", "Taureau (Al-Thawr)", "Gémeaux (Al-Jawza)", 
  "Cancer (Al-Saratan)", "Lion (Al-Asad)", "Vierge (Al-Sunbula)",
  "Balance (Al-Mizan)", "Scorpion (Al-Aqrab)", "Sagittaire (Al-Qaws)",
  "Capricorne (Al-Jady)", "Verseau (Al-Dalw)", "Poissons (Al-Hut)"
];

export const ANGELS = ["Azrail", "Israfil", "Mikail", "Jibril"];
export const DAYS = ["Samedi", "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

export function calculatePM(text: string) {
  let total = 0;
  const normalized = text.toLowerCase().trim();
  for (const char of normalized) {
    total += ARABIC_WEIGHTS[char] || 0;
  }
  return total;
}

export function findMatchingDivineName(targetPm: number) {
  // Find name with closest PM or multiple names that sum to targetPm
  // For simplicity, we find the closest single name first
  return DIVINE_NAMES.reduce((prev, curr) => {
    return (Math.abs(curr.pm - targetPm) < Math.abs(prev.pm - targetPm) ? curr : prev);
  });
}

export function calculateAbjad(text: string) {
  return calculatePM(text);
}

export function getElementInfo(total: number) {
  const elMod = (total % 4) || 4;
  const elementKey = (Object.keys(NATURES) as Array<keyof typeof NATURES>)[elMod - 1];
  return NATURES[elementKey];
}

export function calculateSpiritualProfile(name: string, motherName?: string) {
  if (!name) return null;

  const pmName = calculatePM(name);
  const pmMother = motherName ? calculatePM(motherName) : 0;
  const total = pmName + pmMother;

  // Éléments
  const decomposition = { Fire: 0, Air: 0, Water: 0, Earth: 0 };
  for (const char of name) {
    const element = ELEMENT_MAP[char];
    if (element) decomposition[element] += ARABIC_WEIGHTS[char] || 0;
  }

  const sortedElements = Object.entries(decomposition)
    .map(([key, value]) => ({
      key: key as keyof typeof NATURES,
      value,
      percentage: pmName > 0 ? (value / pmName) * 100 : 0
    }))
    .sort((a, b) => b.value - a.value);

  // Modulos pour Profile complet
  const elMod = (total % 4) || 4;
  const bMod = (total % 12) || 12;

  const elementKey = (Object.keys(NATURES) as Array<keyof typeof NATURES>)[elMod - 1];
  
  const divineName = findMatchingDivineName(total);

  return {
    pmName,
    pmMother,
    total,
    decomposition: sortedElements,
    dominant: NATURES[sortedElements[0].key],
    natureElement: NATURES[elementKey],
    star: BOURDJ[bMod - 1],
    angel: ANGELS[total % 4],
    luckDay: DAYS[total % 7],
    natureIndex: total % 4,
    divineName
  };
}
