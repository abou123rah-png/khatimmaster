from flask import Blueprint, request, jsonify, current_app
import os
from utils import nettoyer_arabe, calculate_arabic_weight, calculate_pm, translitterer_fr_arabe
from .khatim import SURAH_NAMES

oracle_bp = Blueprint('oracle', __name__, url_prefix='/api/oracle')

# Cache pour l'index du Coran (PM par verset)
QURAN_PM_INDEX = []

def initialize_quran_index():
    global QURAN_PM_INDEX
    if QURAN_PM_INDEX:
        return

    dossier_sourates = os.path.join(current_app.static_folder, "coran", "sourates")
    if not os.path.exists(dossier_sourates):
        return

    for num in range(1, 115):
        chemin_fichier = os.path.join(dossier_sourates, f"{num}.txt")
        if os.path.exists(chemin_fichier):
            try:
                with open(chemin_fichier, "r", encoding="utf-8") as f:
                    lignes = [l.strip() for l in f if l.strip()]
                    for idx, ligne in enumerate(lignes, start=1):
                        ligne_clean = nettoyer_arabe(ligne)
                        pm = calculate_pm(ligne_clean)
                        if pm > 0:
                            QURAN_PM_INDEX.append({
                                "pm": pm,
                                "surah": num,
                                "ayah": idx,
                                "text": ligne
                            })
            except:
                continue

@oracle_bp.route('', methods=['POST'])
def get_oracle():
    data = request.get_json(silent=True) or {}
    name = data.get('name', '').strip()
    
    if not name:
        return jsonify({"error": "Veuillez entrer un nom."}), 400

    # Si c'est en français, on translittère
    if any(ord(c) < 128 for c in name):
        name_arabe = translitterer_fr_arabe(name)
    else:
        name_arabe = nettoyer_arabe(name)

    name_pm = calculate_pm(name_arabe)
    
    if name_pm == 0:
        return jsonify({"error": "Impossible de calculer le poids mystique pour ce nom."}), 400

    # Initialiser l'index si nécessaire
    initialize_quran_index()
    
    if not QURAN_PM_INDEX:
        return jsonify({"error": "Index coranique indisponible."}), 500

    # Trouver le verset le plus proche
    closest_verse = min(QURAN_PM_INDEX, key=lambda x: abs(x['pm'] - name_pm))
    
    # Trouver les noms divins (Asmaul Husna) dont la somme est proche
    # (Version simplifiée : on donne les noms principaux dont la somme est <= PM)
    DIVINE_NAMES = [
        {"name": "Allah", "pm": 66},
        {"name": "Ar-Rahman", "pm": 298},
        {"name": "Ar-Rahim", "pm": 258},
        {"name": "Al-Malik", "pm": 90},
        {"name": "Al-Quddus", "pm": 170},
        {"name": "As-Salam", "pm": 131},
        {"name": "Al-Mu'min", "pm": 136},
        {"name": "Al-Muhaymin", "pm": 145},
        {"name": "Al-'Aziz", "pm": 94},
        {"name": "Al-Jabbar", "pm": 206},
        {"name": "Al-Mutakabbir", "pm": 662},
        {"name": "Al-Khaliq", "pm": 731},
        {"name": "Al-Bari'", "pm": 213},
        {"name": "Al-Musawwir", "pm": 336},
        {"name": "Al-Ghaffar", "pm": 1281},
        {"name": "Al-Qahhar", "pm": 306},
        {"name": "Al-Wahhab", "pm": 14},
        {"name": "Ar-Razzaq", "pm": 308},
        {"name": "Al-Fattah", "pm": 489},
        {"name": "Al-'Alim", "pm": 150},
        {"name": "Al-Qabid", "pm": 903},
        {"name": "Al-Basit", "pm": 72},
        {"name": "Al-Khafid", "pm": 1481},
        {"name": "Ar-Rafi'", "pm": 351},
        {"name": "Al-Mu'izz", "pm": 117},
        {"name": "Al-Mudhill", "pm": 770},
        {"name": "As-Sami'", "pm": 180},
        {"name": "Al-Basir", "pm": 302},
        {"name": "Al-Hakam", "pm": 68},
        {"name": "Al-'Adl", "pm": 104},
        {"name": "Al-Latif", "pm": 129},
        {"name": "Al-Khabir", "pm": 812},
        {"name": "Al-Halim", "pm": 88},
        {"name": "Al-'Azim", "pm": 1020},
        {"name": "Al-Ghafur", "pm": 1286},
        {"name": "Ash-Shakur", "pm": 526},
        {"name": "Al-'Aliyy", "pm": 110},
        {"name": "Al-Kabir", "pm": 232},
        {"name": "Al-Hafiz", "pm": 998},
        {"name": "Al-Muqit", "pm": 550},
        {"name": "Al-Hasib", "pm": 80},
        {"name": "Al-Jalil", "pm": 73},
        {"name": "Al-Karim", "pm": 270},
        {"name": "Ar-Raqib", "pm": 312},
        {"name": "Al-Mujib", "pm": 55},
        {"name": "Al-Wasi'", "pm": 137},
        {"name": "Al-Hakim", "pm": 78},
        {"name": "Al-Wadud", "pm": 20},
        {"name": "Al-Majid", "pm": 57},
        {"name": "Al-Ba'ith", "pm": 573},
        {"name": "Ash-Shahid", "pm": 319},
        {"name": "Al-Haqq", "pm": 108},
        {"name": "Al-Wakil", "pm": 66},
        {"name": "Al-Qawiyy", "pm": 116},
        {"name": "Al-Matin", "pm": 500},
        {"name": "Al-Waliyy", "pm": 46},
        {"name": "Al-Hamid", "pm": 62},
        {"name": "Al-Muhsi", "pm": 148},
        {"name": "Al-Mubdi'", "pm": 56},
        {"name": "Al-Mu'id", "pm": 124},
        {"name": "Al-Muhyi", "pm": 68},
        {"name": "Al-Mumit", "pm": 490},
        {"name": "Al-Hayy", "pm": 18},
        {"name": "Al-Qayyum", "pm": 156},
        {"name": "Al-Wajid", "pm": 14},
        {"name": "Al-Majid", "pm": 48},
        {"name": "Al-Wahid", "pm": 19},
        {"name": "Al-Ahad", "pm": 13},
        {"name": "As-Samad", "pm": 134},
        {"name": "Al-Qadir", "pm": 305},
        {"name": "Al-Muqtadir", "pm": 744},
        {"name": "Al-Muqaddim", "pm": 184},
        {"name": "Al-Mu'akhkhir", "pm": 846},
        {"name": "Al-Awwal", "pm": 37},
        {"name": "Al-Akhir", "pm": 801},
        {"name": "Az-Zahir", "pm": 1106},
        {"name": "Al-Batin", "pm": 62},
        {"name": "Al-Wali", "pm": 47},
        {"name": "Al-Muta'ali", "pm": 541},
        {"name": "Al-Barr", "pm": 202},
        {"name": "At-Tawwab", "pm": 409},
        {"name": "Al-Muntaqim", "pm": 630},
        {"name": "Al-'Afuww", "pm": 156},
        {"name": "Ar-Ra'uf", "pm": 287},
        {"name": "Malik-ul-Mulk", "pm": 212},
        {"name": "Dhul-Jalal wal-Ikram", "pm": 1100},
        {"name": "Al-Muqsit", "pm": 209},
        {"name": "Al-Jami'", "pm": 114},
        {"name": "Al-Ghaniyy", "pm": 1060},
        {"name": "Al-Mughni", "pm": 1100},
        {"name": "Al-Mani'", "pm": 161},
        {"name": "Ad-Darr", "pm": 1001},
        {"name": "An-Nafi'", "pm": 201},
        {"name": "An-Nur", "pm": 256},
        {"name": "Al-Hadi", "pm": 20},
        {"name": "Al-Badi'", "pm": 86},
        {"name": "Al-Baqi", "pm": 113},
        {"name": "Al-Warith", "pm": 707},
        {"name": "Ar-Rashid", "pm": 514},
        {"name": "As-Sabur", "pm": 298}
    ]
    
    # On suggère un nom divin dont le PM est "harmonieux" avec celui du nom
    # Par exemple, le nom divin dont le PM est le plus proche
    suggested_divine_name = min(DIVINE_NAMES, key=lambda x: abs(x['pm'] - name_pm))

    return jsonify({
        "name": name,
        "name_arabe": name_arabe,
        "pm": name_pm,
        "verse": {
            "surah": closest_verse['surah'],
            "surah_name": SURAH_NAMES.get(closest_verse['surah'], f"Sourate {closest_verse['surah']}"),
            "ayah": closest_verse['ayah'],
            "text": closest_verse['text'],
            "pm": closest_verse['pm']
        },
        "divine_name": suggested_divine_name,
        "zikr_count": name_pm
    })

@oracle_bp.route('/compatibility', methods=['POST'])
def get_compatibility():
    data = request.get_json(silent=True) or {}
    name1 = data.get('name1', '').strip()
    name2 = data.get('name2', '').strip()

    if not name1 or not name2:
        return jsonify({"error": "Deux noms sont requis."}), 400

    pm1 = calculate_pm(nettoyer_arabe(name1)) if not any(ord(c) < 128 for c in name1) else calculate_pm(translitterer_fr_arabe(name1))
    pm2 = calculate_pm(nettoyer_arabe(name2)) if not any(ord(c) < 128 for c in name2) else calculate_pm(translitterer_fr_arabe(name2))

    total_pm = pm1 + pm2
    modulo_result = total_pm % 9
    if modulo_result == 0: modulo_result = 9

    RESULTS_MAP = {
        1: {"status": "Excellente", "score": 95, "desc": "Une union bénie, pleine de lumière et de stabilité. Vos chemins sont tracés pour se compléter parfaitement.", "remedy": "Zikr de Ya Wadud (20 fois)"},
        2: {"status": "Complexe", "score": 45, "desc": "Dualité et frictions. Il y a beaucoup d'attraction mais aussi des risques de malentendus fréquents.", "remedy": "Zikr de Ya Salam (131 fois)"},
        3: {"status": "Fertile", "score": 85, "desc": "Une relation qui apporte croissance et succès. Tout projet commun fleurira rapidement.", "remedy": "Zikr de Ya Wahhab (14 fois)"},
        4: {"status": "Solide", "score": 75, "desc": "Une union basée sur la protection et la sécurité. C'est un lien ancré dans la réalité matérielle et spirituelle.", "remedy": "Zikr de Ya Hafiz (998 fois)"},
        5: {"status": "Instable", "score": 55, "desc": "Beaucoup de mouvement et de changements. Cette relation demande une grande adaptabilité.", "remedy": "Zikr de Ya Latif (129 fois)"},
        6: {"status": "Passionnée", "score": 90, "desc": "Forte attraction esthétique et émotionnelle. L'harmonie est naturelle et joyeuse.", "remedy": "Zikr de Ya Jamil (82 fois)"},
        7: {"status": "Mystérieuse", "score": 60, "desc": "Lien spirituel profond mais caché. Beaucoup de non-dits qui doivent être éclaircis par la prière.", "remedy": "Zikr de Ya Nur (256 fois)"},
        8: {"status": "Puissante", "score": 80, "desc": "Union de force et d'influence. Ensemble, vous pouvez accomplir de grandes choses, mais attention à l'ego.", "remedy": "Zikr de Ya Qawiyy (116 fois)"},
        9: {"status": "Parfaite", "score": 100, "desc": "L'aboutissement du destin. Vos âmes fusionnent dans une harmonie totale et divine.", "remedy": "Zikr de Al-Hamdu lillah (100 fois)"}
    }

    res = RESULTS_MAP.get(modulo_result)

    return jsonify({
        "pm1": pm1,
        "pm2": pm2,
        "total_pm": total_pm,
        "modulo": modulo_result,
        "status": res["status"],
        "score": res["score"],
        "description": res["desc"],
        "remedy": res["remedy"]
    })

@oracle_bp.route('/spiritual-profile', methods=['POST'])
def get_spiritual_profile():
    data = request.get_json(silent=True) or {}
    name = data.get('name', '').strip()
    mother_name = data.get('mother_name', '').strip()

    if not name or not mother_name:
        return jsonify({"error": "Nom et nom de la mère requis."}), 400

    pm_name = calculate_pm(nettoyer_arabe(name)) if not any(ord(c) < 128 for c in name) else calculate_pm(translitterer_fr_arabe(name))
    pm_mother = calculate_pm(nettoyer_arabe(mother_name)) if not any(ord(c) < 128 for c in mother_name) else calculate_pm(translitterer_fr_arabe(mother_name))

    total = pm_name + pm_mother
    
    # Éléments (Modulo 4)
    el_mod = total % 4
    if el_mod == 0: el_mod = 4
    ELEMENTS = {
        1: {"name": "Feu (Nari)", "desc": "Énergie, passion, volonté de fer. Votre esprit est un brasier protecteur.", "color": "text-orange-500"},
        2: {"name": "Terre (Tourabi)", "desc": "Stabilité, patience, pragmatisme. Vous êtes le socle sur lequel les autres s'appuient.", "color": "text-emerald-500"},
        3: {"name": "Air (Hawai)", "desc": "Communication, intellect, mouvement. Votre esprit est libre comme le vent des savanes.", "color": "text-blue-400"},
        4: {"name": "Eau (Ma'i)", "desc": "Intuition, émotion, profondeur. Vous percevez les secrets là où d'autres ne voient que l'ombre.", "color": "text-teal-400"}
    }
    
    # Bourdj (Modulo 12)
    b_mod = total % 12
    if b_mod == 0: b_mod = 12
    BOURDJ = {
        1: "Bélier (Al-Hamal)", 2: "Taureau (Al-Thawr)", 3: "Gémeaux (Al-Jawza)", 
        4: "Cancer (Al-Saratan)", 5: "Lion (Al-Asad)", 6: "Vierge (Al-Sunbula)",
        7: "Balance (Al-Mizan)", 8: "Scorpion (Al-Aqrab)", 9: "Sagittaire (Al-Qaws)",
        10: "Capricorne (Al-Jady)", 11: "Verseau (Al-Dalw)", 12: "Poissons (Al-Hut)"
    }
    
    # Asma (Closest PM)
    asma = min(DIVINE_NAMES, key=lambda x: abs(x['pm'] - pm_name))
    
    # Khatim 3x3 (Moussalas)
    # On utilise le total pour remplir un carré magique
    # Base du carré de Ghazali (3x3)
    # 8 1 6
    # 3 5 7
    # 4 9 2
    # Pour un total T, la case centrale est (T-12)/3 si T > 12 et T-12 est divisible par 3
    # Sinon on fait une approximation mystique
    center = (total - 12) // 3 if total > 12 else total
    khatim = [
        [center + 3, center - 4, center + 1],
        [center - 2, center, center + 2],
        [center - 1, center + 4, center - 3]
    ]

    return jsonify({
        "pm_name": pm_name,
        "pm_mother": pm_mother,
        "total": total,
        "element": ELEMENTS[el_mod],
        "star": BOURDJ[b_mod],
        "asma": asma,
        "khatim": khatim,
        "luck_day": ["Samedi", "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"][total % 7],
        "angel": ["Azrail", "Israfil", "Mikail", "Jibril"][(total % 4)]
    })

@oracle_bp.route('/daily-zikr', methods=['GET'])
def get_daily_zikr():
    import datetime
    now = datetime.datetime.now()
    day_idx = now.weekday() # 0 = Monday, 6 = Sunday
    
    # Days and their mystical properties
    DAYS = [
        {"name": "Lundi", "planet": "Lune", "asma": "Ya Latif (Le Subtil)", "pm": 129, "virtue": "Douceur, Protection, Ouverture"},
        {"name": "Mardi", "planet": "Mars", "asma": "Ya Qahhar (Le Tout-Puissant)", "pm": 306, "virtue": "Force, Victoire, Protection contre les ennemis"},
        {"name": "Mercredi", "planet": "Mercure", "asma": "Ya 'Alim (Le Très-Savant)", "pm": 150, "virtue": "Sagesse, Intelligence, Affaires"},
        {"name": "Jeudi", "planet": "Jupiter", "asma": "Ya Razzaq (Le Pourvoyeur)", "pm": 308, "virtue": "Prospérité, Fortune, Abondance"},
        {"name": "Vendredi", "planet": "Vénus", "asma": "Ya Wadoud (Le Bien-Aimé)", "pm": 20, "virtue": "Amour, Paix, Harmonie sociale"},
        {"name": "Samedi", "planet": "Saturne", "asma": "Ya Hayyou Ya Qayyoum (Le Vivant, L'Immuable)", "pm": 174, "virtue": "Stabilité, Longévité, Patience"},
        {"name": "Dimanche", "planet": "Soleil", "asma": "Ya Allah (Dieu)", "pm": 66, "virtue": "Lumière, Autorité, Succès total"}
    ]
    
    # Simple logic for current "hour" energy (just a simulation based on time)
    hour = now.hour
    energy = "Ascendante" if hour < 12 else "Descendante"
    
    return jsonify({
        "day": DAYS[day_idx],
        "hour_energy": energy,
        "timestamp": now.isoformat()
    })
