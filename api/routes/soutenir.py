from flask import Blueprint, render_template

soutenir_bp = Blueprint('soutenir', __name__)

@soutenir_bp.route('/soutenir')
def soutenir():
    return render_template('soutenir.html')
