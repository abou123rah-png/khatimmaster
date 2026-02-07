from flask import Blueprint, render_template, send_from_directory, abort
import os

coran_bp = Blueprint('coran', __name__, template_folder='templates')

# Chemin vers les fichiers HTML des sourates
CHAPTERS_DIR = os.path.join(os.path.dirname(__file__), 'static', 'chapters')

@coran_bp.route('/coran')
def coran():
    return render_template('coran.html', chapters=range(1, 115))

@coran_bp.route('/coran/chapitre/<int:num>')
def show_chapter(num):
    filename = f"{num}.html"
    filepath = os.path.join(CHAPTERS_DIR, filename)
    if os.path.exists(filepath):
        return send_from_directory(CHAPTERS_DIR, filename)
    else:
        abort(404, description="Chapitre introuvable")
