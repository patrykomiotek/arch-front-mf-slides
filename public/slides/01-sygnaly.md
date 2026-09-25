<!-- .slide: class="section-divider" data-background-color="#2c3e50" -->
<span class="kicker">Blok 1</span>
# Sygnały - fundament

<p class="subtitle">Trzy prymitywy · Model mentalny · Antywzorce</p>

---

## Trzy prymitywy i jedna zasada

<div class="cols">
<div>

```ts
// źródło prawdy - zapisywalne
const quantity = signal(1);
const unitPriceInCents = signal(1890);

// stan POCHODNY - tylko do odczytu
const totalInCents = computed(
  () => quantity() * unitPriceInCents(),
);

// efekt uboczny - NIE stan
effect(() => {
  console.log('total:', totalInCents());
});
```

</div>
<div>

**`signal`** - wartość, którą ktoś ustawia

**`computed`** - wartość, której **nikt nie ustawia**; jest funkcją innych sygnałów

**`effect`** - reakcja na zmianę, wychodząca **poza** graf sygnałów (log, DOM, analytics)

<div class="callout tip">
<span class="label">Zasada dnia</span>
Jeśli potrafisz coś <strong>policzyć</strong>, nie wolno Ci tego <strong>ustawiać</strong>.
</div>

</div>
</div>

Note:
To jest cały model mentalny sygnałów na jednym slajdzie. Reszta bloku to konsekwencje.
Zapytaj grupę, ile sygnałów w ich kodzie jest ustawianych ręcznie, a dałoby się policzyć.
Zwykle po tym pytaniu ktoś przyznaje, że ma pole `total`, które aktualizuje w trzech miejscach.

---

## Test dobrego modelu stanu

<div class="callout task">
<span class="label">Pytanie diagnostyczne</span>
<strong>Ile sygnałów muszę ustawić, żeby obsłużyć jedną zmianę biznesową?</strong>
</div>

<div class="cols">
<div>

**Źle** - cztery zapisy na jedno zdarzenie

```ts
addItem(item: CartItem) {
  this.items.update((x) => [...x, item]);
  this.count.set(this.items().length);      // ✗
  this.total.set(sum(this.items()));        // ✗
  this.isEmpty.set(false);                  // ✗
}
```

Każdy z tych zapisów to miejsce, w którym stan może się **rozjechać**.

</div>
<div>

**Dobrze** - jeden zapis, reszta wynika

```ts
readonly items = signal<CartItem[]>([]);

readonly count = computed(() => this.items().length);
readonly total = computed(() => sum(this.items()));
readonly isEmpty = computed(
  () => this.count() === 0,
);

addItem(item: CartItem) {
  this.items.update((x) => [...x, item]);   // ✓
}
```

</div>
</div>

Note:
Ten slajd wart jest zatrzymania. „Cztery zapisy" to nie jest wymyślony przykład. To jest
dokładnie to, co powstaje, gdy ktoś przenosi kod z RxJS-a albo z komponentu klasowego 1:1.
Metryka „liczba zapisów na jedno zdarzenie biznesowe" jest mierzalna i łatwa do zapamiętania.

---

## Antywzorzec #1: `effect` jako `computed`

<div class="cols">
<div>

**Nie tak**

```ts
readonly items = signal<CartItem[]>([]);
readonly total = signal(0);

constructor() {
  effect(() => {
    this.total.set(sum(this.items()));  // ✗
  });
}
```

Co tu jest złego:

- `total` jest teraz **zapisywalny z zewnątrz** - każdy może skłamać
- pojawia się **dodatkowy takt** - przez chwilę `total` jest nieaktualny
- nie da się tego przetestować bez uruchomienia frameworka

</div>
<div>

**Tak**

```ts
readonly items = signal<CartItem[]>([]);
readonly total = computed(() => sum(this.items()));
```

<div class="callout warn">
<span class="label">Reguła</span>
<code>effect</code> jest do <strong>wyjścia z aplikacji na zewnątrz</strong>:
log, <code>localStorage</code>, analytics, integracja z biblioteką, która nie zna sygnałów.
<br/>Nie do liczenia.
</div>

</div>
</div>

Note:
Jeśli ktoś zapyta „a kiedy wolno pisać do sygnału w efekcie", odpowiedź brzmi: gdy piszesz
do czegoś, co NIE jest funkcją tego, co czytasz. Np. synchronizacja z zewnętrznym źródłem.
Ale to rzadkie i powinno wymagać uzasadnienia w code review.

---

## Antywzorzec #2: sygnał, który jest cache'em

```ts
// „Pobieram raz w ngOnInit i trzymam w sygnale"
readonly applications = signal<Application[]>([]);

ngOnInit() {
  // ✗
  this.http
    .get<Application[]>('/api/applications')
    .subscribe((d) => this.applications.set(d));
}
```

<div class="cols">
<div>

**Czego tu brakuje**

- stanu ładowania i błędu (zaraz dojdą dwa kolejne sygnały)
- unieważniania - kiedy te dane przestają być prawdziwe?
- anulowania - co, jeśli parametr zmieni się w trakcie?
- ponowienia po błędzie

</div>
<div>

To nie jest stan aplikacji. To jest **kopia stanu serwera**,
czyli **cache**, tylko napisany ręcznie i bez polityki unieważniania.

<div class="callout tip">
<span class="label">Do bloku 2</span>
Rozróżnienie <strong>server state</strong> vs <strong>client state</strong>
to najważniejsza rzecz w modelowaniu stanu. Wracamy do niego za chwilę.
</div>

</div>
</div>

Note:
Prawie każdy zespół ma ten kod. Nie piętnuj go. Pokaż, że to jest niedokończony cache,
i że pytanie „jaka jest polityka unieważniania" jest pytaniem architektonicznym, nie technicznym.

---

## Komponent na sygnałach: `input`, `output`, `model`

<div class="cols dense">
<div>

```ts
@Component({
  selector: 'app-application-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tr [class.is-urgent]="isUrgent()">
      <td>{{ row().title }}</td>
      <td>{{ amount() }}</td>
      <td>
        <button (click)="approve.emit(row().id)">
          Zatwierdź
        </button>
      </td>
    </tr>
  `,
})
export class ApplicationRow {
  // wejście wymagane: brak = błąd kompilacji
  readonly row = input.required<Application>();

  // komponent NIE wie, co stanie się dalej
  readonly approve = output<string>();

  // stan pochodny, liczony z wejścia
  readonly isUrgent = computed(
    () => this.row().daysWaiting > 14,
  );
  readonly amount = computed(
    () => formatMoney(this.row().amountInCents),
  );
}
```

</div>
<div>

**`input()`** - wejście jako sygnał;
`input.required()` przenosi brak wejścia
na **czas kompilacji**

**`output()`** - komponent zgłasza *co się stało*,
nie *co ma się stać*

**`model()`** - dwukierunkowe, gdy komponent
naprawdę współposiada wartość (pole formularza)

<div class="callout">
<span class="label">Granulacja</span>
Komponent prezentacyjny <strong>nie wstrzykuje serwisów</strong>.
Dostaje dane wejściem, zgłasza zdarzenia wyjściem.
Dzięki temu da się go użyć w drugim mikrofrontendzie
bez przenoszenia połowy aplikacji.
</div>

</div>
</div>

Note:
Ostatni akapit to most do części mikrofrontendowej. Komponent, który wstrzykuje serwis,
jest nieprzenośny, a przenośność komponentów to jedyny sensowny powód, żeby mieć
współdzieloną bibliotekę UI między mikrofrontendami.

---

<!-- .slide: class="exercise" -->
## Ćwiczenie 1 · Policz, nie ustawiaj

<div class="callout exercise">
<span class="label">Zadanie · 20 minut · w parach</span>
Weźcie komponent albo serwis <strong>z własnego projektu</strong>, w którym jest
kilka sygnałów albo pól ustawianych ręcznie. Przepiszcie go tak, żeby zostało
<strong>jedno źródło prawdy</strong>, a reszta była <code>computed</code>.
</div>

<div class="cols">
<div>

**Kroki**

1. Wypiszcie wszystkie pola stanu na kartce
2. Przy każdym zaznaczcie: *ustawiane* czy *wynikające*
3. Wszystko, co wynika, zamieńcie na `computed`
4. Policzcie zapisy na jedno zdarzenie biznesowe **przed** i **po**

</div>
<div>

**Kryteria ukończenia**

- [ ] W klasie jest dokładnie jeden `signal` zapisywalny na pojęcie domenowe
- [ ] Żaden `effect` nie ustawia sygnału
- [ ] Reguła biznesowa da się przetestować **bez** `TestBed`
- [ ] Potrafisz powiedzieć, ile zapisów ubyło

</div>
</div>

<div class="callout tip">
<span class="label">Nie macie pod ręką swojego kodu?</span>
Użyjcie koszyka: <code>items</code> + <code>count</code> + <code>total</code> + <code>isEmpty</code> + <code>hasDiscount</code>.
</div>

Note:
Chodź po sali. Najczęstszy zator: ktoś ma pole, które JEST ustawiane z zewnątrz i JEST liczone.
To znak, że kryją się tam dwa różne pojęcia. To najlepszy moment na rozmowę o modelowaniu.
Na koniec poproś dwie pary o pokazanie liczby „przed / po". To robi lepsze wrażenie niż kod.
