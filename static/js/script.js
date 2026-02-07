// Script principal pour KhatimMaster

document.addEventListener('DOMContentLoaded', function() {
    // Support pour l'arabe et RTL
    setupArabicSupport();
    
    // Initialisation des composants interactifs
    initializeComponents();
    
    // Gestion des événements spécifiques
    setupEventListeners();
});

/**
 * Configure le support pour l'arabe et RTL
 */
function setupArabicSupport() {
    const arabicElements = document.querySelectorAll('[lang="ar"], [dir="rtl"]');
    arabicElements.forEach(element => {
        element.setAttribute('dir', 'rtl');
        if (!element.classList.contains('arabic-text')) {
            element.classList.add('arabic-text');
        }
    });
    const arabicNumbers = document.querySelectorAll('.arabic-number');
    arabicNumbers.forEach(element => {
        const text = element.textContent;
        element.textContent = convertToArabicNumerals(text);
    });
}

/**
 * Convertit les chiffres occidentaux en chiffres arabes
 */
function convertToArabicNumerals(text) {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return text.replace(/[0-9]/g, match => arabicNumerals[parseInt(match)]);
}

/**
 * Initialise les composants interactifs de l'application
 */
function initializeComponents() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            const closeButton = alert.querySelector('.btn-close');
            if (closeButton) {
                closeButton.click();
            }
        }, 5000);
    });
}

/**
 * Configure les écouteurs d'événements pour les fonctionnalités spécifiques
 */
function setupEventListeners() {
    setupArabicKeyboard();
    setupKhatimInteractions();
}

/**
 * Clavier arabe virtuel
 */
function setupArabicKeyboard() {
    const keyboardContainer = document.getElementById('arabic-keyboard');
    if (!keyboardContainer) return;
    const targetInput = document.getElementById('arabic-text-input');
    if (!targetInput) return;

    const arabicChars = [
        'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر',
        'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف',
        'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي', 'ء', 'ة',
        'آ', 'أ', 'إ', 'ؤ', 'ئ', 'ى', '،', '؛', '؟', ' '
    ];

    arabicChars.forEach(char => {
        const keyButton = document.createElement('button');
        keyButton.className = 'key';
        keyButton.textContent = char;
        keyButton.addEventListener('click', () => {
            targetInput.value += char;
            targetInput.focus();
            const inputEvent = new Event('input', { bubbles: true });
            targetInput.dispatchEvent(inputEvent);
        });
        keyboardContainer.appendChild(keyButton);
    });

    const backspaceButton = document.createElement('button');
    backspaceButton.className = 'key backspace';
    backspaceButton.innerHTML = '<i class="fas fa-backspace"></i>';
    backspaceButton.addEventListener('click', () => {
        targetInput.value = targetInput.value.slice(0, -1);
        targetInput.focus();
        const inputEvent = new Event('input', { bubbles: true });
        targetInput.dispatchEvent(inputEvent);
    });

    keyboardContainer.appendChild(backspaceButton);
}

/**
 * Interactions avec les khatims
 */
function setupKhatimInteractions() {
    const khatimContainer = document.querySelector('.khatim-container');
    if (!khatimContainer) return;
    const cells = khatimContainer.querySelectorAll('td');
    cells.forEach(cell => {
        cell.addEventListener('click', function() {
            this.classList.toggle('selected');
            updateKhatimCalculations();
        });
    });

    function updateKhatimCalculations() {
        const selectedCells = khatimContainer.querySelectorAll('td.selected');
        let sum = 0;
        selectedCells.forEach(cell => {
            sum += parseInt(cell.textContent) || 0;
        });
        const resultElement = document.getElementById('khatim-result');
        if (resultElement) {
            resultElement.textContent = sum.toString();
            if (resultElement.classList.contains('arabic-number')) {
                resultElement.textContent = convertToArabicNumerals(resultElement.textContent);
            }
        }
    }
}

/**
 * Génère un khatim (carré magique)
 */
function generateKhatim(size, startValue = 1) {
    if (size === 3) {
        return [
            [8, 1, 6],
            [3, 5, 7],
            [4, 9, 2]
        ].map(row => row.map(val => val + startValue - 1));
    }
    return Array(size).fill().map(() => Array(size).fill(0));
}

/**
 * Calcule la valeur Abjad d'un mot arabe
 */
function calculateAbjadValue(text) {
    const abjadValues = {
        'ا': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8,
        'ط': 9, 'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60,
        'ع': 70, 'ف': 80, 'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300,
        'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000
    };
    let total = 0;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (abjadValues[char]) {
            total += abjadValues[char];
        }
    }
    return total;
}

// Script principal pour KhatimMaster
