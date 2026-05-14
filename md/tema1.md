# Introducere

Criptarea prin matrice este o metodă care combină două idei simple:

- transformarea textului într-o formă numerică;
- aplicarea unei operații matematice (înmulțirea cu o matrice-cheie).

Rezultatul este un mesaj care nu poate fi înțeles fără cheia corectă.  
Metoda este inspirată din criptografia clasică (precum cifra Hill), dar noi am adăugat un strat suplimentar de securitate: **permutarea codurilor ASCII**.

---

# Cum pregătim textul pentru criptare

Fie $T$ șirul de caractere introdus de utilizator.

## 1. Conversia caracterelor în numere

- Fiecare caracter este asociat cu codul său ASCII (intervalul $32\text{–}126$).
- Apoi aplicăm o **permutare** introdusă de utilizator.
- Indicele permutării poate avea valori între $0$ și $96!$, corespunzător numărului de caractere ASCII utilizate (95 la număr), cât și a paddingului utilizat pentru a completa mesajul astfel încât lungimea sa să fie multiplu de 3.
- Permutarea rearanjează codurile ASCII astfel încât aceeași literă să nu mai corespundă aceluiași număr.

Astfel, chiar dacă cineva ar vedea valorile numerice, nu ar putea determina direct caracterele originale.

## 2. Formarea matricei $T$

Textul este împărțit în grupuri de câte 3 caractere.  
Dacă lungimea textului nu este multiplu de 3, completăm cu caractere neutre.

Obținem o matrice: $$T \in M_{3 \times (n/3)}(\mathbb{Z})$$

unde fiecare coloană reprezintă trei caractere consecutive din mesaj.

---

# Matricea-cheie $K$

Utilizatorul introduce o matrice: $$K \in M_{3 \times 3}(\mathbb{Z})$$

Condiția esențială este: $$\det(K)=\pm1$$

Aceasta garantează că matricea este inversabilă în $\mathbb{Z}$, adică inversa ei conține tot elemente întregi.  
Fără această condiție, decriptarea ar putea introduce erori sau ar deveni imposibilă.

---

# Procesul de criptare

Criptarea constă într-o înmulțire de matrice: $$C = K \cdot T$$

unde:

- $T$ este matricea textului;
- $K$ este cheia de criptare;
- $C$ este matricea criptată.

Matricea $C$ este transmisă destinatarului.

---

# Procesul de decriptare

Pentru a recupera mesajul original, utilizatorul introduce:

- matricea criptată $C$;
- cheia $K$;
- indicele permutării ASCII.

## 1. Calculul inversei lui $K$

Inversa matricei se calculează prin formula: $$K^{-1}=\frac{1}{\det(K)}\cdot\operatorname{adj}(K)$$ unde:

- $\det(K)$ reprezintă determinantul matricei;
- $\operatorname{adj}(K)$ este matricea adjunctă.

Deoarece: $$\det(K)=\pm1$$

rezultă că: $$\frac{1}{\det(K)}\in\{-1,1\}$$

iar toate elementele lui $K^{-1}$ rămân întregi.

---

## 2. Matricea adjunctă

Matricea adjunctă a unei matrice pătratice este transpusa matricei cofactorilor.

Pentru o matrice: $$K=\begin{pmatrix}a & b & c \\\\ d & e & f \\\\ g & h & i\end{pmatrix}$$

matricea adjunctă este: $$\operatorname{adj}(K)=\begin{pmatrix}ei-fh & ch-bi & bf-ce \\\\ fg-di & ai-cg & cd-af \\\\ dh-eg & bg-ah & ae-bd\end{pmatrix}$$

Această matrice este folosită în calculul inversei: $$K^{-1}=\frac{1}{\det(K)}\cdot\operatorname{adj}(K)$$

---

## 3. Recuperarea matricei $T$

Mesajul original este obținut prin: $$T = K^{-1} \cdot C$$

## 4. Inversarea permutării ASCII

Fiecare număr din matricea $T$ este transformat în caracterul original aplicând permutarea inversă.

---

# Avantajele metodei

- **Securitate dublă:** matrice + permutare ASCII;
- **Fără pierderi de informație:** determinantul $\pm1$ garantează decriptare exactă;
- **Implementare eficientă:** matricea $3\times3$ este mică, rapidă și ușor de verificat;
- **Rezultate greu de intuit:** fără cheia corectă, mesajul apare ca un set de numere fără semnificație aparentă.

---

# Exemplu scurt (conceptual)

Presupunem că textul este „HELLO".

1. Convertim caracterele în coduri ASCII;
2. Aplicăm o permutare (de exemplu, cu indicele $17$);
3. Formăm matricea $T$;
4. Înmulțim cu cheia $K$ și obținem $C$;
5. La decriptare, aplicăm $K^{-1}$ și inversăm permutarea.

Puteți vedea mai jos o varianta interactivă a acestui exemplu

---

# Concluzie

Metoda combină noțiuni de algebră liniară cu programare, rezultând un sistem de criptare intuitiv, dar robust.  
Este un exemplu practic al modului în care matematica poate fi aplicată direct în informatică și securitatea datelor.