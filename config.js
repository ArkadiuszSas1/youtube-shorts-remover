// Konfiguracja wtyczki YouTube Shorts Remover.
// Po zmianie ustawień przeładuj wtyczkę w chrome://extensions i odśwież YouTube.

globalThis.YT_SHORTS_REMOVER_CONFIG = {
  // Główny wyłącznik wtyczki (true = włączona, false = wyłączona)
  enabled: true,

  // Ukrywaj półki z Shortsami na stronie głównej, w subskrypcjach itp.
  hideShelves: true,

  // Ukrywaj przycisk "Shorts" w menu bocznym (oraz dolnym pasku na m.youtube.com)
  hideSidebarLink: true,

  // Ukrywaj pojedyncze filmy Shorts w wynikach wyszukiwania, polecanych i na kanałach
  hideIndividualShorts: true,

  // Ukrywaj zakładkę "Shorts" na stronach kanałów
  hideChannelTab: true,

  // Ukrywaj sekcję "Get more from memberships"
  hideMembershipsPromo: true,

  // Przekierowuj linki /shorts/<id> na zwykły odtwarzacz /watch?v=<id>
  redirectShortsToWatch: true,

  // Pokazuj przycisk "Podsumuj w Gemini" pod filmem (na stronie /watch)
  showGeminiButton: true,

  // Pokazuj przycisk "Podsumuj w Gemini" pod każdym filmem na stronie głównej i listach
  showGeminiCardButton: true,

  // Automatycznie wyślij prompt po otwarciu Gemini (false = tylko wklei tekst)
  geminiAutoSend: true,

  // Szablon promptu wysyłanego do Gemini ({url} zostanie zastąpione linkiem do filmu)
  geminiPromptTemplate: "Podsumuj to wideo w punktach po polsku: {url}"
};

