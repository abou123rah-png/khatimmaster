from flask import Blueprint, render_template, request
from utils import nettoyer_arabe, calculate_arabic_weight, determine_pm_nature, get_arabic_element
import re  # pour la vérification des voyelles/diacritiques

khatim1_bp = Blueprint('khatim1', __name__, template_folder='templates')

@khatim1_bp.route('/khatim1', methods=['GET', 'POST'])
def khatim1():
    resultats = {}
    erreurs = []

    if request.method == 'POST':
        mot_a = request.form.get('mot_a', '').strip()
        mot_b = request.form.get('mot_b', '').strip()

        if not mot_a or not mot_b:
            erreurs.append("Les deux mots doivent être fournis.")
        elif re.search(r'[\u064B-\u0652]', mot_a) or re.search(r'[\u064B-\u0652]', mot_b):
            erreurs.append("Veuillez entrer les mots sans voyelles ou diacritiques.")
        else:
            # Nettoyage obligatoire avant calcul
            mot_a_nettoye = nettoyer_arabe(mot_a)
            mot_b_nettoye = nettoyer_arabe(mot_b)

            pm_a = calculate_arabic_weight(mot_a_nettoye)
            pm_b = calculate_arabic_weight(mot_b_nettoye)

            nature_a_lettre, nature_a_nom = determine_pm_nature(pm_a)
            nature_b_lettre, nature_b_nom = determine_pm_nature(pm_b)

            element_a = get_arabic_element(mot_a_nettoye[0]) if mot_a_nettoye else "inconnu"
            element_b = get_arabic_element(mot_b_nettoye[0]) if mot_b_nettoye else "inconnu"

            # Exemple de condition : les deux PM sont de nature opposée et leur somme divisible par 5
            condition_valide = (
                (nature_a_nom != nature_b_nom) and
                ((pm_a + pm_b) % 5 == 0)
            )

            resultats = {
                'mot_a': mot_a,
                'mot_b': mot_b,
                'pm_a': pm_a,
                'pm_b': pm_b,
                'nature_a': nature_a_nom,
                'nature_b': nature_b_nom,
                'lettre_a': nature_a_lettre,
                'lettre_b': nature_b_lettre,
                'element_a': element_a,
                'element_b': element_b,
                'condition_valide': condition_valide,
                'somme_pm': pm_a + pm_b
            }

    return render_template('khatim1.html', resultats=resultats, erreurs=erreurs)
