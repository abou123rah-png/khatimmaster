from flask import Blueprint, render_template, request
import os

khatim_kountiyou_bp = Blueprint('khatim_kountiyou', __name__, template_folder='templates')

arabic_weights = {
    "ا": 1, "أ": 1, "ب": 2, "ت": 400, "ث": 500, "ج": 3, "ح": 8, "خ": 600, "د": 4, "ذ": 700, "ر": 200,
    "ز": 7, "س": 60, "ش": 300, "ص": 90, "ض": 800, "ط": 9, "ظ": 900, "ع": 70, "غ": 1000, "ف": 80,
    "ق": 100, "ك": 20, "ل": 30, "م": 40, "ن": 50, "ه": 5, "و": 6, "ي": 10
}

def calculate_mystical_weight(phrase):
    return sum(arabic_weights.get(letter, 0) for letter in phrase)

def convert_to_arabic_numerals(number):
    arabic_numerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"]
    return ''.join(arabic_numerals[int(d)] for d in str(number))

def determine_pm_nature(weight):
    nature_map = {
        0: ("ماء", "Eau"),
        1: ("نار", "Feu"),
        2: ("أرض", "Terre"),
        3: ("هواء", "Air")
    }
    return nature_map[weight % 4]

@khatim_kountiyou_bp.route('/khatim_kountiyou', methods=['GET', 'POST'])
def khatim1():
    result = None
    phrase = ""

    if request.method == 'POST':
        phrase = request.form['phrase']
        weight = calculate_mystical_weight(phrase)
        arabic_weight = convert_to_arabic_numerals(weight)
        pm_ar, pm_fr = determine_pm_nature(weight)

        result = {
            'phrase': phrase,
            'weight': weight,
            'arabic_weight': arabic_weight,
            'pm_ar': pm_ar,
            'pm_fr': pm_fr
        }

    return render_template('khatim1.html', result=result, phrase=phrase)
