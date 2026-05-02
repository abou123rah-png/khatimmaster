// LOGIQUE ÉSOTÉRIQUE KHATIMMASTER PRO MAX PLUS
// Centralisation de l'Abjad et de la Science des Éléments

export const ARABIC_WEIGHTS: Record<string, number> = {
  "ا": 1, "أ": 1, "إ": 1, "آ": 1, "ء": 1,
  "ب": 2, "ت": 400, "ث": 500, "ج": 3, "ح": 8,
  "خ": 600, "د": 4, "ذ": 700, "ر": 200, "ز": 7,
  "س": 60, "ش": 300, "ص": 90, "ض": 800, "ط": 9,
  "ظ": 900, "ع": 70, "غ": 1000, "ف": 80, "ق": 100,
  "ك": 20, "ل": 30, "م": 40, "ن": 50, "ه": 5,
  "و": 6, "ي": 10, "ى": 10, "ة": 5
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
  for (const char of text) {
    total += ARABIC_WEIGHTS[char] || 0;
  }
  return total;
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
    natureIndex: total % 4
  };
}
