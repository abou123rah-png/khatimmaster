from flask import Blueprint, render_template

clavier_bp = Blueprint('clavier', __name__)

@clavier_bp.route('/clavier')
def clavier():
    return render_template('clavier.html')
