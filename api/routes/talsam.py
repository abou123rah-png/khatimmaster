from flask import Blueprint, render_template

talsam_bp = Blueprint('talsam', __name__)

@talsam_bp.route('/talsam')
def talsam():
    return render_template('talsam.html')
