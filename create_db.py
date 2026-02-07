# create_db.py
import sqlite3

# Connexion à la base de données (elle sera créée si elle n'existe pas)
conn = sqlite3.connect('dreams.db')
cursor = conn.cursor()

# Création de la table
cursor.execute('''
CREATE TABLE IF NOT EXISTS symbols (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbole TEXT UNIQUE NOT NULL,
    signification TEXT NOT NULL,
    contexte TEXT,
    source TEXT
)
''')
# Créer la table pour stocker les rêves interprétés
cursor.execute('''
CREATE TABLE IF NOT EXISTS dream_interpretations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dream_text TEXT UNIQUE NOT NULL,
    interpretation TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')
# Sauvegarde et fermeture
conn.commit()
conn.close()

print("✅ Base de données 'dreams.db' et table 'symbols' créées avec succès !")