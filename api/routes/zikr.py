from flask import Blueprint, render_template

zikr_bp = Blueprint('zikr', __name__)

@zikr_bp.route('/zikr')
def zikr():
    return render_template('zikr.html')
