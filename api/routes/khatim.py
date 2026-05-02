from flask import Blueprint, request, jsonify, current_app
import os
import re
from utils import nettoyer_arabe, calculate_arabic_weight, translitterer_fr_arabe
from .khatims_math import (
    generate_khatim2,
    generate_khatim3,
    generate_khatim4,
    generate_khatim5,
    generate_khatim6,
    generate_khatim7,
    generate_khatim8,
    generate_khatim9,
    generate_khatim10,
    KHATIM_INFO
)

# ─────────────────────────────────────────────────────────────────────────────
# Données de mapping Coranique
# ─────────────────────────────────────────────────────────────────────────────

SURAH_VERSE_COUNTS = [
    7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 
    98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 
    75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 
    13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 46, 42, 42, 
    15, 25, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6
]

SURAH_NAMES = {
    1: "Al-Fatihah", 2: "Al-Baqarah", 3: "Ali 'Imran", 4: "An-Nisa'", 5: "Al-Ma'idah",
    6: "Al-An'am", 7: "Al-A'raf", 8: "Al-Anfal", 9: "At-Tawbah", 10: "Yunus",
    11: "Hud", 12: "Yusuf", 13: "Ar-Ra'd", 14: "Ibrahim", 15: "Al-Hijr",
    16: "An-Nahl", 17: "Al-Isra'", 18: "Al-Kahf", 19: "Maryam", 20: "Ta-Ha",
    21: "Al-Anbiya'", 22: "Al-Hajj", 23: "Al-Mu'minun", 24: "An-Nur", 25: "Al-Furqan",
    26: "Ash-Shu'ara'", 27: "An-Naml", 28: "Al-Qasas", 29: "Al-'Ankabut", 30: "Ar-Rum",
    31: "Luqman", 32: "As-Sajdah", 33: "Al-Ahzab", 34: "Saba'", 35: "Fatir",
    36: "Ya-Sin", 37: "As-Saffat", 38: "Sad", 39: "Az-Zumar", 40: "Ghafir",
    41: "Fussilat", 42: "Ash-Shura", 43: "Az-Zukhruf", 44: "Ad-Dukhan", 45: "Al-Jathiyah",
    46: "Al-Ahqaf", 47: "Muhammad", 48: "Al-Fath", 49: "Al-Hujurat", 50: "Qaf",
    51: "Adh-Dhariyat", 52: "At-Tur", 53: "An-Najm", 54: "Al-Qamar", 55: "Ar-Rahman",
    56: "Al-Waqi'ah", 57: "Al-Hadid", 58: "Al-Mujadilah", 59: "Al-Hashr", 60: "Al-Mumtahanah",
    61: "As-Saff", 62: "Al-Jumu'ah", 63: "Al-Munafiqun", 64: "At-Taghabun", 65: "At-Talaq",
    66: "At-Tahrim", 67: "Al-Mulk", 68: "Al-Qalam", 69: "Al-Haqqah", 70: "Al-Ma'arij",
    71: "Nuh", 72: "Al-Jinn", 73: "Al-Muzzammil", 74: "Al-Muddaththir", 75: "Al-Qiyamah",
    76: "Al-Insan", 77: "Al-Mursalat", 78: "An-Naba'", 79: "An-Nazi'at", 80: "Abasa",
    81: "At-Takwir", 82: "Al-Infitar", 83: "Al-Mutaffifin", 84: "Al-Inshiqaq", 85: "Al-Buruj",
    86: "At-Tariq", 87: "Al-A'la", 88: "Al-Ghashiyah", 89: "Al-Fajr", 90: "Al-Balad",
    91: "Ash-Shams", 92: "Al-Layl", 93: "Ad-Duha", 94: "Ash-Sharh", 95: "At-Tin",
    96: "Al-'Alaq", 97: "Al-Qadr", 98: "Al-Bayyinah", 99: "Az-Zalzalah", 100: "Al-'Adiyat",
    101: "Al-Qari'ah", 102: "At-Takathur", 103: "Al-'Asr", 104: "Al-Humazah", 105: "Al-Fil",
    106: "Quraysh", 107: "Al-Ma'un", 108: "Al-Kawthar", 109: "Al-Kafirun", 110: "An-Nasr",
    111: "Al-Masad", 112: "Al-Ikhlas", 113: "Al-Falaq", 114: "An-Nas"
}

def get_surah_ayah(line_num):
    """Calcule le numéro de la sourate et du verset à partir de l'index de ligne (1-indexed)."""
    current = 0
    for s_idx, count in enumerate(SURAH_VERSE_COUNTS, 1):
        if current + count >= line_num:
            return s_idx, line_num - current
        current += count
    return None, None

# ─────────────────────────────────────────────────────────────────────────────
# Khatim 1 : Analyse du Poids Mystique (Abjad)
# ─────────────────────────────────────────────────────────────────────────────
khatim1_bp = Blueprint('khatim1', __name__, url_prefix='/api/khatim1')

@khatim1_bp.route('', methods=['POST'])
def khatim1():
    """API pour Khatim 1 : Analyse complète du Poids Mystique et de la Nature"""
    data = request.get_json(silent=True) or {}
    phrase = data.get('phrase', '').strip()

    if not phrase:
        return jsonify({"error": "Phrase manquante"}), 400

    try:
        from utils import (
            nettoyer_arabe, calculate_arabic_weight,
            determine_pm_nature, get_arabic_element
        )
        phrase_nettoyee = nettoyer_arabe(phrase)
        pm = calculate_arabic_weight(phrase_nettoyee)
        nature_lettre, nature_nom = determine_pm_nature(pm)
        element = get_arabic_element(phrase_nettoyee[0]) if phrase_nettoyee else "inconnu"

        return jsonify({
            "result": pm,
            "phrase": phrase,
            "nature": nature_nom,
            "nature_symbol": nature_lettre,
            "element": element,
            "somme": pm,
            "tableau": [[pm]]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─────────────────────────────────────────────────────────────────────────────
# Dispatchers des Khatims 2 à 10
# ─────────────────────────────────────────────────────────────────────────────

GENERATORS = {
    2:  generate_khatim2,
    3:  generate_khatim3,
    4:  generate_khatim4,
    5:  generate_khatim5,
    6:  generate_khatim6,
    7:  generate_khatim7,
    8:  generate_khatim8,
    9:  generate_khatim9,
    10: generate_khatim10,
}


def create_khatim_blueprint(khatim_id):
    blueprint = Blueprint(f'khatim{khatim_id}', __name__, url_prefix=f'/api/khatim{khatim_id}')

    @blueprint.route('', methods=['POST'])
    def khatim():
        data = request.get_json(silent=True) or {}

        # valeur_a = Progression (a)
        # valeur_b = Poids Mystique cible (b)
        val_a = data.get('valeur_a')
        val_b = data.get('valeur_b')

        if val_a is None or val_b is None:
            return jsonify({
                "error": "Les champs 'valeur_a' (progression) et 'valeur_b' (PM cible) sont requis."
            }), 400

        try:
            a = int(val_a)
            b = int(val_b)
        except (ValueError, TypeError):
            return jsonify({"error": "Les valeurs doivent être des nombres entiers."}), 400

        generator = GENERATORS.get(khatim_id)
        if not generator:
            return jsonify({"error": f"Khatim {khatim_id} non supporté."}), 400

        try:
            tableau = generator(a, b)
        except Exception as e:
            return jsonify({"error": f"Erreur lors de la génération : {str(e)}"}), 500

        if tableau is None:
            info = KHATIM_INFO.get(khatim_id, {})
            condition = info.get("condition", "condition non remplie")
            return jsonify({
                "error": f"Condition mystique non satisfaite — {condition}. "
                         f"Valeurs reçues : progression={a}, PM={b}."
            }), 400

        # Sérialiser le tableau : certaines cellules peuvent être des strings (ex: 'أمنيات')
        serialized = []
        for row in tableau:
            serialized_row = []
            for cell in row:
                if isinstance(cell, str):
                    serialized_row.append({"type": "arabic", "value": cell})
                else:
                    serialized_row.append({"type": "number", "value": cell})
            serialized.append(serialized_row)

        info = KHATIM_INFO.get(khatim_id, {})
        return jsonify({
            "tableau": serialized,
            "khatim_id": khatim_id,
            "nom": info.get("nom", f"Khatim {khatim_id}"),
            "taille": info.get("taille", ""),
            "planete": info.get("planete", ""),
            "pm_cible": b,
            "progression": a,
        })

    return blueprint


def create_special_khatim_blueprint(khatim_type):
    from .khatims_math import generate_badouhoun, generate_hadakoun
    from utils import calculate_character_nature_weights

    blueprint = Blueprint(khatim_type, __name__, url_prefix=f'/api/{khatim_type}')

    @blueprint.route('', methods=['POST'])
    def special_khatim():
        data = request.get_json(silent=True) or {}
        words = [data.get('mot_a', ''), data.get('mot_b', ''), data.get('mot_c', '')]
        
        if not all(words):
            return jsonify({"error": "Trois mots (mot_a, mot_b, mot_c) sont requis."}), 400

        weights = calculate_character_nature_weights(words)
        
        if khatim_type == "badouhoun":
            tableau = generate_badouhoun(weights)
        else:
            tableau = generate_hadakoun(weights)

        # Sérialisation
        serialized = []
        for row in tableau:
            serialized_row = []
            for cell in row:
                if isinstance(cell, str):
                    serialized_row.append({"type": "arabic", "value": cell})
                else:
                    serialized_row.append({"type": "number", "value": cell})
            serialized.append(serialized_row)

        info = KHATIM_INFO.get(khatim_type, {})
        return jsonify({
            "tableau": serialized,
            "khatim_id": khatim_type,
            "nom": info.get("nom", khatim_type),
            "taille": info.get("taille", ""),
            "planete": info.get("planete", ""),
            "mots": words
        })

    return blueprint


# ─────────────────────────────────────────────────────────────────────────────
# Autres Outils Mystiques (NLE, Recherche, Translittération)
# ─────────────────────────────────────────────────────────────────────────────

tools_bp = Blueprint('tools', __name__, url_prefix='/api/tools')

@tools_bp.route('/search', methods=['POST'])
def search_quran():
    """Recherche de mots dans le texte intégral du Coran avec normalisation."""
    data = request.get_json(silent=True) or {}
    mot_cle = data.get('query', '').strip()
    
    if not mot_cle:
        return jsonify({"error": "Veuillez entrer un mot-clé."}), 400
    
    # Normaliser le mot-clé (retirer harakat)
    query_clean = nettoyer_arabe(mot_cle)
    
    results = []
    dossier_sourates = os.path.join(current_app.static_folder, "coran", "sourates")
    
    if not os.path.exists(dossier_sourates):
        return jsonify({"error": f"Dossier Coran introuvable dans {dossier_sourates}."}), 500

    total_occurrences = 0
    try:
        for num in range(1, 115):
            chemin_fichier = os.path.join(dossier_sourates, f"{num}.txt")
            if os.path.exists(chemin_fichier):
                with open(chemin_fichier, "r", encoding="utf-8") as f:
                    lignes = [l.strip() for l in f if l.strip()]
                    for idx, ligne in enumerate(lignes, start=1):
                        ligne_clean = nettoyer_arabe(ligne)
                        
                        occurrences_dans_verset = ligne_clean.count(query_clean)
                        if occurrences_dans_verset > 0:
                            total_occurrences += occurrences_dans_verset
                            # Add to results
                            results.append({
                                "sourate": num,
                                "sourate_nom": SURAH_NAMES.get(num, f"Sourate {num}"),
                                "verset": idx,
                                "texte": ligne.strip()
                            })
    except Exception as e:
        return jsonify({"error": f"Erreur lors de la lecture : {str(e)}"}), 500
                
    return jsonify({
        "query": mot_cle,
        "count": total_occurrences,
        "results": results
    })

@tools_bp.route('/nle', methods=['POST'])
def calculate_nle():
    """Calculateur NLE (Compteur de caractères ésotériques)."""
    data = request.get_json(silent=True) or {}
    phrase = data.get('phrase', '').strip()
    
    if not phrase:
        return jsonify({"error": "Phrase manquante."}), 400
        
    # Logic based on nle.html
    arabic_letters = set("اأإآببتثجحخدذرزسشصضطظعغفقكلمنهويىءة")
    count = sum(1 for char in phrase if char in arabic_letters)
    
    return jsonify({
        "phrase": phrase,
        "nle": count
    })

@tools_bp.route('/transliteration', methods=['POST'])
def transliteration():
    """Translittération Français -> Arabe."""
    data = request.get_json(silent=True) or {}
    name = data.get('name', '').strip()
    
    if not name:
        return jsonify({"error": "Nom manquant."}), 400
        
    arabic_name = translitterer_fr_arabe(name)
    pm = calculate_arabic_weight(arabic_name)
    
    return jsonify({
        "original": name,
        "arabic": arabic_name,
        "pm": pm
    })

@tools_bp.route('/resources', methods=['GET'])
def list_resources():
    """Liste tous les articles, PDFs et vidéos disponibles."""
    # 1. Articles
    articles = []
    articles_folder = os.path.join(current_app.static_folder, "articles")
    
    if os.path.exists(articles_folder):
        for file in os.listdir(articles_folder):
            if file.lower().endswith('.md'):
                match = re.match(r'^(\d+)[_-]', file)
                order = int(match.group(1)) if match else 999
                
                slug = file.lower().replace('.md', '').replace('_', '-')
                if re.match(r'^\d+-', slug):
                    slug = re.sub(r'^\d+-', '', slug)
                
                title = file.replace('.md', '').replace('_', ' ').title()
                if re.match(r'^\d+\s', title):
                    title = re.sub(r'^\d+\s', '', title)
                
                articles.append({
                    "title": title,
                    "slug": slug,
                    "filename": file,
                    "order": order
                })
    articles.sort(key=lambda x: x["order"])

    # 2. PDFs
    pdfs = []
    pdf_folder = os.path.join(current_app.static_folder, "uploadPDF")

    if os.path.exists(pdf_folder):
        pdfs = [f for f in os.listdir(pdf_folder) if f.lower().endswith('.pdf')]
        pdfs.sort()

    # 3. Videos
    videos = []
    video_folder = os.path.join(current_app.static_folder, "uploadVIDEO")

    if os.path.exists(video_folder):
        local_vids = [f for f in os.listdir(video_folder) if f.lower().endswith(('.mp4', '.avi', '.mov'))]
        for v in local_vids:
            videos.append({"type": "local", "id": v, "title": v.replace('_', ' ').replace('.mp4', '')})

    # videos.txt dans le dossier parent du blueprint (api/)
    vtxt_path = os.path.join(os.path.dirname(current_app.root_path), "videos.txt")
    if os.path.exists(vtxt_path):
        try:
            with open(vtxt_path, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith('#'): continue
                    parts = line.split('|')
                    if len(parts) >= 3:
                        videos.append({
                            "type": parts[0].strip(),
                            "id": parts[1].strip(),
                            "title": parts[2].strip()
                        })
        except Exception:
            pass

    return jsonify({
        "articles": articles,
        "pdfs": pdfs,
        "videos": videos
    })

@tools_bp.route('/article/<slug>', methods=['GET'])
def get_article(slug):
    """Récupère le contenu Markdown d'un article par son slug."""
    articles_folder = os.path.join(current_app.root_path, "static", "articles")
    if not os.path.exists(articles_folder):
        articles_folder = os.path.join(current_app.root_path, "api", "static", "articles")
    
    if not os.path.exists(articles_folder):
        return jsonify({"error": "Dossier articles introuvable."}), 404
    
    # Trouver le fichier correspondant au slug
    target_file = None
    for file in os.listdir(articles_folder):
        file_slug = file.lower().replace('.md', '').replace('_', '-')
        if re.match(r'^\d+-', file_slug):
            file_slug = re.sub(r'^\d+-', '', file_slug)
        
        if file_slug == slug:
            target_file = file
            break
    
    if not target_file:
        return jsonify({"error": "Article non trouvé."}), 404
        
    try:
        with open(os.path.join(articles_folder, target_file), 'r', encoding='utf-8') as f:
            content = f.read()
            # Basic title extraction
            title_match = re.search(r'^#\s*(.*)', content, re.MULTILINE)
            title = title_match.group(1) if title_match else target_file.replace('.md', '').replace('_', ' ').title()
            
            return jsonify({
                "title": title,
                "content": content,
                "filename": target_file
            })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def register_khatim_blueprints(app):
    app.register_blueprint(khatim1_bp)
    app.register_blueprint(create_special_khatim_blueprint("badouhoun"))
    app.register_blueprint(create_special_khatim_blueprint("hadakoun"))
    app.register_blueprint(tools_bp)
    for i in range(2, 11):
        app.register_blueprint(create_khatim_blueprint(i))
