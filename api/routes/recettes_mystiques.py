from flask import Blueprint, render_template

recettes_bp = Blueprint('recettes_mystiques', __name__)

@recettes_bp.route('/recettes-mystiques')
def recettes():
    return render_template('recettes_mystiques.html')
