# create_and_import.py
import sqlite3
import json
import os

# 1. Nom du fichier de base de données
DB_FILE = 'dreams.db'

# 2. Supprimer la base si elle existe et est corrompue
if os.path.exists(DB_FILE):
    try:
        conn_test = sqlite3.connect(DB_FILE)
        conn_test.execute("SELECT name FROM sqlite_master WHERE type='table';")
        conn_test.close()
        print("📁 Base existante valide — mais on la recrée pour ajouter la colonne 'type'.")
        os.remove(DB_FILE)
    except sqlite3.DatabaseError:
        print("⚠️  Base corrompue ou invalide. Suppression...")
        os.remove(DB_FILE)

# 3. Connexion à la base (elle sera créée si elle n'existe pas)
conn = sqlite3.connect(DB_FILE)
cursor = conn.cursor()

# 4. Création de la table AVEC la colonne "type"
cursor.execute('''
CREATE TABLE IF NOT EXISTS symbols (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    symbole TEXT UNIQUE NOT NULL,
    signification TEXT NOT NULL,
    contexte TEXT,
    source TEXT
)
''')

print("✅ Table 'symbols' créée avec colonne 'type'.")

# 5. Vérifier que le fichier JSON existe
JSON_FILE = 'african_dreams.json'
if not os.path.exists(JSON_FILE):
    print(f"❌ Erreur : Le fichier '{JSON_FILE}' est introuvable.")
    print("➡️  Crée d'abord le fichier 'african_dreams.json' dans ce dossier.")
    conn.close()
    exit(1)

# 6. Charger les données JSON
with open(JSON_FILE, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"📂 {len(data)} symboles chargés depuis '{JSON_FILE}'.")

# 7. Insertion dans la base
inserted = 0
for item in data:
    try:
        cursor.execute('''
        INSERT OR IGNORE INTO symbols (type, symbole, signification, contexte, source)
        VALUES (?, ?, ?, ?, ?)
        ''', (
            item.get('type', 'signe'),
            item.get('symbole', ''),
            item.get('signification', ''),
            item.get('contexte', ''),
            item.get('source', 'africain')
        ))
        if cursor.rowcount > 0:
            inserted += 1
    except Exception as e:
        print(f"❌ Erreur lors de l'insertion de '{item.get('symbole', 'inconnu')}': {e}")

# 8. Sauvegarde et fermeture
conn.commit()
conn.close()

print(f"✅ Import terminé ! {inserted} nouveaux symboles ajoutés.")
print(f"📁 Fichier de base créé : {DB_FILE}")