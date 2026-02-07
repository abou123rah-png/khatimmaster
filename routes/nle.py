from flask import Blueprint, render_template, request, redirect, url_for, flash
import os
from utils import calculer_somme_par_nature

# Créer un blueprint Flask unique pour NLE
nle_bp = Blueprint('nle', __name__)

# Fonction pour calculer le poids mystique
def calculate_mystical_weight(phrase):
    arabic_weights = {
        "ا": 1, "أ": 1, "ب": 1, "ت": 1, "ث": 1, "ج": 1, "ح": 1, "خ": 1, "د": 1, "ذ": 1, "ر": 1,
        "ز": 1, "س": 1, "ش": 1, "ص": 1, "ض": 1, "ط": 1, "ظ": 1, "ع": 1, "غ": 1, "ف": 1,
        "ق": 1, "ك": 1, "ل": 1, "م": 1, "ن": 1, "ه": 1, "و": 1, "ي": 1
    }
    return sum(arabic_weights.get(letter, 0) for letter in phrase)

# Route principale pour NLE
@nle_bp.route('/nle', methods=['GET', 'POST'])
def nle():
    tableau = None
    if request.method == 'POST':
        phrase = request.form.get('phrase')
        if phrase:
            mystical_weight = calculate_mystical_weight(phrase)
            tableau = [[mystical_weight]]  # Exemple de tableau avec le poids mystique
        else:
            flash("Veuillez entrer une phrase.", "warning")

    return render_template('nle.html', tableau=tableau)

