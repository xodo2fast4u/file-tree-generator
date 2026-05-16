let currentFiles = [];
const folderInput = document.getElementById("folderInput");
const treeOutput = document.getElementById("treeOutput");
const outputActions = document.getElementById("outputActions");
const emptyState = document.getElementById("emptyState");
const foldersOnlyCheckbox = document.getElementById("foldersOnly");
const showHiddenCheckbox = document.getElementById("showHidden");

folderInput.addEventListener("change", (e) => {
  currentFiles = Array.from(e.target.files);
  processFiles();
});

function processFiles() {
  if (currentFiles.length === 0) return;

  const foldersOnly = foldersOnlyCheckbox.checked;
  const showHidden = showHiddenCheckbox.checked;
  const tree = {};

  currentFiles.forEach((file) => {
    const pathParts = file.webkitRelativePath.split("/");

    if (pathParts.includes("node_modules")) return;
    if (pathParts[pathParts.length - 1] === "package-lock.json") return;
    if (!showHidden && pathParts.some((part) => part.startsWith("."))) return;

    let currentLevel = tree;
    pathParts.forEach((part, index) => {
      const isLast = index === pathParts.length - 1;

      if (foldersOnly && isLast && index !== 0) return;

      if (!currentLevel[part]) {
        currentLevel[part] = {};
      }
      currentLevel = currentLevel[part];
    });
  });

  setTimeout(() => {
    const treeText = renderTree(tree);
    treeOutput.textContent = treeText;
    emptyState.style.display = "none";
    outputActions.style.display = "block";
  }, 0);
}

function renderTree(obj, prefix = "") {
  let result = "";
  const keys = Object.keys(obj);

  keys.forEach((key, index) => {
    const isLast = index === keys.length - 1;
    const connector = isLast ? "\u2514\u2500\u2500 " : "\u251C\u2500\u2500 ";
    const label = prefix === "" ? `${key} (Root)` : key;

    result += prefix + connector + label + "\n";

    const newPrefix = prefix + (isLast ? "    " : "\u2502   ");
    result += renderTree(obj[key], newPrefix);
  });

  return result;
}

function copyToClipboard() {
  const text = treeOutput.textContent;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(showToast)
      .catch(() => {
        fallbackCopy(text);
      });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    showToast();
  } catch (err) {
    console.error("Unable to copy", err);
  }
  document.body.removeChild(textarea);
}

function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function resetState() {
  currentFiles = [];
  folderInput.value = "";
  treeOutput.textContent = "";
  emptyState.style.display = "flex";
  outputActions.style.display = "none";
}
