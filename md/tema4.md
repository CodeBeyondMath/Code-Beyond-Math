## Introducere

Împachetarea punctelor într-un pătrat este o problemă de **geometrie combinatorică**: dat un pătrat de latură $l$, câte puncte putem plasa în interiorul său (sau pe margini) astfel încât oricare două puncte să se afle la distanță cel puțin $1$ unul față de celălalt?

La prima vedere pare o problemă simplă. În realitate, răspunsul depinde de cum *aranjăm* punctele — iar alegerea configurației poate face diferența dintre câteva puncte în plus sau în minus.

---

## Noțiuni de bază

### 1. Distanța euclidiană

Distanța dintre două puncte $A = (x_1, y_1)$ și $B = (x_2, y_2)$ în plan este: $$d(A, B) = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$

Condiția problemei este ca pentru orice pereche de puncte distincte $P_i, P_j$ din mulțimea noastră să avem: $$d(P_i, P_j) \geq 1$$

### 2. Echivalența cu ambalarea discurilor

Există o modalitate elegantă de a reformula problema: în jurul fiecărui punct plasăm un disc de rază $\frac{1}{2}$.

Condiția $d(P_i, P_j) \geq 1$ este echivalentă cu faptul că discurile nu se suprapun (se pot atinge, dar nu se pot intersecta în interior). Astfel, maximizarea numărului de puncte este același lucru cu maximizarea numărului de discuri de rază $\frac{1}{2}$ care încap în pătrat.

Această reformulare ne conectează la un domeniu bogat din matematică: **teoria ambalării** (*packing theory*).

---

## Configurația 1 — Grila pătrată

### Construcție

Cea mai intuitivă soluție este să plasăm punctele pe o rețea cu pas $1$: $$P_{i,j} = (i,\ j), \quad i, j \in \{0, 1, 2, \ldots, \lfloor l \rfloor\}$$

unde $\lfloor l \rfloor$ este partea întreagă a lui $l$ (cel mai mare întreg mai mic sau egal cu $l$).

Pe fiecare linie și coloană avem $\lfloor l \rfloor + 1$ puncte, deci totalul este: $$N_{\text{grilă}} = (\lfloor l \rfloor + 1)^2$$

Distanța minimă între oricare doi vecini direcți (orizontal sau vertical) este exact $1$. Distanța diagonală este $\sqrt{2} > 1$. Condiția este îndeplinită.

---

## Configurația 2 — Grila hexagonală

### Motivație

Grila pătrată lasă mult spațiu gol între puncte. Dacă privim discurile de rază $\frac{1}{2}$, există goluri în formă de romb între fiecare grup de patru discuri. Putem oare comprima rândurile?

### Construcție

Ideea este să intercalăm rândurile: rândul par rămâne la pozițiile întregi, iar rândul impar este decalat cu $\frac{1}{2}$ pe orizontală. Distanța verticală dintre rânduri devine $\frac{\sqrt{3}}{2} \approx 0{,}866$, mai mică decât $1$, ceea ce înseamnă că includem mai multe rânduri.

Formal, rândul $k$ ($k = 0, 1, 2, \ldots$) are punctele: $$P_{k,j} = \left(j + \frac{k \bmod 2}{2},\ k \cdot \frac{\sqrt{3}}{2}\right), \quad j \in \mathbb{Z},\ 0 \leq P_{k,j}^{(x)} \leq l,\ 0 \leq k \cdot \frac{\sqrt{3}}{2} \leq l$$

Distanța dintre un punct și cei mai apropiați $6$ vecini ai săi (caracteristici rețelei hexagonale) este exact $1$. Condiția este satisfăcută.

### Densitatea de ambalare

Densitatea asimptotică a grilei hexagonale (raportul suprafață ocupată / suprafață totală) este: $$\delta_{\text{hex}} = \frac{\pi}{2\sqrt{3}} \approx 0{,}9069$$

față de grila pătrată, care atinge: $$\delta_{\text{pătrat}} = \frac{\pi}{4} \approx 0{,}7854$$

Grila hexagonală utilizează spațiul cu aproximativ **15%** mai eficient.

---

## Teorema lui Thue (1910)

Axel Thue a demonstrat că nicio altă configurație nu poate depăși densitatea de ambalare a rețelei hexagonale în plan: $$\delta \leq \frac{\pi}{2\sqrt{3}}$$

Cu alte cuvinte, grila hexagonală este **soluția optimă globală** pentru ambalarea discurilor egale în plan. Nu există un aranjament mai bun, indiferent cât de creativ ar fi.

Aceasta înseamnă că pentru pătrate cu latura $l$ mare, numărul maxim de puncte este aproximat de: $$N_{\text{max}} \approx \frac{2}{\sqrt{3}} \cdot l^2$$

unde factorul $\frac{2}{\sqrt{3}} \approx 1{,}155$ reprezintă câștigul față de grila pătrată, care dă $\approx l^2$ puncte.

---

## Cazuri particulare și subtilități

Pentru valori mici ale lui $l$, soluția optimă nu este neapărat grila hexagonală — efectele de margine contează mai mult. De exemplu:

- **$l = 1$:** maximul este $4$ puncte (cele $4$ colțuri ale pătratului).
- **$l = \sqrt{2}$:** putem adăuga un al $5$-lea punct în centru, deoarece distanța de la centru la orice colț este exact $\frac{\sqrt{2}}{2} \cdot \sqrt{2} = 1$... dar atenție: depinde de cum definim pătratul.
- **$l$ mare:** grila hexagonală câștigă clar față de grila pătrată.

Aceste cazuri speciale sunt studiate în cadrul **problemelor de ambalare finită** (*finite packing problems*), un domeniu activ de cercetare.

---

## Aplicații practice

Problema nu este doar teoretică. Configurațiile optime de puncte cu distanță minimă apar în:

- **Rețele de telecomunicații:** amplasarea antenelor astfel încât acoperirea să fie maximă fără interferențe.
- **Cristalografie:** atomii în rețelele cristaline urmează exact aranjamentul hexagonal, minimizând energia potențială.
- **Ambalare industrială:** câte obiecte circulare (țevi, cutii cilindrice) încap pe o suprafață dată.
- **Grafică pe calculator:** eșantionarea *Poisson disk*, folosită la generarea de texturi și anti-aliasing, se bazează pe principiul distanței minime.
- **Rețele de senzori IoT:** distribuția optimă a senzorilor într-o zonă monitorizată cu număr limitat de dispozitive.

---

## Exemplu numeric

Fie $l = 3$.

**Grila pătrată:** plasăm puncte la $(i, j)$ cu $i, j \in \{0, 1, 2, 3\}$. Obținem: $$N_{\text{grilă}} = (3 + 1)^2 = 16 \text{ puncte}$$

**Grila hexagonală:** distanța verticală dintre rânduri este $\frac{\sqrt{3}}{2} \approx 0{,}866$. Numărul de rânduri care încap în $[0, 3]$ este $\lfloor \frac{3}{0{,}866} \rfloor + 1 = 4 + 1 = 5$ rânduri.

- Rândurile pare ($k = 0, 2, 4$): puncte la $x \in \{0, 1, 2, 3\}$ — câte $4$ puncte fiecare.
- Rândurile impare ($k = 1, 3$): puncte la $x \in \{0{,}5,\ 1{,}5,\ 2{,}5\}$ — câte $3$ puncte fiecare.

Total: $$N_{\text{hex}} = 3 \times 4 + 2 \times 3 = 12 + 6 = 18 \text{ puncte}$$

Grila hexagonală adaugă **2 puncte în plus** față de grila pătrată pentru același pătrat.

---

## Concluzie

Problema împachetării punctelor în pătrat ilustrează cum o întrebare aparent simplă duce la matematică profundă. Grila pătrată oferă o soluție ușor de înțeles și de implementat, cu formula $(\lfloor l \rfloor + 1)^2$, dar grila hexagonală — demonstrată optimă de Thue — permite plasarea a circa $15\%$ mai multor puncte pentru pătrate mari.

Este un exemplu concret al modului în care geometria și combinatorica se întâlnesc cu informatica și ingineria, oferind soluții cu impact direct în lumea reală.
