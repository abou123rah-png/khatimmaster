# hadakoun.py
from flask import Blueprint, render_template, request
import os

hadakoun_bp = Blueprint('hadakoun', __name__, template_folder='templates')

@hadakoun_bp.route('/hadakoun', methods=['GET', 'POST'])
def hadakoun():
    resultats = None
    mot_a = ""
    mot_b = ""
    mot_c = ""
    
    if request.method == 'POST':
        mot_a = request.form.get('mot_a', '').strip()
        mot_b = request.form.get('mot_b', '').strip()
        mot_c = request.form.get('mot_c', '').strip()
        
        if not mot_a or not mot_b or not mot_c:
            error = "Veuillez entrer des valeurs pour tous les mots"
            return render_template('hadakoun.html', 
                                 error=error, 
                                 resultats=None,
                                 mot_a=mot_a,
                                 mot_b=mot_b,
                                 mot_c=mot_c)
        
        try:
            # Calcul de la somme par nature
            resultats = calculer_somme_par_nature([mot_a, mot_b, mot_c])
        except Exception as e:
            error = f"Une erreur s'est produite : {str(e)}"
            return render_template('hadakoun.html', 
                                 error=error, 
                                 resultats=None,
                                 mot_a=mot_a,
                                 mot_b=mot_b,
                                 mot_c=mot_c)
    
    return render_template('hadakoun.html', 
                         resultats=resultats,
                         mot_a=mot_a,
                         mot_b=mot_b,
                         mot_c=mot_c)

def calculer_somme_par_nature(mots):
    """
    Calcule le poids mystique des mots selon leur nature.
    Cette fonction est un exemple et devrait être implémentée
    selon les règles spécifiques du khatim Hadakoun.
    """
    # Poids arabes (à adapter selon les règles spécifiques du Hadakoun)
    poids_arabes = {
        "ا": 1, "أ": 1, "ب": 2, "ت": 400, "ث": 500, "ج": 3, "ح": 8, "خ": 600, "د": 4,
        "ذ": 700, "ر": 200, "ز": 7, "س": 60, "ش": 300, "ص": 90, "ض": 800, "ط": 9,
        "ظ": 900, "ع": 70, "غ": 1000, "ف": 80, "ق": 100, "ك": 20, "ل": 30, "م": 40,
        "ن": 50, "ه": 5, "و": 6, "ي": 10
    }
    
    # Nature des lettres (exemple simplifié)
    natures = {
        "ا": "terre", "أ": "terre", "ب": "eau", "ت": "feu", "ث": "feu",
        "ج": "eau", "ح": "air", "خ": "feu", "د": "terre", "ذ": "air",
        "ر": "eau", "ز": "terre", "س": "air", "ش": "feu", "ص": "terre",
        "ض": "terre", "ط": "air", "ظ": "air", "ع": "eau", "غ": "air",
        "ف": "eau", "ق": "terre", "ك": "eau", "ل": "air", "م": "eau",
        "ن": "air", "ه": "terre", "و": "eau", "ي": "air"
    }
    
    # Initialisation des résultats
    sommes = {"terre": 0, "eau": 0, "feu": 0, "air": 0}
    
    # Calcul des sommes par nature
    for mot in mots:
        for lettre in mot:
            if lettre in poids_arabes:
                valeur = poids_arabes[lettre]
                nature = natures.get(lettre, "inconnue")
                if nature in sommes:
                    sommes[nature] += valeur
    
    return sommes