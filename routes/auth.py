# routes/auth.py
from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os

auth_bp = Blueprint('auth', __name__)

DATABASE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'instance', 'khatimmaster.db')

def get_db_connection():
    """Crée le dossier 'instance' s'il n'existe pas, puis retourne une connexion à la base de données."""
    db_dir = os.path.dirname(DATABASE)
    os.makedirs(db_dir, exist_ok=True)  # ← ✅ LIGNE AJOUTÉE — CRÉE LE DOSSIER instance/ SI BESOIN
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
        conn.close()
        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['username'] = user['username']
            flash('Connecté avec succès !', 'success')
            return redirect(url_for('accueil'))
        else:
            flash('Nom d’utilisateur ou mot de passe incorrect.', 'danger')
    return render_template('login.html')

@auth_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        if not username or not email or not password:
            flash('Tous les champs sont obligatoires.', 'warning')
            return render_template('signup.html')
        hashed_password = generate_password_hash(password)
        try:
            conn = get_db_connection()
            conn.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                         (username, email, hashed_password))
            conn.commit()
            conn.close()
            flash('Compte créé avec succès ! Connectez-vous.', 'success')
            return redirect(url_for('auth.login'))
        except sqlite3.IntegrityError:
            flash('Ce nom d’utilisateur ou email existe déjà.', 'danger')
    return render_template('signup.html')

@auth_bp.route('/profile')
def profile():
    if 'user_id' not in session:
        flash('Veuillez vous connecter pour accéder à votre profil.', 'warning')
        return redirect(url_for('auth.login'))
    return render_template('profile.html', username=session['username'])

@auth_bp.route('/logout')
def logout():
    session.clear()
    flash('Déconnecté avec succès.', 'info')
    return redirect(url_for('accueil'))