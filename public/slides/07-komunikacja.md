<!-- .slide: class="section-divider" data-background-color="#2c3e50" -->
<span class="kicker">Blok 7</span>
# Komunikacja między<br/>mikrofrontendami

<p class="subtitle">Zdarzenia · Kontrakty · Współdzielenie kodu</p>

---

## Pryncypium: dziel wzdłuż domeny, nie wzdłuż technologii

<div class="tradeoff">
<div class="cons">
<h4>Antywzorzec - podział technologiczny</h4>

Zespół A odpowiada za **całe UI**,
Zespół B za **całą logikę biznesową**,
Zespół C za **całą warstwę danych**.

Skutek: każda funkcjonalność przechodzi przez trzy zespoły.
Ciągłe zależności, wąskie gardła, nikt nie czuje się właścicielem.

Przy błędzie w koszyku nie wiadomo, czy problem jest
we froncie, w backendzie, czy w bazie.

</div>
<div class="pros">
<h4>Wzorzec - podział wzdłuż domen</h4>

„Zespół Produktów", „Zespół Koszyka", „Zespół Płatności".

Każdy odpowiada za **cały pionowy plaster** swojej domeny:
front-end i back-end.

Jeden zespół jest właścicielem całej funkcjonalności:
od projektu, przez implementację i wdrożenie,
po monitorowanie na produkcji.

</div>
</div>

<div class="callout tip">
<span class="label">To jest Domain-Driven Design w praktyce</span>
Granica mikrofrontendu = granica <strong>kontekstu domenowego</strong>, nie warstwy technicznej.
</div>

Note:
Jeśli ktoś powie „ale my mamy HeaderService i FooterService", to jest dokładnie ten antywzorzec.
Nagłówek nie jest domeną, jest warstwą prezentacji. Zapytaj, kto jest właścicielem
funkcjonalności „użytkownik dodaje wniosek" i ile osób musi się zaangażować.

---

## Komunikacja: zdarzenia, nie wywołania

<div class="cols dense">
<div>

**Kluczowa zasada**

Mikrofrontendy komunikują się przez **zdarzenia**,
a nie przez bezpośrednie wywołania funkcji.

**Przykład**

Mikrofrontend Produktów **nie wywołuje** funkcji
w mikrofrontendzie Koszyka.

Zamiast tego **publikuje zdarzenie**:
`product-added-to-cart`.

Koszyk, który to zdarzenie subskrybuje, reaguje i dodaje produkt.

</div>
<div>

```ts
// kontrakt: jeden typ, wersjonowany,
// własność wspólna
export type ProductAddedToCart = {
  type: 'product-added-to-cart';
  version: 1;
  payload: {
    productId: string;
    quantity: number;
    unitPriceInCents: number;   // grosze!
  };
};

// nadawca - nie wie, kto słucha
bus.publish<ProductAddedToCart>({
  type: 'product-added-to-cart',
  version: 1,
  payload: {
    productId,
    quantity: 1,
    unitPriceInCents: 1890,
  },
});
```

</div>
</div>

<div class="callout warn">
<span class="label">Dlaczego to ma znaczenie</span>
Luźna komunikacja <strong>uniezależnia mikrofrontendy od siebie</strong>.
Nadawca nie wie, kto słucha, i dzięki temu odbiorca może się zmienić,
zniknąć albo dojść, bez zmiany u nadawcy.
</div>

Note:
Zwróć uwagę na pole `version` w kontrakcie. To tanie zabezpieczenie: gdy kształt zdarzenia
się zmieni, odbiorca może obsłużyć obie wersje przez jeden okres przejściowy.
Bez tego każda zmiana kontraktu wymaga jednoczesnego wdrożenia obu stron, czyli tego,
czego mikrofrontendy miały uniknąć.

---

## Event bus - minimalna, typowana implementacja

<div class="cols">
<div>

```ts
// shared/event-bus.ts
// w shellu, wystawiony przez shared
export type DomainEvent =
  | ProductAddedToCart
  | UserLoggedIn;

export class EventBus {
  readonly #target = new EventTarget();

  publish<E extends DomainEvent>(event: E): void {
    this.#target.dispatchEvent(
      new CustomEvent(event.type, { detail: event }),
    );
  }

  on<E extends DomainEvent>(
    type: E['type'],
    handler: (event: E) => void,
  ): () => void {
    const listener = (e: Event) =>
      handler((e as CustomEvent<E>).detail);
    this.#target.addEventListener(type, listener);
    return () =>
      this.#target
        .removeEventListener(type, listener);
  }
}
```

</div>
<div>

**Trzy rzeczy, które robi dobrze**

1. Opiera się na **`EventTarget`** - standard przeglądarki,
   zero zależności, działa między mikrofrontendami
   niezależnie od frameworka

2. `on()` **zwraca funkcję odpinającą** - bez tego
   przy nawigacji między remote'ami zostają wiszące
   nasłuchy i wyciek pamięci

3. Jest **typowany** sumą typów zdarzeń - literówka
   w nazwie zdarzenia to błąd kompilacji, nie cisza w runtime

<div class="callout tip">
<span class="label">W Angularze</span>
Wstawcie <code>EventBus</code> przez <code>InjectionToken</code>, a nie jako import klasy.
Wtedy test podmienia go jedną linią, a mikrofrontend nie zna implementacji.
</div>

</div>
</div>

Note:
Punkt 2 jest tym, o którym wszyscy zapominają. Przy mikrofrontendach ładowanych i odładowywanych
dynamicznie wycieki nasłuchów są bardzo realne. W Angularze połącz to z takeUntilDestroyed
albo DestroyRef.

---

## Współdzielenie kodu - ostrożnie

<div class="cols">
<div>

**Problem**

Pokusa współdzielenia kodu między zespołami jest duża,
zwłaszcza bibliotek komponentów UI.

Ale współdzielony kod tworzy **niejawne zależności**:
zmiana w bibliotece wymusza koordynację wdrożeń,
czyli dokładnie to, czego mikrofrontendy miały uniknąć.

</div>
<div>

**Rozwiązanie**

Mikrofrontendy powinny być **maksymalnie niezależne**.

Zamiast współdzielić kod, ujednolicajcie **wygląd i zachowanie**
przez **design system** (np. udokumentowany w Storybooku).

Spójny produkt **bez** uzależniania zespołów od siebie.

</div>
</div>

<div class="callout warn">
<span class="label">Praktyczny kompromis</span>
Współdzielcie to, co <strong>rzadko się zmienia i jest czysto techniczne</strong>:
tokeny designu, typy kontraktów zdarzeń, prymitywy UI.
<br/>Nie współdzielcie tego, co <strong>niesie logikę domenową</strong>,
bo wtedy dwa zespoły posiadają jedną regułę biznesową i żaden nie może jej zmienić sam.
</div>

Note:
To jest niuans, w którym łatwo przesadzić w obie strony. Zero współdzielenia = duplikacja
i niespójność. Pełne współdzielenie = rozproszony monolit. Linia podziału biegnie tam,
gdzie kończy się technika, a zaczyna domena.

---

<!-- .slide: class="exercise" -->
## Ćwiczenie 5 · Dodaj do koszyka przez zdarzenie

<div class="callout exercise">
<span class="label">Zadanie · 35 minut · w parach</span>
Mikrofrontend <strong>Flights</strong> dodaje lot do koszyka. Licznik koszyka żyje
<strong>w shellu</strong>, a nie w osobnym mikrofrontendzie. Jeszcze nie.
</div>

<div class="cols">
<div>

**Kroki**

1. Zdefiniujcie **typ zdarzenia** z polem `version` i kwotą w groszach
2. `EventBus` w shellu, wystawiony przez `shared` i wstrzykiwany przez `InjectionToken`
3. Flights publikuje zdarzenie po kliknięciu „Dodaj"
4. Komponent w shellu nasłuchuje i pokazuje **licznik + sumę**
5. Odepnijcie nasłuch przy zniszczeniu komponentu i **sprawdźcie**, że działa

</div>
<div>

**Kryteria ukończenia**

- [ ] Flights **nie importuje** niczego z koszyka
- [ ] Shell **nie importuje** niczego z Flights
- [ ] Kwoty są w groszach na całej drodze
- [ ] Nasłuch jest odpinany - potwierdzone, nie założone
- [ ] Umiecie powiedzieć, co się stanie, gdy dojdzie **wersja 2** zdarzenia

<div class="callout tip">
<span class="label">Dlaczego licznik w shellu</span>
Celowo. Najpierw pokazujemy komunikację, dopiero potem
rozważamy wydzielenie koszyka do osobnego MF,
i wtedy pytamy, czy to się w ogóle opłaca.
</div>

</div>
</div>

Note:
Ostatnie kryterium jest pytaniem projektowym, nie implementacyjnym. Dobra odpowiedź:
odbiorca obsługuje obie wersje przez jeden cykl wydawniczy, potem usuwa starą.
To jest ten sam mechanizm co upcasting zdarzeń. Jeśli grupa zna Event Sourcing, nawiąż.
