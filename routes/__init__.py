from flask import Flask

def register_blueprints(app: Flask):
    """
    Enregistre uniquement le blueprint d'authentification.
    """
    from .auth import auth_bp
    app.register_blueprint(auth_bp)