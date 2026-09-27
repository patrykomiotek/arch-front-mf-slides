# Angular, sygnały i mikrofrontendy - slajdy

Jednodniowy warsztat dla Sieci Badawczej Łukasiewicz. Slajdy w reveal.js,
treść w Markdownie, nawigacja **wyłącznie w poziomie** (strzałki ←/→).

## Uruchomienie

```bash
npm install
npm start        # http://localhost:5181
```

**Działa offline.** Fonty (Lato, JetBrains Mono) są hostowane lokalnie przez
`@fontsource` i importowane w [`js/main.js`](js/main.js); `index.html` nie ma
ani jednego odwołania do sieci. Sprawdzone w przeglądarce: zero żądań
zewnętrznych, polskie znaki z podzbioru `latin-ext`.

```bash
npm run build && npm run preview   # wersja produkcyjna
npm run check                      # strażnik separatorów slajdów
```

Wymaga Node ≥ 20.19.

## Dla kogo i po co

11 osób, jeden zespół, **dwa istniejące mikrofrontendy**, 2–3 osoby z realnym
doświadczeniem w temacie. To nie jest grupa, którą trzeba przekonywać do
mikrofrontendów - dlatego deck nie sprzedaje architektury, tylko pomaga podjąć
**następną decyzję**: dokładać trzeci mikrofrontend czy uporządkować to, co jest.

Dzień jest warsztatowy: **sześć bloków ćwiczeniowych**, slajdy są szkieletem.

## Struktura

| Moduł | Blok | Ćwiczenie |
| --- | --- | --- |
| `00-intro` | Wstęp, plan, punkt wyjścia | - |
| `01-sygnaly` | Sygnały: `signal` / `computed` / `effect`, antywzorce | **1** · Policz, nie ustawiaj |
| `02-stan` | Server state vs client state, `linkedSignal`, `resource`, formularze | **2** · Rozdziel stan |
| `03-dlaczego-mf` | Drivery, problemy, korzyści vs gwarantowane koszty | **3** · ADR |
| `04-integracja` | Build-time / server-side / client-side | - |
| `05-module-federation` | Host, remote, `shared`, manifest | **4** · Shell ładuje remote |
| `06-native-federation` | Import maps, porównanie, kryteria wyboru | - |
| `07-komunikacja` | Zdarzenia, kontrakty, event bus, współdzielenie kodu | **5** · Dodaj do koszyka |
| `08-monorepo-nx` | Graf, `affected`, granice modułów, Nx vs Turborepo | **6** · Granice w lincie |
| `09-utrzymanie` | CI/CD, niezależne wdrożenia, izolacja awarii, observability | - |
| `10-outro` | Sześć decyzji do zapisania | - |

**66 slajdów, zero przepełnionych** (sprawdzone w przeglądarce przy 1280×720).

## Teza dnia

> Mikrofrontend to **granica wdrożenia**, nie granica kodu.
> Granicę kodu daje Nx i lint - taniej i bez kosztów operacyjnych.

Przy dwóch mikrofrontendach i jednym zespole koszt rozproszenia jest już płacony
w całości, a korzyść (niezależność zespołów) jeszcze nie nadeszła - bo nie ma
kogo od kogo uniezależniać. Ten wątek wraca w blokach 3, 6 i 8.

## Decyzja Module Federation vs Native Federation

Blok 6 jest zbudowany wokół jednego pytania rozstrzygającego:
**czy jesteście gotowi wrócić na webpacka?**

Module Federation w klasycznej postaci jest wtyczką webpacka; Angular CLI
buduje dziś esbuildem. Native Federation realizuje ten sam wzorzec na
import maps i natywnych ES modules, więc działa z domyślnym builderem.
Model mentalny (`exposes`, `shared`, manifest, `loadRemoteModule`) jest
w obu taki sam - wiedza się przenosi.

Deck **nie wskazuje zwycięzcy**. Daje kryteria i wymaga zapisania decyzji w ADR.

## Uwagi merytoryczne

- **Statusy API zweryfikowane** w `node_modules` Angulara 21.2.24 (repo `../angular`):
  `linkedSignal` jest stabilne (`@publicApi 20.0`), natomiast `resource`,
  `rxResource` i `httpResource` mają status **`@experimental`**. Slajd 16 mówi
  o tym wprost i zaleca schowanie ich za własnym portem.
- Formularze pokazujemy jako **czystą regułę domenową + cienki komponent**, a nie
  przez eksperymentalne API formularzy sygnałowych - ten wzorzec przeżyje migrację.
- Kwoty wszędzie w **groszach jako liczbach całkowitych** (`18.9 * 100 === 1889.9999999999998`).

## Materiał źródłowy

Część mikrofrontendowa jest przeniesiona z prezentacji „Architektura Microfrontends"
(92 slajdy). Przy przenoszeniu:

- treść **skondensowana** do formatu tabel i zestawień - bo to dzień warsztatowy,
  a nie wykładowy; nic nie zostało pominięte merytorycznie
- **przywrócona kolejność** - w oryginale slajdy wprowadzające do sekcji
  („Oczekiwane korzyści…", „Problemy rozwiązywane…") stały *po* swojej treści
- usunięte **trzy duplikaty** slajdu „Izolowanie awarii - podsumowanie"
- uzupełniony slajd o observability, którego tekst był **ucięty** na dole kadru
- dodane bloki, których w oryginale nie było: **Native Federation**, **sygnały**,
  **granice modułów w Nx**

Szkic architektury z oryginalnej prezentacji: [`public/img/szkic-architektury.png`](public/img/szkic-architektury.png).

## Repozytoria ćwiczeniowe

- `github.com/patrykomiotek/info-mf` - shell + flights + cart
- `github.com/patrykomiotek/info-mf-nx` - wersja w Nx
- `github.com/patrykomiotek/info-mf-blank-nx` - punkt startowy do ćwiczenia 6

## Strażnik slajdów

[`scripts/check-slides.mjs`](scripts/check-slides.mjs) jest wpięty w `npm run build`.
reveal.js dzieli plik na slajdy **przed** sparsowaniem Markdownu, więc linia `---`
w bloku kodu rozbija slajd, a brak pustej linii wokół separatora skleja dwa slajdy
w jeden - w obu przypadkach bez ostrzeżenia. Skrypt łapie jedno i drugie.

## Powiązane

- [`../slajdy`](../slajdy) - szkolenie 3-dniowe „Architektura Oprogramowania dla Developerów Frontend"
- [`../angular`](../angular) - przykłady w Angularze (sygnały, porty, testowalność)
- [`../code`](../code) - ćwiczenia w czystym TypeScripcie
- `../trener` - scenariusz i rozwiązania
