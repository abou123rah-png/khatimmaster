from flask import Flask

def register_blueprints(app: Flask):
    """
    Enregistre tous les blueprints de l'application.
    """
    from .auth import auth_bp
    from .khatim import register_khatim_blueprints
    
    app.register_blueprint(auth_bp)
    register_khatim_blueprints(app)