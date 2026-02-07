import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# --- Configuration de l'API ---
try:
    GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
    if not GOOGLE_API_KEY:
        raise ValueError("Clé API non trouvée.")
    
    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')

    print("Configuration de l'API Google et du modèle réussie.")

except Exception as e:
    print(f"Erreur critique lors de la configuration de l'API Google: {e}")
    model = None

def get_ramli_interpretation(question, theme):
    if not model:
        return "Le service d'interprétation par IA n'est pas disponible."

    juge = theme[15]
    temoin_passe = theme[13]
    temoin_futur = theme[14]

    prompt = f"""
    Tu es un sage spécialiste de la géomancie (science du Ramli), bienveillant et pédagogue.
    Un consultant te pose la question suivante : "{question}"

    Voici le thème géomantique qui a été généré :
    - Témoin du Passé (Maison 13) : {temoin_passe['name']} ({temoin_passe['meaning']})
    - Témoin du Futur (Maison 14) : {temoin_futur['name']} ({temoin_futur['meaning']})
    - Juge Suprême (Maison 15) : {juge['name']} ({juge['meaning']})

    En te basant sur ces trois figures clés, rédige une interprétation en 3 paragraphes clairs et structurés :
    1.  **Analyse du Contexte :** Explique brièvement ce que le Témoin du Passé ({temoin_passe['name']}) révèle sur l'origine ou le contexte de la question posée.
    2.  **Tendance et Évolution :** Explique ce que le Témoin du Futur ({temoin_futur['name']}) indique comme direction probable que les événements vont prendre.
    3.  **Verdict et Conseil :** Donne la conclusion finale basée sur le Juge Suprême ({juge['name']}). Termine par un conseil sage et pratique pour le consultant.

    Adopte un ton rassurant et spirituel, sans être trop directif. Utilise le formatage Markdown (gras, listes) pour rendre la réponse facile à lire.
    """

    try:
        safety_settings = {
            'HARM_CATEGORY_HARASSMENT': 'BLOCK_NONE',
            'HARM_CATEGORY_HATE_SPEECH': 'BLOCK_NONE',
            'HARM_CATEGORY_SEXUALLY_EXPLICIT': 'BLOCK_NONE',
            'HARM_CATEGORY_DANGEROUS_CONTENT': 'BLOCK_NONE',
        }
        
        response = model.generate_content(prompt, safety_settings=safety_settings)
        
        # --- ✅ DÉBOGAGE AVANCÉ DE LA RÉPONSE ---
        print("--- Débogage de la réponse de l'API ---")
        # Affiche la raison pour laquelle la réponse pourrait être bloquée
        if response.prompt_feedback:
            print(f"Prompt Feedback: {response.prompt_feedback}")
        # Affiche le contenu brut des "candidates" (les réponses possibles)
        print(f"Candidates: {response.candidates}")
        print("------------------------------------")
        # --- FIN DU DÉBOGAGE ---

        # On essaie de lire le texte, c'est ici que l'erreur se produit probablement
        return response.text
        
    except Exception as e:
        print(f"Erreur lors de l'appel ou du traitement de la réponse de l'API Gemini : {e}")
        # On essaie d'afficher la raison du blocage si elle existe
        try:
            if response.prompt_feedback:
                reason = str(response.prompt_feedback)
                return f"L'IA a bloqué la réponse. Raison : {reason}. Le Juge était **{juge['name']}**."
        except:
            pass # Si response n'existe pas, on passe
            
        return f"Une erreur est survenue lors de la génération de l'interprétation. Le Juge est **{juge['name']}**, ce qui indique : *{juge['meaning']}*"

