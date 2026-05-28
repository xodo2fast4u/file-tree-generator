let currentFiles = [];
let cachedTree = null;
const folderInput = document.getElementById('folderInput');
const treeOutput = document.getElementById('treeOutput');
const outputActions = document.getElementById('outputActions');
const emptyState = document.getElementById('emptyState');
const foldersOnlyCheckbox = document.getElementById('foldersOnly');
const showHiddenCheckbox = document.getElementById('showHidden');

const ALWAYS_EXCLUDE_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  '.venv',
  'venv',
  'dist',
  'build',
  '.cache',
  '.webpack',
  'coverage',
  '.nyc_output',
  'out',
  '.turbo',
  '.vercel',
  '__pycache__',
  '.pytest_cache',
  'target',
  '.gradle',
  '.idea',
  '.vscode',
  '.DS_Store',
  'Thumbs.db',
  '.parcel-cache',
  '.eslintcache',
  '.swc',
  '.cargo',
  'dist-types',
]);

const ALWAYS_EXCLUDE_FILES = new Set([
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'bun.lockb',
  '.DS_Store',
  'Thumbs.db',
  'next-env.d.ts',
]);

folderInput.addEventListener('change', (e) => {
  currentFiles = Array.from(e.target.files);
  processFiles();
});

function processFiles() {
  if (currentFiles.length === 0) return;

  const foldersOnly = foldersOnlyCheckbox.checked;
  const showHidden = showHiddenCheckbox.checked;

  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    const tree = buildTree(currentFiles, foldersOnly, showHidden);
    cachedTree = tree;

    const treeText = renderTreeOptimized(tree);

    treeOutput.innerHTML = '';
    treeOutput.textContent = treeText;

    emptyState.style.display = 'none';
    outputActions.style.display = 'block';

    document.body.style.overflow = '';
  });
}

function shouldExcludePath(pathParts) {
  const fileCount = pathParts.length;

  for (let i = 0; i < fileCount; i++) {
    const part = pathParts[i];

    if (ALWAYS_EXCLUDE_DIRS.has(part)) {
      return true;
    }
  }

  return false;
}

function shouldExcludeFile(fileName) {
  if (ALWAYS_EXCLUDE_FILES.has(fileName)) {
    return true;
  }

  if (fileName.endsWith('.lock') || fileName.endsWith('.lockfile')) {
    return true;
  }

  return false;
}

function buildTree(files, foldersOnly, showHidden) {
  const tree = {};
  const fileCount = files.length;

  for (let i = 0; i < fileCount; i++) {
    const file = files[i];
    const pathParts = file.webkitRelativePath.split('/');

    if (shouldExcludePath(pathParts)) continue;

    const fileName = pathParts[pathParts.length - 1];

    if (shouldExcludeFile(fileName)) continue;

    if (!showHidden && pathParts.some((part) => part.startsWith('.'))) continue;

    let currentLevel = tree;
    const partsLength = pathParts.length;

    for (let j = 0; j < partsLength; j++) {
      const part = pathParts[j];
      const isLast = j === partsLength - 1;

      if (foldersOnly && isLast && j !== 0) break;

      if (!currentLevel[part]) {
        currentLevel[part] = {};
      }
      currentLevel = currentLevel[part];
    }
  }

  return tree;
}

function renderTreeOptimized(obj, prefix = '') {
  let result = '';
  const keys = Object.keys(obj);
  const keysLength = keys.length;

  for (let i = 0; i < keysLength; i++) {
    const key = keys[i];
    const isLast = i === keysLength - 1;
    const connector = isLast ? '\u2514\u2500\u2500 ' : '\u251C\u2500\u2500 ';
    const label = prefix === '' ? `${key} (Root)` : key;

    result += prefix + connector + label + '\n';

    if (Object.keys(obj[key]).length > 0) {
      const newPrefix = prefix + (isLast ? '    ' : '\u2502   ');
      result += renderTreeOptimized(obj[key], newPrefix);
    }
  }

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
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showToast();
  } catch (err) {
    console.error('Unable to copy', err);
  }
  document.body.removeChild(textarea);
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

function resetState() {
  currentFiles = [];
  cachedTree = null;
  folderInput.value = '';
  treeOutput.textContent = '';
  emptyState.style.display = 'flex';
  outputActions.style.display = 'none';
}
