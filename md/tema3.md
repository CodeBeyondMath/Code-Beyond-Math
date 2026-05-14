> Fiecare secțiune are două straturi: un prim paragraf accesibil oricui, urmat de o casetă `▶ Aprofundare` pentru cei care vor să meargă mai departe. Poți sări casetele fără să pierzi firul.

---

## Problema de la care pornim

Imaginează-ți că ții un microfon în aer. Microfonul măsoară presiunea aerului de mii de ori pe secundă și îți dă o listă lungă de numere — un val care urcă și coboară haotic. Din acea listă de numere brute, cum afli că în cameră cântă un viorist la nota La și că în fundal bâzâie un ventilator?

Răspunsul intuitiv: *descompui valul complex în valuri simple*. Orice semnal, oricât de complicat, poate fi scris ca o sumă de sinusoide cu frecvențe și amplitudini diferite. Asta a demonstrat matematicianul **Jean-Baptiste Fourier** în 1822.

**Transformata Fourier** face exact asta: primește un semnal în domeniul timpului (lista ta de numere) și îl traduce în domeniul frecvențelor (cât de mult contribuie fiecare frecvență la semnal). Spectrul de bare pe care îl vezi în tab-ul *Semnale* al demo-ului de mai jos este exact această traducere.

> **▶ Aprofundare — Formula DFT**
>
> Transformata Fourier Discretă (DFT) pentru un semnal `x` de lungime `N` este:
>
> ```
> X[k] = Σ (n=0 la N-1)  x[n] · e^(−2πi·k·n / N)
> ```
>
> Fiecare `X[k]` este un număr complex: modulul lui spune *cât de puternică* e frecvența `k`, iar argumentul (faza) spune *când* începe acea sinusoidă. Calculând naiv această formulă pentru toate `k`, ai `N` sume, fiecare cu `N` termeni → **O(N²)** operații. Pentru un semnal audio de o secundă la 44100 Hz, asta înseamnă ~2 miliarde de înmulțiri. Impracticabil în timp real.

---

## De ce avem nevoie de ceva mai rapid — FFT

Calculul direct al DFT este prea lent pentru aplicații reale. **Fast Fourier Transform (FFT)** nu schimbă *ce* calculezi, ci *cum* calculezi — exploatând o simetrie matematică elegantă.

Ideea centrală: dacă `N` este o putere a lui 2, poți împărți problema în două subprobleme de dimensiune `N/2`, rezolva fiecare recursiv și combina rezultatele în timp liniar. E același principiu ca la **Divide et Impera** (mergesort, quicksort) — dar aplicat la numere complexe.

Câștigul de viteză este dramatic:

| N (lungimea semnalului) | DFT naiv (O(N²)) | FFT (O(N log N)) |
|------------------------|-----------------|-----------------|
| 1 024 | ~1 milion op. | ~10 000 op. |
| 1 048 576 (2²⁰) | ~10¹² op. | ~20 milioane op. |
| Audio HD (192kHz, 10s) | miliarde de ani | milisecunde |

**Demo — tab Butterfly:** Poți urmări pas cu pas cum se transformă 8 valori de intrare în 3 etape succesive. La fiecare etapă, perechile de valori se combină printr-o operație numită *butterfly* (din cauza formei diagramei).

> **▶ Aprofundare — Algoritmul Cooley-Tukey (Radix-2 DIT)**
>
> Separăm `x` în indici pari și impari:
>
> ```
> X[k] = DFT_par[k] + e^(−2πi·k/N) · DFT_impar[k]     pentru k < N/2
> X[k + N/2] = DFT_par[k] − e^(−2πi·k/N) · DFT_impar[k]
> ```
>
> Factorul `W_N^k = e^(−2πi·k/N)` se numește **twiddle factor**. Observă că `DFT_par` și `DFT_impar` sunt DFT-uri de lungime `N/2` — recursia se aplică din nou. Baza recurenței: DFT de lungime 1 este chiar valoarea de intrare.
>
> **Bit-reversal permutation:** Înainte de a începe fluturașii, intrările sunt rearanjate. Indexul fiecărei intrări are biții inversați: valoarea de la poziția `011₂ = 3` merge la poziția `110₂ = 6`. Asta permite algoritmului iterativ (bottom-up) să funcționeze fără alocare recursivă de memorie.
>
> **Complexitate:** La fiecare din cele `log₂N` etape se fac `N/2` butterfly-uri, fiecare cu o înmulțire complexă și două adunări → **O(N log N)** total.

---

## Butterfly — inima algoritmului

O operație butterfly transformă o pereche de valori `(u, v)` în:

```
u' = u + W · v
v' = u − W · v
```

Unde `W` este twiddle factor-ul corespunzător etapei. Vizual, pe diagramă, liniile care unesc două noduri formează un fluture — de unde și numele.

Tab-ul *Butterfly* din demo-ul interactiv de mai jos îți arată exact asta: la etapa 1, se combină perechi vecine; la etapa 2, grupuri de 4; la etapa 3, tot câte 8. Valorile afișate deasupra nodurilor sunt numerele complexe intermediare care se formează treptat.

> **▶ Aprofundare — Complexitate cache și implementare**
>
> Algoritmul Cooley-Tukey în varianta iterativă (bottom-up, in-place) are un avantaj major față de versiunea recursivă: accesele la memorie sunt secvențiale în cadrul fiecărei etape, ceea ce îl face **cache-friendly**. Biblioteci ca FFTW (Fastest Fourier Transform in the West) merg mai departe: detectează arhitectura CPU la runtime și generează cod SIMD (vectorizat) optimizat, ajungând la 80–90% din performanța teoretică de vârf.
>
> Alte variante: Radix-4 (procesează 4 elemente odată, mai puține înmulțiri), Split-radix (mixt 2 și 4), Bluestein (pentru N prim, nu putere de 2).

---

## NTT — FFT fără numere fracționare

FFT lucrează cu numere complexe reprezentate în virgulă mobilă. Asta introduce **erori de rotunjire** microscopice, care se acumulează. Dacă ai nevoie de un rezultat *exact* (în număr întreg), de exemplu când înmulțești polinoame cu coeficienți întregi mari, aceste erori sunt inacceptabile.

**Number Theoretic Transform (NTT)** rezolvă problema înlocuind numerele complexe cu aritmetică modulară. În loc de `e^(2πi/N)` (rădăcina N-a a unității din ℂ), NTT folosește un element `g` care se comportă identic, dar în inelul `ℤ_p` (numerele 0..p-1 cu adunare și înmulțire modulo un număr prim `p`).

Rezultatul: aceeași structură butterfly, aceeași complexitate O(N log N), dar **fără nicio eroare de rotunjire**. Totul rămâne în ℤ.

**Demo — tab Butterfly, butonul NTT (mod 17):** Observă că valorile afișate sunt numere întregi mici (0–16), nu numere complexe. Structura diagramei este identică.

> **▶ Aprofundare — De ce funcționează aritmetica modulară**
>
> FFT are nevoie de un element `ω` cu proprietățile:
> 1. `ω^N = 1` (rădăcina N-a a unității)
> 2. `ω^k ≠ 1` pentru `0 < k < N` (rădăcina *primitivă*)
> 3. Grupul generat de `ω` are exact `N` elemente distincte
>
> În ℤ_p cu `p` prim, teorema lui Fermat garantează că `a^(p-1) ≡ 1 (mod p)` pentru orice `a ≠ 0`. Dacă alegem `p` astfel încât `N | (p-1)`, atunci există o rădăcină primitivă `g` a lui `ℤ_p*`, iar `ω = g^((p-1)/N) mod p` satisface toate cele trei condiții de mai sus.
>
> **Numărul magic 998244353:** Acesta este `119 · 2²³ + 1`, un număr prim NTT-friendly, cel mai folosit în algoritmică competitivă. Suportă NTT pentru N până la 2²³ (~8 milioane), iar generatorul primitiv este `g = 3`. Orice sumă de convoluție cu coeficienți rezonabili (< ~500 milioane) rămâne sub acest modul, deci rezultatul e exact.
>
> Demo-ul de demonstrație folosește `p = 17` (mai mic, vizibil), unde `g = 9` și `ord(9) = 16 = 2⁴`, deci NTT funcționează pentru N ≤ 16.

---

## Înmulțirea polinoamelor — aplicația clasică

Dacă ai două polinoame `A` și `B` de grad `n`, înmulțirea naivă (coeficient cu coeficient) costă **O(n²)**. Cu FFT/NTT, poți face asta în **O(n log n)**:

1. **Zero-padding**: Extinde ambele polinoame la lungimea `2n` (putere de 2) prin adăugare de zerouri.
2. **Transformată înainte**: Aplică FFT/NTT — obții valorile punctuale ale fiecărui polinom.
3. **Înmulțire punct cu punct**: `C[i] = A[i] · B[i]` — O(n) operații simple.
4. **Transformată inversă**: Aplică IFFT/INTT — obții coeficienții produsului.

**Demo — tab Polinoame:** Introdu orice coeficienți și vei vedea ambele metode (FFT și NTT) calculând același rezultat, cu o comparație directă a erorilor de rotunjire.

> **▶ Aprofundare — Aplicații concrete**
>
> - **Înmulțirea numerelor mari** (BigInteger): `a × b` se face prin a trata cifrele ca pe coeficienți de polinom, a înmulți FFT, apoi a propaga transportul. Algoritmul Schönhage–Strassen (baza Python's `int * int` pentru numere uriașe) se bazează pe NTT.
> - **Algoritmică competitivă**: Convoluția polinoamelor apare în probleme de numărare combinatorie, knapsack pe mulțimi, și calculul polinomului caracteristic. NTT mod 998244353 este soluția standard.
> - **Procesarea semnalelor digitale (DSP)**: Filtrele FIR (finite impulse response) aplică convoluție între semnal și kernel de filtrare. FFT reduce costul de la O(N·M) la O(N log N).
> - **Astronomie și fizică**: Calculul potențialului gravitațional N-body, corelații în telescoape radio (VLBI), analiza spectrală a pulsarilor.

---

## DCT și compresia JPEG

**Discrete Cosine Transform (DCT)** este o variantă a FFT care lucrează doar cu funcții cosinus (fără componentă sinusoidală), producând coeficienți reali. Este baza compresiei JPEG.

Procesul JPEG pe scurt:
1. Imaginea este împărțită în blocuri de **8×8 pixeli**.
2. Fiecare bloc este transformat prin **DCT-2D** — blocul trece din domeniu spațial în domeniu frecvențe.
3. Coeficienții sunt **cuantizați**: împărțiți la o matrice de cuantizare și rotunjiți la întreg. Frecvențele înalte (detalii fine) au cuanți mai mari → mai mulți coeficienți devin zero.
4. Coeficienții nenuli sunt comprimați cu **codare entropică** (Huffman sau aritmetică).
5. La decomprimare, procesul este inversat (fără pasul 3, care e ireversibil).

**Demo — tab Compresie DCT:** Slider-ul de calitate controlează matricea de cuantizare. Heatmap-ul din dreapta arată coeficienții DCT ai blocului (0,0): roșu = valoare pozitivă mare, albastru = negativă, ×  = zero după cuantizare. La calitate scăzută, aproape toate celulele au ×, semn că informația a fost aruncată.

> **▶ Aprofundare — De ce DCT și nu DFT pentru compresie?**
>
> DFT aplicat unui bloc finit de pixeli tratează semnalul ca pe o secvență *periodică*. La marginile blocului apare o discontinuitate artificială care generează mulți coeficienți de înaltă frecvență (fenomenul Gibbs). DCT-2D, în schimb, extinde implicit semnalul în mod simetric, eliminând discontinuitatea → **energia se concentrează în coeficienți de joasă frecvență**, compresia devine eficientă.
>
> **PSNR (Peak Signal-to-Noise Ratio):** Metrica standard pentru calitatea compresiei, în dB. Calculul: `PSNR = 10 · log₁₀(255² / MSE)`, unde MSE este eroarea medie pătratică pixel cu pixel. Valori tipice: >40 dB = imperceptibil, 30–40 dB = bun, <30 dB = artefacte vizibile.
>
> **Codec-uri moderne:** H.264/H.265 (video) și HEVC înlocuiesc parțial DCT cu transformate mai sofisticate (DST, transformate adaptative), dar principiul — energie concentrată → cuantizare → entropie — rămâne același.

---

## Unde mai apar FFT/NTT în lumea reală?

| Domeniu | Aplicație | De ce FFT/NTT |
|---------|-----------|---------------|
| Audio | Egalizatoare, efecte (reverb, pitch shift) | Filtrare eficientă în frecvență |
| Imagini / Video | JPEG, H.265, compresie | DCT = FFT restrâns |
| Telecomunicații | LTE/5G, Wi-Fi (OFDM) | Multiplexare pe frecvențe |
| Criptografie | Înmulțire în retele de polinom (NTRU, Kyber) | NTT exact, fără erori |
| Fizică computațională | Simulări fluide, gravitație N-body | Convoluție rapidă |
| Medicină | Imagistică RMN, ecografie | Reconstrucție semnal |
| Algoritmi competitivi | Convoluție, numere mari | NTT mod 998244353 |

---

## Rezumat — Concepte-cheie

```
DFT     — transformă semnal timp → frecvențe. O(N²), prea lent.
FFT     — același rezultat, divide et impera. O(N log N). Butterfly + twiddle factors.
NTT     — FFT în aritmetică modulară. Exact, fără virgulă mobilă.
DCT     — variantă FFT cu cosinus real. Baza JPEG.
Butterfly — operația de bază: (u,v) → (u+Wv, u−Wv).
Bit-reversal — rearanjare inițială a intrărilor, necesară pentru FFT iterativ.
Zero-padding — completare cu zerouri la puterea de 2 pentru înmulțire polinoame.
Cuantizare — pasul cu pierdere din JPEG; aruncă frecvențe înalte.
PSNR    — metrică de calitate a compresiei, în dB.
```

---

## Resurse pentru aprofundare suplimentară

- [**3Blue1Brown** — *But what is the Fourier Transform?*](https://www.youtube.com/watch?v=spUNpyF58BY) (YouTube): vizualizare intuitivă excepțională
- [**Reducible** — *The Fast Fourier Transform (FFT)*](https://www.youtube.com/watch?v=h7apO7q16V0) (YouTube): implementare pas cu pas
- [**cp-algorithms.com** — FFT & NTT](https://cp-algorithms.com/algebra/fft.html): referință completă pentru algoritmică competitivă
- [**Wallace, C.S. (1992)** — *The JPEG still picture compression standard*](https://ieeexplore.ieee.org/document/125072) (IEEE): lucrarea originală JPEG
- **Knuth, TAOCP Vol. 2** — capitolul despre DFT și convoluție, pentru rigoare matematică deplină