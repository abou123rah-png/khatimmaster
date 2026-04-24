from flask import Blueprint, render_template

zikr_personnel_bp = Blueprint('zikr_personnel', __name__)

@zikr_personnel_bp.route('/zikr_personnel')
def zikr_personnel():
    return render_template('zikr_personnel.html')
