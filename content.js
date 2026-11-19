(() => {
  const config = globalThis.YT_SHORTS_REMOVER_CONFIG || {};
  if (!config.enabled) return;

  const root = document.documentElement;
  root.classList.add("ytsr-enabled");
  if (config.hideShelves) root.classList.add("ytsr-hide-shelves");
  if (config.hideSidebarLink) root.classList.add("ytsr-hide-sidebar");
  if (config.hideIndividualShorts) root.classList.add("ytsr-hide-individual");
  if (config.hideChannelTab) root.classList.add("ytsr-hide-channel-tab");
  if (config.hideMembershipsPromo) root.classList.add("ytsr-hide-memberships");

  function redirectIfShortsUrl() {
    if (!config.redirectShortsToWatch) return;
    const match = window.location.pathname.match(/^\/shorts\/([a-zA-Z0-9_-]+)/);
    if (match) {
      const videoId = match[1];
      const targetUrl = `${window.location.origin}/watch?v=${videoId}${window.location.search ? "&" + window.location.search.slice(1) : ""}`;
      window.location.replace(targetUrl);
    }
  }

  // Natychmiastowe przekierowanie przy wejściu na /shorts/...
  redirectIfShortsUrl();

  function hideElement(el) {
    if (!el || el.classList.contains("ytsr-hidden")) return;
    el.classList.add("ytsr-hidden");
  }

  function cleanShortsFromDom() {
    if (config.hideShelves) {
      const shelves = document.querySelectorAll(
        "ytd-reel-shelf-renderer, ytd-rich-shelf-renderer[is-shorts], ytm-reel-shelf-renderer"
      );
      for (const shelf of shelves) {
        const section = shelf.closest("ytd-rich-section-renderer");
        hideElement(section || shelf);
      }

      // Nowsze komponenty YouTube (grid-shelf-view-model)
      const viewModels = document.querySelectorAll("grid-shelf-view-model");
      for (const vm of viewModels) {
        if (
          vm.querySelector('ytm-shorts-lockup-view-model, ytm-shorts-lockup-view-model-v2, a[href^="/shorts/"]')
        ) {
          hideElement(vm.closest("ytd-rich-section-renderer") || vm);
        }
      }
    }

    if (config.hideSidebarLink) {
      const guideLinks = document.querySelectorAll(
        'ytd-guide-entry-renderer a[title="Shorts"], ytd-mini-guide-entry-renderer a[title="Shorts"], ytd-guide-entry-renderer a[href^="/shorts"], ytd-mini-guide-entry-renderer a[href^="/shorts"]'
      );
      for (const link of guideLinks) {
        const entry = link.closest("ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer");
        hideElement(entry || link);
      }

      // Dolny pasek nawigacji na m.youtube.com
      const mobilePivotItems = document.querySelectorAll("ytm-pivot-bar-item-renderer");
      for (const item of mobilePivotItems) {
        if (item.textContent && item.textContent.trim() === "Shorts") {
          hideElement(item);
        }
      }
    }

    if (config.hideChannelTab) {
      const tabs = document.querySelectorAll("yt-tab-shape, tp-yt-paper-tab");
      for (const tab of tabs) {
        const title = tab.getAttribute("tab-title") || tab.textContent?.trim();
        if (title === "Shorts") {
          hideElement(tab);
        }
      }
    }

    if (config.hideIndividualShorts) {
      const shortLinks = document.querySelectorAll('a[href^="/shorts/"]');
      for (const link of shortLinks) {
        const card = link.closest(
          "ytd-video-renderer, ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytm-video-with-context-renderer, ytm-rich-item-renderer, ytm-compact-video-renderer, ytm-video-card-renderer, ytm-shorts-lockup-view-model, ytm-shorts-lockup-view-model-v2"
        );
        if (card) {
          hideElement(card);
        }
      }
    }

    if (config.hideMembershipsPromo) {
      const sections = document.querySelectorAll(
        "ytd-rich-section-renderer, ytd-item-section-renderer, ytd-shelf-renderer, ytd-rich-shelf-renderer, grid-shelf-view-model, ytd-statement-banner-renderer"
      );
      for (const section of sections) {
        const headings = section.querySelectorAll(
          '#title, #title-text, #header-text, h2, yt-formatted-string#title, [role="heading"]'
        );
        for (const heading of headings) {
          if (heading.textContent?.trim().toLowerCase() === "get more from memberships") {
            const wrapper = section.closest("ytd-rich-section-renderer, ytd-item-section-renderer");
            hideElement(wrapper || section);
            break;
          }
        }
      }
    }

    ensureGeminiButton();
    ensureGeminiCardButtons();
  }

  const GEMINI_ICON_SVG = `
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/>
    </svg>
    <span>Podsumuj w Gemini</span>
  `;

  function openGeminiSummary(rawHref) {
    let videoUrl = rawHref;
    try {
      const parsed = new URL(rawHref, window.location.origin);
      const videoId = parsed.searchParams.get("v");
      if (videoId) {
        videoUrl = `${window.location.origin}/watch?v=${videoId}`;
      }
    } catch {
      // zostaw rawHref jako fallback
    }

    const template =
      config.geminiPromptTemplate || "Podsumuj to wideo w punktach po polsku: {url}";
    const prompt = template.replace("{url}", videoUrl);

    // Kopia zapasowa do schowka na wypadek zmian w UI Gemini
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(prompt).catch(() => {});
    }

    const geminiUrl = `https://gemini.google.com/app#ytsr_prompt=${encodeURIComponent(prompt)}`;
    window.open(geminiUrl, "_blank", "noopener");
  }

  function ensureGeminiButton() {
    if (!config.showGeminiButton) return;
    if (window.location.pathname !== "/watch") return;

    const actionsContainer =
      document.querySelector("ytd-watch-metadata #actions #top-level-buttons-computed") ||
      document.querySelector(".slim-video-action-bar-actions");

    if (!actionsContainer || document.getElementById("ytsr-gemini-btn")) return;

    const btn = document.createElement("button");
    btn.id = "ytsr-gemini-btn";
    btn.type = "button";
    btn.title = "Otwórz podsumowanie wideo w Google Gemini";
    btn.innerHTML = GEMINI_ICON_SVG;

    btn.addEventListener("click", () => {
      openGeminiSummary(window.location.href);
    });

    actionsContainer.appendChild(btn);
  }

  function ensureGeminiCardButtons() {
    if (!config.showGeminiCardButton) return;

    const cards = document.querySelectorAll(
      "ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-video-renderer, ytm-video-with-context-renderer, ytm-rich-item-renderer, ytm-compact-video-renderer, ytm-video-card-renderer"
    );

    for (const card of cards) {
      if (card.classList.contains("ytsr-hidden")) continue;
      const outerCard = card.closest("ytm-rich-item-renderer, ytd-rich-item-renderer") || card;
      if (outerCard.querySelector(".ytsr-card-gemini-btn")) continue;

      const watchLink = card.querySelector('a[href*="/watch?v="]');
      if (!watchLink) continue;

      const metaContainer =
        card.querySelector(".yt-lockup-metadata-view-model__text-container") ||
        card.querySelector("yt-lockup-metadata-view-model") ||
        card.querySelector("#meta") ||
        card.querySelector("#details") ||
        card.querySelector(".media-item-info") ||
        card.querySelector(".details");

      if (!metaContainer) continue;

      const btn = document.createElement("button");
      btn.className = "ytsr-card-gemini-btn";
      btn.type = "button";
      btn.title = "Otwórz podsumowanie wideo w Google Gemini";
      btn.innerHTML = GEMINI_ICON_SVG;

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openGeminiSummary(watchLink.href);
      });

      metaContainer.appendChild(btn);
    }
  }

  let scheduled = false;
  function scheduleClean() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      cleanShortsFromDom();
    });
  }

  const observer = new MutationObserver(scheduleClean);

  function startObserving() {
    if (!document.body) return;
    cleanShortsFromDom();
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startObserving, { once: true });
  } else {
    startObserving();
  }

  // Obsługa nawigacji SPA w YouTube
  window.addEventListener("yt-navigate-start", redirectIfShortsUrl);
  window.addEventListener("yt-navigate-finish", () => {
    redirectIfShortsUrl();
    scheduleClean();
  });
  window.addEventListener("popstate", () => {
    redirectIfShortsUrl();
    scheduleClean();
  });
})();

