from flask import (
    Flask, render_template, request, redirect, url_for, flash,
    send_from_directory, jsonify, session, Response, send_file
)
from flask_cors import CORS
from markupsafe import Markup
import requests
from dotenv import load_dotenv
import importlib
import markdown
import os
import re
import json
import sqlite3
from bs4 import BeautifulSoup
from urllib.parse import unquote
import logging

# Configuration des logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
# --- Imports depuis nos modules locaux ---
from routes import register_blueprints
from utils import (
    calculate_arabic_weight,
    calculer_somme_par_nature,
    arabic_weights,
    pm_nature,
    translitterer_fr_arabe,
    nettoyer_arabe
)
from geomancy_logic import generate_random_mothers, derive_theme
# ------------------------------------------

# ---- IMPORTS POUR LES ARTICLES ----
import markdown
from bs4 import BeautifulSoup
# ------------------------------------

# --- CONFIGURATION DES DOSSIERS ---
STATIC_FOLDER = os.path.join(os.path.dirname(__file__), 'static')
UPLOAD_FOLDER = STATIC_FOLDER
ARTICLES_FOLDER = os.path.join(STATIC_FOLDER, 'articles')
PDF_FOLDER = os.path.join(STATIC_FOLDER, 'uploadPDF')
VIDEO_FOLDER = os.path.join(STATIC_FOLDER, 'uploadVIDEO')

# Assurer l'existence des dossiers (seulement si possible, Vercel est read-only)
try:
    for folder in [STATIC_FOLDER, ARTICLES_FOLDER, PDF_FOLDER, VIDEO_FOLDER]:
        os.makedirs(folder, exist_ok=True)
except OSError:
    logger.warning("Vercel (ou read-only filesystem) : impossible de créer les dossiers de logs/uploads.")

load_dotenv()

app = Flask(__name__, static_folder=STATIC_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)
app.url_map.strict_slashes = False

# ✅ FONCTION DE NORMALISATION DES SLUGS
def standardize_slug(text):
    """Génère un slug propre et constant à partir d'un nom de fichier ou titre."""
    text = text.lower()
    # Supprimer l'extension .md si présente
    if text.endswith('.md'):
        text = text[:-3]
    # Remplacer tout ce qui n'est pas alphanumérique par des tirets
    text = re.sub(r'[^a-z0-9]+', '-', text)
    # Supprimer le préfixe numérique (ex: "1-", "12-")
    text = re.sub(r'^\d+-', '', text)
    # Nettoyer les tirets multiples et extrêmes
    text = re.sub(r'-+', '-', text).strip('-')
    return text

# ✅ Routes pour sitemap, robots.txt et vérification Google — UNIQUEMENT ICI
from flask import send_file

import os

from flask import Response, render_template

@app.route('/sitemap.xml')
def sitemap():
    return Response(
        render_template('sitemap.xml'),
        mimetype='application/xml'
    )

@app.route('/robots.txt')
def robots_txt():
    """Servir robots.txt depuis le dossier static."""
    return send_from_directory(app.static_folder, 'robots.txt', mimetype='text/plain')


@app.route('/google7a73cb4c1c3c8e7d.html')
def google_verification():
    """Route pour la vérification Google Search Console."""
    return send_from_directory('.', 'google7a73cb4c1c3c8e7d.html')

@app.before_request
def log_request_info():
    logger.info(f"[REQUEST] {request.method} {request.path}")

@app.route('/api/static/<path:filename>')
def serve_static(filename):
    # Unquote pour gérer les caractères spéciaux comme les accents dans les URLs
    decoded_filename = unquote(filename)
    logger.info(f"[STATIC] Requête pour: {decoded_filename}")
    return send_from_directory(app.static_folder, decoded_filename)

# ✅ INITIALISATION DE LA BASE DE DONNÉES
def get_db_path():
    # Sur Vercel, seul /tmp est inscriptible. Sinon, on utilise le dossier courant.
    if os.environ.get('VERCEL') == '1':
        return '/tmp/dreams.db'
    return os.path.join(os.path.dirname(__file__), 'dreams.db')

def init_db():
    try:
        db_path = get_db_path()
        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        # Table pour le Carnet Secret
        c.execute('''CREATE TABLE IF NOT EXISTS saved_results 
                     (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                      title TEXT, 
                      content TEXT, 
                      category TEXT,
                      created_at DATETIME DEFAULT CURRENT_TIMESTAMP)''')
        conn.commit()
        conn.close()
        print(f"[OK] Base de données initialisée à {db_path}")
    except Exception as e:
        print(f"[ERR] Erreur initialisation DB: {e}")

init_db()

# ----------------------------------------------------
# ✅ ENDPOINTS API POUR LES NOUVELLES FONCTIONNALITÉS
# ----------------------------------------------------

@app.route('/api/asmaul-husna')
def get_asmaul_husna():
    file_path = os.path.join(app.static_folder, 'asmaul_husna.json')
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/save-secret', methods=['POST'])
def save_secret():
    data = request.get_json(silent=True) or {}
    title = data.get('title')
    content = data.get('content')
    category = data.get('category', 'Général')
    
    if not title or not content:
        return jsonify({"error": "Titre et contenu requis"}), 400
        
    try:
        db_path = get_db_path()
        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        c.execute("INSERT INTO saved_results (title, content, category) VALUES (?, ?, ?)", (title, content, category))
        conn.commit()
        conn.close()
        return jsonify({"message": "Secret sauvegardé avec succès"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/saved-secrets')
def get_saved_secrets():
    try:
        db_path = get_db_path()
        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        c.execute("SELECT id, title, content, category, created_at FROM saved_results ORDER BY created_at DESC")
        rows = c.fetchall()
        conn.close()
        
        results = []
        for row in rows:
            results.append({
                "id": row[0],
                "title": row[1],
                "content": row[2],
                "category": row[3],
                "created_at": row[4]
            })
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/delete-secret/<int:secret_id>', methods=['DELETE'])
def delete_secret(secret_id):
    try:
        db_path = get_db_path()
        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        c.execute("DELETE FROM saved_results WHERE id = ?", (secret_id,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Secret supprimé"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 👉 Enregistrement des blueprints
register_blueprints(app)

# Support de l'arabe
app.config['BABEL_DEFAULT_LOCALE'] = 'ar'
app.config['BABEL_DEFAULT_TIMEZONE'] = 'UTC'

# ----------------------------------------------------
# ✅ FONCTION UTILITAIRE : Recherche dans la base SQLite + extraction du verbe/contexte
# ----------------------------------------------------
def search_symbol_in_db(dream_text):
    """Cherche si un mot du rêve correspond à un symbole connu dans dreams.db + extrait le verbe/contexte"""
    try:
        db_path = get_db_path()
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        words = dream_text.lower().split()

        for word in words:
            clean_word = ''.join(c for c in word if c.isalnum())
            if not clean_word:
                continue

            cursor.execute('''
                SELECT symbole, signification, contexte, source
                FROM symbols
                WHERE LOWER(symbole) = ?
            ''', (clean_word,))

            result = cursor.fetchone()
            if result:
                conn.close()
                # Extraire le verbe/contexte autour du symbole
                verbe = get_verb_before(dream_text, clean_word)
                return {
                    "symbole": result[0],
                    "signification": result[1],
                    "contexte": result[2],
                    "source": result[3],
                    "verbe": verbe
                }

        conn.close()
        return None

    except Exception as e:
        print(f"[ERR] SQLite: {str(e)}")
        return None

def get_verb_before(text, keyword):
    """Extrait le mot (verbe ou adjectif) juste avant le symbole"""
    pattern = r'(\w+)\s+' + re.escape(keyword)
    match = re.search(pattern, text, re.IGNORECASE)
    if match:
        return match.group(1).lower()
    return None

# ----------------------------------------------------
# ✅ ROUTES POUR L'INTERPRÈTE DE RÊVES - ✅ STYLE MARABOUTIQUE AVEC PHRASE ARABE
# ----------------------------------------------------
@app.route('/reve')
def reve_page():
    page_title = "🌙 Interprète de Rêves - KhatimMaster"
    page_description = "Racontez votre rêve et obtenez une interprétation symbolique, poétique et spirituelle grâce à l'intelligence artificielle."
    return render_template('reve.html', title=page_title, description=page_description)

@app.route('/api/resources')
def api_resources():
    # 1. ARTICLES
    articles = []
    if os.path.exists(ARTICLES_FOLDER):
        for file in sorted(os.listdir(ARTICLES_FOLDER), reverse=True):
            if not file.lower().endswith('.md'):
                continue
            
            slug = standardize_slug(file)
            
            # Extraction du titre
            title = file.replace('.md', '').replace('_', ' ').title()
            try:
                with open(os.path.join(ARTICLES_FOLDER, file), 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    for line in lines:
                        if line.startswith('# '):
                            title = line.replace('# ', '').strip()
                            break
            except:
                pass

            # Gestion de l'ordre (préfixe numérique)
            match = re.match(r'^(\d+)', file)
            order = int(match.group(1)) if match else 999

            articles.append({
                'title': title,
                'slug': slug,
                'filename': file,
                'order': order
            })

    articles.sort(key=lambda x: x['order'])

    pdf_files = []
    if os.path.exists(PDF_FOLDER):
        pdf_files = sorted([f for f in os.listdir(PDF_FOLDER) if f.lower().endswith('.pdf')])

    video_files = []
    video_extensions = ('.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv')
    if os.path.exists(VIDEO_FOLDER):
        video_files = sorted([f for f in os.listdir(VIDEO_FOLDER) if f.lower().endswith(video_extensions)])

    # On ajoute aussi les vidéos externes s'il y en a dans videos.txt
    external_videos = []
    try:
        with open('videos.txt', 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                parts = line.split('|')
                if len(parts) >= 3:
                    external_videos.append({
                        'type': parts[0].lower(),
                        'id': parts[1],
                        'title': parts[2]
                    })
    except:
        pass

    # Fusion des vidéos locales et externes
    all_videos = external_videos + [
        {'type': 'local', 'id': f, 'title': f.replace('_', ' ').rsplit('.', 1)[0]}
        for f in video_files
    ]

    return jsonify({
        'articles': articles,
        'pdfs': pdf_files,
        'videos': all_videos
    })

@app.route('/api/article/<slug>')
def api_article_detail(slug):
    if not os.path.exists(ARTICLES_FOLDER):
        return jsonify({"error": "Dossier d'articles introuvable"}), 404

    # Recherche de l'article par slug standardisé
    target_file = None
    for file in os.listdir(ARTICLES_FOLDER):
        if standardize_slug(file) == slug:
            target_file = file
            break

    if target_file:
        article_path = os.path.join(ARTICLES_FOLDER, target_file)
        try:
            with open(article_path, 'r', encoding='utf-8') as f:
                content_md = f.read()

            # Extraction du titre depuis le Markdown
            title = target_file.replace('.md', '').replace('_', ' ').capitalize()
            for line in content_md.splitlines():
                if line.startswith('# '):
                   title = line.replace('# ', '').strip()
                   break
            
            return jsonify({
                "title": title,
                "content": content_md,
                "filename": target_file
            })
        except Exception as e:
            return jsonify({"error": f"Erreur de lecture : {str(e)}"}), 500

    return jsonify({"error": "Article non trouvé"}), 404


# ----------------------------------------------------
# CONFIGURATION DES CHEMINS ET DOSSIERS (ROBUSTE)
# ----------------------------------------------------
@app.route('/api/code_mystique', methods=['POST'])
def api_code_mystique():
    data = request.get_json(silent=True) or {}
    phrase = data.get('phrase', '').strip()
    if phrase:
        try:
            # Utiliser la fonction du module utils
            from utils import nettoyer_arabe, calculate_arabic_weight
            phrase_nettoyee = nettoyer_arabe(phrase)
            result = calculate_arabic_weight(phrase_nettoyee)
            return jsonify({"mystical_weight": result, "phrase": phrase})
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Phrase manquante"}), 400


@app.route('/api/interpret', methods=['POST'])
def interpret():
    try:
        data = request.get_json(silent=True) or {}
        dream = data.get('dream', '').strip()
        if not dream:
            return jsonify({"error": "Le rêve ne peut pas être vide."}), 400

        # 1. Chercher d’abord dans la base locale
        local_result = search_symbol_in_db(dream)

        if local_result:
            symbole = local_result['symbole']
            signification = local_result['signification']
            contexte = local_result['contexte']
            source = local_result['source']
            verbe = local_result.get('verbe', None)

            # ✨ Prompt pour Qwen : enrichir la réponse locale dans un style maraboutique avec structure arabe/français/arabe
            user_prompt = (
                f"Ô sage des songes, un âme a vu ceci : '{dream}'. "
                f"Le symbole '{symbole}' de la tradition {contexte} signifie '{signification}'.\n\n"
                f"Réponds en trois parties :\n"
                f"1. Commence par une très courte invocation en arabe, glorifiant Allah, liée au thème du rêve (ex: 'الحمد لله على نعمه', 'سبحان الله عما يصفون').\n"
                f"2. Ensuite, donne une interprétation en français, brève, poétique et symbolique, comme un marabout africain. "
                f"Utilise des mots simples et profonds, chargés de sagesse. Évite tout formatage, liste ou caractère technique.\n"
                f"3. Termine toujours par la phrase arabe exacte : 'رَبِّ زِدْنِي عِلْمًا'.\n\n"
                f"Ta réponse totale doit être concise, tenir en 5 phrases maximum, et suivre strictement cette structure."
            )

            OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
            if not OPENROUTER_API_KEY:
                return jsonify({"error": "Clé API OpenRouter manquante. Vérifiez votre fichier .env"}), 500

            OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
            YOUR_SITE_URL = "https://khatimmaster.onrender.com"
            YOUR_SITE_NAME = "KhatimMaster - Interprète de Rêves"

            headers = {
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "HTTP-Referer": YOUR_SITE_URL,
                "X-Title": YOUR_SITE_NAME,
                "Content-Type": "application/json"
            }

            payload = {
                "model": "qwen/qwen-2.5-72b-instruct",
                "messages": [
                    {
                        "role": "user",
                        "content": user_prompt
                    }
                ]
            }

            response = requests.post(OPENROUTER_API_URL, json=payload, headers=headers)

            if response.status_code == 200:
                data = response.json()
                # Nettoyage de base de la réponse
                raw_interpretation = data["choices"][0]["message"]["content"]
                interpretation_text = re.sub(r'^[\s\d\-\*\•]+\s*', '', raw_interpretation, flags=re.MULTILINE)
                interpretation_text = interpretation_text.strip()
            else:
                # Réponse de secours en cas d'erreur API
                interpretation_text = (
                    f"الْحَمْدُ لِلَّهِ عَلَى كُلِّ حَالٍ\n\n"
                    f"Ton rêve est un reflet de ton âme, un message voilé qu'il te faut décrypter avec patience et foi. "
                    f"Ce que tu as vu est un signe, écoute ton cœur pour en comprendre le langage.\n\n"
                    f"رَبِّ زِدْنِي عِلْمًا"
                )

            return jsonify({"interpretation": interpretation_text})

        # 2. Si non trouvé → appeler Qwen via OpenRouter (fallback avec structure arabe/français/arabe)
        OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
        if not OPENROUTER_API_KEY:
            return jsonify({"error": "Clé API OpenRouter manquante. Vérifiez votre fichier .env"}), 500

        OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
        YOUR_SITE_URL = "https://khatimmaster.onrender.com"
        YOUR_SITE_NAME = "KhatimMaster - Interprète de Rêves"

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": YOUR_SITE_URL,
            "X-Title": YOUR_SITE_NAME,
            "Content-Type": "application/json"
        }

        # Prompt optimisé pour un marabout africain (fallback) - avec structure demandée
        user_prompt = (
            f"Ô gardien des nuits, un rêveur a vu ceci : '{dream}'.\n\n"
            f"Réponds en trois parties :\n"
            f"1. Commence par une très courte invocation en arabe, glorifiant Allah, liée au thème du rêve (ex: 'الله أكبر', 'لا إله إلا الله').\n"
            f"2. Ensuite, donne une interprétation en français, brève, poétique et symbolique, comme un marabout africain. "
            f"Utilise des mots simples et profonds, chargés de sagesse. Évite tout formatage, liste ou caractère technique.\n"
            f"3. Termine toujours par la phrase arabe exacte : 'رَبِّ زِدْنِي عِلْمًا'.\n\n"
            f"Ta réponse totale doit être concise, tenir en 5 phrases maximum, et suivre strictement cette structure."
        )

        payload = {
            "model": "qwen/qwen-2.5-72b-instruct",
            "messages": [
                {
                    "role": "user",
                    "content": user_prompt
                }
            ]
        }

        response = requests.post(OPENROUTER_API_URL, json=payload, headers=headers)

        if response.status_code == 200:
            data = response.json()
            # Nettoyage de base de la réponse
            raw_interpretation = data["choices"][0]["message"]["content"]
            interpretation_text = re.sub(r'^[\s\d\-\*\•]+\s*', '', raw_interpretation, flags=re.MULTILINE)
            interpretation_text = interpretation_text.strip()
        else:
            # Réponse de secours en cas d'erreur API
            interpretation_text = (
                f"سُبْحَانَ اللَّهِ\n\n"
                f"Ce rêve est un souffle de l'invisible, une énigme que seul ton esprit peut résoudre. "
                f"Cherche la paix, et la signification te sera révélée en son temps.\n\n"
                f"رَبِّ زِدْنِي عِلْمًا"
            )

        return jsonify({"interpretation": interpretation_text})

    except Exception as e:
        # Réponse de secours en cas d'exception générale
        return jsonify({
            "interpretation": (
                "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\n\n"
                "Ton rêve est un mystère sacré, un dialogue entre ton âme et l'univers. "
                "Assieds-toi en silence, et la réponse viendra comme une brise douce.\n\n"
                "رَبِّ زِدْنِي عِلْمًا"
            )
        }), 200

# ----------------------------------------------------
# ROUTES PRINCIPALES (ton ancien système — inchangé)
# ----------------------------------------------------
@app.route('/')
def accueil():
    page_title = "KhatimMaster - Accueil | Calculs Mystiques et Carrés Magiques"
    page_description = "Bienvenue sur KhatimMaster, l'application web de référence pour la culture arabo-islamique, les calculs Abjad, la génération de khatims, et l'étude des textes sacrés."
    return render_template('accueil.html', title=page_title, description=page_description)

@app.route('/clavier')
def clavier():
    page_title = "Clavier Arabe et Calculateur Abjad - KhatimMaster"
    page_description = "Utilisez notre clavier arabe virtuel pour écrire des textes et calculer instantanément leur poids mystique (valeur Abjad) avec précision. Idéal pour la science des lettres."
    return render_template('clavier.html', title=page_title, description=page_description)

@app.route('/zikr')
def zikr():
    page_title = "Compteur de Zikr (Invocations) - KhatimMaster"
    page_description = "Accédez à notre outil de Zikr pour vous accompagner dans vos pratiques d'invocations et de prières. Simple, efficace et personnalisable."
    return render_template('zikr.html', title=page_title, description=page_description)

@app.route('/zikr_personnel')
def zikr_personnel():
    page_title = "Zikr Personnel - Créez votre Compteur sur Mesure - KhatimMaster"
    page_description = "Créez un compteur de Zikr personnalisé avec vos propres invocations et objectifs. Un outil flexible pour une pratique spirituelle sur mesure."
    return render_template('zikr_personnel.html', title=page_title, description=page_description)

@app.route('/nle')
def nle():
    page_title = "Calculateur NLE (Niçab Laha Ilaha Illa Anta) - KhatimMaster"
    page_description = "Outil de calcul pour la 'Niçab Laha Ilaha Illa Anta' d'un verset ou d'une phrase. Entrez votre texte et obtenez le résultat pour vos études."
    return render_template('nle.html', title=page_title, description=page_description)

@app.route('/ton_nom_en_arabe', methods=['GET', 'POST'])
def ton_nom_en_arabe():
    page_title = "Convertir un Nom en Arabe et Calculer sa Valeur - KhatimMaster"
    page_description = "Découvrez la translittération de votre nom en arabe et calculez sa valeur numérique (Abjad) grâce à notre outil de conversion simple et rapide."
    arabic_name = None
    if request.method == 'POST':
        name = request.form.get('name')
        if name:
            arabic_name = translitterer_fr_arabe(name)
        else:
            flash("Veuillez entrer un nom.", "warning")
    return render_template('ton_nom_en_arabe.html', arabic_name=arabic_name, title=page_title, description=page_description)


@app.route('/coran')
def coran():
    page_title = "Lecteur du Saint Coran - KhatimMaster"
    page_description = "Lisez et explorez le texte sacré du Saint Coran. Naviguez facilement entre les 114 sourates avec une interface claire et épurée."
    return render_template('coran.html', title=page_title, description=page_description)

@app.route('/coran/<int:sourate>')
def coran_sourate(sourate):
    if 1 <= sourate <= 114:
        try:
            with open(f'static/coran/{sourate}.html', 'r', encoding='utf-8') as f:
                contenu = f.read()
            return contenu
        except FileNotFoundError:
            flash('Sourate introuvable', 'warning')
            return redirect(url_for('coran'))
    else:
        flash('Sourate invalide', 'danger')
        return redirect(url_for('coran'))

@app.route('/recherche', methods=['GET', 'POST'])
def recherche():
    page_title = "Recherche dans le Coran - KhatimMaster"
    page_description = "Effectuez une recherche par mot-clé dans l'ensemble du Saint Coran pour trouver rapidement des versets spécifiques et étudier le texte en profondeur."
    mot_cle = ""
    results = []
    if request.method == "POST":
        mot_cle = request.form.get("mot", "").strip()
        if mot_cle:
            dossier_sourates = os.path.join("static", "coran", "sourates")
            for num in range(1, 115):
                chemin_fichier = os.path.join(dossier_sourates, f"{num}.txt")
                if os.path.exists(chemin_fichier):
                    with open(chemin_fichier, "r", encoding="utf-8") as f:
                        lignes = [l.strip() for l in f if l.strip()]
                        for idx, ligne in enumerate(lignes, start=1):
                            if mot_cle in ligne:
                                results.append({"sourate": num, "verset": idx, "texte": ligne})
    return render_template("recherche.html", mot_cle=mot_cle, results=results, title=page_title, description=page_description)

# Routes /khatim/<num> and /khatim1 removed (migrated to /api/khatimX)


@app.route('/sourates')
def liste_sourates():
    page_title = "Liste des Sourates du Coran - KhatimMaster"
    page_description = "Parcourez la liste complète des 114 sourates du Saint Coran et accédez directement au texte de chacune d'entre elles."
    sourates = []
    for i in range(1, 115):
        chemin = os.path.join("static", "coran", "sourates", f"{i}.txt")
        if os.path.exists(chemin):
            sourates.append(i)
    return render_template("liste_sourates.html", sourates=sourates, title=page_title, description=page_description)

@app.route('/sourate/<int:num>')
def afficher_sourate(num):
    page_title = f"Lire la Sourate {num} - KhatimMaster"
    page_description = f"Lisez le texte complet de la Sourate {num} du Saint Coran. Versets affichés dans un format clair et lisible."
    chemin_fichier = os.path.join("static", "coran", "sourates", f"{num}.txt")
    if not os.path.exists(chemin_fichier):
        flash("Sourate introuvable", "warning")
        return redirect(url_for('liste_sourates'))
    versets = []
    with open(chemin_fichier, "r", encoding="utf-8") as f:
        lignes = [l.strip() for l in f if l.strip()]
        for idx, ligne in enumerate(lignes, start=1):
            versets.append((idx, ligne))
    return render_template("sourate.html", numero=num, versets=versets, title=page_title, description=page_description)

@app.route('/videos')
def videos():
    page_title = "Vidéos et Tutoriels - KhatimMaster"
    page_description = "Visionnez nos vidéos et tutoriels pour mieux comprendre la science des lettres, les carrés mystiques et l'utilisation des outils de KhatimMaster."

    video_list = []
    try:
        with open('videos.txt', 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                parts = line.split('|', 2)  # ← Changé ici : split par |
                if len(parts) < 3:
                    continue
                platform, vid_id, title = parts
                video_list.append({'platform': platform, 'id': vid_id, 'title': title})
    except FileNotFoundError:
        flash("Fichier videos.txt introuvable.", "danger")

    return render_template('videos.html', videos=video_list, title=page_title, description=page_description)

@app.route('/recettes_mystiques')
def recettes_mystiques():
    page_title = "Ressources : Articles, PDF et Vidéos - KhatimMaster"
    # --- CORRECTION APPLIQUÉE ICI ---
    page_description = "Explorez notre bibliothèque de ressources : articles de fond, textes rares en PDF et vidéos explicatives sur la spiritualité et la science des lettres."

    pdf_folder = os.path.join(app.static_folder, 'uploadPDF')
    video_folder = os.path.join(app.static_folder, 'uploadVIDEO')
    articles_folder = os.path.join(app.static_folder, 'articles')

    try:
        os.makedirs(pdf_folder, exist_ok=True)
        os.makedirs(video_folder, exist_ok=True)
        os.makedirs(articles_folder, exist_ok=True)
    except OSError:
        pass # Ignorer sur Vercel (read-only)

    articles = []
    if os.path.exists(articles_folder):
        for file in sorted(os.listdir(articles_folder), reverse=True):
            if file.lower().endswith('.md'):
                slug = file.lower().replace('.md', '').replace('_', '-')
                if re.match(r'^\d+-', slug):
                    slug = re.sub(r'^\d+-', '', slug)

                title = file.replace('.md', '').replace('_', ' ').title()
                if re.match(r'^\d+\s', title):
                    title = re.sub(r'^\d+\s', '', title)

                articles.append({'title': title, 'slug': slug})

    pdf_files = []
    if os.path.exists(pdf_folder):
        pdf_files = [f for f in os.listdir(pdf_folder) if f.lower().endswith('.pdf')]

    video_files = []
    video_extensions = ('.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv')
    if os.path.exists(video_folder):
        video_files = [f for f in os.listdir(video_folder) if f.lower().endswith(video_extensions)]

    def extraire_numero(nom):
        match = re.match(r'^(\d+)_', nom)
        return int(match.group(1)) if match else 999

    pdf_files.sort(key=extraire_numero)
    video_files.sort()

    return render_template(
        'recettes_mystiques.html',
        articles=articles,
        pdf_files=pdf_files,
        video_files=video_files,
        title=page_title,
        description=page_description
    )

@app.route('/article/<slug>')
def article_detail(slug):
    articles_folder = os.path.join(app.static_folder, 'articles')
    article_path = None

    for file in os.listdir(articles_folder):
        file_slug = file.lower().replace('.md', '').replace('_', '-')
        if re.match(r'^\d+-', file_slug):
            file_slug = re.sub(r'^\d+-', '', file_slug)

        if file_slug == slug:
            article_path = os.path.join(articles_folder, file)
            break

    if not article_path or not os.path.exists(article_path):
        flash("Article non trouvé.", "warning")
        return redirect(url_for('recettes_mystiques'))

    with open(article_path, 'r', encoding='utf-8') as f:
        content_md = f.read()
        title_match = re.search(r'^#\s*(.*)', content_md, re.MULTILINE)
        page_title = title_match.group(1) if title_match else "Article"

        content_html = markdown.markdown(content_md, extensions=['fenced_code', 'tables'])

    soup = BeautifulSoup(content_html, 'html.parser')
    page_description = ' '.join(soup.get_text().split()[:30]) + '...'

    return render_template(
        'article_detail.html',
        title=f"{page_title} - KhatimMaster",
        description=page_description,
        article_content=content_html,
        article_title=page_title
    )

@app.route('/soutenir')
def soutenir():
    page_title = "Soutenir le Projet KhatimMaster"
    page_description = "Si vous appréciez les outils et les ressources fournis par KhatimMaster, découvrez comment vous pouvez soutenir le projet pour assurer sa pérennité et son développement."
    return render_template('soutenir.html', title=page_title, description=page_description)

# ----------------------------------------------------
# ✅ ROUTE POUR LA GÉOMANCIE (RAMLI) - ✅ STYLE MARABOUTIQUE AVEC PHRASE ARABE
# ----------------------------------------------------
@app.route('/api/ramli', methods=['POST'])
def api_ramli():
    data = request.get_json(silent=True) or {}
    question = data.get('question', '').strip()

    if not question:
        return jsonify({"error": "Veuillez entrer votre question ou décrire votre situation."}), 400

    mothers = generate_random_mothers()
    theme = derive_theme(mothers)

    juge = theme[15]
    temoin_passe = theme[13]
    temoin_futur = theme[14]

    # ✅ PROMPT SPÉCIFIQUEMENT CONÇU POUR UN STYLE MARABOUTIQUE AVEC STRUCTURE ARABE/FRANÇAIS/ARABE
    user_prompt = (
        f"Ô sage marabout, un cœur cherche la lumière. Sa question est : \"{question}\".\n\n"
        f"Les figures sacrées du Ramli se sont alignées : le Juge est {juge['name']}, le Témoin du Passé est {temoin_passe['name']}, et celui de l'Avenir est {temoin_futur['name']}.\n\n"
        f"Réponds en trois parties :\n"
        f"1. Commence par une très courte invocation en arabe, glorifiant Allah, liée à la guidance ou à la sagesse (ex: 'بِسْمِ اللَّهِ', 'اللَّهُمَّ اهْدِنَا').\n"
        f"2. Ensuite, donne une interprétation en français, brève, poétique et symbolique, comme un ancien. "
        f"Utilise des mots simples et profonds, chargés de sagesse africaine. Évite tout formatage, liste ou caractère technique.\n"
        f"3. Termine toujours par la phrase arabe exacte : 'رَبِّ زِدْنِي عِلْمًا'.\n\n"
        f"Ta réponse totale doit être concise, tenir en 5 phrases maximum, et suivre strictement cette structure."
    )

    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
    if not OPENROUTER_API_KEY:
        return jsonify({"error": "Clé API OpenRouter manquante. Vérifiez votre fichier .env"}), 500

    OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
    YOUR_SITE_URL = "https://khatimmaster.onrender.com"
    YOUR_SITE_NAME = "KhatimMaster - Consultation Ramli"

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": YOUR_SITE_URL,
        "X-Title": YOUR_SITE_NAME,
        "Content-Type": "application/json"
    }

    payload = {
        "model": "google/gemini-2.5-flash",
        "messages": [
            {
                "role": "user",
                "content": user_prompt
            }
        ]
    }

    try:
        response = requests.post(OPENROUTER_API_URL, json=payload, headers=headers)

        if response.status_code == 200:
            api_data = response.json()
            raw_interpretation = api_data["choices"][0]["message"]["content"]
            interpretation_text = re.sub(r'^[\s\d\-\*\•]+\s*', '', raw_interpretation, flags=re.MULTILINE)
            interpretation_text = interpretation_text.strip()
        else:
            interpretation_text = (
                f"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n\n"
                f"La figure de {juge['name']} te parle de {juge['meaning']}. "
                f"Ce qui est semé revient, et l'avenir fleurit pour celui qui attend avec foi.\n\n"
                f"رَبِّ زِدْنِي عِلْمًا"
            )

    except Exception as e:
        interpretation_text = (
            f"اللَّهُمَّ اهْدِنَا\n\n"
            f"Le passé murmure ses leçons, l'avenir chuchote ses promesses. "
            f"Marche avec confiance, car la voie est tracée pour ceux qui croient.\n\n"
            f"رَبِّ زِدْنِي عِلْمًا"
        )

    return jsonify({
        "question": question,
        "theme": theme,
        "juge": juge,
        "temoin_passe": temoin_passe,
        "temoin_futur": temoin_futur,
        "interpretation": interpretation_text
    })

# 👉 AJOUTER LA ROUTE POUR LE GENERATEUR DE TALSAM
from routes.thalsam import thalsam_bp
app.register_blueprint(thalsam_bp)

if __name__ == "__main__":
    # On écoute sur 0.0.0.0 pour être accessible via localhost/127.0.0.1/IP
    app.run(host="0.0.0.0", port=5328, debug=True)