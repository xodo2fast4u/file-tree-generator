let currentFiles = [];
const folderInput = document.getElementById("folderInput");
const treeOutput = document.getElementById("treeOutput");
const outputActions = document.getElementById("outputActions");
const foldersOnlyCheckbox = document.getElementById("foldersOnly");

folderInput.addEventListener("change", (e) => {
  currentFiles = Array.from(e.target.files);
  processFiles();
});

function processFiles() {
  if (currentFiles.length === 0) return;

  const foldersOnly = foldersOnlyCheckbox.checked;
  const tree = {};

  currentFiles.forEach((file) => {
    const pathParts = file.webkitRelativePath.split("/");

    if (pathParts.some((part) => part.startsWith("."))) return;

    let currentLevel = tree;
    pathParts.forEach((part, index) => {
      const isLast = index === pathParts.length - 1;
      const isFolder = !isLast || file.name === "";

      if (foldersOnly && isLast && index !== 0) return;

      if (!currentLevel[part]) {
        currentLevel[part] = {};
      }
      currentLevel = currentLevel[part];
    });
  });

  const treeText = renderTree(tree);
  treeOutput.textContent = treeText;
  outputActions.style.display = "block";
}

function renderTree(obj, prefix = "") {
  let result = "";
  const keys = Object.keys(obj);

  keys.forEach((key, index) => {
    const isLast = index === keys.length - 1;
    const connector = isLast ? "└── " : "├── ";

    const label = prefix === "" ? `${key} (Root)` : key;

    result += prefix + connector + label + "\n";

    const newPrefix = prefix + (isLast ? "    " : "│   ");
    result += renderTree(obj[key], newPrefix);
  });

  return result;
}

function copyToClipboard() {
  const text = treeOutput.textContent;
  const textarea = document.createElement("textarea");
  textarea.value = text;
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
  treeOutput.innerHTML = `
                <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-18 0A2.25 2.25 0 0 0 5.25 15h13.5A2.25 2.25 0 0 0 21 12.75m-18 0V17.25A2.25 2.25 0 0 0 5.25 19.5h13.5A2.25 2.25 0 0 0 21 17.25V12.75m-18 0V12a2.25 2.25 0 0 1 2.25-2.25H15M5.25 15V12m0 3h13.5m0 0V12m-13.5 0h13.5" />
                    </svg>
                    <p>No folder selected. Select a directory to generate its tree diagram.</p>
                </div>`;
  outputActions.style.display = "none";
}
