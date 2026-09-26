<!-- .slide: class="section-divider" data-background-color="#2c3e50" -->
<span class="kicker">Blok 5</span>
# Module Federation

<p class="subtitle">Host i remote · Shared · Manifest · Kod</p>

---

## Czym jest Module Federation

<div class="cols">
<div>

Wzorzec architektoniczny **decentralizacji aplikacji JavaScript**,
odpowiednik mikroserwisów po stronie frontendu.

Pozwala **współdzielić kod i zasoby** między wieloma aplikacjami
(mikrofrontendami) **w czasie działania**.

Deklarowane korzyści:

- ograniczenie duplikacji kodu
- łatwiejsze utrzymanie
- mniejszy łączny rozmiar aplikacji
- lepsza wydajność

</div>
<div>

**Kluczowe pojęcia**

| Pojęcie | Znaczenie |
| --- | --- |
| **Host** (shell) | aplikacja, która ładuje cudze moduły |
| **Remote** | aplikacja, która **wystawia** moduły |
| **Exposes** | co remote udostępnia na zewnątrz |
| **Shared** | biblioteki współdzielone zamiast duplikowane |
| **Manifest** | opis remote'a: co wystawia i pod jakim adresem |

<p class="source">module-federation.io</p>

</div>
</div>

Note:
Rola hosta i remote'a nie jest wyłączna: aplikacja może być jednocześnie jednym i drugim.
Powiedz to, bo w praktyce shell często też coś wystawia (np. komponenty layoutu).

---

## Konfiguracja: remote wystawia, host konsumuje

<div class="cols">
<div>

**Remote** - `flights`

```js
// webpack.config.js
const NG = { singleton: true, strictVersion: true };

new ModuleFederationPlugin({
  name: 'flights',
  filename: 'remoteEntry.js',
  exposes: {
    './Routes':
      './src/app/flights/flights.routes.ts',
    './SearchCard':
      './src/app/flights/search-card.ts',
  },
  shared: {
    '@angular/core': NG,
    '@angular/common': NG,
    '@angular/router': NG,
  },
});
```

</div>
<div>

**Host** - `shell`

```js
// ta sama stała, w drugim pliku konfiguracyjnym
const NG = { singleton: true, strictVersion: true };

new ModuleFederationPlugin({
  name: 'shell',
  remotes: {
    flights:
      'flights@http://localhost:4201/remoteEntry.js',
  },
  shared: {
    '@angular/core': NG,
    '@angular/common': NG,
    '@angular/router': NG,
  },
});
```

<div class="callout warn">
<span class="label">Tu mieszka 80% problemów</span>
<code>shared</code> z <code>singleton: true</code> dla pakietów Angulara jest
<strong>obowiązkowe</strong>. Dwie instancje <code>@angular/core</code> w jednej stronie
dają błędy, które wyglądają na magię, bo DI, zone i router przestają się rozumieć.
</div>

</div>
</div>

Note:
Jeśli w trakcie ćwiczenia ktoś dostanie dziwny błąd typu „NullInjectorError" albo
„two different instances of Angular", pierwsze pytanie brzmi: czy shared jest identyczny
po obu stronach. To jest ten slajd, do którego wtedy wracacie.

---

## Ładowanie remote'a w Angularze

<div class="cols">
<div>

**Statycznie - przez trasy**

```ts
// shell: app.routes.ts
export const routes: Routes = [
  {
    path: 'flights',
    loadChildren: () =>
      import('flights/Routes')
        .then((m) => m.FLIGHT_ROUTES),
  },
];
```

Proste, typowane, ale adres remote'a jest **zapieczony w buildzie shella**.

</div>
<div>

**Dynamicznie - bez przebudowy shella**

```ts
import { loadRemoteModule }
  from '@angular-architects/module-federation';

{
  path: 'flights',
  loadChildren: () =>
    loadRemoteModule({
      type: 'manifest',
      remoteName: 'flights',
      exposedModule: './Routes',
    }).then((m) => m.FLIGHT_ROUTES),
}
```

```json
// public/federation.manifest.json
{
  "flights": "http://localhost:4201/remoteEntry.json"
}
```

</div>
</div>

<div class="callout tip">
<span class="label">Dlaczego dynamicznie</span>
Manifest jest <strong>plikiem konfiguracyjnym</strong>, nie kodem. Zmiana adresu remote'a
między środowiskami (dev / stage / prod) to podmiana JSON-a, <strong>bez przebudowy shella</strong>.
Bez tego tracicie połowę obiecanej niezależności wdrożeniowej.
</div>

Note:
To jest najważniejsza praktyczna różnica w całym bloku. Wiele zespołów wdraża MF statycznie
i potem dziwi się, że każda zmiana adresu wymaga releasu shella. Pokaż manifest na ekranie.

---

## Kiedy Module Federation się sprawdza

<div class="cols">
<div>

**Scenariusze z dokumentacji**

- **duże aplikacje** - podział na wiele mikrofrontendów ze współdzieleniem kodu
- **architektura mikrofrontendowa** - MF jest do tego narzędziem pierwszego wyboru
- **praca wielu zespołów** nad jedną aplikacją

**Co ma w pakiecie**

współdzielenie zależności · manifest · runtime ·
system wtyczek · podpowiadanie typów ·
Chrome DevTools · wsparcie Webpack i Rspack

</div>
<div>

<div class="callout warn">
<span class="label">Cena, którą płacicie</span>
Module Federation w wersji klasycznej jest wtyczką <strong>webpacka</strong>.
<br/><br/>
Angular CLI od kilku wersji buduje domyślnie <strong>esbuildem</strong>,
dużo szybciej. Wybór webpackowego MF oznacza zwykle
<strong>powrót do wolniejszego buildera</strong>.
<br/><br/>
To jest dokładnie ten problem, który rozwiązuje <strong>Native Federation</strong>, czyli następny blok.
</div>

</div>
</div>

Note:
Nie sprzedawaj tu jeszcze Native Federation, tylko postaw problem. Zapytaj, ile trwa
u nich build shella i czy używają esbuilda czy webpacka. Odpowiedź ustawi cały następny blok.

---

<!-- .slide: class="exercise" -->
## Ćwiczenie 4 · Shell ładuje remote

<div class="callout exercise">
<span class="label">Zadanie · 40 minut · w parach</span>
Zestawcie działającą parę shell + remote i załadujcie trasę z remote'a <strong>dynamicznie</strong>.
</div>

<div class="cols">
<div>

**Kroki**

1. Remote `flights` wystawia `./Routes`
2. Shell ładuje je przez `loadRemoteModule` z **manifestu**
3. `shared` z `singleton: true` dla `@angular/core`, `common`, `router`
4. Uruchomcie oba, wejdźcie na `/flights`
5. **Zabijcie remote'a** i odświeżcie stronę. Co się stanie?

</div>
<div>

**Kryteria ukończenia**

- [ ] Trasa z remote'a działa w shellu
- [ ] Adres remote'a jest w **manifeście**, nie w kodzie
- [ ] Zmiana adresu **nie wymaga** przebudowy shella
- [ ] Umiecie opisać, co widzi użytkownik, gdy remote nie odpowiada

<div class="callout tip">
<span class="label">Punkt 5 jest najważniejszy</span>
Większość zespołów odkrywa brak obsługi niedostępnego remote'a
dopiero na produkcji. Wrócimy do tego w bloku o izolacji awarii.
</div>

</div>
</div>

<p class="source">Gotowy punkt startowy: <code>github.com/patrykomiotek/info-mf</code> &nbsp;·&nbsp; dokumentacja: <code>module-federation.io/practice/frameworks/angular</code></p>

Note:
Zarezerwuj czas na problemy środowiskowe: przy pierwszym zestawianiu MF zawsze coś nie gra
(porty, wersje, CORS). To jest normalne. Zapowiedz to, żeby nikt się nie zniechęcił.
Osoby z doświadczeniem MF rozdziel po parach. Będą lokalnym wsparciem.
