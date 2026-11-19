(() => {
  const HASH_PREFIX = "#ytsr_prompt=";
  if (!window.location.hash.startsWith(HASH_PREFIX)) return;

  const config = globalThis.YT_SHORTS_REMOVER_CONFIG || {};
  const rawPrompt = window.location.hash.slice(HASH_PREFIX.length);
  let prompt = "";
  try {
    prompt = decodeURIComponent(rawPrompt);
  } catch {
    return;
  }
  if (!prompt.trim()) return;

  // Wyczyść hash z URL, żeby odświeżenie strony nie wysłało promptu ponownie
  history.replaceState(null, "", window.location.pathname + window.location.search);

  const EDITOR_SELECTORS = [
    'rich-textarea .ql-editor[contenteditable="true"]',
    'rich-textarea [contenteditable="true"]',
    'div.ql-editor[contenteditable="true"]',
    '[role="textbox"][contenteditable="true"]',
    "textarea"
  ];

  const SEND_BUTTON_SELECTORS = [
    "button.send-button:not([disabled])",
    'button[data-test-id="send-button"]:not([disabled])',
    'button[aria-label*="Send"]:not([disabled])',
    'button[aria-label*="Wyślij"]:not([disabled])'
  ];

  function findEditor() {
    for (const sel of EDITOR_SELECTORS) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  function findSendButton() {
    for (const sel of SEND_BUTTON_SELECTORS) {
      const el = document.querySelector(sel);
      if (el && el.getAttribute("aria-disabled") !== "true") return el;
    }
    return null;
  }

  function insertPrompt(editor, text) {
    editor.focus();

    if (editor.tagName === "TEXTAREA") {
      editor.value = text;
      editor.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }

    // Wyczyść ewentualny placeholder i wstaw tekst przez execCommand (najlepiej działa z Quill/Angular)
    document.execCommand("selectAll", false, null);
    const inserted = document.execCommand("insertText", false, text);

    if (!inserted || !editor.textContent.trim()) {
      editor.textContent = text;
      editor.dispatchEvent(
        new InputEvent("input", {
          bubbles: true,
          cancelable: true,
          data: text,
          inputType: "insertText"
        })
      );
    }
  }

  function tryAutoSend(attemptsLeft = 20) {
    if (config.geminiAutoSend === false) return;
    const sendBtn = findSendButton();
    if (sendBtn) {
      sendBtn.click();
      return;
    }
    if (attemptsLeft > 0) {
      setTimeout(() => tryAutoSend(attemptsLeft - 1), 150);
    }
  }

  let handled = false;
  function attemptFill() {
    if (handled) return true;
    const editor = findEditor();
    if (!editor) return false;

    handled = true;
    insertPrompt(editor, prompt);
    setTimeout(() => tryAutoSend(), 200);
    return true;
  }

  if (!attemptFill()) {
    const observer = new MutationObserver(() => {
      if (attemptFill()) {
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    // Zatrzymaj obserwator po 15 sekundach, gdyby strona nie załadowała edytora
    setTimeout(() => observer.disconnect(), 15000);
  }
})();
