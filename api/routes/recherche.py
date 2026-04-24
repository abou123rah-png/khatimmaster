# routes/recherche.py
from flask import Blueprint, render_template, request
import os

# Création du blueprint
recherche_bp = Blueprint('recherche', __name__)

@recherche_bp.route('/recherche', methods=['GET', 'POST'])
def recherche():
    mot_cle = ""
    results = []

    if request.method == "POST":
        mot_cle = request.form.get("mot", "").strip()
        if mot_cle:
            # Dossier où se trouvent les sourates .txt
            dossier_sourates = os.path.join("static", "coran", "sourates")

            # Parcours des 114 fichiers
            for num in range(1, 115):
                chemin_fichier = os.path.join(dossier_sourates, f"{num}.txt")
                if os.path.exists(chemin_fichier):
                    with open(chemin_fichier, "r", encoding="utf-8") as f:
                        lignes = [l.strip() for l in f if l.strip()]
                        for idx, ligne in enumerate(lignes, start=1):
                            if mot_cle in ligne:
                                results.append({
                                    "sourate": num,
                                    "verset": idx,
                                    "texte": ligne
                                })

    return render_template("recherche.html", mot_cle=mot_cle, results=results)
