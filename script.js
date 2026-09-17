const SAMPLE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Hello</title>
  <style>
    body { font-family: system-ui, sans-serif; display: grid; place-items: center; height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
    h1 { font-size: 3rem; margin: 0; }
    p { opacity: .85; }
  </style>
</head>
<body>
  <div style="text-align:center">
    <h1>👋 Hello, World!</h1>
    <p>Edit the code on the left, then hit Preview.</p>
  </div>
</body>
</html>`;

const $ = (id) => document.getElementById(id);
const editor = $("editor");
const preview = $("preview");
const lineNumbers = $("lineNumbers");
const fileName = $("fileName");
const charCount = $("charCount");
const workspace = $("workspace");
const toastEl = $("toast");

let wrap = false;
let view = "split";
let fileNameVal = "untitled.html";

editor.value = SAMPLE;

/* Toast */
let toastTimer;
function toast(msg, isError = false) {
  toastEl.textContent = msg;
  toastEl.classList.toggle("error", isError);
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

/* Line numbers */
function updateLineNumbers() {
  const lines = editor.value.split("\n").length;
  let nums = "";
  for (let i = 1; i <= lines; i++) nums += i + "\n";
  lineNumbers.textContent = nums;
  charCount.textContent = editor.value.length + " chars";
}

/* Sync scroll */
editor.addEventListener("scroll", () => {
  lineNumbers.scrollTop = editor.scrollTop;
});

/* Live preview (debounced) */
let previewTimer;
function schedulePreview() {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(renderPreview, 300);
}

function renderPreview() {
  preview.srcdoc = editor.value;
}

editor.addEventListener("input", () => {
  updateLineNumbers();
  schedulePreview();
});

/* Open file */
$("openBtn").addEventListener("click", () => $("fileInput").click());
$("fileInput").addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  fileNameVal = file.name;
  fileName.textContent = file.name;
  const reader = new FileReader();
  reader.onload = (ev) => {
    editor.value = String(ev.target?.result ?? "");
    updateLineNumbers();
    renderPreview();
    toast("Opened: " + file.name);
  };
  reader.readAsText(file);
  e.target.value = "";
});

/* Open in new tab (about:blank) */
function openInNewTab() {
  const w = window.open("about:blank", "_blank");
  if (!w) { toast("Popup blocked — allow popups", true); return; }
  w.document.open();
  w.document.write(editor.value);
  w.document.close();
}
$("newTabBtn").addEventListener("click", openInNewTab);
$("openTabSmall").addEventListener("click", openInNewTab);

/* Save */
$("saveBtn").addEventListener("click", () => {
  const blob = new Blob([editor.value], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileNameVal || "untitled.html";
  a.click();
  URL.revokeObjectURL(url);
  toast("Saved");
});

/* Copy */
$("copyBtn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(editor.value);
    toast("Copied to clipboard");
  } catch {
    toast("Copy failed", true);
  }
});

/* Wrap toggle */
$("wrapBtn").addEventListener("click", (e) => {
  wrap = !wrap;
  editor.classList.toggle("wrap", wrap);
  e.target.textContent = "Wrap: " + (wrap ? "On" : "Off");
});

/* Clear */
$("clearBtn").addEventListener("click", () => {
  editor.value = "";
  updateLineNumbers();
  renderPreview();
});

/* Refresh */
$("refreshBtn").addEventListener("click", renderPreview);

/* View switch */
document.querySelectorAll(".view-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".view-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    view = btn.dataset.view;
    workspace.className = "workspace " + view;
  });
});

/* Tab key inserts 2 spaces */
editor.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    const s = editor.selectionStart, en = editor.selectionEnd;
    editor.value = editor.value.slice(0, s) + "  " + editor.value.slice(en);
    editor.selectionStart = editor.selectionEnd = s + 2;
    updateLineNumbers();
    schedulePreview();
  }
});

/* Init */
updateLineNumbers();
renderPreview();
