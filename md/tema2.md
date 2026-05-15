## Ce este un arbore de acoperire?

Imaginează-ți o rețea de orașe legate prin drumuri. Un **arbore de acoperire** este o mulțime minimă de drumuri care conectează *toate* orașele, fără să formeze niciun circuit. Dacă ai $n$ orașe, ai nevoie de exact $n - 1$ drumuri.

**De ce contează?** Proiectanții de rețele de calculatoare, inginerii electrici și algoritmii de transport rezolvă în mod constant problema: *în câte moduri pot conecta toate nodurile cu cost minim, fără redundanță?* Numărul arborilor de acoperire măsoară exact această diversitate.

---

## Grafuri și arbori — vocabularul esențial

Un **graf neorientat** $G = (V, E)$ are o mulțime de **noduri** $V$ și o mulțime de **muchii** $E$ — perechi neordonate de noduri.

Un **arbore de acoperire** al lui $G$ este un subgraf care:
- conține **toate** nodurile din $V$
- are exact $|V| - 1$ muchii
- este **conex** (există drum între orice două noduri)
- nu conține **niciun ciclu**

Aceste patru condiții sunt echivalente două câte două: orice subgraf conex cu $n - 1$ muchii e automat arbore, și invers.

**Exemplu simplu.** Graful complet $K_3$ (triunghi cu nodurile 1, 2, 3):

```
  1
 / \
2 — 3
```

Are 3 arbori de acoperire: $\{1\text{-}2,\ 1\text{-}3\}$, $\{1\text{-}2,\ 2\text{-}3\}$, $\{1\text{-}3,\ 2\text{-}3\}$. Fiecare lasă în afară exact o muchie.

---

## Matricea Laplaciană

Acesta este instrumentul algebraic central al teoremei. Pentru un graf cu $n$ noduri, definim matricea **Laplaciană** $L$ de dimensiune $n \times n$ astfel: $$L[i][i] = \deg(i), \quad L[i][j] = -1 \text{ dacă } \{i,j\} \in E, \quad L[i][j] = 0 \text{ altfel}$$

Cu alte cuvinte: $L = D - A$, unde $D$ este matricea diagonală a gradelor și $A$ este matricea de adiacență.

**Proprietăți cheie ale lui $L$:**
- Suma fiecărei linii (și coloane) este zero, deci $\det(L) = 0$ întotdeauna
- $L$ este **pozitiv semidefinit**: toate valorile proprii sunt $\geq 0$
- Rangul lui $L$ este $n - 1$ dacă și numai dacă graful este **conex**
- Există exact o valoare proprie egală cu $0$ (pentru grafuri conexe)

**Exemplu pentru $K_3$:**

$$L = \begin{pmatrix} 2 & -1 & -1 \\\\ -1 & 2 & -1 \\\\ -1 & -1 & 2 \end{pmatrix}$$

Nodul 1 are grad 2 (legat de 2 și 3), deci $L[1][1] = 2$, $L[1][2] = L[1][3] = -1$.

---

## Teorema lui Kirchhoff (Matrix-Tree Theorem)

> **Teoremă (Kirchhoff, 1847).** Numărul arborilor de acoperire ai unui graf neorientat conex cu $n$ noduri este egal cu **orice cofactor** al matricei sale laplaciene.
>
> Cofactorul $C_{ij} = (-1)^{i+j} \cdot \det(\tilde{L}_{ij})$, unde $\tilde{L}_{ij}j$ este matricea obținută ștergând linia $i$ și coloana $j$.
>
> **Remarcabil:** toți cofactorii sunt egali — nu contează ce linie și coloană elimini.

### De ce funcționează — ideea demonstrației

**Pasul 1 — Factorizarea $L = B \cdot B^T$.** Orientăm arbitrar fiecare muchie și construim **matricea de incidență orientată** $B$ de dimensiune $n \times m$: $B[i][k] = +1$ dacă muchia $k$ pleacă din $i$, $-1$ dacă sosește, $0$ altfel. Se verifică direct că $B \cdot B^T = L$.

**Pasul 2 — Formula Cauchy-Binet.** Fie $\tilde{L}$ cofactorul obținut ștergând ultima linie și coloană, și $\tilde{B}$ matricea $B$ fără ultima linie. Atunci: $$\det(\tilde{L}) = \det(\tilde{B} \cdot \tilde{B}^T) = \sum_{S} \det(\tilde{B}_S)^2$$

unde suma rulează peste toate submulțimile $S$ de $n - 1$ coloane ale lui $\tilde{B}$.

**Pasul 3 — Interpretarea combinatorică.** Un subset $S$ de $n - 1$ muchii formează un **arbore de acoperire** dacă și numai dacă $\det(\tilde{B}_S) = \pm 1$. Dacă $S$ conține un ciclu, liniile sunt dependente și determinantul este $0$. Deci: $$\det(\tilde{L}) = \sum_{S \text{ arbore}} 1 = \tau(G)$$

**Pasul 4 — Invarianța cofactorului.** Deoarece orice linie a lui $L$ se poate elimina, toți cofactorii diagonali sunt egali cu $\tau(G)$. Prin matricea adjunctă se arată că și cofactorii ne-diagonali sunt egali.

### Verificare pe $K_3$

Ștergem linia 3 și coloana 3:

$$\tilde{L}_{33} = \begin{pmatrix} 2 & -1 \\\\ -1 & 2 \end{pmatrix}$$

$$\det(\tilde{L}_{33}) = 2 \cdot 2 - (-1) \cdot (-1) = 4 - 1 = 3 \checkmark$$

Exact cei 3 arbori pe care i-am numărat vizual!

### Formula prin valori proprii (bonus)

Dacă $\lambda_1 \leq \lambda_2 \leq \cdots \leq \lambda_n$ sunt valorile proprii ale lui $L$, cu $\lambda_1 = 0$, atunci: $$\tau(G) = \frac{1}{n} \cdot \lambda_2 \cdot \lambda_3 \cdots \lambda_n$$

Pentru $K_4$: valorile proprii sunt $0, 4, 4, 4$, deci $\tau(K_4) = \frac{1}{4} \cdot 4 \cdot 4 \cdot 4 = 16$.

---

## Rezultate notabile

| Graf | Noduri | Arbori de acoperire |
|------|--------|---------------------|
| $K_n$ (complet) | $n$ | $n^{n-2}$ (formula Cayley) |
| $C_n$ (ciclu) | $n$ | $n$ |
| $P_n$ (lanț) | $n$ | $1$ |
| $K_{3,3}$ (bipartit complet) | $6$ | $81$ |
| Hipercub $Q_3$ | $8$ | $384$ |

**Formula lui Cayley** ($\tau(K_n) = n^{n-2}$) este un caz special elegant: graful complet pe $n$ noduri are exact $n^{n-2}$ arbori de acoperire. Pentru $n = 4$: $4^2 = 16$. Se poate demonstra și combinatoric (prin coduri Prüfer), dar teorema lui Kirchhoff o dă *gratuit* din calculul valorilor proprii.

---

*Folosește demo-ul interactiv de mai jos pentru a construi propriul graf și a vedea teoria în acțiune.*
