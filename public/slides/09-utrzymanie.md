<!-- .slide: class="section-divider" data-background-color="#2c3e50" -->
<span class="kicker">Blok 9</span>
# Utrzymanie

<p class="subtitle">Automatyzacja · Niezależne wdrożenia · Izolacja awarii · Observability</p>

---

## Automatyzacja nie jest dodatkiem

<div class="cols">
<div>

Bez automatyzacji zarządzanie wieloma mikrofrontendami staje się
**koszmarem operacyjnym**. Cztery obszary:

**1. Budowanie i testowanie**
Potok CI dla **każdego** mikrofrontendu: testy jednostkowe,
analiza statyczna, artefakt wdrożeniowy, testy integracyjne, e2e.

**2. Wdrożenia**
Potok CD: po przejściu testów artefakt trafia automatycznie
na środowisko. Wdrożenie staje się **rutyną**, nie wydarzeniem.

</div>
<div>

**3. Infrastruktura jako kod**
Terraform, Kubernetes: środowiska w plikach konfiguracyjnych,
wersjonowane i odtwarzalne. Każde środowisko (dev, stage, prod) spójne.

**4. Centralne logowanie i monitoring**
Każdy mikrofrontend automatycznie wysyła logi i metryki
do jednego systemu (ELK, Prometheus/Grafana).

<div class="callout warn">
<span class="label">Bez tego</span>
Automatyzacja jest <strong>fundamentem</strong>, nie opcją. To ona umożliwia
niezależne, szybkie i bezpieczne wdrożenia, czyli główną korzyść z mikrofrontendów.
Bez niej zostaje sama złożoność.
</div>

</div>
</div>

Note:
Zapytaj konkretnie, co z tych czterech mają dziś. Przy dwóch MF-ach zwykle jest 1 i 2,
a brakuje 4. To jest dobra lista do zabrania na retrospektywę.

---

## Niezależne wdrożenia - cztery konsekwencje

<div class="dense">

| | Bez mikrofrontendów | Z mikrofrontendami |
| --- | --- | --- |
| **Cykle wydawnicze** | wszyscy zsynchronizowani z jednym cyklem; nowa funkcja to tygodnie | **asynchroniczne** - zespół wdraża niezależnie |
| **Częstotliwość** | rzadkie, duże wdrożenia → więcej skumulowanych zmian → większe ryzyko | **częstsze i mniejsze** - łatwiejsze do zdiagnozowania i wycofania |
| **Izolacja błędów** | błąd w jednej części kładzie całość | awaria modułu płatności nie psuje reszty strony |
| **Zasoby** | wdrożenie całości na dużej maszynie, nawet przy małej zmianie | wdrożenie i skalowanie tylko tego, co się zmieniło |

</div>

<div class="callout tip">
<span class="label">Zależność</span>
Wszystkie cztery korzyści są <strong>konsekwencją</strong> punktu pierwszego z poprzedniego slajdu.
Bez zautomatyzowanego CI/CD żadna z nich nie nadchodzi.
</div>

Note:
„Częstsze i mniejsze wdrożenia" to jest ta korzyść, którą najłatwiej zmierzyć i którą możesz
zaproponować jako metrykę sukcesu w ADR z bloku 3. Deployment Frequency z DORA.

---

## Izolacja awarii - na trzech poziomach

<div class="cols">
<div>

**1. Na poziomie wdrożenia**
Błąd w nowej wersji jednego mikrofrontendu dotyka **tylko jego**.
Nie trzeba wycofywać całej aplikacji; użytkownicy wciąż korzystają z reszty.

**2. W czasie rzeczywistym**
Gdy mikrofrontend wywróci się w runtime, można go **bezpiecznie ukryć**
albo pokazać prosty komunikat zamiast pustej strony albo błędu 500.

**3. Circuit Breaker**
Gdy remote przestaje odpowiadać, „bezpiecznik" **otwiera się i od razu zwraca błąd**,
zamiast czekać w nieskończoność. System nie obciąża uszkodzonego serwisu i nie blokuje reszty.

</div>
<div>

```ts
// shell: opakowanie ładowania remote'a
async function loadRemoteSafely<T>(
  load: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await withTimeout(load(), 3_000);
  } catch (error) {
    reportRemoteFailure(error);   // → observability
    // → degradacja, nie awaria
    return fallback;
  }
}
```

<div class="callout warn">
<span class="label">Pytanie z ćwiczenia 4</span>
„Zabijcie remote'a i odświeżcie stronę." Jeśli wtedy padła <strong>cała aplikacja</strong>,
to znaczy, że nie macie izolacji awarii, tylko <strong>rozproszony monolit</strong>
z dodatkowym punktem awarii.
</div>

</div>
</div>

Note:
To jest domknięcie ćwiczenia 4. Wróć do tego, co wtedy zobaczyli. Jeśli komuś padła cała
aplikacja, świetnie: masz żywy przykład. Izolacja awarii jest jedyną korzyścią z MF,
która nie przychodzi sama: trzeba ją zaprogramować.

---

## Observability - trzy filary

<div class="cols">
<div>

**Logi**
Każdy mikrofrontend wysyła logi do centralnego systemu (ELK, Splunk).
Muszą zawierać **ID korelacji transakcji**, dzięki któremu odtworzycie
ścieżkę użytkownika przez wiele mikrofrontendów i zobaczycie,
gdzie wystąpił błąd.

**Metryki**
Czas odpowiedzi, liczba błędów, użycie zasobów, per mikrofrontend.
Pulpity (Prometheus/Grafana) dają całościowy obraz i pomagają wykrywać anomalie.

**Ślady (traces)**
Najbardziej zaawansowany filar: śledzenie, jak **pojedyncze żądanie**
przechodzi przez różne mikrofrontendy.

</div>
<div>

<div class="callout task">
<span class="label">Problem, który to rozwiązuje</span>
W monolicie wystarczy monitorować jeden proces.
<br/>Przy mikrofrontendach jedna akcja użytkownika
(„dodaj do koszyka") przechodzi przez kilka niezależnych aplikacji.
<br/><strong>Bez korelacji nie da się ustalić, która zawiodła.</strong>
</div>

<div class="callout tip">
<span class="label">Minimum na start</span>
Jedno <code>traceparent</code> (W3C Trace Context) generowane w shellu
i przekazywane do każdego remote'a oraz do backendu.
<br/>Jedna decyzja, a daje korelację przez cały system.
</div>

**Wspólne standardy.** Bez nich każdy zespół użyje innych narzędzi
i całość przestanie się składać w obraz.

</div>
</div>

Note:
W3C Trace Context to konkret, który można wdrożyć w tydzień i który zwraca się natychmiast
przy pierwszym incydencie. Jeśli zostanie czas, to jest dobry temat na ćwiczenie dodatkowe.
