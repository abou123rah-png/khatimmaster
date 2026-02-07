# KhatimMaster - Application Web Flask

[![Pipeline Status](https://gitlab.com/cissdoro/khatimmaster/badges/main/pipeline.svg )](https://gitlab.com/cissdoro/khatimmaster/-/pipelines )
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg )](https://opensource.org/licenses/MIT )

**Accédez à l'application en ligne : [khatimmaster.onrender.com](https://khatimmaster.onrender.com/ )**

KhatimMaster est une application web dédiée à la culture arabo-islamique. Elle offre une suite d'outils pour les calculs de poids mystiques (Abjad), la génération de carrés magiques (khatims), la lecture du Coran, et d'autres fonctionnalités liées aux textes et pratiques ésotériques.

## Fonctionnalités Principales

*   **Générateur de Khatims :** Créez des carrés magiques de différentes tailles (3x3 à 10x10).
*   **Calculs Mystiques :** Outils pour le calcul de poids mystique, "Badouhoun", "Hadakoun", NLE, etc.
*   **Lecteur de Coran :** Accès complet au texte sacré avec une interface de recherche de sourates.
*   **Outils de Conversion :** Clavier arabe pour calculer la valeur Abjad et outil pour convertir un nom en arabe.
*   **Compteur de Zikr :** Plusieurs modules pour accompagner les pratiques d'invocations.
*   **Ressources :** Section avec des textes, recettes mystiques et vidéos.

## Technologies Utilisées

*   **Backend :** Python avec le framework Flask
*   **Frontend :** HTML5, CSS3, JavaScript, Bootstrap 5
*   **Base de Données :** (Précisez si vous en utilisez une, ex: SQLite)
*   **Déploiement :** Gunicorn sur la plateforme Render, avec intégration continue via GitLab.

## Installation et Lancement en Local

Pour faire fonctionner ce projet sur votre machine locale, suivez ces étapes :

1.  **Clonez le dépôt :**
    ```bash
    git clone https://gitlab.com/cissdoro/khatimmaster.git
    cd khatimmaster
    ```

2.  **Créez un environnement virtuel et activez-le :**
    ```bash
    # Pour Windows
    python -m venv venv
    .\venv\Scripts\activate

    # Pour macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Installez les dépendances :**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Lancez l'application :**
    ```bash
    flask run
    ```

L'application sera alors accessible à l'adresse `http://127.0.0.1:5000`.

## Auteur

*   **M. Cissé** - [cissdoro@gmail.com](mailto:cissdoro@gmail.com )

## Licence

Ce projet est sous licence MIT. Vous pouvez ajouter un fichier `LICENSE` si vous le souhaitez.
