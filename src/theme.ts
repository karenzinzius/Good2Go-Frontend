const root = document.documentElement;
const btn = document.getElementById("theme-toggle");
const icon = document.getElementById("theme-icon");

// load theme
const savedTheme = localStorage.getItem("theme");
let currentTheme =
  savedTheme ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

root.setAttribute("data-theme", currentTheme);
icon!.textContent = currentTheme === "dark" ? "☾" : "☀︎";

btn?.addEventListener("click", () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";

  root.setAttribute("data-theme", currentTheme);
  localStorage.setItem("theme", currentTheme);

  // smooth icon swap
  icon!.classList.add("scale-0", "rotate-90");

  setTimeout(() => {
    icon!.textContent = currentTheme === "dark" ? "☾" : "☀︎";
    icon!.classList.remove("scale-0", "rotate-90");
  }, 150);
});