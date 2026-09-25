<!-- .slide: class="section-divider" data-background-color="#2c3e50" -->
<span class="kicker">Blok 2</span>
# Stan serwera vs stan klienta

<p class="subtitle">Dwa różne zwierzęta · <code>linkedSignal</code> · <code>resource</code> · Formularze</p>

---

## Dwa rodzaje stanu, dwa zestawy pytań

<div class="cols">
<div>

**Server state**

Dane, których **właścicielem jest serwer**.
Wy macie tylko kopię.

Pytania, na które musicie odpowiedzieć:

- kiedy ta kopia jest nieaktualna?
- co pokazujemy w trakcie ładowania?
- co robimy z błędem?
- czy anulujemy poprzednie żądanie?
- czy dwa komponenty dzielą tę samą kopię?

</div>
<div>

**Client state**

Dane, których **właścicielem jesteście wy**.
Serwer o nich nie wie.

Pytania są inne, i jest ich mniej:

- jaka jest wartość początkowa?
- co ją resetuje?
- czy przeżywa nawigację?

Przykłady: zaznaczony wiersz, otwarty modal,
filtry, krok kreatora, szkic formularza.

</div>
</div>

<div class="callout warn">
<span class="label">Najczęstszy błąd</span>
Wrzucenie obu do jednego worka, czyli „store aplikacji". Wtedy <strong>cache dostaje logikę UI</strong>,
a stan UI dostaje politykę unieważniania. Oba tracą.
</div>

Note:
Zapytaj tu: „wymieńcie mi trzy rzeczy z Waszego store'a".
Prawie zawsze padnie mieszanka obu rodzajów. Nie chodzi o to, żeby mieć dwie biblioteki.
Chodzi o to, żeby wiedzieć, o którym rodzaju się mówi.

---

## `linkedSignal` - stan, który ma właściciela i reset

Sytuacja: lista wniosków przychodzi z serwera. Użytkownik zaznacza jeden wiersz.
**Co się dzieje z zaznaczeniem, gdy lista się przeładuje?**

<div class="cols">
<div>

```ts
readonly applications = signal<Application[]>([]);

// zaznaczenie: NASZE, ale zależne od listy
type Apps = Application[];
type Sel = string | null;

readonly selectedId = linkedSignal<Apps, Sel>({
  source: () => this.applications(),
  computation: (apps, previous) => {
    // zachowaj zaznaczenie, jeśli nadal istnieje
    const stillThere = apps.some(
      (a) => a.id === previous?.value,
    );
    return stillThere
      ? previous!.value
      : apps[0]?.id ?? null;
  },
});
```

</div>
<div>

`linkedSignal` to sygnał, który:

- **da się ustawić** jak zwykły `signal` (klik użytkownika)
- **resetuje się**, gdy zmieni się źródło
- zna **poprzednią wartość**, więc może ją zachować

To dokładnie ten wzorzec „stan UI przypięty do danych z serwera",
który wcześniej pisało się ręcznie w `effect` i który
przez to potrafił zgubić zaznaczenie.

<div class="callout tip">
<span class="label">Status API</span>
<code>linkedSignal</code> jest <strong>stabilne</strong> (public API od Angulara&nbsp;20).
</div>

</div>
</div>

Note:
Sprawdziłem w node_modules Waszej wersji: linkedSignal ma adnotację @publicApi 20.0,
czyli jest stabilne. Powiedz to wprost, bo grupa często nie wie, co jest
developer preview, a co nie.

---

## `resource` - server state z pierwszej ręki

<div class="cols">
<div>

```ts
readonly month = signal('2026-09');

readonly applicationsResource = resource({
  params: () => ({ month: this.month() }),
  loader: async ({ params, abortSignal }) => {
    const res = await fetch(
      `/api/applications?month=${params.month}`,
      // anulowanie w pakiecie:
      { signal: abortSignal },
    );
    if (!res.ok) throw new Error(res.statusText);
    return (await res.json()) as Application[];
  },
});

// w szablonie:
// @if (applicationsResource.isLoading()) { ... }
// @if (applicationsResource.error()) { ... }
// @for (a of applicationsResource.value() ?? [];…)
```

</div>
<div>

Co dostajecie w pakiecie:

- `value()` / `error()` / `isLoading()` / `status()`
- **automatyczne przeładowanie**, gdy zmienią się `params`
- **anulowanie** poprzedniego żądania (`abortSignal`)
- `reload()`

Warianty: `rxResource` (dla `Observable`)
i `httpResource` (dla `HttpClient`).

<div class="callout warn">
<span class="label">Uwaga przed wdrożeniem</span>
W Waszej wersji (21.2) <code>resource</code>, <code>rxResource</code> i <code>httpResource</code>
mają nadal status <strong><code>@experimental</code></strong>.
API może się zmienić między wersjami. Użyteczne, ale <strong>schowajcie je za własnym portem</strong>,
zamiast rozsypywać po całej aplikacji.
</div>

</div>
</div>

Note:
To jest slajd, który buduje zaufanie. Sprawdziłem adnotacje w ich node_modules:
resource i rxResource to @experimental 19.0, httpResource to @experimental 19.2.
Nie odradzaj, ale powiedz wprost, że to jest decyzja do świadomego podjęcia,
i że opakowanie w port (jeden plik do zmiany) jest tanim zabezpieczeniem.

---

## Formularze na sygnałach - dziś, bez eksperymentów

Angular ma eksperymentalne API formularzy sygnałowych. **Nie potrzebujecie go**, żeby reguły formularza były testowalne bez frameworka.

<div class="cols dense">
<div>

```ts
// domain/…-rules.ts - ZERO importów @angular/*
export type Draft = {
  title: string;
  amountInCents: number;
};

export type Violation = {
  field: keyof Draft;
  message: string;
};

export function validate(d: Draft): Violation[] {
  const out: Violation[] = [];
  const add = (f: keyof Draft, message: string) =>
    out.push({ field: f, message });

  if (d.title.trim().length < 3)
    add('title', 'Tytuł min. 3 znaki');
  if (d.amountInCents <= 0)
    add('amountInCents', 'Kwota musi być dodatnia');
  return out;
}
```

</div>
<div>

```ts
// komponent - cienka warstwa nad regułą
readonly draft = signal<Draft>({
  title: '',
  amountInCents: 0,
});

readonly violations = computed(
  () => validate(this.draft()),
);
readonly isValid = computed(
  () => this.violations().length === 0,
);

readonly errorFor = computed(() => {
  const map = new Map<keyof Draft, string>();
  for (const v of this.violations()) {
    map.set(v.field, v.message);
  }
  return map;
});
```

<div class="callout tip">
<span class="label">Efekt</span>
Reguła formularza testuje się w <strong>milisekundach, bez TestBed</strong>.
Komponent tylko ją wywołuje. To ta sama zasada, co w bloku 1:
<em>policz, nie ustawiaj</em>.
</div>

</div>
</div>

Note:
Jeśli ktoś zapyta o @angular/forms/signals, powiedz, że istnieje, jest eksperymentalne,
i że trzeba je obserwować. Ale pokaż, że wzorzec „czysta reguła + cienki komponent" działa
niezależnie od tego, które API formularzy wybiorą, i przeżyje migrację.

---

## Kwoty: grosze jako liczby całkowite

<div class="cols">
<div>

```ts
> 18.9 * 100
1889.9999999999998        // ✗
```

Dlatego w całym kodzie:

```ts
type AmountInCents = number;   // ZAWSZE grosze
```

Konwersja na złotówki wyłącznie **na wyjściu**, w widoku.

</div>
<div>

<div class="callout warn">
<span class="label">Dlaczego to tu jest</span>
Bo za chwilę będziemy przesyłać te kwoty <strong>między mikrofrontendami</strong>.
Kontrakt, w którym „kwota" raz znaczy złotówki, a raz grosze,
to najdroższy rodzaj błędu w architekturze rozproszonej:
nie wywala się, tylko po cichu liczy źle.
</div>

Nazwa pola niesie jednostkę: `amountInCents`, nie `amount`.

</div>
</div>

Note:
Krótki slajd, ale zostaw go. To jest konkret, który zostaje w głowie,
i naturalne wejście w temat kontraktów między mikrofrontendami.

---

<!-- .slide: class="exercise" -->
## Ćwiczenie 2 · Rozdziel stan serwera od stanu klienta

<div class="callout exercise">
<span class="label">Zadanie · 25 minut · w parach</span>
Zbudujcie widok listy z filtrem i zaznaczeniem: dane z serwera, filtr i zaznaczenie po stronie klienta.
</div>

<div class="cols">
<div>

**Wymagania**

1. Lista pobierana po zmianie filtra, ze **starym żądaniem anulowanym**
2. Widoczny stan ładowania i stan błędu
3. Zaznaczony wiersz **przeżywa** przeładowanie listy, jeśli nadal istnieje
4. Gdy zaznaczony element zniknął, zaznacz pierwszy z nowej listy
5. Reguła „czy wiersz jest pilny" w **osobnym pliku bez importów Angulara** + test

</div>
<div>

**Podpowiedzi**

- punkt 1–2 → `resource` (pamiętajcie o `abortSignal`)
- punkt 3–4 → `linkedSignal` z `previous`
- punkt 5 → czysta funkcja + `describe`/`it`

**Kryteria ukończenia**

- [ ] Żaden `effect` nie ustawia sygnału
- [ ] Test reguły przechodzi bez `TestBed`
- [ ] Umiecie wskazać, co jest kopią serwera, a co Waszą własnością

</div>
</div>

Note:
Punkt 4 jest celowo podchwytliwy: wymusza użycie previous w linkedSignal.
Jeśli para pójdzie w effect, pozwól im dojść do błędu (zgubione zaznaczenie albo pętla),
a potem pokaż linkedSignal. Ta droga przez błąd zapada w pamięć lepiej niż slajd.
