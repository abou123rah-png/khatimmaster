from flask import (
    Flask, render_template, request, redirect, url_for, flash,
    send_from_directory, jsonify, session, Response, send_file
)
from markupsafe import Markup
import requests
from dotenv import load_dotenv
import importlib
import markdown
import os
import re
import sqlite3
from bs4 import BeautifulSoup
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

load_dotenv()

app = Flask(__name__)

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

app.secret_key = 'une_cle_secrete_tres_complexe_1234567890'
app.config['UPLOAD_FOLDER'] = os.path.join(app.static_folder, 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# 👉 Enregistrement des blueprints (seulement pour l'authentification)
register_blueprints(app)

# Création du dossier upload s'il n'existe pas
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Support de l'arabe
app.config['BABEL_DEFAULT_LOCALE'] = 'ar'
app.config['BABEL_DEFAULT_TIMEZONE'] = 'UTC'

# ----------------------------------------------------
# ✅ FONCTION UTILITAIRE : Recherche dans la base SQLite + extraction du verbe/contexte
# ----------------------------------------------------
def search_symbol_in_db(dream_text):
    """Cherche si un mot du rêve correspond à un symbole connu dans dreams.db + extrait le verbe/contexte"""
    try:
        conn = sqlite3.connect('dreams.db')
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
        print(f"❌ Erreur SQLite : {str(e)}")
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

@app.route('/interpret', methods=['POST'])
def interpret():
    try:
        dream = request.form.get('dream', '').strip()
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

            OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions    "
            YOUR_SITE_URL = "https://khatimmaster.onrender.com    "
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
        YOUR_SITE_URL = "https://khatimmaster.onrender.com    "
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

@app.route('/code_mystique', methods=['GET', 'POST'])
def code_mystique():
    page_title = "Calcul du Poids Mystique (Abjad) - KhatimMaster"
    page_description = "Calculez le poids mystique (valeur Abjad) de n'importe quelle phrase, nom ou verset en arabe. Un outil essentiel pour la science des lettres."
    mystical_weight = None
    if request.method == 'POST':
        phrase = request.form.get('phrase')
        if phrase:
            phrase_nettoyee = nettoyer_arabe(phrase)
            mystical_weight = sum(arabic_weights.get(char, 0) for char in phrase_nettoyee)
        else:
            flash("Veuillez entrer une phrase.", "warning")
    return render_template('code_mystique.html', mystical_weight=mystical_weight, title=page_title, description=page_description)

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

@app.route('/khatim/<int:num>', methods=['GET', 'POST'])
def khatim(num):
    page_title = f"Générateur de Khatim {num}x{num} - KhatimMaster"
    page_description = f"Générez et calculez un carré magique (khatim) de taille {num}x{num}. Entrez vos valeurs pour obtenir un résultat personnalisé pour vos études et pratiques."
    if not (1 <= num <= 10):
        flash('Khatim non disponible', 'danger')
        return redirect(url_for('accueil'))
    tableau = None
    if request.method == 'POST':
        valeur_a = request.form.get('valeur_a')
        valeur_b = request.form.get('valeur_b')
        try:
            a = int(valeur_a)
            b = int(valeur_b)
        except (ValueError, TypeError):
            flash("Veuillez entrer des nombres valides.", "warning")
            return render_template(f'khatim{num}.html', tableau=None, title=page_title, description=page_title)
        try:
            module = importlib.import_module(f'khatims.generateur_khatim{num}')
            tableau = module.generer_tableau(a, b)
        except ModuleNotFoundError:
            flash("Générateur de khatim non trouvé.", "danger")
        except Exception as e:
            flash(f"Erreur dans le calcul : {str(e)}", "danger")
    return render_template(f'khatim{num}.html', tableau=tableau, title=page_title, description=page_title)

@app.route('/khatim1', methods=['GET', 'POST'])
def khatim1():
    page_title = "Calcul de Poids Mystique (Zikr PM) - KhatimMaster"
    page_description = "Calculez le poids mystique d'une phrase en arabe pour vos Zikr PM. Obtenez une analyse détaillée de la valeur numérique."
    if request.method == 'POST':
        phrase = request.form.get('phrase', '').strip()
        if not re.match(r'^[\u0621-\u064A\s]+$', phrase):
            flash("Veuillez entrer une valeur valide en arabe.", "warning")
            return render_template('khatim1.html', phrase=phrase, title=page_title, description=page_description)
        try:
            phrase_nettoyee = nettoyer_arabe(phrase)
            result = calculate_arabic_weight(phrase_nettoyee)
            return render_template('khatim1.html', result=result, phrase=phrase, title=page_title, description=page_description)
        except Exception as e:
            flash(f"Erreur lors du calcul : {str(e)}", "danger")
            return render_template('khatim1.html', phrase=phrase, title=page_title, description=page_description)
    return render_template('khatim1.html', title=page_title, description=page_description)

@app.route('/badouhoun', methods=['GET', 'POST'])
def badouhoun():
    page_title = "Calculateur de Khatim Badouhoun - KhatimMaster"
    page_description = "Générez un carré magique Badouhoun personnalisé en entrant trois mots ou valeurs. Un outil puissant pour les praticiens avancés."
    tableau = None
    if request.method == 'POST':
        mot_a = request.form.get('mot_a')
        mot_b = request.form.get('mot_b')
        mot_c = request.form.get('mot_c')
        if mot_a and mot_b and mot_c:
            res = calculer_somme_par_nature([mot_a, mot_b, mot_c])
            tableau = [
                [2 + res['terre'], 69 + res['eau'] + 4 + res['air'], 4 + res['feu']],
                [res['feu'] + 12 + res['air'], "الله", res['terre'] + 8 + res['eau']],
                [6 + res['eau'], res['terre'] + 6 + res['feu'], 8 + res['air']]
            ]
    return render_template('badouhoun.html', tableau=tableau, title=page_title, description=page_description)

@app.route('/hadakoun', methods=['GET', 'POST'])
def hadakoun():
    page_title = "Calculateur de Khatim Hadakoun - KhatimMaster"
    page_description = "Générez un carré magique Hadakoun personnalisé. Entrez trois mots ou valeurs pour obtenir votre khatim spécifique."
    tableau = None
    if request.method == 'POST':
        mot_a = request.form.get('mot_a')
        mot_b = request.form.get('mot_b')
        mot_c = request.form.get('mot_c')
        if mot_a and mot_b and mot_c:
            res = calculer_somme_par_nature([mot_a, mot_b, mot_c])
            tableau = [
                [65 + res['terre'], "كن", 63 + res['feu']],
                [64, "الله", 68],
                [69 + res['eau'], 62, 67 + res['air']]
            ]
    return render_template('hadakoun.html', tableau=tableau, title=page_title, description=page_description)

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

    os.makedirs(pdf_folder, exist_ok=True)
    os.makedirs(video_folder, exist_ok=True)
    os.makedirs(articles_folder, exist_ok=True)

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
@app.route('/ramli', methods=['GET', 'POST'])
def ramli():
    page_title = "Consultation de Géomancie (Ramli) - KhatimMaster"

    if request.method == 'POST':
        question = request.form.get('question', '').strip()

        if not question:
            flash("Veuillez entrer votre question ou décrire votre situation.", "warning")
            return redirect(url_for('ramli'))

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
        YOUR_SITE_URL = "https://khatimmaster.onrender.com    "
        YOUR_SITE_NAME = "KhatimMaster - Consultation Ramli"

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": YOUR_SITE_URL,
            "X-Title": YOUR_SITE_NAME,
            "Content-Type": "application/json"
        }

        payload = {
            "model": "google/gemini-flash-1.5-8b",
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
                data = response.json()
                # Nettoyage de base de la réponse pour supprimer d'éventuels caractères indésirables
                raw_interpretation = data["choices"][0]["message"]["content"]
                interpretation_text = re.sub(r'^[\s\d\-\*\•]+\s*', '', raw_interpretation, flags=re.MULTILINE)
                interpretation_text = interpretation_text.strip()
            else:
                flash(f"Erreur API. Réponse de base fournie.", "warning")
                interpretation_text = (
                    f"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n\n"
                    f"La figure de {juge['name']} te parle de {juge['meaning']}. "
                    f"Ce qui est semé revient, et l'avenir fleurit pour celui qui attend avec foi.\n\n"
                    f"رَبِّ زِدْنِي عِلْمًا"
                )

        except Exception as e:
            flash(f"Erreur. Réponse de base fournie.", "danger")
            interpretation_text = (
                f"اللَّهُمَّ اهْدِنَا\n\n"
                f"Le passé murmure ses leçons, l'avenir chuchote ses promesses. "
                f"Marche avec confiance, car la voie est tracée pour ceux qui croient.\n\n"
                f"رَبِّ زِدْنِي عِلْمًا"
            )

        page_description = f"Réponse à votre question : '{question[:100]}...'. Le juge est {juge['name']}."

        return render_template(
            'ramli_result.html',
            title=f"Réponse du Ramli : {juge['name']}",
            description=page_description,
            question=question,
            theme=theme,
            interpretation=interpretation_text
        )

    page_description = "Posez votre question à l'oracle de la géomancie (Ramli) et recevez une guidance brève, poétique et maraboutique."
    return render_template('ramli_question.html', title=page_title, description=page_description)

# 👉 AJOUTER LA ROUTE POUR LE GENERATEUR DE TALSAM
from routes.thalsam import thalsam_bp
app.register_blueprint(thalsam_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000, debug=True)