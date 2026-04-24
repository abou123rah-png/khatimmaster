import json
import os
import sys

# Define the arabic cleaning logic used in the app
import re

def nettoyer_arabe(texte):
    texte = re.sub(r'[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]', '', texte)
    texte = texte.replace("أ", "ا").replace("إ", "ا").replace("آ", "ا").replace("ٱ", "ا")
    return texte

def test_search():
    query = "ب"
    query_clean = nettoyer_arabe(query)
    
    results = []
    # simulate the search logic
    chemin_complet = os.path.join("api", "static", "code.txt")
    if not os.path.exists(chemin_complet):
        print(json.dumps({"error": "file not found"}))
        return
        
    try:
        with open(chemin_complet, "r", encoding="utf-8") as f:
            for idx, ligne in enumerate(f, start=1):
                if idx > 6236: break
                
                ligne_clean = nettoyer_arabe(ligne)
                if query_clean in ligne_clean:
                    results.append({
                        "verset": idx
                    })
                    if len(results) >= 100: break
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        return
        
    print(json.dumps({"count": len(results), "first_match": results[0] if results else None}))

if __name__ == "__main__":
    test_search()
