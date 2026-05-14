# Introducere

**Conway's Game of Life** nu este un joc în sensul obișnuit — nu există jucători, nu există decizii, nu există câștigători. Este un **automat celular**, inventat în 1970 de matematicianul britanic **John Horton Conway**, care a demonstrat ceva uluitor: din patru reguli elementare aplicate unei grile infinite de celule, poate emerge orice comportament computațional imaginabil.

Întrebarea care a motivat invenția era filozofică: *cât de simple pot fi regulile unui sistem care generează complexitate arbitrară?* Răspunsul lui Conway a schimbat modul în care matematicienii și informaticienii gândesc despre viață, calcul și emergență.

---

# Configurația inițială

Universul jocului este o **grilă bidimensională infinită** de celule, fiecare putând fi în una din două stări:

- **vie** (notată $1$ sau $\blacksquare$)
- **moartă** (notată $0$ sau $\square$)

O **configurație** (sau *pattern*) este o funcție $s : \mathbb{Z}^2 \to \{0, 1\}$ care asociază fiecărei celule $(i, j)$ starea sa la un moment dat. La fiecare pas de timp, toate celulele își actualizează simultan starea conform regulilor.

**Vecinătatea Moore** a unei celule $(i, j)$ este mulțimea celor 8 celule adiacente (orizontal, vertical și diagonal): $$\mathcal{N}(i, j) = \{(i+a,\ j+b) \mid a, b \in \{-1, 0, 1\},\ (a, b) \neq (0, 0)\}$$

Numărul de vecini vii al celulei $(i, j)$ la pasul $t$ este: $$n_{i,j}^{(t)} = \sum_{(a,b) \in \mathcal{N}(i,j)} s_{a,b}^{(t)}$$

---

# Cele patru reguli

Starea la pasul $t+1$ depinde exclusiv de starea la pasul $t$ și de numărul de vecini vii:

1. **Subpopulare:** o celulă vie cu mai puțin de 2 vecini vii **moare** (izolare).
2. **Supraviețuire:** o celulă vie cu 2 sau 3 vecini vii **rămâne vie**.
3. **Suprapopulare:** o celulă vie cu mai mult de 3 vecini vii **moare** (aglomerare).
4. **Reproducere:** o celulă moartă cu exact 3 vecini vii **devine vie**.

Formal, funcția de tranziție $\phi : \{0,1\} \times \{0,\ldots,8\} \to \{0,1\}$ este: $$s_{i,j}^{(t+1)} = \phi\!\left(s_{i,j}^{(t)},\ n_{i,j}^{(t)}\right) = \begin{cases} 1 & \text{dacă } n_{i,j}^{(t)} = 3 \\\\ 1 & \text{dacă } s_{i,j}^{(t)} = 1 \text{ și } n_{i,j}^{(t)} = 2 \\\\ 0 & \text{altfel} \end{cases}$$

Regulile sunt adesea notate compact ca **B3/S23** (Birth la 3 vecini, Survival la 2 sau 3 vecini) — o convenție folosită în clasificarea automatelor celulare.

---

# Tipuri de configurații

Comportamentul pe termen lung al unei configurații inițiale se clasifică în mai multe categorii.

## Configurații statice (*Still Lifes*)

Nu se modifică de la un pas la altul: $s^{(t+1)} = s^{(t)}$. Sunt configurații în care fiecare celulă vie are exact 2 sau 3 vecini vii, iar fiecare celulă moartă adiacentă are mai puțin sau mai mult de 3 vecini vii.

Exemple clasice: **Block** (pătrat $2 \times 2$), **Beehive** (hexagon), **Loaf**, **Boat**. Cel mai mic *still life* are 4 celule.

## Oscilatoare (*Oscillators*)

Revin periodic la configurația inițială după $p$ pași, unde $p \geq 2$ se numește **perioadă**: $$s^{(t+p)} = s^{(t)}$$

- **Blinker** — cel mai mic oscilator, $p = 2$: trei celule în linie alternează cu trei celule în coloană.
- **Toad** — $p = 2$, 6 celule.
- **Beacon** — $p = 2$, 8 celule.
- **Pulsar** — $p = 3$, unul dintre cele mai frumoase pattern-uri.
- **Pentadecathlon** — $p = 15$.

Au fost descoperite oscilatoare pentru orice perioadă $p \geq 2$.

## Nave spațiale (*Spaceships*)

Se deplasează pe grilă menținând forma (sau revenind la ea periodic după translatare). Viteza maximă posibilă este $c = 1\ \text{celulă/pas}$ (limita cosmică a universului Conway).

- **Glider** — cel mai mic și mai cunoscut: $p = 4$, se deplasează diagonal cu viteza $\frac{c}{4}$.
- **Lightweight Spaceship (LWSS)** — $p = 4$, viteza $\frac{c}{2}$ pe orizontală.
- **Middleweight și Heavyweight Spaceships** — variante mai mari.

## Configurații în creștere

Unele configurații cresc indefinit, generând mereu celule noi.

- **Glider Gun** (tunul lui Gosper, 1970) — produce câte un glider la fiecare 30 de generații; a fost primul pattern descoperit cu populație infinită. Conway oferise un premiu de 50$ pentru descoperirea lui.
- **Puffer Train** — se deplasează lăsând în urmă structuri stabile sau oscilatoare.
- **Breeders** — cresc pătratic; produc multiple *guns* sau *puffers*.

---

# Universalitate și calcul

## Completitudine Turing

Cel mai profund rezultat despre Game of Life: este **Turing-complet**. Orice calcul realizabil de o mașină Turing poate fi simulat într-o configurație inițială a jocului.

Construcția folosește:
- **Glider Gun** ca generator de semnal (fluxuri de glideri ca biți),
- **Eater** ca absorber de semnal,
- **Coliziuni de glideri** pentru implementarea porților logice AND, OR, NOT.

Din aceste primitive se pot construi: registre, memorie, unitate aritmetică — deci un calculator complet.

## Von Neumann universality

În 2010, Andrew Wade a demonstrat că în Game of Life există configurații **auto-replicante** — pattern-uri care, după suficiente generații, produc copii exacte ale lor înșiși. Aceasta realizează programul lui von Neumann din anii 1940 despre auto-reproducerea mașinilor.

## Nedecidabilitate

Din completitudinea Turing decurg rezultate de nedecidabilitate directe:

- **Problema vieții eterne** (*immortality problem*): nu există algoritm care să decidă, pentru o configurație finită arbitrară, dacă populația crește la infinit. Echivalentă cu problema opririi.
- **Problema echivalenței**: nu se poate decide în general dacă două configurații duc la același comportament asimptotic.

---

# Proprietăți matematice

## Reversibilitate

Game of Life **nu este reversibil**: o configurație poate avea mai mulți predecesori sau niciun predecesor (*Garden of Eden*). Primele configurații *Garden of Eden* au fost demonstrate teoretic de Edward Moore în 1962 și construite explicit de Roger Banks și alții în 1971.

Numărul de configurații fără predecesor este infinit.

## Densitate și faza

Comportamentul statistic al configurațiilor aleatoare depinde de **densitatea inițială** $\rho_0 = P(\text{celulă vie})$:

- $\rho_0$ mic: populația moare rapid (prea puțini vecini).
- $\rho_0$ mare: populația moare rapid (suprapopulare).
- $\rho_0 \approx 0{,}37$: configurații cu viață prelungită, structuri emergente bogate.

Există o **tranziție de fază** în jurul acestei densități critice, analog tranziției lichid-gaz din fizica statistică.

## Entropie și compresie

Configurațiile tipice după multe generații au **entropie informațională** mai mică decât configurații aleatorii de aceeași densitate — structurile emergente (oscilatoare, still lifes) sunt mai compresibile decât zgomotul pur.

---

# Conexiuni matematice și aplicații

**Teoria automatelor celulare** — Game of Life este cel mai studiat automat celular 2D. John von Neumann proiectase anterior automatul celular cu 29 de stări și auto-replicare; Conway a arătat că 2 stări sunt suficiente.

**Sisteme dinamice și haos** — Comportamentul multor configurații este impredictibil pe termen lung fără simulare explicită, analog sistemelor haotice. Sensibilitatea la condiții inițiale: modificarea unei singure celule poate schimba complet evoluția.

**Biologie computațională** — Automatele celulare modelează creșterea tumorilor, propagarea semnalelor nervoase, formarea pattern-urilor pe blana animalelor (modelul Turing de morphogeneză).

**Fizică** — Analogia cu mecanica statistică: celulele ca particule, regulile ca interacțiuni locale, pattern-urile emergente ca faze macroscopice.

**Criptografie și generatoare pseudo-aleatoare** — Automatele celulare reversibile sunt folosite ca primitive criptografice datorită comportamentului lor haotic și eficienței computaționale.

---

# Patterns notabile și recorduri

| Pattern | Tip | Perioadă / Viteză | Celule |
|---------|-----|-------------------|--------|
| Block | Still life | — | 4 |
| Blinker | Oscilator | $p = 2$ | 3 |
| Glider | Nava spațială | $c/4$ diagonal | 5 |
| Gosper Glider Gun | Gun | $p = 30$ | 36 |
| Pulsar | Oscilator | $p = 3$ | 48 |
| LWSS | Nava spațială | $c/2$ orizontal | 9 |
| Methuselah R-pentomino | Haotic | ~1100 gen. până stabilizare | 5 |

**R-pentomino** merită o mențiune specială: 5 celule vii într-o configurație în formă de R evoluează haotic timp de 1103 generații înainte de a se stabiliza, producând 116 celule vii, 8 glideri și mai mulți oscilatoare. Un exemplu perfect al impredictibilității din simplitate.

---

# Notație și generalizări

Game of Life este regula **B3/S23** dintr-o familie vastă de automate celulare cu același tip de grilă și vecinătate:

- **HighLife (B36/S23)** — are auto-replicatori mai simpli decât Life.
- **Seeds (B2/S)** — orice celulă vie moare imediat; creștere explozivă din semințe.
- **Day & Night (B3678/S34678)** — simetric între viu și mort; comportament similar cu Life.
- **Smooth Life** — generalizare continuă pe grilă reală, cu comportamente asemănătoare vieții biologice.

Familia completă a automatelor celulare cu vecinătate Moore și 2 stări are $2^{2^9} = 2^{512}$ reguli posibile — un spațiu imens din care B3/S23 s-a dovedit cel mai bogat.

---

# Concluzie

Conway's Game of Life demonstrează că **complexitatea nu necesită reguli complexe**. Patru reguli, două stări, o grilă infinită — și obții un univers Turing-complet, capabil de auto-replicare, calcul arbitrar și comportament impredictibil.

Este un argument matematic pentru emergență: proprietăți globale sofisticate (calculabilitate, auto-organizare, structuri stabile) nu sunt prezente în reguli, ci apar din interacțiunile locale. Aceasta este, poate, și lecția cea mai profundă despre complexitatea din lumea reală.

Puteți vedea mai jos o variantă interactivă a regulilor descrise, unde puteți desena configurații proprii și urmări evoluția lor pas cu pas.
