# YouTube Shorts Remover

Prosta wtyczka do Chrome (Manifest V3) usuwająca sekcję Shorts z YouTube, bez potrzeby budowania projektu.

## Instalacja w Chrome

1. Otwórz `chrome://extensions` w przeglądarce Chrome.
2. Włącz **Tryb dewelopera** (przełącznik w prawym górnym rogu).
3. Kliknij **Wczytaj rozpakowane** (*Load unpacked*) i wybierz ten folder (`ChromePlugin`).
4. Odśwież kartę z YouTube.

## Konfiguracja

Wszystkie opcje znajdują się w pliku `config.js`:

- `enabled` — główny wyłącznik wtyczki (`true` / `false`)
- `hideShelves` — ukrywa półki z Shorts na stronie głównej, w subskrypcjach i w wyszukiwarce
- `hideSidebarLink` — ukrywa przycisk *Shorts* w menu bocznym
- `hideIndividualShorts` — ukrywa pojedyncze kafelki Shorts w wynikach wyszukiwania i polecanych
- `hideChannelTab` — ukrywa zakładkę *Shorts* na profilach kanałów
- `hideMembershipsPromo` — ukrywa sekcję *Get more from memberships*
- `redirectShortsToWatch` — automatycznie przekierowuje linki `/shorts/<id>` na zwykły odtwarzacz `/watch?v=<id>`
- `showGeminiButton` — dodaje przycisk *Podsumuj w Gemini* pod filmem na stronie `/watch`
- `showGeminiCardButton` — dodaje przycisk *Podsumuj w Gemini* pod kafelkami filmów na stronie głównej i listach
- `geminiAutoSend` — automatycznie wysyła prompt po otwarciu nowej karty Gemini
- `geminiPromptTemplate` — treść promptu (`{url}` zostaje zamienione na link do filmu)

Po edycji `config.js` kliknij ikonę odświeżenia przy wtyczce w `chrome://extensions` oraz odśwież YouTube.

