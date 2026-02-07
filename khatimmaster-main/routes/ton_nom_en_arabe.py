from flask import Blueprint, render_template, request
from utils import translitterer_fr_arabe

ton_nom_en_arabe_bp = Blueprint('ton_nom_en_arabe', __name__)

@ton_nom_en_arabe_bp.route('/ton_nom_en_arabe', methods=['GET', 'POST'])
def ton_nom_en_arabe():
    resultat = None
    if request.method == 'POST':
        prenom = request.form.get('prenom')
        if prenom:
            resultat = translitterer_fr_arabe(prenom)
    return render_template('ton_nom_en_arabe.html', resultat=resultat)
