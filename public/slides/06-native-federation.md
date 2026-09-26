<!-- .slide: class="section-divider" data-background-color="#2c3e50" -->
<span class="kicker">Blok 6</span>
# Native Federation<br/>- i co właściwie wybrać

<p class="subtitle">Import maps · Bundler-agnostic · Wasza decyzja</p>

Note:
To jest blok, o który prosiliście wprost. Grupa skłania się ku Module Federation,
ale rozważa Native Federation. Celem bloku NIE jest wskazanie zwycięzcy,
tylko danie im kryterium, po którym sami rozstrzygną.

---

## Skąd się wzięło Native Federation

<div class="cols">
<div>

**Problem**

Module Federation w klasycznej postaci to wtyczka **webpacka**.
Jest z nim zrośnięta i korzysta z jego mechanizmu modułów.

Tymczasem Angular CLI przeszedł na **esbuild**, a ekosystem
frontendowy na Vite, Rollup i Rspack.

Efekt: żeby użyć MF, często trzeba **wrócić na webpacka**
i oddać znaczną część zysku na czasie budowania.

</div>
<div>

**Odpowiedź**

**Native Federation** - ta sama idea, ale oparta na
**standardach przeglądarki**, a nie na konkretnym bundlerze:

- **import maps** - standard W3C do mapowania nazw modułów na adresy
- **natywne ES modules** - zamiast wewnętrznego runtime'u webpacka

Dzięki temu jest **bundler-agnostic**: działa z esbuildem,
Vite, Rollupem i z domyślnym builderem Angulara.

<p class="source">Implementacja dla Angulara: <code>@angular-architects/native-federation</code></p>

</div>
</div>

Note:
Kluczowe zdanie: „ta sama idea, inny mechanizm". Native Federation celowo naśladuje
model mentalny i API Module Federation, żeby migracja i wiedza były przenośne.
To nie jest konkurencyjna filozofia, tylko inna implementacja tego samego wzorca.

---

## Ten sam model mentalny

<div class="cols dense">
<div>

**Native Federation - remote**

```js
// federation.config.js
const { withNativeFederation, shareAll } =
  require(
    '@angular-architects/native-federation/config',
  );

module.exports = withNativeFederation({
  name: 'flights',
  exposes: {
    './Routes':
      './src/app/flights/flights.routes.ts',
  },
  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    }),
  },
});
```

</div>
<div>

**Native Federation - host**

```ts
// main.ts - inicjalizacja przed startem aplikacji
import { initFederation }
  from '@angular-architects/native-federation';

initFederation('/federation.manifest.json')
  .then(() => import('./bootstrap'))
  .catch((err) => console.error(err));
```

```ts
// trasy - API niemal identyczne jak w MF
import { loadRemoteModule }
  from '@angular-architects/native-federation';

{
  path: 'flights',
  loadChildren: () =>
    loadRemoteModule('flights', './Routes')
      .then((m) => m.FLIGHT_ROUTES),
}
```

</div>
</div>

<div class="callout tip">
<span class="label">Zauważcie</span>
<code>exposes</code>, <code>shared</code>, <code>singleton</code>, manifest, <code>loadRemoteModule</code>:
<strong>te same pojęcia</strong>. Wiedza z jednego rozwiązania przenosi się na drugie.
</div>

Note:
Pokaż oba slajdy obok siebie, jeśli możesz: konfigurację MF z poprzedniego bloku i tę.
Podobieństwo jest celowe i jest głównym argumentem za tym, że wybór nie jest nieodwracalny.

---

## Porównanie - na czym naprawdę polega różnica

<div class="dense">

| | **Module Federation** (webpack / Rspack) | **Native Federation** |
| --- | --- | --- |
| Podstawa | runtime modułów **bundlera** | **import maps** + natywne ESM (standard) |
| Bundler | webpack, Rspack | dowolny - esbuild, Vite, Rollup |
| Angular CLI (esbuild) | zwykle wymaga zmiany buildera | działa z **domyślnym** builderem |
| Dojrzałość ekosystemu | **większa** - MF 2.0, wtyczki runtime, DevTools | mniejsza, węższy ekosystem |
| Model mentalny | host / remote / exposes / shared | **taki sam** |
| Kto za tym stoi | zespół Module Federation, wsparcie Nx | Manfred Steyer / angular-architects |
| Ryzyko | przywiązanie do bundlera | mniejszy ekosystem, mniej gotowych wtyczek |

</div>

<div class="callout warn">
<span class="label">Jedno pytanie rozstrzyga najwięcej</span>
<strong>Czy jesteście gotowi wrócić na webpacka?</strong>
<br/>Jeśli nie, Native Federation jest drogą mniejszego oporu.
Jeśli tak, bo potrzebujecie dojrzałego ekosystemu MF 2.0, wybierzcie Module Federation świadomie.
</div>

Note:
Zanim pokażesz ten slajd, zapytaj o ich builder. Jeśli są na esbuildzie i mają szybki build,
to pytanie w callout odpowiada się samo. Jeśli są jeszcze na webpacku, inercja przemawia za MF.
Nie odpowiadaj za nich.

---

## Jak wybrać - kryteria, nie preferencje

<div class="cols">
<div>

**Wybierzcie Module Federation, jeśli…**

- jesteście już na webpacku i to Wam nie przeszkadza
- potrzebujecie **wtyczek runtime**, DevTools, dojrzałego tooling'u
- planujecie **wiele frameworków** obok siebie i dużą skalę
- Wasze narzędzia (np. Nx) mają dla MF gotowe generatory, z których chcecie korzystać

</div>
<div>

**Wybierzcie Native Federation, jeśli…**

- jesteście na **esbuildzie** i nie chcecie z niego rezygnować
- zależy Wam na **standardach przeglądarki** i mniejszym uzależnieniu od bundlera
- macie **jeden framework** (Angular) i prosty scenariusz host + kilka remote'ów
- cenicie krótszy czas budowania bardziej niż szerokość ekosystemu

</div>
</div>

<div class="callout task">
<span class="label">Wasz kontekst</span>
Jeden framework · jeden zespół · dwa mikrofrontendy · nowoczesny Angular.
<br/>To jest profil, w którym <strong>prostota bije ekosystem</strong>,
ale decyzja należy do Was i musi trafić do ADR.
</div>

Note:
Ten callout jest moją rekomendacją, ale podaną jako obserwacja, nie wyrok. Jeśli zespół
ma mocny argument za MF (np. wykorzystują Nx z generatorami MF), to też jest dobra decyzja.
Ważne, żeby powód był zapisany.

---

## Co jest wspólne niezależnie od wyboru

Te decyzje musicie podjąć tak samo w obu rozwiązaniach:

<div class="cols">
<div>

**1. Polityka `shared`**
Które biblioteki są singletonami? `@angular/core`, `common`, `router`: zawsze.
Co z bibliotekami UI i datami?

**2. Wersjonowanie remote'ów**
Czy shell ładuje zawsze najnowszą wersję, czy przypiętą?
Kto decyduje o podniesieniu?

**3. Zachowanie przy niedostępnym remote**
Co widzi użytkownik? Komunikat, ukrycie sekcji, przekierowanie?

</div>
<div>

**4. Kontrakt komunikacji**
Jakie zdarzenia, jaki kształt danych, kto jest właścicielem typu? → blok 7

**5. Design system**
Wspólny wygląd **bez** wspólnego kodu wiążącego zespoły.

**6. Observability**
Skąd wiecie, **który** remote się wywrócił? → blok 9

</div>
</div>

<div class="callout tip">
<span class="label">Dobra wiadomość</span>
Sześć powyższych decyzji jest <strong>ważniejszych</strong> niż wybór między MF a NF,
i przenosi się między nimi bez zmian.
</div>

Note:
To jest slajd, który zdejmuje presję z decyzji MF vs NF. Powiedz wprost: jeśli wyjdziecie
dziś z sali bez rozstrzygnięcia, ale z odpowiedziami na te sześć punktów, dzień był udany.
