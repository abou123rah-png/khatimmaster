# routes/thalsam.py
from flask import Blueprint, render_template, request, jsonify
import random

thalsam_bp = Blueprint('thalsam', __name__)

@thalsam_bp.route('/thalsam', methods=['GET', 'POST'])
def thalsam_generator():
    """Route pour le générateur de Talsam."""
    if request.method == 'POST':
        try:
            pm_value = int(request.form.get('pm', 0))
            if pm_value <= 0:
                return jsonify({'error': 'Veuillez entrer un nombre PM valide.'}), 400
            
            talsam = generate_talsam(pm_value)
            return jsonify({'talsam': talsam})
        except ValueError:
            return jsonify({'error': 'Valeur PM invalide.'}), 400
    else:
        return render_template('thalsam.html')

def generate_talsam(pm):
    """Fonction de génération du Talsam."""
    correspondances = {
        "ا": 1, "أ": 1, "ب": 2, "ت": 400, "ث": 500, "ج": 3, "ح": 8, "خ": 600, "د": 4,
        "ذ": 700, "ر": 200, "ز": 7, "س": 60, "ش": 300, "ص": 90, "ض": 800, "ط": 9,
        "ظ": 900, "ع": 70, "غ": 1000, "ف": 80, "ق": 100, "ك": 20, "ل": 30, "م": 40,
        "ن": 50, "ه": 5, "و": 6, "ي": 10
    }

    def generer_combinaisons_variees(pm_val):
        lettres_triees = sorted(correspondances.items(), key=lambda x: x[1], reverse=True)
        combinaison = []
        reste = pm_val
        derniere_lettre = None

        while reste > 0:
            if reste >= 900:
                choix = "غ" if random.random() < 0.5 else "ش"
                combinaison.append(choix)
                reste -= correspondances[choix]
                derniere_lettre = choix
            else:
                candidats = [item for item in lettres_triees if item[1] <= reste and item[0] != derniere_lettre]
                if candidats:
                    lettre, val = random.choice(candidats)
                    combinaison.append(lettre)
                    reste -= val
                    derniere_lettre = lettre
                else:
                    combinaison.append("غ")
                    reste -= 1000
        return combinaison

    def ajouter_protection(talsam_list):
        return ''.join(talsam_list) + ' النور'

    combinaisons = generer_combinaisons_variees(pm)
    talsam = ajouter_protection(combinaisons)
    return talsam