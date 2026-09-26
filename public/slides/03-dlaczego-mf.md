<!-- .slide: class="section-divider" data-background-color="#2c3e50" -->
<span class="kicker">Blok 3</span>
# Kiedy mikrofrontendy,<br/>a kiedy nie

<p class="subtitle">Drivery · Problemy · Korzyści i gwarantowane koszty</p>

Note:
Ten blok jest skondensowany z dużej prezentacji o mikrofrontendach. Grupa ma już dwa MF-y,
więc nie sprzedajemy, tylko pomagamy im podjąć następną decyzję. Jeśli czas goni, ten blok
można skrócić do trzech slajdów: drivery, koszty i „test jednego pytania".

---

## Skąd w ogóle monolit i co w nim boli

<div class="cols">
<div>

**Monolit** - cały system, razem z UI, logiką i danymi,
jest jedną, spójną całością.

Jego cechy:

- jeden proces, jedna baza kodu
- silne powiązania między komponentami
- jeden zespół (albo kilka mocno zintegrowanych)
- **jedno wdrożenie** - mała zmiana wymaga wdrożenia całości

</div>
<div>

<div class="tradeoff">
<div class="pros">
<h4>Zalety</h4>

- łatwy start, szybki pierwszy rok
- prostsze testowanie (jeden system)
- tańsza infrastruktura

</div>
<div class="cons">
<h4>Wady</h4>

- skalowanie części = skalowanie całości
- rosnąca złożoność, trudne utrzymanie
- wolniejszy i bardziej ryzykowny cykl wdrożeń
- zamknięcie w jednej technologii

</div>
</div>

</div>
</div>

Note:
Nie zatrzymuj się tu długo. To punkt odniesienia, nie temat. Najważniejsza linia to
„jedno wdrożenie": wszystkie korzyści mikrofrontendów sprowadzają się do zaatakowania tej jednej cechy.

---

## Pięć driverów architektonicznych

Przejście na mikrofrontendy nigdy nie jest przypadkowe. Napędza je jedna z pięciu rzeczy:

<div class="dense">

| # | Driver | Problem | Co daje MF |
| --- | --- | --- | --- |
| 1 | **Przyspieszenie cyklu wdrożeń** | mała zmiana w UI = testy i wdrożenie całego systemu | niezależne wdrożenia, krótsze time-to-market |
| 2 | **Skalowalność organizacyjna** | duże zespoły blokują się nawzajem, trudno dodać ludzi | model *you build it, you run it*; małe, autonomiczne zespoły |
| 3 | **Elastyczność technologiczna** | cały system zablokowany w jednym frameworku, *big bang rewrite* | poliglotyzm, **stopniowa migracja** |
| 4 | **Odporność i izolacja błędów** | błąd w jednym komponencie kładzie całą aplikację | awaria ogranicza się do jednego mikrofrontendu |
| 5 | **Uproszczenie utrzymania** | nowa osoba musi zrozumieć całość, zanim cokolwiek zrobi | zespół zna swój mały wycinek; łatwiejszy onboarding |

</div>

<div class="callout tip">
<span class="label">Do notatnika</span>
Zapiszcie sobie, <strong>który z tych pięciu</strong> był powodem powstania Waszych dwóch mikrofrontendów.
Wrócimy do tego przy ADR.
</div>

Note:
Poproś o odpowiedź na głos od tych 2–3 osób, które budowały istniejące MF-y. Bardzo często
okazuje się, że powód był techniczny („chcieliśmy spróbować", „build był wolny"), a nie
organizacyjny, i to jest najlepsze możliwe wejście w slajd o kosztach.

---

## Pięć problemów, które to rozwiązuje

<div class="dense">

| # | Problem | Na czym polega | Odpowiedź MF |
| --- | --- | --- | --- |
| 1 | **Wielka kula błota** | aplikacja rośnie, nikt nie rozumie całości, zmiany dają nieprzewidziane skutki | podział złożoności na małe, odizolowane moduły |
| 2 | **Długi czas wdrożeń** | zmiana w jednym miejscu = wdrożenie całości; długie, ryzykowne cykle | niezależne wdrożenia: z tygodni do godzin |
| 3 | **Zależności między zespołami** | zespół czeka na zespół, wąskie gardła i konflikty | autonomia - każdy wdraża we własnym tempie |
| 4 | **Technology lock-in** | zmiana technologii wymaga przepisania wszystkiego | różne technologie obok siebie, migracja krokami |
| 5 | **Skalowalność i wydajność** | skalowanie obciążonej części wymaga skalowania całości | niezależne skalowanie tylko tego, co obciążone |

</div>

Note:
Ta tabela zastępuje dziesięć slajdów z dużej prezentacji. Jeśli ktoś chce szczegółów,
opowiedz driver 1 i problem 1 szerzej. Reszta jest analogiczna i grupa to widzi.

---

## Oczekiwane korzyści i **gwarantowane** koszty

<div class="tradeoff">
<div class="pros">
<h4>Oczekiwane korzyści</h4>

- **szybkie wdrożenia** - niezależne rozwijanie, testowanie i wdrażanie części
- **autonomia zespołów** - pełna kontrola nad kodem, procesem i technologią
- **skalowalność organizacyjna** - wiele zespołów nad jednym produktem
- **elastyczność technologiczna** - migracja bez przepisywania całości
- **odporność** - awaria jednego modułu nie kładzie aplikacji

</div>
<div class="cons">
<h4>Gwarantowane koszty</h4>

- **złożoność operacyjna** - więcej wdrożeń do skoordynowania, infrastruktura, monitoring
- **komunikacja między frontendami** - wspólny stan, duplikacja, konflikty
- **narzut technologiczny** - każdy MF ma swoje zależności → większy bundle
- **testy end-to-end** - pojedynczy MF testuje się łatwiej, całość znacznie trudniej
- **infrastruktura i DevOps** - środowiska dla wielu serwisów, dedykowane kompetencje

</div>
</div>

<div class="callout warn">
<span class="label">Asymetria</span>
Korzyści są <strong>oczekiwane</strong>, więc mogą nie nadejść. Koszty są <strong>gwarantowane</strong> i pojawią się w pierwszym tygodniu.
</div>

Note:
To najmocniejszy slajd bloku. Zostaw go na ekranie dłużej. Asymetria w callout
to sedno: decyzja o MF to kupienie pewnego kosztu za niepewną korzyść. To nie argument
przeciw, tylko argument za tym, żeby korzyść nazwać konkretnie i mierzalnie.

---

## Test jednego pytania

<div class="callout task">
<span class="label">Zanim dołożycie trzeci mikrofrontend</span>
<strong>Ilu niezależnych zespołów ma dostarczać do tego produktu?</strong>
</div>

<div class="cols">
<div>

<div class="metrics">
<div><span class="value">≥3</span><span class="label">zespoły, żeby się opłacało</span></div>
<div><span class="value">11</span><span class="label">osób u Was</span></div>
</div>

Jeśli odpowiedź brzmi **„jeden zespół"**, nie potrzebujecie mikrofrontendów.
Potrzebujecie **modułów z egzekwowanymi granicami**.

To jest dokładnie to, co daje Nx, i o tym jest blok 8.

</div>
<div>

<div class="callout warn">
<span class="label">Wasza sytuacja: dwa mikrofrontendy</span>
Dwa to liczba, przy której macie już <strong>pełny koszt</strong> rozproszenia
(dwa wdrożenia, dwa pipeline'y, kontrakt między nimi, wspólny design system),
ale jeszcze <strong>niewiele korzyści</strong>, bo przy jednym zespole
nie ma kogo od kogo uniezależniać.
<br/><br/>
Pytanie na dziś nie brzmi „jak dołożyć trzeci", tylko
<strong>„co dokładnie chcemy uniezależnić i od kogo"</strong>.
</div>

</div>
</div>

Note:
To jest najważniejszy slajd całego dnia dla tej konkretnej grupy. Postaw pytanie i MILCZ.
Niech odpowiedzą sami. Jeśli padnie „bo chcemy oddzielić moduł X", dopytaj, czy X ma
własny zespół i własny cykl wydawniczy. Jeśli nie, to jest kandydat na bibliotekę w Nx,
a nie na mikrofrontend. Nie narzucaj wniosku. Poprowadź do niego pytaniami.

---

## Mikrofrontendy to zmiana kulturowa, nie techniczna

<div class="cols">
<div>

Sukces zależy od dojrzałości DevOps w czterech obszarach:

**1. Autonomia i odpowiedzialność**
*you build it, you run it* - zespół jest właścicielem całego cyklu życia

**2. Automatyzacja CI/CD**
niezależne wdrożenia wymagają solidnych, zautomatyzowanych potoków dla **każdego** MF

</div>
<div>

**3. Monitoring i obserwowalność**
w rozproszeniu trzeba wiedzieć, **który** mikrofrontend jest źródłem problemu

**4. Komunikacja i współpraca**
autonomiczne zespoły bez wspólnych standardów tworzą **niespójny produkt**

<div class="callout warn">
<span class="label">Wniosek</span>
Przejście na mikrofrontendy <strong>bez gotowej kultury DevOps</strong> to przepis na porażkę.
Złożoność operacyjna zje obiecane korzyści.
</div>

</div>
</div>

Note:
Zapytaj konkretnie: „ile minut trwa u Was wdrożenie jednego mikrofrontendu na produkcję
i ile osób musi w tym uczestniczyć?". Odpowiedź powie Wam więcej o gotowości na trzeci MF
niż cała ta prezentacja.

---

<!-- .slide: class="exercise" -->
## Ćwiczenie 3 · ADR: trzeci mikrofrontend czy biblioteka?

<div class="callout exercise">
<span class="label">Zadanie · 25 minut · dwie grupy, potem konfrontacja</span>
Napiszcie <strong>ADR</strong> dla najbliższej realnej zmiany w Waszej aplikacji.
Grupa A broni „nowy mikrofrontend". Grupa B broni „moduł w monorepo".
</div>

<div class="cols">
<div>

**Szkielet ADR**

```md
# ADR-00X: <decyzja>

## Kontekst
Co się dzieje, że w ogóle rozmawiamy.
Ile zespołów, jaki cykl wydawniczy.

## Rozważane opcje
1. Nowy mikrofrontend
2. Biblioteka / moduł w monorepo
3. Nic nie robimy

## Decyzja
Wybieramy ..., ponieważ ...

## Konsekwencje
+ co zyskujemy
− jaki koszt kupujemy świadomie
```

</div>
<div>

**Musi paść odpowiedź na:**

- [ ] Który z **pięciu driverów** to uzasadnia?
- [ ] **Ilu zespołów** dotyczy ta granica?
- [ ] Jaki jest **niezależny cykl wydawniczy** tej części?
- [ ] Co **zmierzymy** za trzy miesiące, żeby wiedzieć, czy decyzja była dobra?
- [ ] Jaki koszt **kupujemy świadomie**?

<div class="callout tip">
<span class="label">Puenta ćwiczenia</span>
Dobry ADR nie udowadnia, że masz rację. Zapisuje, <strong>od czego zależała</strong> decyzja,
żeby za rok dało się sprawdzić, czy założenia nadal obowiązują.
</div>

</div>
</div>

Note:
Podziel salę tak, żeby osoby z doświadczeniem MF trafiły do grupy B (bronią biblioteki).
Obrona stanowiska przeciwnego do własnego jest tu najbardziej wartościowa.
Na koniec nie ogłaszaj zwycięzcy. Poproś obie grupy o wskazanie JEDNEGO warunku,
po którego spełnieniu zmieniłyby zdanie. To jest prawdziwy produkt tego ćwiczenia.
