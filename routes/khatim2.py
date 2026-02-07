from flask import Flask, render_template, request
from utils import to_arabic_digits  # ✅ Import de la fonction depuis utils.py

app = Flask(__name__)

def generate_table_3x3(a, b):
    c = b // 12
    tableau = [
        [3*c, b - 4*c, c],
        [b - 5*c, 'أمنيات', 5*c],
        [2*c, 4*c, b - 6*c]
    ]
    for i, row in enumerate(tableau):
        for j, val in enumerate(row):
            if isinstance(val, int):
                tableau[i][j] = to_arabic_digits(val)
    return tableau

@app.route('/', methods=['GET', 'POST'])
def index():
    tableau = None
    error = ""
    if request.method == 'POST':
        try:
            a = int(request.form['a'])
            b = int(request.form['b'])
            tableau = generate_table_3x3(a, b)
        except ValueError:
            error = "Veuillez entrer des valeurs numériques valides."
    return render_template("moussala_kountiyou.html", tableau=tableau, error=error)

if __name__ == '__main__':
    app.run(debug=True)
