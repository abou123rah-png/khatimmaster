# geomancy_logic.py

import random

FIGURES = {
    1: {"name": "Via", "binary": (1, 1, 1, 1), "meaning": "Le Chemin, la Voie. Indique le mouvement, le voyage, le changement."},
    2: {"name": "Cauda Draconis", "binary": (1, 1, 1, 2), "meaning": "La Queue du Dragon. Fin, sortie, achèvement. Peut être difficile mais nécessaire."},
    3: {"name": "Puer", "binary": (1, 1, 2, 1), "meaning": "Le Jeune Garçon. Action, impulsion, énergie masculine, parfois imprudente."},
    4: {"name": "Fortuna Minor", "binary": (1, 1, 2, 2), "meaning": "La Petite Fortune. Succès rapide mais éphémère, chance passagère."},
    5: {"name": "Puella", "binary": (1, 2, 1, 1), "meaning": "La Jeune Fille. Beauté, féminité, harmonie, plaisir. Favorable pour les arts."},
    6: {"name": "Amissio", "binary": (1, 2, 1, 2), "meaning": "La Perte, l'abandon. Indique un sacrifice nécessaire, une dépense ou un sentiment de vide."},
    7: {"name": "Carcer", "binary": (1, 2, 2, 1), "meaning": "La Prison. Blocage, retard, isolement, restriction."},
    8: {"name": "Laetitia", "binary": (1, 2, 2, 2), "meaning": "La Joie. Bonheur, optimisme, célébration. Annonce une issue heureuse."},
    9: {"name": "Caput Draconis", "binary": (2, 1, 1, 1), "meaning": "La Tête du Dragon. Commencement, entrée, opportunité. Favorable."},
    10: {"name": "Conjunctio", "binary": (2, 1, 1, 2), "meaning": "La Conjonction. Union, rencontre, mariage, association."},
    11: {"name": "Acquisitio", "binary": (2, 1, 2, 1), "meaning": "L'Acquisition. Gain, profit, recevoir. Favorable pour les questions matérielles."},
    12: {"name": "Rubeus", "binary": (2, 1, 2, 2), "meaning": "Le Rouge. Passion, colère, violence, action désordonnée."},
    13: {"name": "Fortuna Major", "binary": (2, 2, 1, 1), "meaning": "La Grande Fortune. Succès majeur, chance durable, aide divine. Très favorable."},
    14: {"name": "Albus", "binary": (2, 2, 1, 2), "meaning": "Le Blanc. Sagesse, paix, pureté, clarté d'esprit."},
    15: {"name": "Tristitia", "binary": (2, 2, 2, 1), "meaning": "La Tristesse. Chagrin, mélancolie, difficulté."},
    16: {"name": "Populus", "binary": (2, 2, 2, 2), "meaning": "Le Peuple. Rassemblement, communauté, opinion publique."}
}

FIGURES_BY_BINARY = {v["binary"]: v for k, v in FIGURES.items()}

def add_points(p1, p2):
    """Additionne deux points (1 ou 2). 1+1=2, 1+2=1, 2+1=1, 2+2=2."""
    return 2 if (p1 + p2) % 2 == 0 else 1

def generate_figure_from(fig1, fig2):
    """Génère une nouvelle figure à partir de deux autres."""
    new_binary = tuple(add_points(p1, p2) for p1, p2 in zip(fig1["binary"], fig2["binary"]))
    return FIGURES_BY_BINARY[new_binary]

def generate_random_mothers():
    """Génère 4 figures Mères aléatoirement."""
    return [random.choice(list(FIGURES.values())) for _ in range(4)]

def derive_theme(mothers):
    """Dérive un thème géomantique complet à partir des 4 Mères."""
    theme = {i + 1: mothers[i] for i in range(4)}
    
    # Filles (5-8)
    for i in range(4):
        new_binary = (mothers[0]["binary"][i], mothers[1]["binary"][i], mothers[2]["binary"][i], mothers[3]["binary"][i])
        theme[i + 5] = FIGURES_BY_BINARY[new_binary]

    # Nièces (9-12)
    theme[9] = generate_figure_from(theme[1], theme[2])
    theme[10] = generate_figure_from(theme[3], theme[4])
    theme[11] = generate_figure_from(theme[5], theme[6])
    theme[12] = generate_figure_from(theme[7], theme[8])

    # Témoins (13-14)
    theme[13] = generate_figure_from(theme[9], theme[10])
    theme[14] = generate_figure_from(theme[11], theme[12])

    # Juge (15)
    theme[15] = generate_figure_from(theme[13], theme[14])
    
    return theme  # ← ✅ CORRECTION : retourne le thème complet

# Bloc de test pour exécuter ce fichier directement
if __name__ == '__main__':
    print("--- Génération d'un thème géomantique aléatoire ---")
    random_mothers = generate_random_mothers()
    print("Les 4 Mères générées :")
    for i, mother in enumerate(random_mothers):
        print(f"  Mère {i+1}: {mother['name']} {mother['binary']}")
    
    full_theme = derive_theme(random_mothers)
    print("\nThème complet :")
    for i in range(1, 16):
        print(f"  Maison {i}: {full_theme[i]['name']}")
    
    print("\n--- Interprétation Clé ---")
    print(f"Témoin de Droite (Passé): {full_theme[13]['name']}")
    print(f"Témoin de Gauche (Futur): {full_theme[14]['name']}")
    print(f"Juge Suprême (Réponse): {full_theme[15]['name']}")
    print(f"  -> Signification: {full_theme[15]['meaning']}")