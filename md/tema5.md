## Introducere

Jocul Haosului nu este un joc al competiției, ci unul al probabilității și al geometriei ascunse.  
El este un algoritm iterativ care demonstrează un paradox fundamental: faptul că haosul aparent poate genera o ordine matematică perfectă.

Prin repetarea unor reguli extrem de simple, jocul produce ceea ce se numește *fractali* — structuri geometrice care își repetă forma la orice scară de mărire. Această proprietate poartă numele de *autosimilaritate*.

Fractalii au numeroase aplicații moderne, printre care:

1. **Compresia imaginilor fractale** — utilizată intens în anii '90, iar în prezent în anumite domenii de Machine Learning.
2. **Grafica procedurală** — generarea automată a peisajelor și texturilor în jocuri video.
3. **Modelarea sistemelor biologice** — descrierea structurilor precum creierul, plămânii sau vasele de sânge.
4. **Criptografia bazată pe fractali** — metode matematice de codificare și securizare a informației.

Fractali, fractali, fractali...  
Dar ce sunt, de fapt, fractalii?

<img src="poze/triunghi_fr.png" alt="descriere" style="width: 100%; max-width: 500px;">
<img src="poze/pentagon_fr.png" alt="descriere" style="width: 100%; max-width: 500px;">
<img src="poze/frunza_fr.png" alt="descriere" style="width: 100%; max-width: 500px;">
<img src="poze/maple_fr.png" alt="descriere" style="width: 100%; max-width: 500px;">
<img src="poze/pentigree_fr.png" alt="descriere" style="width: 100%; max-width: 500px;">
<img src="poze/dr_fr.png" alt="descriere" style="width: 100%; max-width: 500px;">

Un fractal este o figură geometrică obținută prin repetarea unui proces matematic. Proprietatea fundamentală a unui fractal este autosimilaritatea: fiecare parte a figurii seamănă cu întregul, indiferent de nivelul de mărire.

Unul dintre cele mai cunoscute exemple este triunghiul lui Sierpiński, care poate fi generat prin metoda numită *Jocul Haosului*.

---

## Jocul Haosului și generarea triunghiului lui Sierpiński

Se consideră un triunghi echilateral cu vârfurile

$$ A(x_A,y_A),\quad B(x_B,y_B),\quad C(x_C,y_C) $$

și un punct inițial arbitrar

$$ P_0(x_0,y_0), $$

situat în interiorul triunghiului.

Pentru fiecare pas $n \ge 0$, se alege aleator unul dintre vârfurile triunghiului, notat cu

$$ V_n \in \{A,B,C\}. $$

Noul punct se definește ca mijlocul segmentului determinat de punctul curent $P_n$ și vârful ales $V_n$:

$$ P_{n+1}=\frac{P_n+V_n}{2}. $$

Dacă $V_n=(x_v,y_v)$, atunci coordonatele noului punct sunt

$$ P_{n+1}\left(\frac{x_n+x_v}{2},\frac{y_n+y_v}{2}\right). $$

Procesul se repetă de un număr foarte mare de ori, iar mulțimea punctelor obținute converge către ***triunghiul lui Sierpiński***. Deși alegerea vârfurilor este aleatoare, structura finală are proprietatea de autosimilaritate: fiecare parte a figurii reproduce forma întregului la o scară mai mică.

<div style="text-align: center;">
  <img src="poze/1.png" alt="descriere" style="width: 100%; max-width: 500px;">
</div>

## Exemple de aplicații în viața reală

####  1. Genetica
Chaos Game poate transforma ADN-ul în imagini fractale. Fiecărui nucleotid (A, T, G, C) îi corespunde un colț al pătratului, iar algoritmul evidențiază tipare și frecvențe din secvențele genetice.

<div style="text-align: center;">
  <img src="poze/2.png" alt="descriere" style="width: 100%; max-width: 500px;">
</div>

####  2. Muzica
Analiza fractală poate măsura cât de „predictibilă” este o piesă muzicală. Simfoniile sunt mai regulate, iar ragtime-ul este mai haotic, ceea ce ajută la înțelegerea structurii muzicii.

####  3. Anatomie
Structuri precum creierul și plămânii au dimensiuni fractale ridicate datorită complexității lor. Diferențele de dimensiune fractală pot indica starea de sănătate, de exemplu în bolile respiratorii.

<div style="text-align: center;">
  <img src="poze/3.png" alt="descriere" style="width: 100%; max-width: 500px;">
</div>
