from flask import Blueprint, render_template, request

badouhoun_bp = Blueprint('badouhoun', __name__, template_folder='templates')

lettres_nature = {
    'feu': ['ا', 'أ', 'ط', 'م', 'ف', 'س', 'ذ', 'ه'],
    'terre': ['ب', 'و', 'ي', 'ن', 'ض', 'ت', 'ظ'],
    'air': ['ج', 'ز', 'ك', 'ص', 'ق', 'ث', 'غ', 'ح'],
    'eau': ['د', 'ح', 'ل', 'ع', 'ر', 'خ', 'ش']
}

valeurs_numeriques = {
    "ا": 1, "أ": 1, "ب": 2, "ت": 400, "ث": 500, "ج": 3, "ح": 8, "خ": 600, "د": 4, "ذ": 700, "ر": 200,
    "ز": 7, "س": 60, "ش": 300, "ص": 90, "ض": 800, "ط": 9, "ظ": 900, "ع": 70, "غ": 1000, "ف": 80,
    "ق": 100, "ك": 20, "ل": 30, "م": 40, "ن": 50, "ه": 5, "و": 6, "ي": 10
}

tableau_fusion = [
    [4, 0, 2],
    [8, 0, 12],
    [8, 6, 6]
]

def calculer_somme_par_nature(mots):
    somme_nature = {'feu': 0, 'terre': 0, 'air': 0, 'eau': 0}
    for mot in mots:
        for lettre in mot:
            valeur = valeurs_numeriques.get(lettre, 0)
            for nature, lettres in lettres_nature.items():
                if lettre in lettres:
                    somme_nature[nature] += valeur
    return somme_nature

def generer_tableau(somme_nature):
    tableau = [
        [somme_nature['terre'], somme_nature['eau'] + somme_nature['air'], somme_nature['feu']],
        [somme_nature['feu'] + somme_nature['air'], 0, somme_nature['terre'] + somme_nature['eau']],
        [somme_nature['eau'], somme_nature['terre'] + somme_nature['feu'], somme_nature['air']]
    ]
    tableau_final = [
        [tableau[i][j] + tableau_fusion[i][j] for j in range(3)]
        for i in range(3)
    ]
    return tableau_final

@badouhoun_bp.route('/badouhoun', methods=['GET', 'POST'])
def badouhoun():
    tableau_final = None
    if request.method == 'POST':
        mot_a = request.form.get('mot_a', '').strip()
        mot_b = request.form.get('mot_b', '').strip()
        mot_c = request.form.get('mot_c', '').strip()

        if mot_a and mot_b and mot_c:
            resultats = calculer_somme_par_nature([mot_a, mot_b, mot_c])
            tableau_final = generer_tableau(resultats)

    return render_template('badouhoun.html', tableau_final=tableau_final)
