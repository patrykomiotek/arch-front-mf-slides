<!-- .slide: class="section-divider" data-background-color="#2c3e50" -->
<span class="kicker">Blok 4</span>
# Jak się składa mikrofrontendy

<p class="subtitle">Build-time · Server-side · Client-side</p>

---

## Trzy momenty, w których można złożyć UI

<div class="dense">

| | **Build-time** | **Server-side** | **Client-side** |
| --- | --- | --- | --- |
| Kiedy | podczas budowania | na serwerze, przed wysłaniem | w przeglądarce |
| Jak | pakiet npm, biblioteka | kompozytor składa fragmenty HTML | shell ładuje zdalne moduły |
| Niezależne wdrożenie | **nie** - trzeba przebudować shell | tak | tak |
| SEO / pierwsze ładowanie | dobre | **najlepsze** | słabsze |
| Interaktywność | pełna | ograniczona bez JS | **pełna** |
| Złożoność | najniższa | serwer kompozytora | złożoność w kliencie |

</div>

<div class="callout warn">
<span class="label">Build-time to nie są mikrofrontendy</span>
Jeśli wdrożenie „mikrofrontendu" wymaga <strong>przebudowania shella</strong>,
nie kupiliście niezależności wdrożeniowej, tylko podział katalogów.
To bywa dobra decyzja, ale nazywajmy ją <strong>biblioteką</strong>.
</div>

Note:
Ten slajd rozstrzyga wiele nieporozumień. Zapytaj grupę, do której kolumny należą
ich dwa istniejące mikrofrontendy. Jeśli padnie odpowiedź „build-time", to jest właśnie
ten moment, w którym wracasz do „testu jednego pytania".

---

## Integracja server-side

<div class="cols">
<div>

**Jak to działa**

1. **Żądanie** - przeglądarka pyta serwer-kompozytor
2. **Kompozycja** - kompozytor, zależnie od URL-a, pobiera fragmenty HTML z różnych mikrofrontendów (nagłówek, koszyk, lista produktów)
3. **Stitching** - łączy fragmenty w jeden dokument
4. **Odpowiedź** - przeglądarka dostaje gotową, złożoną stronę

</div>
<div>

<div class="tradeoff">
<div class="pros">
<h4>Zalety</h4>

- szybkie pierwsze ładowanie, dobre dla SEO
- prostsza obsługa stanu (po stronie serwera)
- niezależne zespoły i wdrożenia
- działa bez JS

</div>
<div class="cons">
<h4>Wady</h4>

- dodatkowy serwer-kompozytor
- zmiany w warstwie kompozycji wymagają synchronizacji
- opóźnienie: czekamy na wszystkie fragmenty
- ograniczona interaktywność bez JS

</div>
</div>

</div>
</div>

Note:
Dla aplikacji wewnętrznej (a taka jest u Łukasiewicza) SEO nie jest argumentem,
a serwer-kompozytor to realny koszt. Powiedz to wprost: to nie jest ich droga.
Trzeba je znać, żeby świadomie odrzucić.

---

## Integracja client-side - Wasza droga

<div class="cols">
<div>

**Jak to działa**

1. **Żądanie** - serwer odpowiada minimalnym HTML-em (*shell*, *container*)
2. **Pobieranie** - shell na podstawie swojej logiki ściąga JS i CSS kolejnych mikrofrontendów
3. **Kompozycja w przeglądarce** - kod MF renderuje się w wyznaczone miejsca w DOM
4. **Stan** - komunikacja przez zdarzenia, event bus albo współdzielony stan

</div>
<div>

<div class="tradeoff">
<div class="pros">
<h4>Zalety</h4>

- pełna niezależność zespołów i wdrożeń
- każdy MF może mieć własny framework
- prosta infrastruktura serwerowa
- pełna interaktywność

</div>
<div class="cons">
<h4>Wady</h4>

- większy bundle, wolniejsze pierwsze ładowanie
- złożoność przeniesiona do przeglądarki
- ryzyko konfliktów zależności
- koordynacja danych między MF bywa trudna

</div>
</div>

</div>
</div>

<div class="callout tip">
<span class="label">To jest kontekst dla Module Federation</span>
Punkt 2, czyli „shell ściąga kod kolejnych mikrofrontendów", jest dokładnie tym,
co Module Federation automatyzuje i czyni bezpiecznym.
</div>

Note:
Most do następnego bloku. Powiedz wprost: wszystko, co teraz zobaczymy,
rozwiązuje problemy z prawej kolumny, zwłaszcza „ryzyko konfliktów zależności".
