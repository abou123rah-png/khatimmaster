from flask import Flask

def register_blueprints(app: Flask):
    """
    Enregistre tous les blueprints de l'application.
    """
    from .auth import auth_bp
    from .khatim import register_khatim_blueprints
    from .oracle import oracle_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(oracle_bp)
    register_khatim_blueprints(app)