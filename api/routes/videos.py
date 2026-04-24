from flask import Blueprint, render_template

videos_bp = Blueprint('videos', __name__)

@videos_bp.route('/videos')
def videos():
    return render_template('videos.html')
