"use client";

// Must match the inline script in app/layout.tsx that applies the stored choice before first paint.
const STORAGE_KEY = "theme";

// No React state: the icon and label are picked by CSS from <html data-theme> (see globals.css),
// so server HTML, first paint and hydration always agree.
export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    // Light is the default: no stored choice means light, whatever the OS prefers.
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage blocked (private mode): the choice still applies until the page is left.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="relative grid size-[30px] place-items-center rounded-full text-fg shadow-hairline before:absolute before:-inset-1.5 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
    >
      <span className="theme-light-only">
        <span className="sr-only">다크 모드로 전환</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      </span>
      <span className="theme-dark-only">
        <span className="sr-only">라이트 모드로 전환</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      </span>
    </button>
  );
}
