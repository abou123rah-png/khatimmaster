from flask import Blueprint, render_template, request, flash

# Route spécifique pour Khatim 1
khatim1_bp = Blueprint('khatim1', __name__, url_prefix='/khatim1')

@khatim1_bp.route('/', methods=['GET', 'POST'])
def khatim1():
    """Page indépendante pour Khatim 1"""
    tableau = None

    if request.method == 'POST':
        valeur_a = request.form.get('valeur_a')
        valeur_b = request.form.get('valeur_b')

        if valeur_a and valeur_b:
            try:
                a = int(valeur_a)
                b = int(valeur_b)
                tableau = [[a, b], [b, a]]
            except ValueError:
                flash("Veuillez entrer des nombres valides.", "warning")

    return render_template('khatim1.html', tableau=tableau)


# Fonction pour créer dynamiquement khatim2 à khatim10
def create_khatim_blueprint(khatim_id):
    blueprint = Blueprint(f'khatim{khatim_id}', __name__, url_prefix=f'/khatim{khatim_id}')

    @blueprint.route('/', methods=['GET', 'POST'])
    def khatim():
        tableau = None
        if request.method == 'POST':
            valeur_a = request.form.get('valeur_a')
            valeur_b = request.form.get('valeur_b')

            if valeur_a and valeur_b:
                try:
                    a = int(valeur_a)
                    b = int(valeur_b)
                    tableau = [[a, b], [b, a]]
                except ValueError:
                    flash("Veuillez entrer des nombres valides.", "warning")

        return render_template(f'khatim{khatim_id}.html', tableau=tableau)

    return blueprint


def register_khatim_blueprints(app):
    # On ajoute d'abord khatim1 explicitement
    app.register_blueprint(khatim1_bp)

    # Puis les khatim2 à khatim10 dynamiquement
    for i in range(2, 11):  # Commencer à 2 pour éviter doublon
        app.register_blueprint(create_khatim_blueprint(i))
