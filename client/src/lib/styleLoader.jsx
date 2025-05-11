// utils/styleLoader.js
export function loadStyle(id, href) {
  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

export function unloadStyle(id) {
  const existing = document.getElementById(id);
  if (existing) {
    document.head.removeChild(existing);
  }
}
