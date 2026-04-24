#!/usr/bin/env python3
# coding: utf-8

import os
import json

# Basmallah officielle
BASMALLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ"

def find_input_file(possible_paths):
    """Retourne le premier chemin existant."""
    for p in possible_paths:
        if os.path.exists(p):
            return p
    return None

def split_by_sourate(input_path=None, output_dir="static/coran/sourates"):
    # Liste des chemins possibles avec ton vrai emplacement
    default_candidates = [
        input_path or "static/coran_clear.txt",
        "static/coran/coran_clear.txt",
        "static/coran/sourates/coran_clear.txt",
        "coran_clear.txt",
        "/mnt/data/coran_clear.txt",
    ]
    source = find_input_file(default_candidates)
    if source is None:
        raise FileNotFoundError("❌ Fichier coran_clear.txt introuvable.")

    print(f"Lecture : {source}")
    with open(source, "r", encoding="utf-8") as f:
        lines = [ln.rstrip("\n") for ln in f if ln.strip()]

    chunks = {}
    for line in lines:
        try:
            # On suppose que le fichier est formaté avec numéro de sourate en premier
            sourate_num = int(line.split("|")[0])
        except ValueError:
            continue
        texte = line.split("|", 2)[-1]

        if sourate_num not in chunks:
            chunks[sourate_num] = []
        chunks[sourate_num].append(texte)

    # Ajouter la Basmallah aux sourates sauf la 9
    for num in range(1, 115):
        if num not in chunks:
            chunks[num] = []
        if num != 9:  # Sauf sourate 9
            if not chunks[num] or not chunks[num][0].startswith("بِسْم"):
                chunks[num].insert(0, BASMALLAH)

    # Écriture des fichiers
    os.makedirs(output_dir, exist_ok=True)
    for num in range(1, 115):
        out_path = os.path.join(output_dir, f"{num}.txt")
        with open(out_path, "w", encoding="utf-8") as fo:
            fo.write("\n".join(chunks[num]))

    # Sauvegarde de l’index
    index = {
        "source": os.path.abspath(source),
        "output_dir": os.path.abspath(output_dir),
        "n_sourates_detectees": len(chunks)
    }
    with open(os.path.join(output_dir, "index.json"), "w", encoding="utf-8") as jf:
        json.dump(index, jf, ensure_ascii=False, indent=2)

    print(f"✅ {len(chunks)} sourates créées dans '{output_dir}'")
    return index

if __name__ == "__main__":
    try:
        split_by_sourate()
    except Exception as e:
        print("Erreur :", e)
