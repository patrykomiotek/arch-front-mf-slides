<!-- .slide: class="title-slide" -->
<span class="kicker">Warsztat · 1 dzień · Sieć Badawcza Łukasiewicz</span>

# Angular, sygnały<br/>i mikrofrontendy

<div class="title-rule"></div>

<p class="subtitle">Sygnały &nbsp;·&nbsp; Module Federation &nbsp;·&nbsp; Nx &nbsp;·&nbsp; Decyzje</p>

<p class="subtitle small">Bottega IT Minds &nbsp;·&nbsp; Patryk Omiotek</p>

Note:
Runda na start, krótka. Jedenaście osób: imię i jedno zdanie „co dziś robię w naszym froncie".
Zapytaj wprost, kto dotykał mikrofrontendów. Spodziewaj się 2–3 rąk. Zapisz te imiona,
będą Twoimi sojusznikami przy ćwiczeniach. Posadź ich w różnych parach, nie w jednej.

---

## Jak pracujemy dzisiaj

<div class="cols">
<div>

**To jest warsztat, nie wykład**

Slajdy są szkieletem. Większość dnia to **kod i decyzje**,
a nie slajdy.

Pięć bloków ćwiczeniowych. Każdy kończy się czymś,
co działa albo czymś, co świadomie odrzucamy.

</div>
<div>

**Zasady**

- Przerywajcie w trakcie - pytanie w kontekście jest warte więcej niż na końcu
- Nie ma głupich pytań, są tylko głupie odpowiedzi ;)
- **Ponglish** - kod i nazwy po angielsku, rozmowa po polsku
- Część slajdów powstanie **na żywo**, z Waszych przykładów

</div>
</div>

<div class="callout tip">
<span class="label">Repozytorium</span>
Zaglądajcie po szkoleniu. Dopiszę to, co powstanie na sali.
</div>

Note:
Powiedz wprost, że nie zdążymy ze wszystkim i że to jest zaplanowane.
Materiał jest szerszy niż dzień, więc wybierzemy w trakcie, zależnie od tego, gdzie będzie energia.

---

## Punkt wyjścia: gdzie jesteście

<div class="metrics">
<div><span class="value">11</span><span class="label">osób w zespole</span></div>
<div><span class="value">2–3</span><span class="label">z doświadczeniem w MF</span></div>
<div><span class="value">2</span><span class="label">mikrofrontendy dzisiaj</span></div>
</div>

To **nie jest** grupa, którą trzeba przekonywać do mikrofrontendów. Macie je.

Dlatego dzisiejszy dzień jest o czymś innym:

- **kiedy dokładać kolejne, a kiedy przestać** - dwa to ciekawa liczba, wrócimy do niej
- **jak nimi zarządzać**, żeby nie kosztowały więcej, niż dają
- **jak je spiąć** - Module Federation czy Native Federation
- **czym to wszystko orkiestrować** - Nx

Note:
Ta liczba „2" jest najważniejsza na slajdzie. Przy dwóch mikrofrontendach nie ma się jeszcze
problemu skali, ale ma się już pełny koszt rozproszenia. To jest dokładnie ten moment,
w którym pada pytanie: kolejny mikrofrontend czy raczej porządne monorepo z granicami?
Nie odpowiadaj za nich teraz. Postaw pytanie i wróć do niego w bloku o Nx.

---

## Plan dnia

<div class="dense">

| | Blok | Co robimy |
| --- | --- | --- |
| **1** | Sygnały - fundament | `signal` / `computed` / `effect`, antywzorce &nbsp;→&nbsp; **kod** |
| **2** | Stan serwera vs stan klienta | `resource`, `linkedSignal`, formularze &nbsp;→&nbsp; **kod** |
| **3** | Kiedy mikrofrontendy, a kiedy nie | drivery, koszty, Wasza decyzja &nbsp;→&nbsp; **ADR** |
| **4** | Jak się składa mikrofrontendy | build-time / server-side / client-side |
| **5** | Module Federation | shell, remote, `loadRemoteModule` &nbsp;→&nbsp; **kod** |
| **6** | Native Federation - i co wybrać | porównanie, kryteria &nbsp;→&nbsp; **decyzja** |
| **7** | Komunikacja między MF | zdarzenia, kontrakty, stan &nbsp;→&nbsp; **kod** |
| **8** | Monorepo i Nx | graf, `affected`, granice modułów &nbsp;→&nbsp; **kod** |
| **9** | Utrzymanie | wdrożenia, izolacja awarii, observability |

</div>

Note:
Nie obiecuj godzin. Obiecaj kolejność. Jeśli blok 1–2 pójdzie szybko, zostanie więcej
czasu na Nx, który dla tej grupy jest prawdopodobnie najbardziej wartościowy.

---

## Czego dziś NIE będzie

<div class="cols">
<div>

- **React i Vue** - mówimy o Waszym stacku, czyli Angularze
- **NgRx i inne biblioteki stanu** - pokazujemy wzorzec, nie konfigurację narzędzia
- **Backend** - BFF pojawi się jako pojęcie, nie jako kod
- **SSR dla mikrofrontendów** - osobny, duży temat

</div>
<div>

<div class="callout warn">
<span class="label">Uczciwie</span>
Mikrofrontendy to architektura, która <strong>kupuje niezależność wdrożeniową za złożoność operacyjną</strong>.
Jeśli w którymś momencie uznacie, że Wam się nie opłaca, to też jest wynik tego dnia.
</div>

</div>
</div>

Note:
Ten slajd buduje wiarygodność. Grupa, która ma już dwa MF-y, natychmiast wyczuje sprzedawanie.
Powiedz otwarcie, że jednym z możliwych wyników dnia jest „nie dokładamy trzeciego".
