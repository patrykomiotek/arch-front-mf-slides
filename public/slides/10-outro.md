<!-- .slide: class="section-divider" data-background-color="#2c3e50" -->
<span class="kicker">Podsumowanie</span>
# Co z tym zrobić w poniedziałek

---

## Sześć decyzji, które warto zapisać

<div class="cols">
<div>

1. **Module Federation czy Native Federation** - i dlaczego
2. **Polityka `shared`** - co jest singletonem
3. **Wersjonowanie remote'ów** - najnowsza czy przypięta
4. **Zachowanie przy niedostępnym remote** - co widzi użytkownik

</div>
<div>

5. **Kontrakt zdarzeń** - kształt, wersjonowanie, właściciel
6. **Granice modułów** - tagi w Nx zamiast dobrej woli

<div class="callout tip">
<span class="label">Format</span>
Po jednym ADR na decyzję. Krótko: kontekst, opcje, decyzja, konsekwencje.
Wartość jest w zapisaniu <strong>od czego zależała</strong>, nie w objętości.
</div>

</div>
</div>

Note:
Poproś, żeby wskazali właściciela i termin dla każdej z sześciu decyzji, zanim wyjdą z sali.
Bez tego lista zostanie listą.

---

## Trzy rzeczy, które warto zapamiętać

<div class="cols3">
<div class="card">

### Policz, nie ustawiaj

Jeśli wartość da się wyliczyć z innych, nie wolno jej ustawiać.
Metryka: **ile sygnałów ustawiasz na jedno zdarzenie biznesowe**.

</div>
<div class="card">

### Mikrofrontend = granica wdrożenia

Nie granica kodu. Granicę kodu daje **Nx i lint**, taniej i bez kosztów operacyjnych.

</div>
<div class="card">

### Koszty są gwarantowane

Korzyści są oczekiwane. Dlatego korzyść trzeba nazwać **mierzalnie**, zanim kupicie koszt.

</div>
</div>

---

## Wasz następny krok

<div class="callout task">
<span class="label">Rekomendacja</span>
Przy <strong>dwóch mikrofrontendach i jednym zespole</strong> największy zwrot da nie trzeci mikrofrontend,
tylko <strong>uporządkowanie tego, co macie</strong>: monorepo z egzekwowanymi granicami,
jeden kontrakt zdarzeń i obsługa niedostępnego remote'a.
<br/><br/>
Trzeci mikrofrontend wydzielcie wtedy, gdy pojawi się <strong>drugi zespół</strong>
z własnym cyklem wydawniczym.
</div>

<div class="cols">
<div>

**Materiały**

- `module-federation.io` - dokumentacja i glosariusz
- `nx.dev` - monorepo, `affected`, granice modułów
- `github.com/patrykomiotek/info-mf` - shell + flights + cart
- `github.com/patrykomiotek/info-mf-nx` - wersja w Nx
- `github.com/patrykomiotek/info-mf-blank-nx` - punkt startowy

</div>
<div>

**Zadanie domowe (nieobowiązkowe)**

Weźcie jeden z sześciu punktów z poprzedniego slajdu
i napiszcie ADR **w tym tygodniu**, póki kontekst jest świeży.

Jeśli miałby to być tylko jeden, niech to będzie
**zachowanie przy niedostępnym remote**.
To najtańsza zmiana o największym wpływie na użytkownika.

</div>
</div>

Note:
Zakończ pytaniem „co zabieracie ze sobą?" i zrób rundę po jednym zdaniu. To zamyka dzień lepiej
niż podsumowanie trenera i daje Ci informację zwrotną, co faktycznie wybrzmiało.

---

<!-- .slide: class="title-slide" -->
# Dziękuję

<div class="title-rule"></div>

<p class="subtitle">Pytania · Kontakt · Materiały w repozytorium</p>

<p class="subtitle small">Bottega IT Minds &nbsp;·&nbsp; Patryk Omiotek</p>
