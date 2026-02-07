from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from app import db # On importe l'objet 'db' que nous avons créé dans app.py

# La classe User hérite de db.Model (pour être un modèle SQLAlchemy)
# et de UserMixin (pour avoir les propriétés requises par Flask-Login)
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True) # Clé primaire
    username = db.Column(db.String(80), unique=True, nullable=False) # Nom d'utilisateur, doit être unique
    email = db.Column(db.String(120), unique=True, nullable=False) # Email, doit être unique
    password_hash = db.Column(db.String(256)) # Champ pour le mot de passe haché

    def set_password(self, password):
        """Crée un hash sécurisé du mot de passe."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Vérifie si le mot de passe fourni correspond au hash."""
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'

