import re
from arabic_reshaper import reshape
from bidi.algorithm import get_display

# ✅ Valeurs numériques des lettres arabes (système abjad)
arabic_weights = {
    "ا": 1, "ب": 2, "ج": 3, "د": 4, "ه": 5, "و": 6, "ز": 7, "ح": 8, "ط": 9,
    "ي": 10, "ك": 20, "ل": 30, "م": 40, "ن": 50, "س": 60, "ع": 70, "ف": 80, "ص": 90,
    "ق": 100, "ر": 200, "ش": 300, "ت": 400, "ث": 500, "خ": 600, "ذ": 700,
    "ض": 800, "ظ": 900, "غ": 1000
}

# ✅ Lettres selon leur nature (éléments)
pm_nature = {
    'feu': ['ا', 'أ', 'إ', 'آ', 'ط', 'م', 'ف', 'س', 'ذ', 'ه'],
    'terre': ['ب', 'و', 'ي', 'ن', 'ض', 'ت', 'ظ'],
    'air': ['ج', 'ز', 'ك', 'ص', 'ق', 'ث', 'غ', 'ح'],
    'eau': ['د', 'ل', 'ع', 'ر', 'خ', 'ش']
}

# ✅ Nettoyage du texte arabe
def nettoyer_arabe(texte):
    """
    Supprime les voyelles, shadda, maddah, tatweel, etc.
    Normalise les variantes de alif.
    """
    texte = re.sub(r'[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]', '', texte)
    texte = texte.replace("أ", "ا").replace("إ", "ا").replace("آ", "ا").replace("ٱ", "ا")
    return texte

# ✅ Calcul du poids mystique d’un texte arabe
def calculate_pm(texte):
    texte_nettoye = nettoyer_arabe(texte)
    return sum(arabic_weights.get(lettre, 0) for lettre in texte_nettoye)

# ✅ Ancienne fonction (alias)
def calculate_arabic_weight(mot_arabe):
    mot_arabe = nettoyer_arabe(mot_arabe)
    return sum(arabic_weights.get(lettre, 0) for lettre in mot_arabe)

# ✅ Détermination de la nature d’un PM selon modulo 4
def determine_pm_nature(pm):
    if pm == 0:
        return "ﻻ", "Inconnu"
    
    correspondances = {
        1: ("م", "Eau"),
        2: ("ن", "Feu"),
        3: ("ت", "Terre"),
        0: ("ه", "Air")
    }

    reste = pm % 4
    return correspondances[reste]

# ✅ Fonction pour récupérer la nature élémentaire d'une lettre arabe
def get_arabic_element(lettre):
    for nature, lettres in pm_nature.items():
        if lettre in lettres:
            return nature
    return "inconnu"

# ✅ Calcul de la somme par nature élémentaire (selon modulo 4 du PM total)
def calculer_somme_par_nature(mots):
    resultats = {'eau': 0, 'feu': 0, 'terre': 0, 'air': 0}

    for mot in mots:
        mot = nettoyer_arabe(mot)
        somme = sum(arabic_weights.get(l, 0) for l in mot)
        _, nature_fr = determine_pm_nature(somme)

        if nature_fr == "Eau":
            resultats['eau'] += somme
        elif nature_fr == "Feu":
            resultats['feu'] += somme
        elif nature_fr == "Terre":
            resultats['terre'] += somme
        elif nature_fr == "Air":
            resultats['air'] += somme

    return resultats


# ✅ Distribution des lettres par nature (selon Badouhoun/Hadakoun)
# Note : certaines lettres peuvent appartenir à deux natures (ex: ح)
LETTRES_PAR_NATURE = {
    'feu':   ['ا', 'أ', 'ط', 'م', 'ف', 'س', 'ذ', 'ه'],
    'terre': ['ب', 'و', 'ي', 'ن', 'ض', 'ت', 'ظ'],
    'air':   ['ج', 'ز', 'ك', 'ص', 'ق', 'ث', 'غ', 'ح'],
    'eau':   ['د', 'ح', 'ل', 'ع', 'ر', 'خ', 'ش']
}


def calculate_character_nature_weights(texts):
    """
    Calcule la somme des poids par nature élémentaire pour une liste de textes.
    Utilise l'assignation fixe de chaque lettre à une ou plusieurs natures.
    """
    totals = {'feu': 0, 'terre': 0, 'air': 0, 'eau': 0}

    for text in texts:
        for char in text:
            # Poids direct ou normalisé
            weight = arabic_weights.get(char)
            if weight is None:
                char_norm = char.replace("أ", "ا").replace("إ", "ا").replace("آ", "ا")
                weight = arabic_weights.get(char_norm, 0)

            for nature, lettres in LETTRES_PAR_NATURE.items():
                if char in lettres:
                    totals[nature] += weight

    return totals

# ✅ Translitération d'un prénom français vers l'arabe
def translitterer_fr_arabe(prenom):
    mapping = {
        'a': 'ا', 'â': 'ا', 'à': 'ا', 'ā': 'ا',
        'b': 'ب', 'p': 'پ', 't': 'ت', 'j': 'ج',
        'ḥ': 'ح', 'd': 'د', 'r': 'ر', 'z': 'ز',
        's': 'س', 'š': 'ش', 'ṣ': 'ص', 'ḍ': 'ض',
        'ṭ': 'ط', 'ẓ': 'ظ', 'ʿ': 'ع', 'ġ': 'غ',
        'f': 'ف', 'q': 'ق', 'k': 'ك', 'l': 'ل',
        'm': 'م', 'n': 'ن', 'h': 'ه', 'w': 'و',
        'y': 'ي', 'u': 'و', 'i': 'ي', 'e': 'ي',
        'o': 'و'
    }
    return ''.join(mapping.get(c.lower(), '') for c in prenom if c.lower() in mapping)

# ✅ Fonction pour reshape + bidi (affichage correct)
def afficher_correctement(texte: str) -> str:
    return get_display(reshape(texte))

# ✅ Recherche d'un mot dans le Coran local
def search_in_quran(word):
    try:
        # Chercher dans le dossier static
        file_path = os.path.join(os.path.dirname(__file__), 'static', 'coran_clean.txt')
        if not os.path.exists(file_path):
             # Fallback if we are in a different context
             file_path = 'static/coran_clean.txt'
             
        with open(file_path, 'r', encoding='utf-8') as f:
            verses = f.read().splitlines()
        return [v for v in verses if word in v]
    except Exception as e:
        return [f"Erreur : {str(e)}"]

