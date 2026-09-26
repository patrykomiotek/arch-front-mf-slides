<!-- .slide: class="section-divider" data-background-color="#2c3e50" -->
<span class="kicker">Blok 8</span>
# Monorepo i Nx

<p class="subtitle">Graf zależności · <code>affected</code> · Granice modułów · Nx vs Turborepo</p>

Note:
Dla tej grupy to jest prawdopodobnie najbardziej wartościowy blok dnia. Mają dwa mikrofrontendy
i jeden zespół, więc narzędzie do zarządzania granicami da im więcej niż trzeci mikrofrontend.

---

## Problem, który rozwiązuje monorepo

<div class="cols">
<div>

Przy dwóch mikrofrontendach i wspólnych bibliotekach zaczynają się pytania:

- gdzie mieszka **wspólny typ zdarzenia**?
- kto i kiedy podbija wersję biblioteki UI?
- jak sprawdzić, **co się zepsuje**, gdy zmienię wspólny komponent?
- dlaczego CI buduje wszystko, skoro zmieniłem jeden plik?
- kto pilnuje, żeby mikrofrontend A **nie zaimportował** wnętrza mikrofrontendu B?

</div>
<div>

**Polirepo** - osobne repozytoria

+ pełna niezależność, jasna własność
− trudna zmiana przekrojowa, wersjonowanie przez npm, rozjazd standardów

**Monorepo** - jedno repozytorium, wiele projektów

+ jedna zmiana atomowa, wspólne standardy, widoczny graf zależności
− potrzebne **narzędzie**, inaczej szybko robi się bałagan

<div class="callout tip">
<span class="label">Uwaga</span>
Monorepo <strong>nie znosi</strong> niezależnych wdrożeń.
Możecie mieć jedno repo i osobne pipeline'y na każdy mikrofrontend.
</div>

</div>
</div>

Note:
Piąte pytanie z lewej kolumny jest najważniejsze i prowadzi prosto do enforce-module-boundaries.
Zapytaj, czy dziś cokolwiek powstrzymuje ich przed importem „na skróty" między projektami.
Odpowiedź zwykle brzmi „tylko code review".

---

## Nx.dev - co daje

<div class="cols">
<div>

**Zarządzanie monorepo**
Ułatwia organizację wielu aplikacji i bibliotek w jednym repozytorium,
współdzielenie kodu i zarządzanie zależnościami.

**Graf zależności i optymalizacja**
Nx buduje **graf zależności** między projektami i uruchamia zadania
(build, test, lint) **tylko dla tych, które faktycznie się zmieniły**.
To drastycznie skraca CI/CD.

**Współdzielenie kodu**
Biblioteki komponentów i funkcji do użycia między mikrofrontendami,
bez duplikacji.

</div>
<div>

**Schematy i generatory**
Gotowe generatory nowych mikrofrontendów, komponentów i serwisów.
Spójna struktura projektów w całej organizacji.

**Integracje z frameworkami**
Wbudowane wsparcie dla Angulara, Reacta i Vue oraz narzędzi
(Jest, Cypress, ESLint).

```bash
nx graph                    # zobacz graf zależności
nx affected -t test lint    # tylko to, co dotknięte
nx affected -t build --base=main
```

</div>
</div>

Note:
`nx graph` na żywo robi największe wrażenie. Odpal to na ich repo, jeśli się da,
albo na przykładowym. Zobaczenie własnych zależności jako obrazka bywa momentem olśnienia.

---

## Funkcja, która jest dla Was najważniejsza

<div class="cols dense">
<div>

**Egzekwowane granice modułów**

```json
// .eslintrc - @nx/enforce-module-boundaries
{
  "depConstraints": [
    {
      "sourceTag": "scope:flights",
      "onlyDependOnLibsWithTags": [
        "scope:flights", "scope:shared"
      ]
    },
    {
      "sourceTag": "scope:cart",
      "onlyDependOnLibsWithTags": [
        "scope:cart", "scope:shared"
      ]
    },
    {
      "sourceTag": "type:ui",
      "onlyDependOnLibsWithTags": [
        "type:ui", "type:util"
      ]
    }
  ]
}
```

</div>
<div>

Import z `flights` do wnętrza `cart` przestaje być
kwestią dyscypliny i **staje się błędem lintera**.

<div class="callout tip">
<span class="label">Dlaczego to jest dla Was kluczowe</span>
Przy jednym zespole i dwóch mikrofrontendach
granice utrzymuje dziś <strong>wyłącznie dobra wola</strong>.
<br/><br/>
Reguła w linterze daje Wam <strong>tę samą izolację,
co osobne repozytoria</strong>, bez kosztu osobnych repozytoriów.
<br/><br/>
To jest realna alternatywa dla „dołóżmy trzeci mikrofrontend,
żeby wymusić separację".
</div>

</div>
</div>

Note:
To jest puenta, do której zmierzałeś od „testu jednego pytania" w bloku 3. Powiedz to wprost:
jeśli powodem wydzielania mikrofrontendu jest chęć wymuszenia granicy w kodzie, to Nx daje
tę granicę taniej. Mikrofrontend wydzielajcie wtedy, gdy potrzebujecie osobnego WDROŻENIA.

---

## Nx - wady, o których warto wiedzieć

<div class="tradeoff">
<div class="cons">
<h4>Koszt wejścia</h4>

**Krzywa uczenia się** - Nx wprowadza własne konwencje i ekosystem.
Zrozumienie generatorów, schematów i mechanizmu weryfikacji zależności
zajmuje czas.

**Złożoność na początku projektu** - w małych aplikacjach
może wydawać się przerostem formy. Wymaga nakładu na konfigurację.

</div>
<div class="cons">
<h4>Koszt długofalowy</h4>

**Dodatkowa warstwa abstrakcji** - Nx nakłada się na standardowe
narzędzia. Utrudnia debugowanie i zrozumienie, co dzieje się pod spodem,
zwłaszcza dla nowych osób.

**Ryzyko uwięzienia w ekosystemie** - mimo otwartości,
silne powiązanie z konwencjami Nx może utrudnić późniejszą migrację.

</div>
</div>

<div class="callout warn">
<span class="label">Uczciwie</span>
Przy 11 osobach i dwóch aplikacjach koszt wejścia jest <strong>realny</strong>, ale jednorazowy.
Przy pięciu aplikacjach bez Nx zapłacicie go i tak, tylko w formie chaosu.
</div>

Note:
Nie pomijaj tego slajdu. Grupa, której sprzedajesz narzędzie bez wad, przestaje Ci wierzyć.
„Dodatkowa warstwa abstrakcji" jest prawdziwym problemem przy onboardingu. Powiedz o tym.

---

## Nx czy Turborepo

<div class="dense">

| | **Nx** | **Turborepo** |
| --- | --- | --- |
| Filozofia | zintegrowana platforma do monorepo | lekki **orkiestrator zadań** |
| Cache zadań | tak (lokalny + zdalny) | tak (lokalny + zdalny) |
| Graf zależności | tak, z wizualizacją (`nx graph`) | tak, prostszy |
| Generatory kodu | **tak** - bogate, dla Angulara | nie |
| Wsparcie Angulara | **pierwszej klasy** (`@nx/angular`) | brak dedykowanego |
| Egzekwowanie granic | **tak** - reguła ESLint z tagami | nie (trzeba własnym narzędziem) |
| Koszt wejścia | wyższy | **niższy** |
| Kiedy wybrać | Angular, wiele bibliotek, potrzeba granic | wiele języków, minimalna ingerencja |

</div>

<div class="callout task">
<span class="label">Rekomendacja dla Waszego kontekstu</span>
Angular + potrzeba <strong>egzekwowanych granic</strong> + generatory mikrofrontendów →
<strong>Nx</strong>. Turborepo jest świetny, ale jego przewaga (lekkość, agnostyczność językowa)
nie jest tym, czego dziś potrzebujecie.
</div>

Note:
Jeśli ktoś używał Turborepo i je lubi, nie podważaj. Powiedz, że to dobry wybór dla repo,
w którym obok frontu żyje Go i Python. Przy jednorodnym Angularze przewaga Nx to generatory
i granice, czyli dokładnie ich dwa problemy.

---

<!-- .slide: class="exercise" -->
## Ćwiczenie 6 · Granice, które egzekwuje maszyna

<div class="callout exercise">
<span class="label">Zadanie · 35 minut · w parach</span>
Przenieście strukturę z ćwiczeń 4–5 do workspace'u Nx i <strong>zablokujcie</strong> niedozwolony import.
</div>

<div class="cols">
<div>

**Kroki**

1. Workspace Nx z dwiema aplikacjami Angulara (`shell`, `flights`)
2. Dwie biblioteki: `shared-ui` i `shared-contracts` (typy zdarzeń)
3. Otagujcie projekty: `scope:*` oraz `type:app|ui|util`
4. Skonfigurujcie `@nx/enforce-module-boundaries`
5. **Spróbujcie zaimportować** wnętrze `flights` z `shell`; lint ma to odrzucić
6. Pokażcie graf (`nx graph`), potem `nx affected -t lint` po zmianie w bibliotece

</div>
<div>

**Kryteria ukończenia**

- [ ] Niedozwolony import **nie przechodzi lintu**
- [ ] `nx graph` pokazuje oczekiwane zależności
- [ ] `nx affected` po zmianie w `shared-ui` obejmuje obie aplikacje
- [ ] `nx affected` po zmianie w `flights` **nie** obejmuje `shell`
- [ ] Umiecie wyjaśnić, co z tego trafi do Waszego CI

<p class="source">Punkt startowy: <code>github.com/patrykomiotek/info-mf-blank-nx</code> · <code>info-mf-nx</code></p>

</div>
</div>

Note:
Punkty 3–4 zajmą najwięcej czasu, bo tagowanie wymaga decyzji, a nie tylko wpisania.
To jest celowe: układ tagów TO JEST architektura, zapisana w pliku. Jeśli para długo
się spiera o tagi, to znaczy, że ćwiczenie działa.
