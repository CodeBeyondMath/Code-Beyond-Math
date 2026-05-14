## Ce este un arbore de acoperire?

Imaginează-ți o rețea de orașe legate prin drumuri. Un **arbore de acoperire** este o mulțime minimă de drumuri care conectează *toate* orașele, fără să formeze niciun circuit. Dacă ai `n` orașe, ai nevoie de exact `n − 1` drumuri.

**De ce contează?** Proiectanții de rețele de calculatoare, inginerii electrici și algoritmii de transport rezolvă în mod constant problema: *în câte moduri pot conecta toate nodurile cu cost minim, fără redundanță?* Numărul arborilor de acoperire măsoară exact această diversitate.

---

## Grafuri și arbori — vocabularul esențial

Un **graf neorientat** `G = (V, E)` are o mulțime de **noduri** `V` și o mulțime de **muchii** `E` — perechi neordonate de noduri.

Un **arbore de acoperire** al lui `G` este un subgraf care:
- conține **toate** nodurile din `V`
- are exact **`|V| − 1` muchii**
- este **conex** (există drum între orice două noduri)
- nu conține **niciun ciclu**

Aceste patru condiții sunt echivalente două câte două: orice subgraf conex cu `n − 1` muchii e automat arbore, și invers.

**Exemplu simplu.** Graful complet `K₃` (triunghi cu nodurile 1, 2, 3):

```
  1
 / \
2 — 3
```

Are 3 arbori de acoperire: `{1-2, 1-3}`, `{1-2, 2-3}`, `{1-3, 2-3}`. Fiecare lasă în afară exact o muchie.

---

## Matricea Laplaciană

Acesta este instrumentul algebraic central al teoremei. Pentru un graf cu `n` noduri, definim matricea **Laplaciană** `L` de dimensiune `n × n` astfel:

```
L[i][i] = gradul nodului i   (numărul de muchii incidente)
L[i][j] = −1                dacă există muchia {i, j}
L[i][j] =  0                altfel
```

Cu alte cuvinte: `L = D − A`, unde `D` este matricea diagonală a gradelor și `A` este matricea de adiacență.

**Proprietăți cheie ale lui L:**
- Suma fiecărei linii (și coloane) este **zero** → `det(L) = 0` întotdeauna
- `L` este **pozitiv semidefinit**: toate valorile proprii sunt `≥ 0`
- Rangul lui `L` este `n − 1` dacă și numai dacă graful este **conex**
- Există exact o valoare proprie egală cu `0` (pentru grafuri conexe)

**Exemplu pentru K₃:**

```
     1   2   3
1  [ 2  −1  −1 ]
2  [−1   2  −1 ]
3  [−1  −1   2 ]
```

Nodul 1 are grad 2 (legat de 2 și 3), deci `L[1][1] = 2`, `L[1][2] = L[1][3] = −1`.

---

## Teorema lui Kirchhoff (Matrix-Tree Theorem)

> **Teoremă (Kirchhoff, 1847).** Numărul arborilor de acoperire ai unui graf neorientat conex cu `n` noduri este egal cu **orice cofactor** al matricei sale laplaciene.
>
> Cofactorul `Lᵢⱼ` = `(−1)^{i+j} · det(Lᵢⱼ)`, unde `L̃ᵢⱼ` este matricea obținută ștergând linia `i` și coloana `j`.
>
> **Remarcabil:** toți cofactorii sunt egali — nu contează ce linie și coloană elimini.

### De ce funcționează — ideea demonstrației

Pasul 1 — **Factorizarea L = B · Bᵀ.** Orientăm arbitrar fiecare muchie și construim **matricea de incidență orientată** `B` (dimensiune `n × m`): `B[i][k] = +1` dacă muchia `k` pleacă din `i`, `−1` dacă sosește, `0` altfel. Se verifică direct că `B · Bᵀ = L`.

Pasul 2 — **Formula Cauchy-Binet.** Fie `L̃` cofactorul obținut ștergând ultima linie și coloană, și `B̃` matricea `B` fără ultima linie. Atunci:

```
det(L̃) = det(B̃ · B̃ᵀ) = Σ  det(B̃_S)²
                       S
```

unde suma rulează peste toate submulțimile `S` de `n − 1` coloane ale lui `B̃`.

Pasul 3 — **Interpretarea combinatorică.** Un subset `S` de `n − 1` muchii formează un **arbore de acoperire** dacă și numai dacă `det(B̃_S) = ±1`. Dacă `S` conține un ciclu, liniile sunt dependente și `det = 0`. Deci:

```
det(L̃) = Σ 1 = numărul arborilor de acoperire
        S arbore
```

Pasul 4 — **Invarianța cofactorului.** Deoarece orice linie a lui `L` se poate elimina (argumentul nu depinde de care anume), toți cofactorii diagonali sunt egali cu `τ(G)`. Prin matricea adjunctă se arată că și cofactorii ne-diagonali sunt egali.

### Verificare pe K₃

Ștergem linia 3 și coloana 3:

```
L̃₃₃ = [ 2  −1 ]
        [−1   2 ]

det(L̃₃₃) = 2·2 − (−1)·(−1) = 4 − 1 = 3  ✓
```

Exact cei 3 arbori pe care i-am numărat vizual!

### Formula prin valori proprii (bonus)

Dacă `λ₁ ≤ λ₂ ≤ ... ≤ λₙ` sunt valorile proprii ale lui `L`, cu `λ₁ = 0`, atunci:

```
τ(G) = (1/n) · λ₂ · λ₃ · ... · λₙ
```

Pentru `K₄`: valorile proprii sunt `0, 4, 4, 4`, deci `τ(K₄) = (1/4) · 4 · 4 · 4 = 16`.

---

## Rezultate notabile

| Graf | Noduri | Arbori de acoperire |
|------|--------|---------------------|
| `Kₙ` (complet) | `n` | `nⁿ⁻²` (formula Cayley) |
| `Cₙ` (ciclu) | `n` | `n` |
| `Pₙ` (lanț) | `n` | `1` |
| `K_{3,3}` (bipartit complet) | `6` | `729` |
| Hipercub `Q₃` | `8` | `384` |

**Formula lui Cayley** (`τ(Kₙ) = nⁿ⁻²`) este un caz special elegant: graful complet pe `n` noduri are exact `nⁿ⁻²` arbori de acoperire. Pentru `n = 4`: `4² = 16`. Se poate demonstra și combinatoric (prin coduri Prüfer), dar teorema lui Kirchhoff o dă *gratuit* din calculul valorilor proprii.

---

*Folosește demo-ul interactiv de mai jos pentru a construi propriul graf și a vedea teoria în acțiune.*