# routes/auth.py
from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os

auth_bp = Blueprint('auth', __name__, url_prefix='/api')

DATABASE = '/tmp/khatimmaster.db' if os.environ.get('VERCEL') == '1' else os.path.join(os.path.dirname(os.path.dirname(__file__)), 'instance', 'khatimmaster.db')

def get_db_connection():
    """Crée le dossier 'instance' s'il n'existe pas, puis retourne une connexion à la base de données."""
    db_dir = os.path.dirname(DATABASE)
    try:
        os.makedirs(db_dir, exist_ok=True)
    except OSError:
        pass # Ignorer sur Vercel (read-only)
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
        if request.is_json:
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')
        else:
            username = request.form.get('username')
            password = request.form.get('password')
            
        if not username or not password:
            if request.is_json:
                return jsonify({"error": "Nom d'utilisateur et mot de passe requis"}), 400
            flash('Nom d’utilisateur et mot de passe requis', 'danger')
            return render_template('login.html')

        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
        conn.close()
        
        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['username'] = user['username']
            if request.is_json:
                return jsonify({"success": True, "username": user['username']})
            flash('Connecté avec succès !', 'success')
            return redirect(url_for('accueil'))
        else:
            if request.is_json:
                return jsonify({"error": "Nom d’utilisateur ou mot de passe incorrect"}), 401
            flash('Nom d’utilisateur ou mot de passe incorrect.', 'danger')
            
    return render_template('login.html')

@auth_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        if request.is_json:
            data = request.get_json()
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
        else:
            username = request.form.get('username')
            email = request.form.get('email')
            password = request.form.get('password')

        if not username or not email or not password:
            if request.is_json:
                return jsonify({"error": "Tous les champs sont obligatoires"}), 400
            flash('Tous les champs sont obligatoires.', 'warning')
            return render_template('signup.html')

        hashed_password = generate_password_hash(password)
        try:
            conn = get_db_connection()
            conn.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                         (username, email, hashed_password))
            conn.commit()
            conn.close()
            if request.is_json:
                return jsonify({"success": True})
            flash('Compte créé avec succès ! Connectez-vous.', 'success')
            return redirect(url_for('auth.login'))
        except sqlite3.IntegrityError:
            if request.is_json:
                return jsonify({"error": "Ce nom d’utilisateur ou email existe déjà"}), 409
            flash('Ce nom d’utilisateur ou email existe déjà.', 'danger')
            
    return render_template('signup.html')

@auth_bp.route('/me')
def me():
    if 'user_id' in session:
        return jsonify({
            "logged_in": True,
            "username": session.get('username'),
            "user_id": session.get('user_id')
        })
    return jsonify({"logged_in": False}), 200

@auth_bp.route('/profile')
def profile():
    if 'user_id' not in session:
        flash('Veuillez vous connecter pour accéder à votre profil.', 'warning')
        return redirect(url_for('auth.login'))
    return render_template('profile.html', username=session['username'])

@auth_bp.route('/logout', methods=['GET', 'POST'])
def logout():
    session.clear()
    if request.is_json or request.method == 'POST':
        return jsonify({"success": True})
    flash('Déconnecté avec succès.', 'info')
    return redirect(url_for('accueil'))