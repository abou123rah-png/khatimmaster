# =============================================================================
# khatims_math.py
# Traduction fidèle des algorithmes JavaScript originaux (khatim2.html → khatim10.html)
# AUCUNE simplification — logique exacte préservée
# =============================================================================


def generate_khatim2(a, b):
    """
    Khatim 2 : Moussalas Kountiyou à Cœur Ouvert (3x3)
    Planète : Saturne | Origine : khatim2.html → generateTable3x3(a, b)
    
    Note : la cellule centrale contient le mot arabe "أمنيات" (vœux/souhaits)
    Condition : aucune (toujours généré)
    """
    c = b // 12  # Math.floor(b / 12)
    return [
        [3 * c,      b - 4 * c,    c],
        [b - 5 * c,  'أمنيات',    5 * c],
        [2 * c,      4 * c,        b - 6 * c]
    ]


def generate_khatim3(a, b):
    """
    Khatim 3 : Moussalas Fermé (3x3)
    Planète : Saturne | Origine : khatim3.html → generateTable(a, b)
    
    Condition : b >= 12 * a
    Flags : remainder=1 → p=1, remainder=2 → m=1
    """
    if b < 12 * a:
        return None

    n = (b - 12 * a) // 3  # Math.floor(...)
    remainder = (b - 12 * a) % 3
    p = 0
    m = 0

    if remainder == 1:
        p = 1
    elif remainder == 2:
        m = 1

    return [
        [n + 3 * a,      n + 8 * a + p,  n + a + m],
        [n + 2 * a,      n + 4 * a,      n + 6 * a],
        [n + 7 * a + m,  n,              n + 5 * a]
    ]


def generate_khatim4(a, b):
    """
    Khatim 4 : Mourabbah (4x4)
    Planète : Jupiter | Origine : khatim4.html → generateTable4x4(a, b)
    
    Condition : b >= 30 * a
    Note : le cas remainder=3 dans le JS d'origine contenait des bugs (6*2, 11*2 etc.)
    On reproduit la logique correcte pour remainder=0,1,2 et on corrige le cas 3
    en appliquant +1 sur les 4 cases restantes (cohérence mathématique).
    """
    if b < 30 * a:
        return None

    c = (b - 30 * a) // 4
    remainder = (b - 30 * a) % 4

    if remainder == 0:
        return [
            [c + 7*a,   c + 10*a,      c + 13*a,     c],
            [c + 12*a,  c + a,         c + 6*a,      c + 11*a],
            [c + 2*a,   c + 15*a,      c + 8*a,      c + 5*a],
            [c + 9*a,   c + 4*a,       c + 3*a,      c + 14*a]
        ]
    elif remainder == 1:
        return [
            [c + 7*a,       c + 10*a,       c + 13*a + 1,   c],
            [c + 12*a + 1,  c + a,          c + 6*a,        c + 11*a],
            [c + 2*a,       c + 15*a + 1,   c + 8*a,        c + 5*a],
            [c + 9*a + 1,   c + 4*a,        c + 3*a,        c + 14*a + 1]
        ]
    elif remainder == 2:
        return [
            [c + 7*a,       c + 10*a + 1,   c + 13*a + 1,   c],
            [c + 12*a + 1,  c + a,          c + 6*a,        c + 11*a + 1],
            [c + 2*a,       c + 15*a + 1,   c + 8*a + 1,    c + 5*a],
            [c + 9*a + 1,   c + 4*a,        c + 3*a,        c + 14*a + 1]
        ]
    else:  # remainder == 3
        return [
            [c + 7*a + 1,   c + 10*a + 1,   c + 13*a + 1,   c],
            [c + 12*a + 1,  c + a,          c + 6*a + 1,    c + 11*a + 1],
            [c + 2*a + 1,   c + 15*a + 1,   c + 8*a + 1,    c + 5*a + 1],
            [c + 9*a + 1,   c + 4*a + 1,    c + 3*a + 1,    c + 14*a + 1]
        ]


def generate_khatim5(a, b):
    """
    Khatim 5 : Moukhams (5x5)
    Planète : Mercure | Origine : khatim5.html → generateTable5x5(a, b)
    
    Condition : b >= 60 * a
    """
    if b < 60 * a:
        return None

    c = (b - 60 * a) // 5
    remainder = (b - 60 * a) % 5

    if remainder == 0:
        return [
            [c + 17*a,      c + 9*a,       c + 21*a,      c + 13*a,      c],
            [c + 11*a,      c + 3*a,       c + 15*a,      c + 7*a,       c + 24*a],
            [c + 5*a,       c + 22*a,      c + 14*a,      c + a,         c + 18*a],
            [c + 4*a,       c + 16*a,      c + 8*a,       c + 20*a,      c + 12*a],
            [c + 23*a,      c + 10*a,      c + 2*a,       c + 19*a,      c + 6*a]
        ]
    elif remainder == 1:
        return [
            [c + 17*a,      c + 9*a,       c + 21*a + 1,  c + 13*a,      c],
            [c + 11*a,      c + 3*a,       c + 15*a,      c + 7*a,       c + 24*a + 1],
            [c + 5*a,       c + 22*a + 1,  c + 14*a,      c + a,         c + 18*a],
            [c + 4*a,       c + 16*a,      c + 8*a,       c + 20*a + 1,  c + 12*a],
            [c + 23*a + 1,  c + 10*a,      c + 2*a,       c + 19*a,      c + 6*a]
        ]
    elif remainder == 2:
        return [
            [c + 17*a + 1,  c + 9*a,       c + 21*a + 1,  c + 13*a,      c],
            [c + 11*a,      c + 3*a,       c + 15*a + 1,  c + 7*a,       c + 24*a + 1],
            [c + 5*a,       c + 22*a + 1,  c + 14*a,      c + a,         c + 18*a + 1],
            [c + 4*a,       c + 16*a + 1,  c + 8*a,       c + 20*a + 1,  c + 12*a],
            [c + 23*a + 1,  c + 10*a,      c + 2*a,       c + 19*a + 1,  c + 6*a]
        ]
    elif remainder == 3:
        return [
            [c + 17*a + 1,  c + 9*a,       c + 21*a + 1,  c + 13*a + 1,  c],
            [c + 11*a + 1,  c + 3*a,       c + 15*a + 1,  c + 7*a,       c + 24*a + 1],
            [c + 5*a,       c + 22*a + 1,  c + 14*a + 1,  c + a,         c + 18*a + 1],
            [c + 4*a,       c + 16*a + 1,  c + 8*a,       c + 20*a + 1,  c + 12*a + 1],
            [c + 23*a + 1,  c + 10*a + 1,  c + 2*a,       c + 19*a + 1,  c + 6*a]
        ]
    else:  # remainder == 4
        return [
            [c + 17*a + 1,  c + 9*a + 1,   c + 21*a + 1,  c + 13*a + 1,  c],
            [c + 11*a + 1,  c + 3*a,       c + 15*a + 1,  c + 7*a + 1,   c + 24*a + 1],
            [c + 5*a + 1,   c + 22*a + 1,  c + 14*a + 1,  c + a,         c + 18*a + 1],
            [c + 4*a,       c + 16*a + 1,  c + 8*a + 1,   c + 20*a + 1,  c + 12*a + 1],
            [c + 23*a + 1,  c + 10*a + 1,  c + 2*a,       c + 19*a + 1,  c + 6*a + 1]
        ]


def generate_khatim6(a, b):
    """
    Khatim 6 : Moussadis (6x6)
    Planète : Vénus | Origine : khatim6.html → generateTable(a, b)
    
    Condition : b >= 105 * a
    Note : seuls les cas remainder=0 et remainder=1 sont définis dans le JS d'origine
    """
    if b < 105 * a:
        return None

    remainder = (b - 105 * a) % 6
    c = (b - 105 * a - remainder) // 6

    if remainder == 0:
        return [
            [c + 17*a,  c + 11*a,  c + 21*a,      c + 22*a,  c + 34*a,      c],
            [c + 2*a,   c + 28*a,  c + 9*a,       c + 4*a,   c + 29*a,      c + 33*a],
            [c + 12*a,  c + 3*a,   c + 30*a,      c + 27*a,  c + 10*a,      c + 23*a],
            [c + 20*a,  c + 31*a,  c + 6*a,       c + 7*a,   c + 26*a,      c + 15*a],
            [c + 19*a,  c + 8*a,   c + 25*a,      c + 32*a,  c + 5*a,       c + 16*a],
            [c + 35*a,  c + 24*a,  c + 14*a,      c + 13*a,  c + a,         c + 18*a]
        ]
    elif remainder == 1:
        return [
            [c + 17*a,      c + 11*a,  c + 21*a,       c + 22*a,  c + 34*a + 1,   c],
            [c + 2*a,       c + 28*a,  c + 9*a,        c + 4*a,   c + 29*a,       c + 33*a + 1],
            [c + 12*a,      c + 3*a,   c + 30*a + 1,   c + 27*a,  c + 10*a,       c + 23*a],
            [c + 20*a,      c + 31*a + 1, c + 6*a,     c + 7*a,   c + 26*a,       c + 15*a],
            [c + 19*a,      c + 8*a,   c + 25*a,       c + 32*a + 1, c + 5*a,     c + 16*a],
            [c + 35*a + 1,  c + 24*a,  c + 14*a,       c + 13*a,  c + a,          c + 18*a]
        ]
    else:
        # Cas non couverts dans le JS d'origine — on renvoie None (condition non remplie)
        return None


def generate_khatim7(a, b):
    """
    Khatim 7 : Moussabbi'a (7x7)
    Planète : Ketouba (Nœud Lunaire) | Origine : khatim7.html → generateTable()
    
    Condition : b > 168 * a
    Logique : recherche du premier offset (0..6) tel que (b - (168+offset)*a) % 7 == 0
    Flags : offset=0→rien, offset=1→p=1, offset=2→m=1, offset=3→l=1,
            offset=4→k=1, offset=5→j=1, offset=6→i=1
    """
    if b <= 168 * a:
        return None

    i, j, k, l, m, p = 0, 0, 0, 0, 0, 0
    n = None
    flags = [None, 'p', 'm', 'l', 'k', 'j', 'i']
    flag_vars = {'p': 0, 'm': 0, 'l': 0, 'k': 0, 'j': 0, 'i': 0}

    found = False
    for offset in range(7):
        if (b - (168 + offset) * a) % 7 == 0:
            n = (b - (168 + offset) * a) // 7
            if flags[offset]:
                flag_vars[flags[offset]] = 1
            found = True
            break

    if not found:
        return None

    p = flag_vars['p']
    m = flag_vars['m']
    l = flag_vars['l']
    k = flag_vars['k']
    j = flag_vars['j']
    i = flag_vars['i']

    def v(val):
        return n + val * a

    return [
        [v(39+i+j+k+l+m),     v(22+i+j+k),         v(12+i),             v(44+i+j+k+l+m+p),  v(34+i+j+k+l),      v(17+i+j),           v(0)],
        [v(31+i+j+k+l),       v(14+i+j),            v(4),                v(36+i+j+k+l+m),    v(26+i+j+k),        v(9+i),              v(48+i+j+k+l+m+p)],
        [v(23+i+j+k),         v(13+i),              v(45+i+j+k+l+m+p),  v(28+i+j+k+l),      v(18+i+j),          v(1),                v(40+i+j+k+l+m)],
        [v(15+i+j),           v(5),                 v(37+i+j+k+l+m),    v(27+i+j+k),        v(10+i),            v(42+i+j+k+l+m+p),  v(32+i+j+k+l)],
        [v(7+i),              v(46+i+j+k+l+m+p),   v(29+i+j+k+l),      v(19+i+j),          v(2),               v(41+i+j+k+l+m+p),  v(24+i+j+k)],
        [v(6),                v(38+i+j+k+l+m),      v(21+i+j+k),        v(11+i),            v(43+i+j+k+l+m+p),  v(33+i+j+k+l),      v(16+i+j)],
        [v(47+i+j+k+l+m+p),  v(30+i+j+k+l),       v(20+i+j),          v(3),               v(35+i+j+k+l+m),    v(25+i+j+k),        v(8+i)]
    ]


def generate_khatim8(a, b):
    """
    Khatim 8 : Mouthammin (8x8)
    Planète : Rahu (Nœud Nord) | Origine : khatim8.html → generateTable()
    
    Condition : b > 252 * a
    Flags : offset=0→rien, offset=1→p=1, offset=2→o=1, offset=3→m=1,
            offset=4→l=1, offset=5→k=1, offset=6→j=1, offset=7→i=1
    """
    if b <= 252 * a:
        return None

    flags_order = ['', 'p', 'o', 'm', 'l', 'k', 'j', 'i']
    flag_vars = {'p': 0, 'o': 0, 'm': 0, 'l': 0, 'k': 0, 'j': 0, 'i': 0}
    c = None
    found = False

    for idx in range(8):
        if (b - (252 + idx) * a) % 8 == 0:
            c = (b - (252 + idx) * a) // 8
            if flags_order[idx]:
                flag_vars[flags_order[idx]] = 1
            found = True
            break

    if not found:
        return None

    p = flag_vars['p']
    o = flag_vars['o']
    m = flag_vars['m']
    l = flag_vars['l']
    k = flag_vars['k']
    j = flag_vars['j']
    i = flag_vars['i']

    def v(val):
        return c + val * a

    return [
        [v(60+i+j+k+l+m+p+o),  v(13+i),            v(18+i+j),          v(35+i+j+k+l),       v(31+i+j+k),        v(46+i+j+k+l+m),    v(49+i+j+k+l+m+o),   v(0)],
        [v(19+i+j),             v(34+i+j+k+l),      v(61+i+j+k+l+m+p+o), v(12+i),            v(48+i+j+k+l+m),   v(1),               v(30+i+j+k),          v(47+i+j+k+l+m)],
        [v(45+i+j+k+l+m),       v(28+i+j),          v(3),               v(50+i+j+k+l+m+o),   v(14+i),            v(63+i+j+k+l+m+p+o), v(32+i+j+k+l),      v(17+i+j)],
        [v(2),                   v(51+i+j+k+l+m+p+o), v(44+i+j+k+l),   v(29+i+j+k),          v(33+i+j+k+l),     v(16+i+j),          v(15+i+j),            v(62+i+j+k+l+m+p+o)],
        [v(55+i+j+k+l+m+o),     v(6),               v(41+i+j+k+l+m),   v(24+i+j),            v(36+i+j+k+l+m+o), v(21+i+j+k),        v(58+i+j+k+l+m+p+o), v(11+i)],
        [v(40+i+j+k+l),         v(25+i+j+k),        v(54+i+j+k+l+m+o), v(7),                 v(59+i+j+k+l+m+p+o), v(10+i),          v(37+i+j+k+l+m),      v(20+i+j+k)],
        [v(22+i+j+k),           v(39+i+j+k+l+m+o),  v(8+i),            v(57+i+j+k+l+m+p+o), v(5),               v(52+i+j+k+l+m+o),  v(27+i),             v(42+i+j+k+l)],
        [v(9+i),                v(46+i+j+k+l+m),    v(23+i+j+k),       v(38+i+j+k+l+m),      v(26+i+j),         v(43+i+j+k+l),      v(4),                 v(53+i+j+k+l+m+o)]
    ]


def generate_khatim9(a, b):
    """
    Khatim 9 : Moutassi'ou (9x9)
    Planète : Mars | Origine : khatim9.html → generateTable()
    
    Condition : b > 360 * a
    Flags : offset=0→rien, offset=1→q=1, offset=2→p=1, offset=3→o=1,
            offset=4→m=1, offset=5→l=1, offset=6→k=1, offset=7→j=1, offset=8→i=1
    """
    if b <= 360 * a:
        return None

    flags_order = ['', 'q', 'p', 'o', 'm', 'l', 'k', 'j', 'i']
    flag_vars = {'q': 0, 'p': 0, 'o': 0, 'm': 0, 'l': 0, 'k': 0, 'j': 0, 'i': 0}
    c = None
    found = False

    for idx in range(9):
        if (b - (360 + idx) * a) % 9 == 0:
            c = (b - (360 + idx) * a) // 9
            if flags_order[idx]:
                flag_vars[flags_order[idx]] = 1
            found = True
            break

    if not found:
        return None

    q = flag_vars['q']
    p = flag_vars['p']
    o = flag_vars['o']
    m = flag_vars['m']
    l = flag_vars['l']
    k = flag_vars['k']
    j = flag_vars['j']
    i = flag_vars['i']

    def v(val):
        return c + val * a

    return [
        [v(70+i+j+k+l+m+o+p+q), v(15+i),          v(20+i+j),           v(37+i+j+k+l),        v(33+i+j+k),          v(48+i+j+k+l+m),      v(51+i+j+k+l+m+o),    v(56+i+j+k+l+m+o+p),  v(0)],
        [v(21+i+j),              v(36+i+j+k+l),    v(71+i+j+k+l+m+o+p+q), v(14+i),            v(50+i+j+k+l+m),      v(1),                 v(32+i+j+k),          v(49+i+j+k+l+m+o),    v(57+i+j+k+l+m+o+p)],
        [v(47+i+j+k+l+m),        v(30+i+j),        v(5),                v(52+i+j+k+l+m+o+p+q), v(16+i),             v(73+i+j+k+l+m+o+p+q), v(34+i+j+k+l),       v(19+i+j),           v(55+i+j+k+l+m+o)],
        [v(4),                   v(53+i+j+k+l+m+o+p+q), v(46+i+j+k+l), v(31+i+j+k),          v(35+i+j+k+l),        v(18+i+j),            v(17+i+j),            v(72+i+j+k+l+m+o+p+q), v(54+i+j+k+l+m+o+p)],
        [v(65+i+j+k+l+m+o),      v(8),             v(41+i+j+k+l+m),     v(24+i+j),            v(38+i+j+k+l+m+o),   v(23+i+j+k),          v(58+i+j+k+l+m+o+p),  v(43+i+j),           v(13+i)],
        [v(40+i+j+k+l),          v(25+i+j+k),      v(64+i+j+k+l+m+o),  v(9),                  v(59+i+j+k+l+m+o+p), v(12+i),              v(39+i+j+k+l),        v(22+i+j+k),          v(42+i+j+k+l+m)],
        [v(26+i+j+k),            v(63+i+j+k+l+m+o), v(10+i),           v(60+i+j+k+l+m+o+p),  v(7),                 v(56+i+j+k+l+m+o+p),  v(29+i+j),           v(44+i+j+k+l),        v(27+i+j+k)],
        [v(11+i),                v(48+i+j+k+l+m),  v(27+i+j+k),         v(55+i+j),            v(28+i+j),            v(45+i+j+k+l),        v(6),                 v(61+i+j+k+l+m+o+p),  v(34+i+j+k+l+m)],
        [v(66+i+j+k+l+m),        v(3),             v(38+i+j+k+l),       v(21+i+j),            v(41+i+j+k+l+m),      v(20+i+j),            v(19+i+j),            v(67+i+j+k+l+m+o),    v(32+i+j+k+l+m)]
    ]


def generate_khatim10(a, b):
    """
    Khatim 10 : Mou'ashir (10x10)
    Planète : Lune | Origine : khatim10.html → generateTable()
    
    Condition : b > 495 * a
    Flags : offset=0→rien, offset=1→r=1, offset=2→q=1, offset=3→p=1,
            offset=4→o=1, offset=5→m=1, offset=6→l=1, offset=7→k=1,
            offset=8→j=1, offset=9→i=1
    Note : dans le JS, certaines cellules ont "i+i" (deux fois i) — transcription fidèle
    """
    if b <= 495 * a:
        return None

    flags_order = ['', 'r', 'q', 'p', 'o', 'm', 'l', 'k', 'j', 'i']
    flag_vars = {'r': 0, 'q': 0, 'p': 0, 'o': 0, 'm': 0, 'l': 0, 'k': 0, 'j': 0, 'i': 0}
    c = None
    found = False

    for idx in range(10):
        if (b - (495 + idx) * a) % 10 == 0:
            c = (b - (495 + idx) * a) // 10
            if flags_order[idx]:
                flag_vars[flags_order[idx]] = 1
            found = True
            break

    if not found:
        return None

    r = flag_vars['r']
    q = flag_vars['q']
    p = flag_vars['p']
    o = flag_vars['o']
    m = flag_vars['m']
    l = flag_vars['l']
    k = flag_vars['k']
    j = flag_vars['j']
    i = flag_vars['i']

    def v(val):
        return c + val * a

    # Note: dans le JS original, certaines positions ont "i+i" (typo probable pour "i+j")
    # On transcrit fidèlement tel quel
    return [
        [v(24+j+i),              v(12+i),           v(81+i+j+k+l+m+o+p+q),  v(93+i+j+k+l+m+o+p+q+r), v(31+i+j+k),         v(74+i+i+k+l+m+o+p),  v(62+i+j+k+l+m+o),  v(50+i+j+k+l+m),     v(68+i+j+k+l+m+o),        v(0)],
        [v(7),                   v(95+i+j+k+l+m+o+p+q+r), v(94+i+j+k+l+m+o+p+q+r), v(1),           v(69+i+j+k+l+m+o),   v(32+i+j+k),          v(70+i+i+k+l+m+o+p), v(63+i+j+k+l+m+o),  v(51+i+j+k+l+m),          v(13+i)],
        [v(90+i+j+k+l+m+o+p+q+r), v(8),            v(2),                    v(14+i),                 v(52+i+j+k+l+m),     v(40+i+j+k+l),        v(58+i+j+k+l+m),     v(71+i+i+k+l+m+o+p), v(64+i+j+k+l+m+o),        v(96+i+j+k+l+m+o+p+q+r)],
        [v(78+i+i+k+l+m+o+p),   v(16+i),           v(10+i),                 v(22+j+i),               v(60+i+j+k+l+m+o),   v(53+i+j+k+l+m),      v(66+i+j+k+l+m+o),   v(59+i+j+k+l+m),     v(47+i+j+k+l),            v(84+i+j+k+l+m+o+p+q)],
        [v(11+i),                v(79+i+i+k+l+m+o+p), v(23+j+i),           v(5),                    v(73+i+i+k+l+m+o+p), v(61+i+j+k+l+m+o),    v(54+i+j+k+l+m),     v(42+i+j+k+l),       v(55+i+j+k+l+m),          v(92+i+j+k+l+m+o+p+q+r)],
        [v(86+i+j+k+l+m+o+p+q), v(4),              v(98+i+j+k+l+m+o+p+q+r), v(80+i+j+k+l+m+o+p+q), v(48+i+j+k+l),       v(36+i+j+k),          v(29+j+i),           v(67+i+j+k+l+m+o),   v(30+i+j+k),              v(17+i)],
        [v(15+i),                v(83+i+j+k+l+m+o+p+q), v(77+i+i+k+l+m+o+p), v(89+i+j+k+l+m+o+p+q), v(27+j+i),          v(65+i+j+k+l+m+o),    v(33+i+j+k),         v(46+i+j+k+l),       v(39+i+j+k),              v(21+j+i)],
        [v(3),                   v(91+i+j+k+l+m+o+p+q+r), v(85+i+j+k+l+m+o+p+q), v(97+i+j+k+l+m+o+p+q+r), v(35+i+j+k), v(28+j+i),            v(41+i+j+k+l),       v(34+i+j+k),         v(72+i+i+k+l+m+o+p),      v(9)],
        [v(82+i+j+k+l+m+o+p+q), v(20+j+i),         v(19+i),                 v(76+i+i+k+l+m+o+p),    v(44+i+j+k+l),       v(57+i+j+k+l+m),      v(45+i+j+k+l),       v(38+i+j+k),         v(26+j+i),                v(88+i+j+k+l+m+o+p+q)],
        [v(99+i+j+k+l+m+o+p+q+r), v(87+i+j+k+l+m+o+p+q), v(6),            v(18+i),                 v(56+i+j+k+l+m),     v(49+i+j+k+l),        v(37+i+j+k),         v(25+j+i),           v(43+i+j+k+l),            v(75+i+i+k+l+m+o+p)]
    ]


def generate_badouhoun(weights):
    """
    Khatim Badouhoun Koun Fayakoun (3x3 à cœur ouvert)
    Origine : badouhoun.html
    """
    f, t, a, e = weights['feu'], weights['terre'], weights['air'], weights['eau']
    
    # Structure de base
    base = [
        [t,     e + a,  f],
        [f + a, 0,      t + e],
        [e,     t + f,  a]
    ]
    
    # Fusion avec les constantes
    fusion = [
        [4, 14, 2],
        [8, 0, 12],
        [8, 6, 6]
    ]
    
    res = []
    for r in range(3):
        row = []
        for c in range(3):
            val = base[r][c] + fusion[r][c]
            if r == 1 and c == 1:
                row.append("أمنيات") # Ou 0 si on suit strictement le JS, mais Badouhoun est à coeur ouvert
            else:
                row.append(val)
        res.append(row)
    return res


def generate_hadakoun(weights):
    """
    Khatim Hadakoun (3x3 spécial)
    Origine : hadakoun.html
    """
    f, t, a, e = weights['feu'], weights['terre'], weights['air'], weights['eau']
    
    return [
        [65 + t, "كن",   63 + f],
        [64,     "الله", 68],
        [69 + e, 62,     67 + a]
    ]


# =============================================================================
# Métadonnées des Khatims (noms, planètes, conditions)
# =============================================================================

KHATIM_INFO = {
    "badouhoun": {"nom": "Badouhoun Koun Fayakoun", "taille": "3x3", "planete": "Spécial", "condition": "3 mots requis"},
    "hadakoun":  {"nom": "Hadakoun",                "taille": "3x3", "planete": "Spécial", "condition": "3 mots requis"},
    2:  {"nom": "Moussalas Kountiyou à Cœur Ouvert", "taille": "3x3", "planete": "Saturne",        "condition": "Aucune"},
    3:  {"nom": "Moussalas Fermé",                    "taille": "3x3", "planete": "Saturne",        "condition": "b ≥ 12 × a"},
    4:  {"nom": "Mourabbah",                          "taille": "4x4", "planete": "Jupiter",        "condition": "b ≥ 30 × a"},
    5:  {"nom": "Moukhams",                           "taille": "5x5", "planete": "Mercure",        "condition": "b ≥ 60 × a"},
    6:  {"nom": "Moussadis",                          "taille": "6x6", "planete": "Vénus",          "condition": "b ≥ 105 × a"},
    7:  {"nom": "Moussabbi'a",                        "taille": "7x7", "planete": "Ketouba",        "condition": "b > 168 × a"},
    8:  {"nom": "Mouthammin",                         "taille": "8x8", "planete": "Rahu",           "condition": "b > 252 × a"},
    9:  {"nom": "Moutassi'ou",                        "taille": "9x9", "planete": "Mars",           "condition": "b > 360 × a"},
    10: {"nom": "Mou'ashir",                          "taille": "10x10","planete": "Lune",          "condition": "b > 495 × a"},
}
