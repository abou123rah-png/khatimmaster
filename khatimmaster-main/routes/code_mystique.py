# routes/code_mystique.py
from flask import Blueprint, render_template, request
import unicodedata
import re

# Définir le blueprint
code_mystique_bp = Blueprint('code_mystique', __name__)

# Dictionnaire de normalisation arabe
ARABIC_REPLACEMENTS = {
    'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ؤ': 'و', 'ئ': 'ى',
    'ة': 'ه', 'ٱ': 'ا', 'ّ': '', 'َ': '', 'ُ': '', 'ِ': '', 'ْ': '', 'ٰ': '', 'ـ': ''
}

def normaliser_texte(texte):
    """Normalise le texte arabe sans altérer les lettres essentielles"""
    texte = unicodedata.normalize('NFKC', texte)
    resultat = ''
    
    for c in texte:
        # Ignore les diacritiques non essentiels
        if unicodedata.combining(c):
            continue
        # Remplace uniquement les caractères non critiques
        if c in ARABIC_REPLACEMENTS:
            resultat += ARABIC_REPLACEMENTS[c]
        elif '\u0600' <= c <= '\u06FF':  # Garde les lettres arabes
            resultat += c
    
    return resultat

def compter_occurrences(mot, texte):
    """Recherche exacte mais robuste"""
    if not mot:
        return 0
    return texte.count(mot)

# Charger le texte du Coran
try:
    with open('static/coran_clean.txt', 'r', encoding='utf-8') as f:
        coran_versets = f.read().splitlines()
    print(f"[DEBUG] {len(coran_versets)} versets chargés")
except FileNotFoundError:
    print("[ERREUR] Fichier non trouvé !")
    coran_versets = []

@code_mystique_bp.route('/code_mystique', methods=['GET', 'POST'])
def code_mystique():
    results = None
    error = None
    
    if request.method == 'POST':
        mot = request.form.get('mot', '').strip()
        print(f"[DEBUG] Mot recherché: {mot}")
        
        if not mot:
            error = "Veuillez entrer un mot arabe."
        else:
            mot_normalise = normaliser_texte(mot)
            print(f"[DEBUG] Mot normalisé: {mot_normalise}")
            
            if not mot_normalise:
                error = "Mot invalide après normalisation."
            else:
                occurrences = 0
                versets_trouves = []
                
                for i, verset in enumerate(coran_versets):
                    verset_normalise = normaliser_texte(verset)
                    count = compter_occurrences(mot_normalise, verset_normalise)
                    
                    if count > 0:
                        print(f"[DEBUG] Trouvé dans le verset {i+1} ({count} fois)")
                        versets_trouves.append({
                            'num': i + 1,
                            'texte': verset.strip()
                        })
                        occurrences += count
                
                results = {
                    'mot': mot,
                    'occurrences': occurrences,
                    'versets': versets_trouves
                }
    
    return render_template('code_mystique.html', results=results, error=error)