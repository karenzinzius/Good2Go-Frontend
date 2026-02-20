const root = document.documentElement;

// Apply saved theme first
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  root.setAttribute('data-theme', savedTheme);
} else {
  // Otherwise, use system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
}

// DaisyUI toggle listener
const toggle = document.querySelector<HTMLInputElement>('input[data-toggle-theme]');
toggle?.addEventListener('change', () => {
  localStorage.setItem('theme', root.getAttribute('data-theme')!);
});
