:root {
  /* spacing */
  --space-0: 0;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  /* radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;

  /* z-index */
  --z-nav: 1000;
  --z-sidebar: 900;

  /* typography */
  --font-sans: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, "Noto Sans", "Helvetica Neue", sans-serif;
  --fs-sm: 0.875rem;
  --fs-md: 1rem;
  --fs-lg: 1.125rem;
  --fs-xl: 1.25rem;

  /* light theme */
  --bg: #ffffff;
  --bg-soft: #f7f7f9;
  --text: #111827;
  --muted: #6b7280;
  --border: #e5e7eb;
  --primary: #2563eb;
  --primary-contrast: #ffffff;
}

:root[data-theme="dark"] {
  --bg: #0b0f14;
  --bg-soft: #111827;
  --text: #e5e7eb;
  --muted: #9ca3af;
  --border: #1f2937;
  --primary: #60a5fa;
  --primary-contrast: #0b0f14;
}
